"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCreateDiscountMutation } from "@/components/Redux/features/discount/discountApi";
import { toast } from "sonner";

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
}

const DiscountModal = ({ isOpen, onClose, productId }: DiscountModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [createDiscount] = useCreateDiscountMutation();

  const [formData, setFormData] = useState({
    type: "PERCENTAGE",
    value: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
    productId: productId
  });

  useEffect(() => {
    if (productId) {
      setFormData(prev => ({
        ...prev,
        productId: productId
      }));
    }
  }, [productId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const discountData = {
      type: formData.type,
      value: parseFloat(formData.value),
      productId: formData.productId,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      status: formData.status
    };

    try {
      const res = await createDiscount(discountData).unwrap();
      console.log(res);
      toast.success("Discount added successfully");
      onClose();
      setFormData({
        type: "PERCENTAGE",
        value: "",
        startDate: "",
        endDate: "",
        status: "ACTIVE",
        productId: productId
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add discount");
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
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-900 rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">Add Discount</h2>
        <form onSubmit={handleSubmit}>
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
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="value" className="block text-sm font-medium text-gray-300 mb-1">
              Value (%)
            </label>
            <input
              type="number"
              id="value"
              name="value"
              value={formData.value}
              onChange={handleInputChange}
              required
              min="0"
              max="100"
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
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
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
              {isLoading ? "Adding..." : "Add Discount"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default DiscountModal; 