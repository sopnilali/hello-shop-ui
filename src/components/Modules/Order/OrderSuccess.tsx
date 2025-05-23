"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiCheckCircle, FiShoppingBag, FiHome, FiDownload } from 'react-icons/fi';
import { useParams } from 'next/navigation';
import { useGetOrderByIdQuery } from '@/components/Redux/features/order/orderApi';
import { useGetPaymentWithVerifyQuery } from '@/components/Redux/features/payment/paymentApi';

const OrderSuccess = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tranId = searchParams.get("tran_id");
    const { data: orderData } = useGetPaymentWithVerifyQuery(tranId);

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
                                <h2 className="text-xl font-semibold text-orange-800">Order Details</h2>
                            </div>
                            <div className="text-left space-y-3 text-gray-700">
                                <div className="flex justify-between">
                                    <span>Order ID:</span>
                                    <span className="font-medium">{orderData?.data?.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Amount:</span>
                                    <span className="font-medium">৳{orderData?.data?.total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Payment Method:</span>
                                    <span className="font-medium capitalize">{orderData?.data?.paymentMethod?.replace(/_/g, ' ')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Status:</span>
                                    <span className="font-medium capitalize">{orderData?.data?.status}</span>
                                </div>
                            </div>
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
                                onClick={() => router.push('/product')}
                                className="flex items-center justify-center gap-2 border border-orange-500 text-orange-500 px-6 py-3 rounded-md hover:bg-orange-50 transition-colors"
                            >
                                <FiShoppingBag className="w-5 h-5" />
                                Continue Shopping
                            </button>
                            <button
                                onClick={() => router.push(`/invoice/success?tran_id=${orderData?.data?.transactionId}`)}
                                className="flex items-center justify-center gap-2 border border-orange-500 text-orange-500 px-6 py-3 rounded-md hover:bg-orange-50 transition-colors"
                            >
                                <FiDownload className="w-5 h-5" />
                                Download Invoice
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;