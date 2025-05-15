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

const ProductDetails = () => {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { data: product, isLoading, isError } = useSingleProductQuery(id);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState('description');
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);
    const [reviewName, setReviewName] = useState('');
    const [reviewEmail, setReviewEmail] = useState('');

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

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!handleAuthCheck()) return;
        
        toast.success('Your review has been submitted!');
        setReviewText('');
        setRating(5);
        setReviewName('');
        setReviewEmail('');
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
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 mb-4">No reviews yet. Be the first to review this product!</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h4 className="text-lg font-semibold mb-4">Write a Review</h4>
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            <div>
                                <label htmlFor="rating" className="block mb-2 font-medium">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="text-2xl"
                                        >
                                            {star <= rating ? '★' : '☆'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="name" className="block mb-2 font-medium">Your Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={reviewName}
                                    onChange={(e) => setReviewName(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="email" className="block mb-2 font-medium">Your Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={reviewEmail}
                                    onChange={(e) => setReviewEmail(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="review" className="block mb-2 font-medium">Your Review</label>
                                <textarea
                                    id="review"
                                    rows={4}
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                                    required
                                ></textarea>
                            </div>
                            
                            <button 
                                type="submit"
                                className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors"
                            >
                                Submit Review
                            </button>
                        </form>
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
                            className={`flex items-center gap-1 sm:gap-2 py-2 sm:py-3 px-3 sm:px-6 text-sm sm:text-base font-medium transition-colors ${
                                activeTab === tab
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
