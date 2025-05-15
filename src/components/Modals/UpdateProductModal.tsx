"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: number;
  images: string[];
  categoryId: string;
  condition: string;
  brandId: string;
  status: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  brand: {
    id: string;
    name: string;
    description: string;
    logo: string;
    createdAt: string;
    updatedAt: string;
  };
  seller: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
  };
}

interface UpdateProductModalProps {
  isUpdateModalOpen: boolean;
  setUpdateModalOpen: (isOpen: boolean) => void;
  product: Product | null;
}

const UpdateProductModal = ({
  isUpdateModalOpen,
  setUpdateModalOpen,
  product,
}: UpdateProductModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Product>();
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
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

  const onSubmit: SubmitHandler<Product> = async (data) => {
    const toastId = toast.loading("Updating Product...", { duration: 2000 });

    const formData = new FormData();

    images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    const updateProduct = {
      ...data,
      price: Number(data.price),
      weight: Number(data.weight),
    };

    formData.append("data", JSON.stringify(updateProduct));

    // Here you would typically make an API call to update the product
    // For example:
    // try {
    //   const res = await updateProduct({ formData, productId: product?.id });
    //   if (res.data) {
    //     toast.success("Product updated successfully", { id: toastId });
    //     setUpdateModalOpen(false);
    //     reset();
    //   } else {
    //     toast.error("Failed to update product", { id: toastId });
    //   }
    // } catch (error) {
    //   toast.error("An error occurred", { id: toastId });
    // }

    // For now, we'll just simulate a successful update
    setTimeout(() => {
      toast.success("Product updated successfully", { id: toastId });
      setUpdateModalOpen(false);
      reset();
      setPreviewImages([]);
      setImages([]);
    }, 2000);
  };

  useEffect(() => {
    if (product) {
      reset(product);
      setPreviewImages(product.images);
    }
  }, [product, reset]);

  return (
    <AnimatePresence>
      {isUpdateModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-lg z-50"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-[#000a3a] border border-[#1a2d6d] rounded-xl overflow-hidden"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-8 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Update Product
              </h2>

              {/* Image Upload */}
              <div className="mb-6">
                <div className="border-2 border-dashed border-[#1a2d6d] rounded-xl p-4 text-center">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="relative">
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
                    className="bg-purple-600/20 text-purple-400 px-6 py-3 rounded-lg hover:bg-purple-600/30 transition-colors"
                  >
                    Upload Images
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <input
                    {...register("name", { required: true })}
                    placeholder="Product Name"
                    className="w-full bg-[#00031b] px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  {errors.name && (
                    <p className="text-red-500">Product name is required!</p>
                  )}

                  <textarea
                    {...register("description")}
                    placeholder="Description"
                    className="w-full bg-[#00031b] px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 h-32"
                  />

                  <input
                    type="number"
                    step="0.01"
                    {...register("price", { valueAsNumber: true })}
                    placeholder="Price"
                    className="w-full bg-[#00031b] px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />

                  <input
                    type="number"
                    step="0.01"
                    {...register("weight", { valueAsNumber: true })}
                    placeholder="Weight"
                    className="w-full bg-[#00031b] px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <input
                    {...register("categoryId")}
                    placeholder="Category ID"
                    className="w-full bg-[#00031b] px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />

                  <input
                    {...register("condition")}
                    placeholder="Condition"
                    className="w-full bg-[#00031b] px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />

                  <input
                    {...register("brandId")}
                    placeholder="Brand ID"
                    className="w-full bg-[#00031b] px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />

                  <select
                    {...register("status")}
                    className="w-full bg-[#00031b] px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="SOLD">Sold</option>
                  </select>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setUpdateModalOpen(false);
                    reset();
                    setPreviewImages([]);
                    setImages([]);
                  }}
                  className="px-6 py-2 cursor-pointer rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 cursor-pointer px-6 py-2 rounded-lg transition-colors"
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
