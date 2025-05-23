"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { MdDeleteOutline } from "react-icons/md";
import { FaPen } from "react-icons/fa6";
import { useAddCouponMutation, useDeleteCouponMutation, useGetAllCouponsQuery, useUpdateCouponMutation } from "@/components/Redux/features/coupon/couponApi";
import { UpdateCouponModal } from "@/components/Modals/UpdateCouponModal";


const ManageCoupon = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [couponToUpdate, setCouponToUpdate] = useState<any | null>(null);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);
  const { data: coupons, isError, refetch } = useGetAllCouponsQuery(undefined);
  const [addCoupon] = useAddCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();
  const [isLoading, setIsLoading] = useState(false);

  const Allcoupons = coupons?.data;

  console.log(Allcoupons);

  const [formData, setFormData] = useState({
    code: "",
    type: "PERCENTAGE",
    value: "",
    minPurchase: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
    usageLimit: "",
  });

  const handleDelete = (couponId: string) => {
    setCouponToDelete(couponId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (couponToDelete) {
      setIsLoading(true);
      const toastId = toast.loading("Deleting Coupon...");
      try {
        await deleteCoupon(couponToDelete);
        toast.success("Coupon deleted successfully!", { id: toastId });
      } catch (error) {
        console.error("Error deleting coupon:", error);
        toast.error("Failed to delete coupon. Please try again.", { id: toastId });
      } finally {
        setIsLoading(false);
        setIsDeleteModalOpen(false);
        setCouponToDelete(null);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Adding Coupon...");

    const couponData = {
      ...formData,
      value: parseFloat(formData.value),
      minPurchase: parseFloat(formData.minPurchase),
      maxDiscount: parseFloat(formData.maxDiscount),
      usageLimit: parseInt(formData.usageLimit),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };

    try {
      const res = await addCoupon(couponData);
      console.log(res);
      toast.success("Coupon added successfully", { id: toastId });
      setIsAddModalOpen(false);
      setFormData({
        code: "",
        type: "PERCENTAGE",
        value: "",
        minPurchase: "",
        maxDiscount: "",
        startDate: "",
        endDate: "",
        status: "ACTIVE",
        usageLimit: "",
      });
      refetch();
    } catch (error: any) {
      console.error("Error adding coupon:", error);
      const errorMessage = error.data?.message || "Failed to add coupon. Please try again.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading coupons</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center gap-3 mb-8">
          <h1 className="md:text-3xl text-xl font-bold bg-gray-300 bg-clip-text text-transparent">
            Coupon Management
          </h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="cursor-pointer bg-gray-600 transition-colors hover:bg-gray-700 text-white text-sm px-2 lg:px-6 py-2 rounded-lg"
          >
            Add Coupon
          </button>
        </div>

        <div className="rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 transition-colors">
                <tr>
                  <th className="px-6 py-4 text-left">Code</th>
                  <th className="px-6 py-4 text-left">Type</th>
                  <th className="px-6 py-4 text-left">Value</th>
                  <th className="px-6 py-4 text-left">Min Purchase</th>
                  <th className="px-6 py-4 text-left">Max Discount</th>
                  <th className="px-6 py-4 text-left">Start Date</th>
                  <th className="px-6 py-4 text-left">End Date</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Usage</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Allcoupons && Allcoupons.map((coupon: any, index: number) => (
                  <motion.tr
                    key={coupon.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-gray-700 hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">{coupon.code}</td>
                    <td className="px-6 py-4">{coupon.type}</td>
                    <td className="px-6 py-4">{coupon.value}%</td>
                    <td className="px-6 py-4">${coupon.minPurchase}</td>
                    <td className="px-6 py-4">${coupon.maxDiscount}</td>
                    <td className="px-6 py-4">{new Date(coupon.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{new Date(coupon.endDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-sm border ${
                        coupon.status === 'ACTIVE' ? 'border-green-500/20 text-green-400' : 'border-red-500/20 text-red-400'
                      }`}>
                        {coupon.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{coupon.usedCount}/{coupon.usageLimit}</td>
                    <td className="px-6 py-4 text-2xl flex gap-3">
                      <MdDeleteOutline
                        className="cursor-pointer hover:text-red-500 transition-colors"
                        onClick={() => handleDelete(coupon.id)}
                      />
                      <FaPen
                        className="cursor-pointer hover:text-blue-500 text-xl transition-colors"
                        onClick={() => {
                          setCouponToUpdate(coupon);
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
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-xl overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="p-8 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 bg-white bg-clip-text text-transparent">
                  Add New Coupon
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
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setFormData({
                        code: "",
                        type: "PERCENTAGE",
                        value: "",
                        minPurchase: "",
                        maxDiscount: "",
                        startDate: "",
                        endDate: "",
                        status: "ACTIVE",
                        usageLimit: "",
                      });
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
                    {isLoading ? 'Adding...' : 'Add Coupon'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      <AnimatePresence>
        {isUpdateModalOpen && (
          <UpdateCouponModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            coupon={couponToUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageCoupon;
