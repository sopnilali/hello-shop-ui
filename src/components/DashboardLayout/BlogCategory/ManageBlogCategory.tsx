'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'
import LoadingSpinner from '@/components/Shared/LoadingSpinner'
import { useAddBlogCategoryMutation, useDeleteBlogCategoryMutation, useGetAllBlogCategoriesQuery, useUpdateBlogCategoryMutation } from '@/components/Redux/features/blogcategory/blogcategoryApi'
import BlogCategoryModal from '@/components/Modals/BlogCategoryModal'
import DeleteBlogCategoryModal from '@/components/Modals/DeleteBlogCategoryModal'

// Animation variants
const tableRowVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (index: number) => ({ 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      delay: index * 0.05,
      duration: 0.3,
      ease: "easeOut"
    } 
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
}

const tableContainerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.05,
      delayChildren: 0.1
    } 
  }
}

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
}

const ManageBlogCategory = () => {
  // RTK Query hooks
  const { data: categoriesData, isLoading, isError, refetch } = useGetAllBlogCategoriesQuery(undefined)
  const [addCategory] = useAddBlogCategoryMutation()
  const [updateCategory] = useUpdateBlogCategoryMutation()
  const [deleteCategory] = useDeleteBlogCategoryMutation()

  // State management
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdateMode, setIsUpdateMode] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; name: string; description: string } | null>(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, categoryId: '', categoryName: '' })
  const [isDeleting, setIsDeleting] = useState(false)

  // Extract categories from API response
  const categories = categoriesData?.data || []

  // Handle form submission
  const handleSubmit = async (formData: { name: string; description: string }) => {
    try {
      if (isUpdateMode && selectedCategory) {
        await updateCategory({
          id: selectedCategory.id,
          data: formData
        }).unwrap()
        toast.success('Category updated successfully')
      } else {
        await addCategory(formData).unwrap()
        toast.success('Category added successfully')
      }
      refetch()
    } catch (error: any) {
      toast.error(error?.data?.message || (isUpdateMode ? 'Failed to update category' : 'Failed to add category'))
      throw error
    }
  }

  // Handle edit action
  const handleEdit = (category: any) => {
    setSelectedCategory(category)
    setIsUpdateMode(true)
    setIsModalOpen(true)
  }

  // Handle delete action
  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteCategory(deleteModal.categoryId).unwrap()
      toast.success('Category deleted successfully')
      setDeleteModal({ isOpen: false, categoryId: '', categoryName: '' })
      refetch()
    } catch (error) {
      toast.error('Failed to delete category')
    } finally {
      setIsDeleting(false)
    }
  }

  // Reset modal state
  const handleModalClose = () => {
    setIsModalOpen(false)
    setIsUpdateMode(false)
    setSelectedCategory(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-full"
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h1 
          variants={titleVariants}
          className="text-2xl font-bold text-gray-100"
        >
          Manage Blog Categories
        </motion.h1>
        <motion.button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-700/90 text-gray-100 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700/80"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <FiPlus /> Add Category
        </motion.button>
      </div>

      <div className="overflow-x-auto rounded" style={{ overflowY: 'hidden' }}>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            {/* <LoadingSpinner /> */}
          </div>
        ) : isError ? (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-red-400">Failed to load categories. Please try again.</p>
            <button 
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-slate-700 rounded-lg text-gray-100 hover:bg-slate-600"
            >
              Retry
            </button>
          </div>
        ) : (
          <motion.table 
            className="min-w-full bg-gray-900 rounded-lg shadow-lg"
            variants={tableContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <thead className="bg-slate-700/90 text-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              <AnimatePresence>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-400">
                      No categories found
                    </td>
                  </tr>
                ) : (
                  categories.map((category: any, index: number) => (
                    <motion.tr
                      key={category.id}
                      className='hover:bg-gray-700 duration-500 transition-all'
                      variants={tableRowVariants}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-200 max-w-md">
                        {category.description || 'No description'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <motion.button 
                          onClick={() => handleEdit(category)}
                          className="mr-2 text-indigo-400 hover:text-indigo-300 cursor-pointer"
                          whileHover={{ scale: 1.15, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </motion.button>
                        <motion.button 
                          onClick={() => setDeleteModal({ isOpen: true, categoryId: category.id, categoryName: category.name })} 
                          className="text-rose-400 hover:text-rose-300 cursor-pointer"
                          whileHover={{ scale: 1.15, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </motion.table>
        )}
      </div>

      {/* Category Modal */}
      <BlogCategoryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        initialData={selectedCategory ? { name: selectedCategory.name, description: selectedCategory.description } : undefined}
        isUpdateMode={isUpdateMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteBlogCategoryModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, categoryId: '', categoryName: '' })}
        onDelete={handleDelete}
        categoryName={deleteModal.categoryName}
        isLoading={isDeleting}
      />
    </motion.div>
  )
}

export default ManageBlogCategory