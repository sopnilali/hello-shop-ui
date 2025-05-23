"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { MdDeleteOutline } from "react-icons/md";
import { FaPen } from "react-icons/fa6";
import { MdDiscount } from "react-icons/md";
import UpdateProductModal from "./UpdateProductModal";
import DiscountModal from "./DiscountModal";
import { useAllProductsQuery, useAddProductMutation, useDeleteProductMutation, } from "@/components/Redux/features/products/productsApi";
import { useAllbrandsQuery } from "@/components/Redux/features/brands/brandsApi";
import { useAllcategoriesQuery } from "@/components/Redux/features/category/categoryApi";
import { useAllShopQuery } from "@/components/Redux/features/shop/shopApi";

const ManageProduct = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState<any | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [productForDiscount, setProductForDiscount] = useState<string | null>(null);
  const { data: products, isError, refetch } = useAllProductsQuery(undefined);
  const { data: brands } = useAllbrandsQuery(undefined);
  const { data: categories } = useAllcategoriesQuery(undefined);
  const [addProduct] = useAddProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const { data: shops } = useAllShopQuery(undefined);

  const Allproducts = products?.data?.data; // all products

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    weight: "",
    categoryId: "",
    brandId: "",
    quantity: "",
    shopId: "",
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imagesFiles, setImagesFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      setIsLoading(true);
      const toastId = toast.loading("Deleting Product...");
      try {
        await deleteProduct(productToDelete);
        toast.success("Product deleted successfully!", { id: toastId });
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product. Please try again.", { id: toastId });
      } finally {
        setIsLoading(false);
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      }
    }
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files);
      setImagesFiles(prevImages => [...prevImages, ...newImages]);

      const newPreviewImages = newImages.map(file => URL.createObjectURL(file));
      setPreviewImages(prevPreviews => [...prevPreviews, ...newPreviewImages]);
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    setImagesFiles(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    setPreviewImages([]);
    setImagesFiles([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Adding Product...");

    if (imagesFiles.length === 0) {
      toast.error("Please provide at least one image", { id: toastId });
      setIsLoading(false);
      return;
    }

    // Prepare data object
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      weight: parseFloat(formData.weight || '0'),
      categoryId: formData.categoryId,
      brandId: formData.brandId,
      quantity: parseInt(formData.quantity || '0'),
      shopId: formData.shopId,
    };

    // Build FormData
    const formDataToSend = new FormData();
    formDataToSend.append("data", JSON.stringify(productData));

    // Append each image file with the same key
    imagesFiles.forEach((file) => {
      formDataToSend.append("files", file);
    });

    try {
      const response = await addProduct(formDataToSend);
      console.log('Response:', response);
      toast.success("Product added successfully", { id: toastId });
      setIsAddModalOpen(false);
      setFormData({
        name: "",
        description: "",
        price: "",
        weight: "",
        categoryId: "",
        brandId: "",
        quantity: "",
        shopId: "",
      });
      clearImages();
      refetch();
    } catch (error: any) {
      console.error("Error adding product:", error);
      const errorMessage = error.data?.message || "Failed to add product. Please try again.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscountClick = (productId: string) => {
    setProductForDiscount(productId);
    setIsDiscountModalOpen(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center gap-3 mb-8">
          <h1 className="md:text-3xl text-xl font-bold bg-gray-300 bg-clip-text text-transparent">
            Product Management
          </h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="cursor-pointer bg-gray-600 transition-colors hover:bg-gray-700 text-white text-sm px-2 lg:px-6 py-2 rounded-lg "
          >
            Add Product
          </button>
        </div>

        <div className="rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 transition-colors">
                <tr>
                  <th className="px-6 py-4 text-left ">Name</th>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-left">Brand</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-left">Weight</th>
                  <th className="px-6 py-4 text-left">Shop</th>
                  <th className="px-6 py-4 text-left">Quantity</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Allproducts && Allproducts.map((product: any, index: number) => (
                  <motion.tr
                    key={product.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-gray-700 hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 tracking-wider">{product.name}</td>
                    <td className="px-6 py-4 tracking-wider">{product.category?.name}</td>
                    <td className="px-6 py-4 tracking-wider">{product.brand?.name}</td>
                    <td className="px-6 py-4 tracking-wider">${product.price}</td>
                    <td className="px-6 py-4 tracking-wider">{product.weight} kg</td>
                    <td className="px-6 py-4 tracking-wider">{product.shop?.name}</td>
                    <td className="px-6 py-4 tracking-wider">{product.quantity}</td>
                    <td className="px-6 py-4 tracking-wider">
                      <span className={`px-2 py-1 rounded-full text-sm border ${product.status === 'SOLD' ? 'border-green-500/20 text-green-400' : 'border-yellow-500/20 text-yellow-400'
                        }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-2xl flex gap-3 tracking-wider">
                      <MdDeleteOutline
                        className="cursor-pointer hover:text-red-500 transition-colors"
                        onClick={() => handleDelete(product.id)}
                      />
                      <FaPen
                        className="cursor-pointer hover:text-blue-500 text-xl transition-colors"
                        onClick={() => {
                          setProductToUpdate(product);
                          setIsUpdateModalOpen(true);
                        }}
                      />
                      <MdDiscount 
                        className="cursor-pointer hover:text-cyan-500 text-xl transition-colors" 
                        onClick={() => handleDiscountClick(product.id)}
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
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
                onSubmit={handleSubmit}
                className="p-8 max-h-[90vh] overflow-y-auto"
                encType="multipart/form-data"
              >
                <h2 className="text-2xl font-bold mb-6 bg-white bg-clip-text text-transparent">
                  Add New Product
                </h2>

                {/* Image Upload */}
                <div className="mb-6">
                  <div
                    className="border-2 border-dashed border-gray-600 rounded-xl p-4 text-center"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
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
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                      id="imageUpload"
                    />
                    <label
                      htmlFor="imageUpload"
                      className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Upload Images
                    </label>
                    <p className="mt-2 text-sm text-gray-400 pt-4">or drag and drop images here</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div>
                    {/* Product Name */}
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                      />
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
                        Price
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                      />
                    </div>

                    {/* Weight */}
                    <div className="mb-4">
                      <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                      />
                    </div>
                    {/* Shop Selection */}
                    <div className="mb-6">
                      <label htmlFor="shopId" className="block text-sm font-medium text-gray-300 mb-1">
                        Shop
                      </label>
                      <select
                        id="shopId"
                        name="shopId"
                        value={formData.shopId}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        <option value="">Select a shop</option>
                        {shops && shops.data.map((shop: any) => (
                          <option key={shop.id} value={shop.id}>
                            {shop.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    {/* Quantity */}
                    <div className="mb-4">
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="1"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                      />
                    </div>

                    {/* Brand */}
                    <div className="mb-4">
                      <label htmlFor="brandId" className="block text-sm font-medium text-gray-300 mb-1">
                        Brand
                      </label>
                      <select
                        id="brandId"
                        name="brandId"
                        value={formData.brandId}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        <option value="">Select a brand</option>
                        {brands && brands.data.map((brand: any) => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Category */}
                    <div className="mb-4">
                      <label htmlFor="categoryId" className="block text-sm font-medium text-gray-300 mb-1">
                        Category
                      </label>
                      <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        <option value="">Select a category</option>
                        {categories && categories.data.map((category: any) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setFormData({
                        name: "",
                        description: "",
                        price: "",
                        weight: "",
                        categoryId: "",
                        brandId: "",
                        quantity: "",
                        shopId: "",
                      });
                      clearImages();
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:bg-gray-400"
                  >
                    {isLoading ? 'Adding...' : 'Add Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <UpdateProductModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        product={productToUpdate}
        categories={categories?.data}
        brands={brands?.data}
      />

      <DiscountModal
        isOpen={isDiscountModalOpen}
        onClose={() => {
          setIsDiscountModalOpen(false);
          setProductForDiscount(null);
        }}
        productId={productForDiscount || ""}
      />

      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full"
            >
              <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
              <p className="mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageProduct;
