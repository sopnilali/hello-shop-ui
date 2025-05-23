"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { MdDeleteOutline } from "react-icons/md";
import { FaPen } from "react-icons/fa6";
import Image from "next/image";
import { useGetAllReviewQuery, useDeleteReviewMutation, useUpdateReviewMutation } from "@/components/Redux/features/review/reviewApi";
import { IReview } from "@/components/Types/review";
import { FaCheckCircle, FaClock } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const ManageReviews = () => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { data: reviewsData, refetch: refetchReviews } = useGetAllReviewQuery(undefined);
    const [selectedReview, setSelectedReview] = useState<any>(null);
    const [deleteReview] = useDeleteReviewMutation();
    const [updateReview] = useUpdateReviewMutation();

    const handleDelete = (reviewId: string) => {
        setSelectedReview(reviewId);
        setIsDeleteModalOpen(true);
    };

    const handleStatusUpdate = (review: IReview) => {
        setSelectedReview(review);
        setIsStatusModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedReview) return;
        setIsLoading(true);
        const toastId = toast.loading("Deleting Review...");
        try {
            const res = await deleteReview(selectedReview);
            if (res.data) {
                toast.success(res.data.message, { id: toastId });
                refetchReviews();
            } else {
                throw new Error("Deletion failed");
            }
        } catch (error) {
            console.error("Error deleting review:", error);
            toast.error("Failed to delete review. Please try again.", { id: toastId });
        } finally {
            setIsLoading(false);
            setIsDeleteModalOpen(false);
            setSelectedReview(null);
        }
    };

    const confirmStatusUpdate = async (newStatus: string) => {
        if (!selectedReview) return;
        setIsLoading(true);
        const toastId = toast.loading("Updating Review Status...");
        try {
            const res = await updateReview({ id: selectedReview.id, status: newStatus });
            if (res.data) {
                toast.success(res.data.message, { id: toastId });
                refetchReviews();
            } else {
                throw new Error("Status update failed");
            }
        } catch (error) {
            console.error("Error updating review status:", error);
            toast.error("Failed to update review status. Please try again.", { id: toastId });
        } finally {
            setIsLoading(false);
            setIsStatusModalOpen(false);
            setSelectedReview(null);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-full mx-auto">
                <div className="flex justify-between items-center gap-3 mb-8">
                    <h1 className="md:text-3xl text-xl font-bold bg-gray-300 bg-clip-text text-transparent">
                        Review Management
                    </h1>
                </div>

                <div className="rounded-xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-800 transition-colors">
                                <tr>
                                    <th className="px-6 py-4 text-left">Product</th>
                                    <th className="px-6 py-4 text-left">User</th>
                                    <th className="px-6 py-4 text-left">Rating</th>
                                    <th className="px-6 py-4 text-left">Comment</th>
                                    <th className="px-6 py-4 text-left">Status</th>
                                    <th className="px-6 py-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviewsData?.data?.map((review: IReview) => (
                                    <motion.tr
                                        key={review.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="border-t border-gray-700 hover:bg-gray-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-12 h-12">
                                                    <Image
                                                        src={review?.product?.images?.[0] || '/placeholder.png'}
                                                        alt={review?.product?.name || 'Product image'}
                                                        fill
                                                        className="object-cover rounded-lg"
                                                    />
                                                </div>
                                                <span>{review?.product?.name || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium">{review?.user?.name || 'N/A'}</p>
                                                <p className="text-sm text-gray-400">{review?.user?.email || 'N/A'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <span>{review?.rating || 0}</span>
                                                <span className="text-yellow-400">★</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{review?.reviewText || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span 
                                                className={`px-2 py-1 rounded-full text-sm border ${review?.status === "PUBLISHED" ? 'border-green-500/20 text-green-400' : 'border-yellow-500/20 text-yellow-400'}`}
                                            >
                                                {review?.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-2xl flex gap-3">
                                            <MdDeleteOutline
                                                className="cursor-pointer hover:text-red-500 transition-colors"
                                                onClick={() => handleDelete(review?.id)}
                                            />
                                            {review?.status !== "PUBLISHED" && (
                                                <FaPen
                                                    className="cursor-pointer hover:text-blue-500 transition-colors"
                                                    onClick={() => handleStatusUpdate(review)}
                                                />
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
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
                            <p className="mb-6">Are you sure you want to delete this review? This action cannot be undone.</p>
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

            {/* Status Update Modal */}
            <AnimatePresence>
                {isStatusModalOpen && (
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
                            className="bg-gray-900 p-8 rounded-xl shadow-2xl max-w-md w-full border border-gray-700"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                    Update Review Status
                                </h3>
                                <button
                                    onClick={() => setIsStatusModalOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <IoClose size={24} />
                                </button>
                            </div>
                            
                            <p className="text-gray-300 mb-8">Select the new status for this review.</p>
                            
                            <div className="space-y-4 mb-8">
                                <button
                                    onClick={() => confirmStatusUpdate("PUBLISHED")}
                                    disabled={isLoading || selectedReview?.status === "PUBLISHED"}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-green-500/20"
                                >
                                    <FaCheckCircle className="text-xl" />
                                    <span className="font-medium">Publish Review</span>
                                </button>
                                
                                <button
                                    onClick={() => confirmStatusUpdate("PENDING")}
                                    disabled={isLoading || selectedReview?.status === "PENDING"}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg hover:from-yellow-600 hover:to-amber-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-yellow-500/20"
                                >
                                    <FaClock className="text-xl" />
                                    <span className="font-medium">Mark as Pending</span>
                                </button>
                            </div>
                            
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setIsStatusModalOpen(false)}
                                    className="px-6 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 border border-gray-600 hover:border-gray-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageReviews;
