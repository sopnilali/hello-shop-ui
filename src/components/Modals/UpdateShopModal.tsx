"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Image from "next/image";
import { useUpdateShopMutation } from "../Redux/features/shop/shopApi";

interface UpdateShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  shop: any;
}

const UpdateShopModal = ({ isOpen, onClose, onSuccess, shop }: UpdateShopModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [updateShop] = useUpdateShopMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
  });

  useEffect(() => {
    if (shop) {
      setFormData({
        name: shop.name,
        description: shop.description,
        logo: shop.logo,
      });
      setLogoPreview(shop.logo);
    }
  }, [shop]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Updating shop...");

    try {
      const formDataToSend = new FormData();
      
      // Add the JSON data
      const jsonData = {
        name: formData.name,
        description: formData.description,
      };

      // Add the file first
      if (file) {
        formDataToSend.append("file", file);
      }

      // Then add the JSON data
      formDataToSend.append("data", JSON.stringify(jsonData));


      const res = await updateShop({ 
        id: shop.id, 
        data: formDataToSend 
      });

      if (res.data) {
        toast.success(res.data.message, { id: toastId });
        onSuccess();
        onClose();
      } else {
        throw new Error("Update failed");
      }
    } catch (error: any) {
      console.error("Error updating shop:", error);
      const errorMessage = error.data?.message || "Failed to update shop. Please try again.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
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
        className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold mb-6 bg-white bg-clip-text text-transparent">
            Update Shop
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Shop Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
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
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-300 mb-1">
                Shop Logo
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <label
                  htmlFor="logo"
                  className="cursor-pointer px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Choose File
                </label>
                {logoPreview && (
                  <div className="relative w-16 h-16">
                    <Image
                      src={logoPreview}
                      alt="Logo preview"
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isLoading ? "Updating..." : "Update Shop"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UpdateShopModal;
