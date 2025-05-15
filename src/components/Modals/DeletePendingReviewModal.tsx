import { AnimatePresence, motion } from "framer-motion";

interface deletePendingReviewModalProps {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  reviewToDelete: any;
  setReviewToDelete: (review: any) => void;
  onDelete: (id: string) => Promise<void>;
}

const DeletePendingReviewModal = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  reviewToDelete,
  setReviewToDelete,
  onDelete,
}: deletePendingReviewModalProps) => {
  const handlePendingReviewDelete = async () => {
    if (reviewToDelete?.id) {
      await onDelete(reviewToDelete.id);
    }
  };

  if (!isDeleteModalOpen || !reviewToDelete) return null;

  return (
    <div>
      <AnimatePresence>
        {isDeleteModalOpen && reviewToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-lg z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#000a3a] border border-[#1a2d6d] rounded-xl overflow-hidden p-6"
            >
              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
              >
                Delete Pending Review
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-300 mb-6"
              >
                Are you sure you want to delete your pending review? This action cannot be undone.
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-end gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setReviewToDelete(null);
                  }}
                  className="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePendingReviewDelete}
                  className="hover:bg-red-600 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Delete
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeletePendingReviewModal;