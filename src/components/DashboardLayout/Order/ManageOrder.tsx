"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { MdDeleteOutline } from "react-icons/md";
import { FaPen } from "react-icons/fa6";
import { useGetAllOrderQuery, useUpdateOrderStatusMutation } from "@/components/Redux/features/order/orderApi";
import OrderStatusUpdateModal from "./OrderStatusUpdateModal";

enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

const ManageOrder = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [orderToUpdate, setOrderToUpdate] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { data: orders, isError, refetch } = useGetAllOrderQuery(
    [
      { name: 'limit', value: itemsPerPage },
      { name: 'page', value: currentPage }
    ]
  );

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const allOrders = orders?.data?.data;
  const totalItems = orders?.data?.meta?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = (orderId: string) => {
    setOrderToDelete(orderId);
    setIsDeleteModalOpen(true);
  };

  const handleUpdate = (order: any) => {
    setOrderToUpdate(order);
    setIsUpdateModalOpen(true);
  };

  const confirmDelete = async () => {
    if (orderToDelete) {
      setIsLoading(true);
      const toastId = toast.loading("Deleting Order...");
      try {
        // Add delete order mutation here
        toast.success("Order deleted successfully!", { id: toastId });
        refetch();
      } catch (error) {
        console.error("Error deleting order:", error);
        toast.error("Failed to delete order. Please try again.", { id: toastId });
      } finally {
        setIsLoading(false);
        setIsDeleteModalOpen(false);
        setOrderToDelete(null);
      }
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'border-yellow-500/20 text-yellow-400';
      case OrderStatus.PROCESSING:
        return 'border-blue-500/20 text-blue-400';
      case OrderStatus.SHIPPED:
        return 'border-purple-500/20 text-purple-400';
      case OrderStatus.DELIVERED:
        return 'border-green-500/20 text-green-400';
      case OrderStatus.CANCELLED:
        return 'border-red-500/20 text-red-400';
      default:
        return 'border-gray-500/20 text-gray-400';
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading orders</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center gap-3 mb-8">
          <h1 className="md:text-3xl text-xl font-bold bg-gray-300 bg-clip-text text-transparent">
            Order Management
          </h1>
        </div>

        <div className="rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 transition-colors">
                <tr>
                  <th className="px-6 py-4 text-left">Customer Name</th>
                  <th className="px-6 py-4 text-left">Customer Email</th>
                  <th className="px-6 py-4 text-left">Phone Number</th>
                  <th className="px-6 py-4 text-left">Payment Method</th>
                  <th className="px-6 py-4 text-left">Total</th>
                  <th className="px-6 py-4 text-left">Transaction ID</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Order Date</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allOrders && allOrders.map((order: any, index: number) => (
                  <motion.tr
                    key={order.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-gray-700 hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">{order.name}</td>
                    <td className="px-6 py-4">{order.email}</td>
                    <td className="px-6 py-4">{order.phoneNumber}</td>
                    <td className="px-6 py-4">{order.paymentMethod}</td>
                    <td className="px-6 py-4">${order.total}</td>
                    <td className="px-6 py-4">{order.transactionId}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-sm border ${getStatusColor(order.status as OrderStatus)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-2xl flex gap-3">
                      <MdDeleteOutline
                        className="cursor-pointer hover:text-red-500 transition-colors"
                        onClick={() => handleDelete(order.id)}
                      />
                      <FaPen
                        className="cursor-pointer hover:text-blue-500 text-xl transition-colors"
                        onClick={() => handleUpdate(order)}
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  return page === 1 || 
                         page === totalPages || 
                         (page >= currentPage - 1 && page <= currentPage + 1);
                })
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? 'bg-gray-600 text-white'
                          : 'border border-gray-700 hover:bg-gray-800'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800"
            >
              Next
            </button>
          </div>
        </div>
      </div>

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
              <p className="mb-6">Are you sure you want to delete this order? This action cannot be undone.</p>
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

      <OrderStatusUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setOrderToUpdate(null);
          refetch();
        }}
        order={orderToUpdate}
      />
    </div>
  );
};

export default ManageOrder;
