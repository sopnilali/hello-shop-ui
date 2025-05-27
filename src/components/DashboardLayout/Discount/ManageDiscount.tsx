"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdDeleteOutline } from 'react-icons/md';
import { FaPen } from 'react-icons/fa6';
import { useAllDiscountsQuery, useCreateDiscountMutation, useDeleteDiscountMutation, useUpdateDiscountMutation } from '@/components/Redux/features/discount/discountApi';
import { toast } from 'sonner';
import { useAllProductsQuery } from '@/components/Redux/features/products/productsApi';
import LoadingSpinner from '@/components/LoadingSpinner';

const ManageDiscount = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [discountToUpdate, setDiscountToUpdate] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: discounts, isError, refetch } = useAllDiscountsQuery(undefined);
  const [createDiscount] = useCreateDiscountMutation();
  const [deleteDiscount] = useDeleteDiscountMutation();
  const [updateDiscount] = useUpdateDiscountMutation();
  const { data: products } = useAllProductsQuery(undefined);

  const [formData, setFormData] = useState({
    type: "PERCENTAGE",
    value: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
    productId: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = async (discountId: string) => {
    try {
      await deleteDiscount(discountId);
      toast.success("Discount deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete discount");
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!discountToUpdate) return;

    setIsLoading(true);
    try {
      const updateData = {
        type: formData.type,
        value: parseFloat(formData.value),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        status: formData.status
      };

      await updateDiscount({
        id: discountToUpdate.id,
        data: updateData
      });
      toast.success("Discount updated successfully");
      setIsUpdateModalOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update discount");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner/>;
  }

  if (isError) {
    return <div>Error loading discounts</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center gap-3 mb-8">
          <h1 className="md:text-3xl text-xl font-bold bg-gray-300 bg-clip-text text-transparent">
            Discount Management
          </h1>
        </div>

        <div className="rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 transition-colors">
                <tr>
                  <th className="px-6 py-4 text-left">Product</th>
                  <th className="px-6 py-4 text-left">Type</th>
                  <th className="px-6 py-4 text-left">Value</th>
                  <th className="px-6 py-4 text-left">Start Date</th>
                  <th className="px-6 py-4 text-left">End Date</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {discounts?.data?.data?.map((discount: any) => (
                  <motion.tr
                    key={discount.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-gray-700 hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">{discount.product?.name}</td>
                    <td className="px-6 py-4">{discount.type}</td>
                    <td className="px-6 py-4">{discount.value}%</td>
                    <td className="px-6 py-4">{new Date(discount.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{new Date(discount.endDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-sm border ${
                        discount.status === 'ACTIVE' ? 'border-green-500/20 text-green-400' : 'border-red-500/20 text-red-400'
                      }`}>
                        {discount.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-2xl flex gap-3 tracking-wider">
                      <MdDeleteOutline
                        className="cursor-pointer hover:text-red-500 transition-colors"
                        onClick={() => handleDelete(discount.id)}
                      />
                      <FaPen
                        className="cursor-pointer hover:text-blue-500 text-xl transition-colors"
                        onClick={() => {
                          setDiscountToUpdate(discount);
                          setFormData({
                            type: discount.type,
                            value: discount.value.toString(),
                            startDate: new Date(discount.startDate).toISOString().slice(0, 16),
                            endDate: new Date(discount.endDate).toISOString().slice(0, 16),
                            status: discount.status,
                            productId: discount.product?.id
                          });
                          setIsUpdateModalOpen(true);
                        }}
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Update Discount Modal */}
      <AnimatePresence>
        {isUpdateModalOpen && (
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
              <h2 className="text-xl font-semibold mb-4">Update Discount</h2>
              <form onSubmit={handleUpdate}>
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
                    onClick={() => {
                      setIsUpdateModalOpen(false);
                      setDiscountToUpdate(null);
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
                    {isLoading ? "Updating..." : "Update Discount"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageDiscount;
