"use client";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { MdDeleteOutline } from "react-icons/md";
import { RootState } from "@/components/Redux/store";
import { removeFromWishlist, clearWishlist } from "@/components/Redux/features/wishlist/wishlistSlice";
import { useEffect } from "react";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items: wishlistItems, loading, error } = useSelector((state: RootState) => state.wishlist);

  useEffect(() => {
    // Log the current state for debugging
    console.log("Wishlist State:", { wishlistItems, loading, error });
  }, [wishlistItems, loading, error]);

  const handleRemove = (id: string) => {
    try {
      dispatch(removeFromWishlist(id));
      toast.success("Item removed from wishlist");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item from wishlist");
    }
  };

  const handleClear = () => {
    try {
      dispatch(clearWishlist());
      toast.success("Wishlist cleared");
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      toast.error("Failed to clear wishlist");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black-300 mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className=" flex justify-center items-center  ">
        <div className="text-center inset-0 ">
          <h2 className="text-2xl font-bold text-black-300 mb-4">Your Wishlist is Empty</h2>
          <p className="text-black-400">Add items to your wishlist to see them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className=" container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-black">My Wishlist</h1>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear Wishlist
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {wishlistItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <MdDeleteOutline className="text-xl" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">{item.name}</h3>
                  <p className="text-gray-400">${item.price}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Wishlist; 