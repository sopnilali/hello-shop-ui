"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { FiMinus, FiPlus, FiShoppingCart, FiCreditCard } from 'react-icons/fi';
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

    console.log(product);

    if (isLoading) return <div className='flex justify-center items-center text-2xl font-bold pt-10'>Loading...</div>;
    if (isError) return <div>Error loading product details</div>;
    if (!product || !product.data) return <div>No product data available</div>;

    const { images, name, price, description } = product.data;

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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Product Images */}
                <div className="flex-1">
                    <div className="relative h-[500px] w-full rounded-lg overflow-hidden">
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
                                className={`relative h-24 rounded-md overflow-hidden cursor-pointer border ${selectedImage === idx ? 'border-orange-500' : 'hover:border-orange-500'}`}
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
                <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-semibold">{name}</h1>
                        <AddToWishlistButton item={{ id: id as string, name, price, image: images[selectedImage] }} />
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-orange-500">৳{price.toLocaleString()}</span>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-medium">Description:</h3>
                        <p className="text-gray-600">{description}</p>
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

                    <button 
                        onClick={handleAddToCart}
                        className="flex items-center justify-center gap-2 w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition-colors"
                    >
                        <FiShoppingCart />
                        Add to Cart
                    </button>

                    <button 
                        onClick={handleBuyNow}
                        className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors"
                    >
                        <FiCreditCard />
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
