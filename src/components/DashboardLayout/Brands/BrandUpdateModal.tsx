"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { useUpdateBrandMutation } from "@/components/Redux/features/brands/brandsApi";

interface Brand {
  id: string;
  name: string;
  description: string;
  logo: string;
}

interface BrandUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: Brand | null;
}

const BrandUpdateModal = ({
  isOpen,
  onClose,
  brand,
}: BrandUpdateModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Brand>();
  const [updateBrand] = useUpdateBrandMutation();
  const [previewImage, setPreviewImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit: SubmitHandler<Brand> = async (data) => {
    const toastId = toast.loading("Updating Brand...");

    const formData = new FormData();

    if (imageFile) {
      formData.append("file", imageFile);
    }

    const brandData = {
      name: data.name,
      description: data.description
    };

    formData.append("data", JSON.stringify(brandData));
    
    try {
      const response = await updateBrand({ id: data.id, data:formData });
      
      if (response.data?.success) {
        toast.success(response.data.message, { id: toastId });
        onClose();
        reset();
        setPreviewImage("");
        setImageFile(null);
      } else {
        toast.error("Failed to update brand", { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to update brand", { id: toastId });
    }
  };

  useEffect(() => {
    if (brand) {
      reset(brand);
      setPreviewImage(brand.logo);
    }
  }, [brand, reset]);

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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-xl overflow-hidden"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-8 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6 text-white">
                Update Brand
              </h2>

              {/* Logo Upload */}
              <div className="mb-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4">
                    <img
                      src={previewImage}
                      alt="Logo Preview"
                      className="w-full h-full object-cover rounded-lg border-2 border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-gray-600 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-2 text-gray-300">Name</label>
                  <input
                    id="name"
                    {...register("name", { required: true })}
                    className="w-full bg-gray-800 px-4 py-2 rounded-lg focus:ring-2 focus:ring-gray-500 text-white"
                  />
                  {errors.name && (
                    <p className="text-red-500">Name is required!</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block mb-2 text-gray-300">Description</label>
                  <textarea
                    id="description"
                    {...register("description", { required: true })}
                    className="w-full bg-gray-800 px-4 py-2 rounded-lg focus:ring-2 focus:ring-gray-500 text-white h-32"
                  />
                  {errors.description && (
                    <p className="text-red-500">Description is required!</p>
                  )}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    reset();
                    setPreviewImage("");
                    setImageFile(null);
                  }}
                  className="px-6 py-2 cursor-pointer rounded-lg hover:bg-gray-700 transition-colors text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gray-600 text-white cursor-pointer px-6 py-2 rounded-lg transition-colors hover:bg-gray-700"
                >
                  Update Brand
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BrandUpdateModal; 