"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { FiCheckCircle, FiShoppingBag, FiHome } from 'react-icons/fi';
import Image from 'next/image';

const OrderSuccess = () => {
    
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <FiCheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                        </div>
                        
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                            Order Placed Successfully!
                        </h1>
                        
                        <p className="text-gray-600 mb-8">
                            Thank you for your purchase. Your order has been received and is being processed.
                        </p>

                        <div className="bg-orange-50 border border-orange-100 rounded-lg p-6 mb-8">
                            <div className="flex items-center justify-center mb-4">
                                <FiShoppingBag className="w-6 h-6 text-orange-500 mr-2" />
                                <h2 className="text-xl font-semibold text-orange-800">What's Next?</h2>
                            </div>
                            <ul className="text-left space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-orange-500 mr-2">•</span>
                                    You will receive an order confirmation email shortly
                                </li>
                                <li className="flex items-start">
                                    <span className="text-orange-500 mr-2">•</span>
                                    Our team will process your order within 24 hours
                                </li>
                                <li className="flex items-start">
                                    <span className="text-orange-500 mr-2">•</span>
                                    You can track your order status in your account
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => router.push('/')}
                                className="flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors"
                            >
                                <FiHome className="w-5 h-5" />
                                Back to Home
                            </button>
                            <button
                                onClick={() => router.push('/products')}
                                className="flex items-center justify-center gap-2 border border-orange-500 text-orange-500 px-6 py-3 rounded-md hover:bg-orange-50 transition-colors"
                            >
                                <FiShoppingBag className="w-5 h-5" />
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess; 