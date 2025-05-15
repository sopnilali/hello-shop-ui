"use client";

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/components/Redux/hooks';
import { removeFromCart, updateQuantity } from '@/components/Redux/features/cart/cartSlice';
import Image from 'next/image';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ManageCart = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const cartItems = useAppSelector((state) => state.cart.items);
    console.log(cartItems);

    const handleQuantityChange = (id: string, newQuantity: number) => {
        if (newQuantity > 0) {
            dispatch(updateQuantity({ id, quantity: newQuantity }));
        }
    };

    const handleRemoveItem = (id: string) => {
        dispatch(removeFromCart(id));
    };

    const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    const handleProceedToCheckout = () => {
        router.push('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
                <Link href="/products" className="text-orange-500 hover:text-orange-600">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {cartItems.map((item: any) => (
                        <div key={item.id} className="flex gap-4 border-b py-4">
                            <div className="relative w-24 h-24">
                                {Array.isArray(item.images) ? (
                                    <Image
                                        src={item.images?.[0]}
                                        alt={item.name}
                                        fill
                                        className="object-cover rounded-md"
                                    />
                                ) : (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover rounded-md"
                                    />
                                )}
                            </div>

                            <div className="flex-1">
                                <h3 className="font-medium">{item.name}</h3>
                                <p className="text-orange-500 font-semibold">৳{item.price.toLocaleString()}</p>

                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center border rounded-md">
                                        <button
                                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                                            className="p-2 hover:bg-gray-100"
                                        >
                                            <FiMinus />
                                        </button>
                                        <span className="px-4 py-2 border-x">{item.quantity || 1}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                                            className="p-2 hover:bg-gray-100"
                                        >
                                            <FiPlus />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-semibold">
                                    ৳{((item.price * (item.quantity || 1))).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Total</span>
                                <span>৳{total.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleProceedToCheckout}
                            className="w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition-colors mt-4"
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