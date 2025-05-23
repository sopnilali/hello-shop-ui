"use client"

import { toast } from "sonner";


import { useState } from "react";
import { useUpdateCouponMutation } from "../Redux/features/coupon/couponApi";
import { motion } from "framer-motion";

interface UpdateCouponModalProps {
    isOpen: boolean;
    onClose: () => void;
    coupon: any;
  }
  
  export const UpdateCouponModal = ({ isOpen, onClose, coupon }: UpdateCouponModalProps) => {
    const [formData, setFormData] = useState({
      code: coupon?.code || "",
      type: coupon?.type || "PERCENTAGE",
      value: coupon?.value || "",
      minPurchase: coupon?.minPurchase || "",
      maxDiscount: coupon?.maxDiscount || "",
      startDate: coupon?.startDate ? new Date(coupon.startDate).toISOString().slice(0, 16) : "",
      endDate: coupon?.endDate ? new Date(coupon.endDate).toISOString().slice(0, 16) : "",
      status: coupon?.status || "ACTIVE",
      usageLimit: coupon?.usageLimit || "",
    });
  
    const [updateCoupon, { isLoading }] = useUpdateCouponMutation();
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const toastId = toast.loading("Updating Coupon...");
  
      const couponData = {
        code: formData.code,
        type: formData.type,
        value: parseFloat(formData.value),
        minPurchase: parseFloat(formData.minPurchase),
        maxDiscount: parseFloat(formData.maxDiscount),
        usageLimit: parseInt(formData.usageLimit),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        status: formData.status
      };
  
      try {
        const res = await updateCoupon({ id: coupon.id, data: couponData });
        toast.success(res.data.message, { id: toastId });
        onClose();
      } catch (error: any) {
        console.error("Error updating coupon:", error);
        const errorMessage = error.data?.message || "Failed to update coupon. Please try again.";
        toast.error(errorMessage, { id: toastId });
      }
    };
  
    if (!isOpen) return null;
  
    return (
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
          <form onSubmit={handleSubmit} className="p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 bg-white bg-clip-text text-transparent">
              Update Coupon
            </h2>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="mb-4">
                  <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-1">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
  
                <div className="mb-4">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FIXED_AMOUNT">Fixed Amount</option>
                  </select>
                </div>
  
                <div className="mb-4">
                  <label htmlFor="value" className="block text-sm font-medium text-gray-300 mb-1">
                    Value
                  </label>
                  <input
                    type="number"
                    id="value"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
  
                <div className="mb-4">
                  <label htmlFor="minPurchase" className="block text-sm font-medium text-gray-300 mb-1">
                    Minimum Purchase
                  </label>
                  <input
                    type="number"
                    id="minPurchase"
                    name="minPurchase"
                    value={formData.minPurchase}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
                
              </div>
  
              <div>
                <div className="mb-4">
                  <label htmlFor="maxDiscount" className="block text-sm font-medium text-gray-300 mb-1">
                    Maximum Discount
                  </label>
                  <input
                    type="number"
                    id="maxDiscount"
                    name="maxDiscount"
                    value={formData.maxDiscount}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
  
                <div className="mb-4">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
  
                <div className="mb-4">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
  
                <div className="mb-4">
                  <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-300 mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    id="usageLimit"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
              </div>
            </div>
  
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:bg-gray-400"
              >
                {isLoading ? 'Updating...' : 'Update Coupon'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };