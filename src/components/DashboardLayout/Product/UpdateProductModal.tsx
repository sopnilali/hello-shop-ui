"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { useUpdateProductMutation } from "@/components/Redux/features/products/productsApi";
import { Product } from "@/components/Types";
import { useAllShopQuery } from "@/components/Redux/features/shop/shopApi";

interface UpdateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
}

const UpdateProductModal = ({
  isOpen,
  onClose,
  product,
  categories,
  brands,
}: UpdateProductModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Product>();
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const { data: shopData } = useAllShopQuery(undefined);
  const [shops, setShops] = useState([]);

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files);
      setImages(prevImages => [...prevImages, ...newImages]);
      
      const newPreviewImages = newImages.map(file => URL.createObjectURL(file));
      setPreviewImages(prevPreviews => [...prevPreviews, ...newPreviewImages]);
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      const newPreviewImages = [...previewImages];
      const newImages = [...images];
      const [movedPreview] = newPreviewImages.splice(draggedIndex, 1);
      const [movedImage] = newImages.splice(draggedIndex, 1);
      newPreviewImages.splice(dropIndex, 0, movedPreview);
      newImages.splice(dropIndex, 0, movedImage);
      setPreviewImages(newPreviewImages);
      setImages(newImages);
    }
    setDraggedIndex(null);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const onSubmit: SubmitHandler<Product> = async (data) => {
    const toastId = toast.loading("Updating Product...", { duration: 2000 });

    const formData = new FormData();

    images.forEach((image, index) => {
      formData.append(`files`, image);
    });

    const productData = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: Number(data.price),
      weight: Number(data.weight),
      categoryId: data.categoryId,
      brandId: data.brandId,
      quantity: data.quantity,
      condition: data.condition,
      shopId: data.shopId,
      status: data.status
    };

    formData.append("data", JSON.stringify(productData));
    
    const response = await updateProduct({formData, productId: data.id});


    if(response.error){
      toast.error("Failed to update product", { id: toastId });
    }

    if(response.data.success){
      toast.success(response.data.message, { id: toastId });
      onClose();
      reset();
      setPreviewImages([]);
      setImages([]);
    }
  };

  useEffect(() => {
    if (shopData) {
      setShops(shopData.data);
    }
  }, [shopData]);

  useEffect(() => {

    if (product) {
      reset(product);
      setPreviewImages(product.images);
    }
  }, [product, reset]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-lg z-50"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-xl overflow-hidden"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-8 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6 text-white">
                Update Product
              </h2>

              {/* Image Upload */}
              <div className="mb-6">
                <div 
                  className="border-2 border-dashed border-gray-600 rounded-xl p-4 text-center"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                >
                  <div className="flex flex-wrap gap-2 mb-4">
                    {previewImages.map((preview, index) => (
                      <div 
                        key={index} 
                        className="relative"
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 bg-red-500/80 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-600/20 text-white px-6 py-2 rounded-lg hover:bg-gray-600/30 transition-colors"
                  >
                    Upload Images
                  </button>
                  <input
                    id="imageUpload"
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e.target.files)}
                  />
                  <p className="mt-2 text-sm text-gray-400">or drag and drop images here</p>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-gray-300">Product Name</label>
                    <input
                      id="name"
                      {...register("name", { required: true })}
                      placeholder="Product Name"
                      className="w-full bg-gray-800 px-4 py-2 rounded-lg focus:ring-2 focus:ring-gray-500 text-white"
                    />
                    {errors.name && (
                      <p className="text-red-500">Product name is required!</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="price" className="block mb-2 text-gray-300">Price</label>
                    <input
                      id="price"
                      type="number"
                      step="0.01"
                      {...register("price", { valueAsNumber: true })}
                      placeholder="Price"
                      className="w-full bg-gray-800 px-4 py-2 rounded-lg focus:ring-2 focus:ring-gray-500 text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="weight" className="block mb-2 text-gray-300">Weight</label>
                    <input
                      id="weight"
                      type="number"
                      step="0.01"
                      {...register("weight", { valueAsNumber: true })}
                      placeholder="Weight"
                      className="w-full bg-gray-800 px-4 py-2 rounded-lg focus:ring-2 focus:gray-blue-500 text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="categoryId" className="block mb-2 text-gray-300">Category</label>
                    <select
                      id="categoryId"
                      {...register("categoryId")}
                      className="w-full bg-gray-800 px-4 py-2 rounded-lg focus:ring-2 focus:gray-blue-500 text-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="shopId" className="block mb-2 text-gray-300">Shop</label>
                    <select
                      id="shopId"
                      {...register("shopId")}
                      className="w-full bg-gray-800 px-4 py-2 rounded-lg focus:ring-2 focus:gray-blue-500 text-white"
                    >
                      <option value="">Select Shop</option>
                      {shops.map((shop: any) => (
                        <option key={shop.id} value={shop.id}>
                          {shop.name}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="condition" className="block mb-2 text-gray-300">Condition</label>
                    <input
                      id="condition"
                      {...register("condition")}
                      placeholder="Condition"
                      className="w-full bg-gray-800 px-4 py-2 rounded-lg focus:ring-2 focus:ring-gray-500 text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="brandId" className="block mb-2 text-gray-300">Brand</label>
                    <select
                      id="brandId"
                      {...register("brandId")}
                      className="w-full bg-gray-800 px-4 py-2 rounded-lg focus:ring-2 focus:ring-gray-500 text-white"
                    >
                      <option value="">Select Brand</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="status" className="block mb-2 text-gray-300">Status</label>
                    <select
                      id="status"
                      {...register("status")}
                      className="w-full bg-gray-800 px-4 py-2 rounded-lg focus:ring-2 focus:ring-gray-500 text-white"
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="SOLD">Sold</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="quantity" className="block mb-2 text-gray-300">Quantity</label>
                    <input
                      id="quantity"
                      type="number"
                      step="1"
                      {...register("quantity", { valueAsNumber: true })}
                      placeholder="Quantity"
                      className="w-full bg-gray-800 px-4 py-2 rounded-lg focus:ring-2 focus:ring-gray-500 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label htmlFor="description" className="block mb-2 text-gray-300">Description</label>
                <textarea
                  id="description"
                  {...register("description")}
                  placeholder="Description"
                  className="w-full bg-gray-800 px-4 py-2 rounded-lg focus:ring-2 focus:ring-gray-500 text-white h-32"
                />
              </div>

              {/* Form Buttons */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    reset();
                    setPreviewImages([]);
                    setImages([]);
                  }}
                  className="px-6 py-2 cursor-pointer rounded-lg hover:bg-gray-700 transition-colors text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gray-600 text-white cursor-pointer px-6 py-2 rounded-lg transition-colors hover:bg-gray-700"
                >
                  Update Product
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateProductModal;