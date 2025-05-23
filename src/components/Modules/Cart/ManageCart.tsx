"use client";

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/components/Redux/hooks';
import { removeFromCart, updateQuantity } from '@/components/Redux/features/cart/cartSlice';
import Image from 'next/image';
import { FiMinus, FiPlus, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    images?: string[];
}

const ManageCart = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const cartItems = useAppSelector((state) => state.cart.items);

    const handleQuantityChange = (id: string, newQuantity: number) => {
        if (newQuantity > 0) {
            dispatch(updateQuantity({ id, quantity: newQuantity }));
            toast.success('Cart updated successfully');
        }
    };

    const handleRemoveItem = (id: string) => {
        dispatch(removeFromCart(id));
        toast.success('Item removed from cart');
    };

    const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    const handleProceedToCheckout = () => {
        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }
        router.push('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-md mx-auto">
                    <FiShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h1 className="text-2xl font-semibold mb-4 text-gray-800">Your Shopping Cart is Empty</h1>
                    <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
                    <Link 
                        href="/products" 
                        className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-300 font-medium"
                    >
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-8 text-gray-800">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item: CartItem) => (
                        <div key={item.id} className="flex gap-4 border-b py-4 bg-white rounded-lg shadow-sm p-4">
                            <div className="relative w-24 h-24 flex-shrink-0">
                                <Image
                                    src={Array.isArray(item.images) ? item.images[0] : item.image || '/placeholder.png'}
                                    alt={item.name}
                                    fill
                                    className="object-cover rounded-md"
                                    sizes="(max-width: 768px) 100vw, 96px"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-800 truncate">{item.name}</h3>
                                <p className="text-orange-500 font-semibold mt-1">৳{item.price.toLocaleString()}</p>

                                <div className="flex items-center gap-4 mt-3">
                                    <div className="flex items-center border rounded-md">
                                        <button
                                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                                            className="p-2 hover:bg-gray-100 transition-colors"
                                            aria-label="Decrease quantity"
                                        >
                                            <FiMinus className="w-4 h-4" />
                                        </button>
                                        <span className="px-4 py-2 border-x text-gray-700">{item.quantity || 1}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                                            className="p-2 hover:bg-gray-100 transition-colors"
                                            aria-label="Increase quantity"
                                        >
                                            <FiPlus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="text-red-500 hover:text-red-600 transition-colors p-2"
                                        aria-label="Remove item"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-semibold text-gray-800">
                                    ৳{((item.price * (item.quantity || 1))).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>৳{total.toLocaleString()}</span>
                            </div>
                            <div className="border-t pt-3 mt-3">
                                <div className="flex justify-between font-semibold text-gray-800">
                                    <span>Total</span>
                                    <span>৳{total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleProceedToCheckout}
                            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors duration-300 mt-6 font-medium"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageCart;