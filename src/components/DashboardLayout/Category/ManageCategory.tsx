"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { MdDeleteOutline } from "react-icons/md";
import { FaPen } from "react-icons/fa6";
import { useAllcategoriesQuery, useCreatecategoryMutation, useDeletecategoryMutation, useUpdatecategoryMutation, } from "@/components/Redux/features/category/categoryApi";
import LoadingSpinner from "@/components/Shared/LoadingSpinner";

interface Category {
    id: string;
    name: string;
    description: string;
}

const ManageCategory = () => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [categoryToUpdate, setCategoryToUpdate] = useState<Category | null>(null);
    const { data: categories, isError, isLoading } = useAllcategoriesQuery(undefined);
    const [deleteCategory] = useDeletecategoryMutation();
    const [updateCategory] = useUpdatecategoryMutation();
    const [createCategory] = useCreatecategoryMutation();

    const allCategories = categories?.data;

    const handleDelete = (categoryId: string) => {
        setCategoryToDelete(categoryId);
        setIsDeleteModalOpen(true);
    };

    const handleUpdate = (category: Category) => {
        setCategoryToUpdate(category);
        setIsUpdateModalOpen(true);
    };

    const handleAdd = () => {
        setIsAddModalOpen(true);
    };

    const confirmDelete = async () => {
        if (categoryToDelete) {
            const toastId = toast.loading("Deleting Category...");
            try {
                await deleteCategory(categoryToDelete);
                toast.success("Category deleted successfully!", { id: toastId });
            } catch (error) {
                console.error("Error deleting category:", error);
                toast.error("Failed to delete category. Please try again.", { id: toastId });
            } finally {
                setIsDeleteModalOpen(false);
                setCategoryToDelete(null);
            }
        }
    };

    const confirmUpdate = async (updatedCategory: Category) => {
        const toastId = toast.loading("Updating Category...");
        try {
            await updateCategory({ id: updatedCategory.id, data: updatedCategory });
            toast.success("Category updated successfully!", { id: toastId });
            setIsUpdateModalOpen(false);
        } catch (error) {
            console.error("Error updating category:", error);
            toast.error("Failed to update category. Please try again.", { id: toastId });
        }
    };

    const confirmAdd = async (newCategory: Omit<Category, 'id'>) => {
        console.log(newCategory);
        const toastId = toast.loading("Adding Category...");
        try {
            const res = await createCategory(newCategory);
            toast.success(res.data.message, { id: toastId });
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Error adding category:", error);
            toast.error("Failed to add category. Please try again.", { id: toastId });
        }
    };

    if (isLoading) {
        return <LoadingSpinner/>;
    }

    if (isError) {
        return <div>Error loading categories</div>;
    }

    return (
        <div className="max-h-screen overflow-auto">
            <div className="max-w-full mx-auto">
                <div className="flex justify-between items-center gap-3 mb-8">
                    <h1 className="md:text-3xl text-xl font-bold bg-gray-300 bg-clip-text text-transparent">
                        Category
                    </h1>
                    <button
                        onClick={handleAdd}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Add Category
                    </button>
                </div>

                <div className="rounded-xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-800 transition-colors">
                                <tr>
                                    <th className="px-6 py-4 text-left">Category Name</th>
                                    <th className="px-6 py-4 text-left">Category Description</th>
                                    <th className="px-6 py-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allCategories && allCategories.map((category: Category) => (
                                    <motion.tr
                                        key={category.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="border-t border-gray-700 hover:bg-gray-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">{category.name}</td>
                                        <td className="px-6 py-4">{category.description}</td>
                                        <td className="px-6 py-4 text-2xl flex gap-3">
                                            <MdDeleteOutline
                                                className="cursor-pointer hover:text-red-500 transition-colors"
                                                onClick={() => handleDelete(category.id)}
                                            />
                                            <FaPen
                                                className="cursor-pointer hover:text-blue-500 text-xl transition-colors"
                                                onClick={() => handleUpdate(category)}
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
                            <p className="mb-6">Are you sure you want to delete this category? This action cannot be undone.</p>
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
                {isUpdateModalOpen && categoryToUpdate && (
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
                            <h3 className="text-xl font-semibold mb-4">Update Category</h3>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const updatedCategory = {
                                    id: categoryToUpdate.id,
                                    name: formData.get('name') as string,
                                    description: formData.get('description') as string
                                };
                                confirmUpdate(updatedCategory);
                            }}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        defaultValue={categoryToUpdate.name}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        defaultValue={categoryToUpdate.description}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                    />
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsUpdateModalOpen(false)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isAddModalOpen && (
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
                            <h3 className="text-xl font-semibold mb-4">Add New Category</h3>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const newCategory = {
                                    name: formData.get('name') as string,
                                    description: formData.get('description') as string
                                };
                                confirmAdd(newCategory);
                            }}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        required
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                    />
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                        Add
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

export default ManageCategory;
