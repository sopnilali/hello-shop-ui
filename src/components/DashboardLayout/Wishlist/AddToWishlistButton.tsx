"use client";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { addToWishlist, removeFromWishlist } from "@/components/Redux/features/wishlist/wishlistSlice";
import { RootState } from "@/components/Redux/store";
import { useEffect } from "react";

interface AddToWishlistButtonProps {
  item: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

const AddToWishlistButton = ({ item }: AddToWishlistButtonProps) => {
  const dispatch = useDispatch();
  const { items: wishlistItems, loading, error } = useSelector((state: RootState) => state.wishlist);
  const isInWishlist = wishlistItems?.some((wishlistItem) => wishlistItem.id === item.id) ?? false;

  useEffect(() => {
    // Log the current state for debugging
    console.log("Wishlist Button State:", { item, isInWishlist, loading, error });
  }, [item, isInWishlist, loading, error]);

  const handleWishlistToggle = () => {
    try {
      if (isInWishlist) {
        dispatch(removeFromWishlist(item.id));
        toast.success("Removed from wishlist");
      } else {
        dispatch(addToWishlist(item));
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  };

  if (loading) {
    return (
      <button
        disabled
        className="p-2 rounded-full opacity-50 cursor-not-allowed"
        title="Loading..."
      >
        <MdFavoriteBorder className="text-2xl text-gray-400" />
      </button>
    );
  }

  return (
    <button
      onClick={handleWishlistToggle}
      className="p-2 rounded-full hover:bg-gray-700 transition-colors"
      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isInWishlist ? (
        <MdFavorite className="text-2xl text-red-500" />
      ) : (
        <MdFavoriteBorder className="text-2xl text-gray-400 hover:text-red-500" />
      )}
    </button>
  );
};

export default AddToWishlistButton; 