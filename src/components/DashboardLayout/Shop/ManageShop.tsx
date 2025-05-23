"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { MdDeleteOutline } from "react-icons/md";
import { FaPen } from "react-icons/fa6";
import Image from "next/image";
import AddShopModal from "@/components/Modals/AddShopModal";
import UpdateShopModal from "@/components/Modals/UpdateShopModal";
import { useAllShopQuery, useDeleteShopMutation } from "@/components/Redux/features/shop/shopApi";

const ManageShop = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {data: shopData, refetch: refetchShop} = useAllShopQuery(undefined)
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [deleteShop] = useDeleteShopMutation();

  const handleEdit = (shop: any) => {
    setSelectedShop(shop);
    setIsEditModalOpen(true);
  };

  const handleDelete = (shopId: string) => {
    setSelectedShop(shopId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedShop) return;
    setIsLoading(true);
    const toastId = toast.loading("Deleting Shop...");
    try {
      const res = await deleteShop(selectedShop);
      if (res.data) {
        toast.success(res.data.message, { id: toastId });
      } else {
        throw new Error("Deletion failed");
      }
    } catch (error) {
      console.error("Error deleting shop:", error);
      toast.error("Failed to delete shop. Please try again.", { id: toastId });
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setSelectedShop(null);
    }
  };

  const handleSuccess = () => {
    // Add your refetch logic here
    refetchShop();
    console.log("Operation successful, refetching data...");
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center gap-3 mb-8">
          <h1 className="md:text-3xl text-xl font-bold bg-gray-300 bg-clip-text text-transparent">
            Shop Management
          </h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="cursor-pointer bg-gray-600 transition-colors hover:bg-gray-700 text-white text-sm px-2 lg:px-6 py-2 rounded-lg"
          >
            Add Shop
          </button>
        </div>

        <div className="rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 transition-colors">
                <tr>
                  <th className="px-6 py-4 text-left">Logo</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Description</th>
                  <th className="px-6 py-4 text-left">Owner</th>
                  <th className="px-6 py-4 text-left">Products</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shopData?.data?.map((shop: any) => (
                  <motion.tr
                    key={shop.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-gray-700 hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="relative w-12 h-12">
                        <Image
                          src={shop?.logo}
                          alt={shop?.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">{shop?.name}</td>
                    <td className="px-6 py-4">{shop?.description}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{shop?.owner?.name}</p>
                        <p className="text-sm text-gray-400">{shop?.owner?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{shop?._count?.products}</td>
                    <td className="px-6 py-4 text-2xl flex gap-3">
                      <MdDeleteOutline
                        className="cursor-pointer hover:text-red-500 transition-colors"
                        onClick={() => handleDelete(shop?.id)}
                      />
                      <FaPen
                        className="cursor-pointer hover:text-blue-500 text-xl transition-colors"
                        onClick={() => handleEdit(shop)}
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
          <AddShopModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && (
          <UpdateShopModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={handleSuccess}
            shop={selectedShop}
          />
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
              <p className="mb-6">Are you sure you want to delete this shop? This action cannot be undone.</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:bg-red-400"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageShop;
