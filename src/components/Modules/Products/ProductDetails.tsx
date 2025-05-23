"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { FiMinus, FiPlus, FiShoppingCart, FiCreditCard, FiInfo, FiList, FiStar, FiShare, FiMessageSquare, FiX, FiUser, FiMail, FiPhone, FiRepeat } from 'react-icons/fi';
import { useParams, useRouter } from 'next/navigation';
import { useSingleProductQuery } from '@/components/Redux/features/products/productsApi';
import { useAppDispatch, useAppSelector } from '@/components/Redux/hooks';
import { addToCart } from '@/components/Redux/features/cart/cartSlice';
import customToast from '@/components/Shared/customToast';
import AddToWishlistButton from '@/components/DashboardLayout/Wishlist/AddToWishlistButton';
import { Rating } from '@smastrom/react-rating';
import "@smastrom/react-rating/style.css";
import { useGetUserQuery } from '@/components/Redux/features/user/useApi';
import ReviewCard from '../Reviews/ReviewCard';
import { useForm } from 'react-hook-form';
import { useCreateReviewMutation } from '@/components/Redux/features/review/reviewApi';
import { FaWhatsapp } from 'react-icons/fa';
import { BiSolidData } from 'react-icons/bi';

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
    const [enquiryMessage, setEnquiryMessage] = useState('');
    const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ReviewFormData>();

    if (isLoading) return (
        <div className='w-full overflow-x-hidden bg-gray-50'>
            <div className='container mx-auto px-2 sm:px-6 py-6 sm:py-8 lg:py-8'>
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Image Skeleton */}
                    <div className="flex-1">
                        <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full rounded-lg bg-gray-200 animate-pulse"></div>
                        <div className="grid grid-cols-4 gap-2 mt-4">
                            {[1, 2, 3, 4].map((idx) => (
                                <div key={idx} className="relative h-16 sm:h-20 md:h-24 rounded-md bg-gray-200 animate-pulse"></div>
                            ))}
                        </div>
                    </div>

                    {/* Info Skeleton */}
                    <div className="flex-1 space-y-4 mt-6 md:mt-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                            <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
                        </div>

                        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>

                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                            <div className="h-20 bg-gray-200 rounded w-full animate-pulse"></div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                            <div className="flex items-center border rounded-md">
                                <div className="h-10 w-24 bg-gray-200 animate-pulse"></div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="h-12 bg-gray-200 rounded w-full animate-pulse"></div>
                            <div className="h-12 bg-gray-200 rounded w-full animate-pulse"></div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-100 rounded-lg">
                            <div className="space-y-2 w-full">
                                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <div className="h-10 bg-gray-200 rounded w-full sm:w-24 animate-pulse"></div>
                                <div className="h-10 bg-gray-200 rounded w-full sm:w-24 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Skeleton */}
                <div className="mt-12">
                    <div className="flex border-b">
                        {[1, 2, 3].map((idx) => (
                            <div key={idx} className="h-10 bg-gray-200 rounded-t-lg w-24 mx-1 animate-pulse"></div>
                        ))}
                    </div>
                    <div className="mt-6 bg-white p-4 sm:p-6 rounded-lg">
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (isError) return <div>Error loading product details</div>;
    if (!product || !product.data) return <div>No product data available</div>;

    const { images, name, price, description, weight, dimensions, origin, brand, category, orderItems, discount } = product.data;

    const totalQuantity = orderItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

    const discountedPrice = discount ? price * (1 - discount.value / 100) : price;

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
            customToast('Please login first to continue', 'error', 'loading...');
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
            price: discountedPrice,
            quantity,
            image: images[selectedImage]
        }));
        customToast('Product added to cart', 'success', 'loading...');
        router.push('/cart');
    };

    const handleBuyNow = () => {
        if (!handleAuthCheck()) return;

        dispatch(addToCart({
            id: id as string,
            name,
            price: discountedPrice,
            quantity,
            image: images[selectedImage]
        }));
        router.push('/checkout');
    };

    const onSubmit = async (data: ReviewFormData) => {
        if (!user.id) {
            customToast("User information not available. Please try again later.", "error", "loading...");
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
                customToast(res?.message || "Your review is Pending", "success", "loading...");
                reset();
                setRating(0);
                refetchProductDetails();
            } else {
                customToast(res?.message || "Failed to add review", "error", "loading...");
            }
        } catch (error: any) {
            console.error("Review submission error:", error);
            customToast(error?.data?.message || "Something went wrong", "error", "loading...");
        }
    };

    const handleSendEnquiry = () => {
        if (!enquiryMessage.trim()) {
            customToast('Please enter a message', 'error', 'loading...');
            return;
        }
        // Add your enquiry sending logic here
        customToast('Message sent to seller', 'success', 'loading...');
        setEnquiryMessage('');
        setIsEnquiryModalOpen(false);
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
                            <td className="py-2">{weight || '500g'}kg</td>
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
        <div className='w-full overflow-x-hidden bg-gray-50'>
            <div className='container mx-auto px-2 sm:px-6 py-6 sm:py-8 lg:py-8'>
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Product Images */}
                    <div className="flex-1">
                        <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden">
                            <Image
                                src={images[selectedImage]}
                                alt={name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-2 mt-4">
                            {images.map((image: string, index: number) => (
                                <div
                                    key={index}
                                    className={`relative h-16 sm:h-20 md:h-24 rounded-md overflow-hidden cursor-pointer ${
                                        selectedImage === index ? 'ring-2 ring-[#ff4500]' : ''
                                    }`}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <Image
                                        src={image}
                                        alt={`${name} - Image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-4 mt-6 md:mt-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{name}</h1>
                            <AddToWishlistButton item={{
                                id: id as string,
                                name,
                                price,
                                image: images[selectedImage]
                            }} />
                        </div>

                        <div className="flex items-center gap-2">
                            {discount ? (
                                <>
                                    <span className="text-2xl font-bold text-[#ff4500]">
                                        ৳{discountedPrice.toFixed(2)}
                                    </span>
                                    <span className="text-lg text-gray-500 line-through">
                                        ৳{price.toFixed(2)}
                                    </span>
                                    <span className="bg-[#ff4500] text-white px-2 py-1 rounded text-sm">
                                        {discount.value}% OFF
                                    </span>
                                </>
                            ) : (
                                <span className="text-2xl font-bold text-[#ff4500]">
                                    ৳{price.toFixed(2)}
                                </span>
                            )}
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
                        <div className="flex items-center gap-4">
                            <span className="text-gray-600 text-sm sm:text-base flex items-center gap-2"><BiSolidData/> {totalQuantity} Items Sold</span>
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
                        <div className="flex flex-col lg:flex-row sm:flex-row  lg:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col space-y-2">
                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Shop Information</h4>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <FiInfo className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-700">{product.data.shop?.name || 'Unknown Shop'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiInfo className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-700">{product.data.shop?.description || 'No description available'}</span>
                                        </div>
                                        <div className="border-t pt-2 mt-2">
                                            <h5 className="text-sm font-medium text-gray-500 mb-2">Shop Owner</h5>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <FiUser className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-700">{product.data.shop?.owner?.name || 'Unknown Owner'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FiMail className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-700">{product.data.shop?.owner?.email || 'No email available'}</span>
                                                </div>
                                                {product.data.shop?.owner?.phoneNumber && (
                                                    <div className="flex items-center gap-2">
                                                        <FaWhatsapp className="w-4 h-4 text-gray-400" />
                                                        <span className="text-gray-700">{product.data.shop.owner.phoneNumber}</span>
                                                    </div>
                                                )}
                                                {product.data.shop?.owner?.address && (
                                                    <div className="flex items-center gap-2">
                                                        <FiInfo className="w-4 h-4 text-gray-400" />
                                                        <span className="text-gray-700">{product.data.shop.owner.address}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">

                                <button
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                    title="Share Product"
                                >
                                    <FiShare className="w-4 h-4" />
                                    <span className="sm:inline" onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: product.data.name,
                                                text: product.data.description,
                                                url: window.location.href
                                            })
                                                .catch(error => console.log('Error sharing:', error));
                                        } else {
                                            // Fallback for browsers that don't support Web Share API
                                            const shareUrl = window.location.href;
                                            navigator.clipboard.writeText(shareUrl)
                                                .then(() => customToast('Link copie d to clipboard!', 'success', 'loading...'))
                                                .catch(() => customToast('Failed to copy link', 'error', 'loading...'));
                                        }
                                    }}>Share</span>
                                </button>
                            </div>
                        </div>

                        {/* Enquiry Modal */}
                        {isEnquiryModalOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold">Contact Shop</h3>
                                        <button
                                            onClick={() => setIsEnquiryModalOpen(false)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <FiX className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="text-sm text-gray-600 mb-2">
                                            <p>Shop: {product.data.shop?.name}</p>
                                            <p>Owner: {product.data.shop?.owner?.name}</p>
                                        </div>
                                        <textarea
                                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            rows={4}
                                            placeholder="Type your message to the shop..."
                                            value={enquiryMessage}
                                            onChange={(e) => setEnquiryMessage(e.target.value)}
                                        />
                                        <div className="flex justify-end">
                                            <button
                                                onClick={handleSendEnquiry}
                                                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                                            >
                                                Send Message
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
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
        </div>
    );
};

export default ProductDetails;
