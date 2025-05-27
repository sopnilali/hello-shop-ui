'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetAllBlogCategoriesQuery } from '@/components/Redux/features/blogcategory/blogcategoryApi';
import { FiX } from 'react-icons/fi';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCategories: string[];
    onCategorySelect: (categoryId: string) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
    isOpen,
    onClose,
    selectedCategories,
    onCategorySelect,
}) => {
    const { data: categories, isLoading } = useGetAllBlogCategoriesQuery(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCategories = categories?.data?.filter((category: any) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Filter by Category
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <div className="p-4">
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />

                            <div className="mt-4 max-h-60 overflow-y-auto">
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-4">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {filteredCategories?.map((category: any) => (
                                            <button
                                                key={category.id}
                                                onClick={() => onCategorySelect(category.id)}
                                                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                                    selectedCategories.includes(category.id)
                                                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                            >
                                                {category.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CategoryModal; 