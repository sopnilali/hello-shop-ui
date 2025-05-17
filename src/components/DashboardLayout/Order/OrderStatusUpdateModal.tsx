"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { useUpdateOrderStatusMutation } from "@/components/Redux/features/order/orderApi";

interface Order {
  id: string;
  status: string;
}

interface OrderStatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderStatusUpdateModal = ({
  isOpen,
  onClose,
  order,
}: OrderStatusUpdateModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ status: string }>();
  
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const onSubmit: SubmitHandler<{ status: string }> = async (data) => {
    if (!order) return;
    
    const toastId = toast.loading("Updating Order Status...");
    try {
      await updateOrderStatus({
        id: order.id,
        statusData: { status: data.status }
      }).unwrap();
      
      toast.success("Order status updated successfully!", { id: toastId });
      onClose();
      reset();
    } catch (error) {
      toast.error("Failed to update order status", { id: toastId });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full"
        >
          <h3 className="text-xl font-semibold mb-4">Update Order Status</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                {...register("status", { required: "Status is required" })}
                defaultValue={order?.status}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
              )}
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
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Update Status
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderStatusUpdateModal; 