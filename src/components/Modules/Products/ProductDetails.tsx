"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { FiMinus, FiPlus, FiShoppingCart, FiCreditCard, FiInfo, FiList, FiStar } from 'react-icons/fi';
import { useParams, useRouter } from 'next/navigation';
import { useSingleProductQuery } from '@/components/Redux/features/products/productsApi';
import { useAppDispatch, useAppSelector } from '@/components/Redux/hooks';
import { addToCart } from '@/components/Redux/features/cart/cartSlice';
import { toast } from 'sonner';
import AddToWishlistButton from '@/components/DashboardLayout/Wishlist/AddToWishlistButton';
import { Rating } from '@smastrom/react-rating';
import "@smastrom/react-rating/style.css";
import { useGetUserQuery } from '@/components/Redux/features/user/useApi';
import ReviewCard from '../Reviews/ReviewCard';
import { useForm } from 'react-hook-form';
import { useCreateReviewMutation } from '@/components/Redux/features/review/reviewApi';

interface ReviewFormData {
    rating: number;
    reviewText: string;
}

const ProductDetails = () => {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user }: any = useAppSelector((state) => state.auth);
    const [addReview] = useCreateReviewMutation();
    const { data: product, isLoading, isError, refetch: refetchProductDetails } = useSingleProductQuery(id);
    const { data: SingleUser } = useGetUserQuery(user?.id);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState('description');
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);
    const [reviewName, setReviewName] = useState('');
    const [reviewEmail, setReviewEmail] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ReviewFormData>();

    if (isLoading) return <div className='flex justify-center items-center text-2xl font-bold pt-10'>Loading...</div>;
    if (isError) return <div>Error loading product details</div>;
    if (!product || !product.data) return <div>No product data available</div>;

    const { images, name, price, description, weight, dimensions, origin, brand, category } = product.data;

    const handleIncrement = () => {
        setQuantity(prev => prev + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAuthCheck = () => {
        if (!user) {
            toast.error('Please login first to continue');
            router.push('/login?redirectPath=/product/' + id);
            return false;
        }
        return true;
    };

    const handleAddToCart = () => {
        if (!handleAuthCheck()) return;

        dispatch(addToCart({
            id: id as string,
            name,
            price,
            quantity,
            image: images[selectedImage]
        }));
        toast.success('Product added to cart');
        router.push('/cart');
    };

    const handleBuyNow = () => {
        if (!handleAuthCheck()) return;

        dispatch(addToCart({
            id: id as string,
            name,
            price,
            quantity,
            image: images[selectedImage]
        }));
        router.push('/checkout');
    };

    const onSubmit = async (data: ReviewFormData) => {
        const toastId = toast.loading("Adding Review...");
        if (!user.id) {
            toast.error("User information not available. Please try again later.", {
                id: toastId,
            });
            return;
        }

        try {
            const reviewData = {
                rating: rating,
                reviewText: data.reviewText,
                productId: product.data.id,
            };

            const res = await addReview(reviewData).unwrap();

            if (res?.success) {
                toast.success(res?.message || "Your review is Pending", {
                    id: toastId,
                });
                reset();
                setRating(0);
                refetchProductDetails();
            } else {
                toast.error(res?.message || "Failed to add review", { id: toastId });
            }
        } catch (error: any) {
            console.error("Review submission error:", error);
            toast.error(error?.data?.message || "Something went wrong", {
                id: toastId,
            });
        }
    };

    const tabContent = {
        description: (
            <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <p className="text-gray-700">{description}</p>
            </div>
        ),
        additional: (
            <div>
                <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
                <table className="w-full border-collapse">
                    <tbody>
                        <tr className="border-b">
                            <td className="py-2 font-medium">Weight</td>
                            <td className="py-2">{weight || '500g'}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 font-medium">Dimensions</td>
                            <td className="py-2">{dimensions || '10 × 10 × 10 cm'}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 font-medium">Origin</td>
                            <td className="py-2">{origin || 'Bangladesh'}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-2 font-medium">Brand</td>
                            <td className="py-2">{brand?.name || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td className="py-2 font-medium">Category</td>
                            <td className="py-2">{category?.name || 'N/A'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        ),
        reviews: (
            <div>
                <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                <div className="space-y-6">


                    <div className="bg-white rounded-lg">
                        {user ? <>
                            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                                {/* Rating Component */}
                                <div className="flex items-center gap-1">
                                    <Rating
                                        style={{ maxWidth: 120 }}
                                        value={rating}
                                        onChange={setRating}
                                        halfFillMode="box"
                                        transition="colors"
                                    />
                                    <span className="text-yellow-400">{rating}/5</span>
                                </div>
                                {/* Review Textarea */}
                                <textarea
                                    className="w-full mt-4 p-2 outline-none focus:border-blue-500 transition-all duration-300 border border-gray-600 rounded"
                                    rows={4}
                                    placeholder="Your review *"
                                    {...register("reviewText", { required: "Review is required" })}
                                />
                                {errors.reviewText && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.reviewText.message}
                                    </p>
                                )}

                                {/* Checkbox for saving info */}

                                {/* <div className="mt-4">
 
              <label className="text-sm">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
                Save my name, email, and website in this browser for the next
                time I comment.
              </label>
 
            </div> */}

                                {/* Submit Button */}
                                <br />
                                <button
                                    type="submit"
                                    disabled={!user?.id || rating === 0}
                                    className="mt-4 px-10 py-3 cursor-pointer bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-lg hover:-translate-y-1 hover:shadow-orange-600/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {!user?.id ? "Loading user data..." : "Submit"}
                                </button>
                            </form>

                        </> : <></>}

                        {/* Display Submitted Review */}
                        <div className="mt-10">
                            <ReviewCard
                                ReviewData={product.data.reviews}
                                UserData={user?.id ? SingleUser?.data : null}
                                onReviewUpdate={refetchProductDetails}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Product Images */}
                <div className="flex-1">
                    <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden">
                        <Image
                            src={images[selectedImage]}
                            alt="Product Image"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-4">
                        {images.map((image: string, idx: number) => (
                            <div
                                key={idx}
                                className={`relative h-16 sm:h-20 md:h-24 rounded-md overflow-hidden cursor-pointer border ${selectedImage === idx ? 'border-orange-500' : 'hover:border-orange-500'}`}
                                onClick={() => setSelectedImage(idx)}
                            >
                                <Image
                                    src={image}
                                    alt={`Thumbnail ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 space-y-4 mt-6 md:mt-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                        <h1 className="text-2xl sm:text-3xl font-semibold">{name}</h1>
                        <AddToWishlistButton item={{ id: id as string, name, price, image: images[selectedImage] }} />
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-xl sm:text-2xl font-bold text-orange-500">৳{price.toLocaleString()}</span>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-medium">Description:</h3>
                        <p className="text-gray-600 text-sm sm:text-base">{description}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="font-medium">Quantity:</span>
                        <div className="flex items-center border rounded-md">
                            <button
                                onClick={handleDecrement}
                                className="p-2 hover:bg-gray-100"
                            >
                                <FiMinus />
                            </button>
                            <span className="px-4 py-2 border-x">{quantity}</span>
                            <button
                                onClick={handleIncrement}
                                className="p-2 hover:bg-gray-100"
                            >
                                <FiPlus />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleAddToCart}
                            className="flex items-center justify-center gap-2 w-full bg-orange-500 text-white py-2 sm:py-3 rounded-md hover:bg-orange-600 transition-colors"
                        >
                            <FiShoppingCart />
                            Add to Cart
                        </button>

                        <button
                            onClick={handleBuyNow}
                            className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-2 sm:py-3 rounded-md hover:bg-green-600 transition-colors"
                        >
                            <FiCreditCard />
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-12">
                <div className="flex flex-wrap border-b">
                    {['description', 'additional', 'reviews'].map((tab) => (
                        <button
                            key={tab}
                            className={`flex items-center gap-1 sm:gap-2 py-2 sm:py-3 px-3 sm:px-6 text-sm sm:text-base font-medium transition-colors ${activeTab === tab
                                ? 'text-orange-500 border-b-2 border-orange-500'
                                : 'text-gray-500 hover:text-orange-500'
                                }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'description' && <FiInfo />}
                            {tab === 'additional' && <FiList />}
                            {tab === 'reviews' && <FiStar />}
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="mt-6 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                    {tabContent[activeTab as keyof typeof tabContent]}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
