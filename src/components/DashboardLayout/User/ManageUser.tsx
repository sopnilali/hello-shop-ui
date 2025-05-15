"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { MdDeleteOutline } from "react-icons/md";
import { FaPen } from "react-icons/fa6";
import { MdDiscount } from "react-icons/md";
import { useDeleteUserMutation, useGetAllUserQuery } from "@/components/Redux/features/user/useApi";
import UserUpdateModal from "./UserUpdateModal";

const ManageUser = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToUpdate, setUserToUpdate] = useState<any>(null);
  const { data: users, isError, refetch } = useGetAllUserQuery(undefined);
  const [deleteUser] = useDeleteUserMutation();

  const allUsers = users?.data; // all users
  console.log(allUsers);

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  const handleUpdate = (user: any) => {
    setUserToUpdate(user);
    setIsUpdateModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      setIsLoading(true);
      const toastId = toast.loading("Deleting User...");
      try {
        await deleteUser(userToDelete);
        toast.success("User deleted successfully!", { id: toastId });
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user. Please try again.", { id: toastId });
      } finally {
        setIsLoading(false);
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading users</div>;
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center gap-3 mb-8">
          <h1 className="md:text-3xl text-xl font-bold bg-gray-300 bg-clip-text text-transparent">
            User Management
          </h1>
        </div>

        <div className="rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 transition-colors">
                <tr>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Phone Number</th>
                  <th className="px-6 py-4 text-left">Address</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers && allUsers.map((user: any, index: number) => (
                  <motion.tr
                    key={user.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-gray-700 hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.phoneNumber}</td>
                    <td className="px-6 py-4">{user.address}</td>
                    <td className="px-6 py-4">{user.role}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-sm border ${user.status === 'ACTIVE' ? 'border-green-500/20 text-green-400' : 'border-yellow-500/20 text-yellow-400'
                        }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-2xl flex gap-3">
                      <MdDeleteOutline
                        className="cursor-pointer hover:text-red-500 transition-colors"
                        onClick={() => handleDelete(user.id)}
                      />
                      <FaPen
                        className="cursor-pointer hover:text-blue-500 text-xl transition-colors"
                        onClick={() => handleUpdate(user)}
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
              <p className="mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
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

      <UserUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        user={userToUpdate}
      />
    </div>
  );
};

export default ManageUser;
