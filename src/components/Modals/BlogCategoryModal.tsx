'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface BlogCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; description: string }) => Promise<void>;
    initialData?: {
        name: string;
        description: string;
    };
    isUpdateMode?: boolean;
}

const BlogCategoryModal: React.FC<BlogCategoryModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isUpdateMode = false
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [formErrors, setFormErrors] = useState({
        name: '',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = { name: '', description: '' };

        if (!formData.name.trim()) {
            newErrors.name = 'Category name is required';
            valid = false;
        } else if (formData.name.length > 50) {
            newErrors.name = 'Name must be less than 50 characters';
            valid = false;
        }

        if (formData.description.length > 200) {
            newErrors.description = 'Description must be less than 200 characters';
            valid = false;
        }

        setFormErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            setIsSubmitting(true);
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative bg-slate-800/70 rounded-xl shadow-xl w-full max-w-md"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-white">
                                {isUpdateMode ? 'Edit Category' : 'Add Category'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-100 mb-1">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 text-gray-900 rounded-lg border ${
                                            formErrors.name
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-blue-500'
                                        } focus:outline-none focus:ring-2 bg-gray-100 text-gray-900`}
                                        placeholder="Enter category name"
                                    />
                                    {formErrors.name && (
                                        <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                                    )}
                                </div>

                                {/* Description Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-100 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className={`w-full px-4 py-2 rounded-lg border ${
                                            formErrors.description
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-blue-500'
                                        } focus:outline-none focus:ring-2 bg-gray-100 text-gray-900`}
                                        placeholder="Enter category description (optional)"
                                    />
                                    {formErrors.description && (
                                        <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-100 ">
                                        {formData.description.length}/200 characters
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium border border-white/80 text-white/80 hover:text-black hover:bg-gray-400/60 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !formData.name.trim()}
                                    className="px-4 py-2 text-sm font-medium text-black  bg-white/80 hover:bg-white/60 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {isUpdateMode ? 'Updating...' : 'Adding...'}
                                        </span>
                                    ) : (
                                        isUpdateMode ? 'Update Category' : 'Add Category'
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BlogCategoryModal; 