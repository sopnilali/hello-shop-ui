"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { useUpdateUserMutation } from "@/components/Redux/features/user/useApi";

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  profilePhoto: string;
  address: string;
  city: string;
  role: string;
  status: string;
}

interface UserUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const UserUpdateModal = ({
  isOpen,
  onClose,
  user,
}: UserUpdateModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>();
  const [updateUser] = useUpdateUserMutation();
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

  const onSubmit: SubmitHandler<User> = async (data) => {
    const toastId = toast.loading("Updating User...");

    const formData = new FormData();

    if (imageFile) {
      formData.append("file", imageFile);
    }

    const userData = {
      name: data.name,
      phoneNumber: data.phoneNumber,
      address: data.address,
      city: data.city,
      role: data.role,
      status: data.status
    };

    formData.append("data", JSON.stringify(userData));
    
    try {
      const response = await updateUser({ userId: data.id, formData });
      
      if (response.data?.success) {
        toast.success(response.data.message, { id: toastId });
        onClose();
        reset();
        setPreviewImage("");
        setImageFile(null);
      } else {
        toast.error("Failed to update user", { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to update user", { id: toastId });
    }
  };

  useEffect(() => {
    if (user) {
      reset(user);
      setPreviewImage(user.profilePhoto);
    }
  }, [user, reset]);

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
                Update User
              </h2>

              {/* Profile Photo Upload */}
              <div className="mb-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4">
                    <img
                      src={previewImage}
                      alt="Profile Preview"
                      className="w-full h-full object-cover rounded-full border-2 border-gray-600"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
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
                    <label htmlFor="phoneNumber" className="block mb-2 text-gray-300">Phone Number</label>
                    <input
                      id="phoneNumber"
                      {...register("phoneNumber", { required: true })}
                      className="w-full bg-gray-800 px-4 py-2 rounded-lg focus:ring-2 focus:ring-gray-500 text-white"
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500">Phone number is required!</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="address" className="block mb-2 text-gray-300">Address</label>
                    <input
                      id="address"
                      {...register("address", { required: true })}
                      className="w-full bg-gray-800 px-4 py-2 rounded-lg focus:ring-2 focus:ring-gray-500 text-white"
                    />
                    {errors.address && (
                      <p className="text-red-500">Address is required!</p>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="role" className="block mb-2 text-gray-300">Role</label>
                    <select
                      id="role"
                      {...register("role", { required: true })}
                      className="w-full bg-gray-800 px-4 py-2 rounded-lg focus:ring-2 focus:ring-gray-500 text-white"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="SELLER">SELLER</option>
                      <option value="CUSTOMER">CUSTOMER</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="status" className="block mb-2 text-gray-300">Status</label>
                    <select
                      id="status"
                      {...register("status", { required: true })}
                      className="w-full bg-gray-800 px-4 py-2 rounded-lg focus:ring-2 focus:ring-gray-500 text-white"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="BLOCKED">BLOCKED</option>
                    </select>
                  </div>
                <div>
                  <label htmlFor="city" className="block mb-2 text-gray-300">City</label>
                  <select
                    id="city"
                    {...register("city", { required: true })}
                    className="w-full bg-gray-800 px-4 py-2 rounded-lg focus:ring-2 focus:ring-gray-500 text-white"
                  >
                    <option value="">Select City</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Chapainawabganj">Chapainawabganj</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barishal">Barishal</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                  {errors.city && (
                    <p className="text-red-500">City is required!</p>
                  )}
                </div>
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
                  Update User
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserUpdateModal; 