"use client";

import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/components/Redux/hooks';
import { clearCart } from '@/components/Redux/features/cart/cartSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import { FiMapPin, FiPhone, FiMail, FiUser } from 'react-icons/fi';
import { calculateShippingCost } from '@/components/Utils/shippingCost';
import { useGetUserQuery } from '@/components/Redux/features/user/useApi';
import { useCreateOrderMutation } from '@/components/Redux/features/order/orderApi';
import { getCookie } from 'cookies-next';
import { verifyToken } from '@/components/Utils/verifyToken';

const ManageCheckout = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.items);
    const cartShippingInfo = useAppSelector((state) => state.cart.shippingInfo);
    const token = getCookie('accessToken') as string;
    let user: any;
    if (token) {
        user = verifyToken(token);
    }

    const { data: UserData, refetch } = useGetUserQuery(user?.id as string);
    const [createOrder] = useCreateOrderMutation();

    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phoneNumber: '',
        address: '',
        transactionId: '',
        city: cartShippingInfo?.city || '',
        paymentMethod: 'CASH_ON_DELIVERY'
    });

    const [shippingInfo, setShippingInfo] = useState({
        cost: 0,
        estimatedDays: 0
    });

    const total = cartItems.reduce((sum, item) => {
        const price = typeof item.price === 'number' && !isNaN(item.price) ? item.price : 0;
        const quantity = typeof item.quantity === 'number' && !isNaN(item.quantity) ? item.quantity : 1; // Default quantity set to 1
        return sum + (price * quantity);
    }, 0);
    const finalTotal = total + shippingInfo.cost;

    useEffect(() => {
        refetch();

        if (UserData?.data) {
            setFormData(prev => ({
                ...prev,
                phoneNumber: UserData.data.phoneNumber || ''
            }));
        }

        if (cartShippingInfo) {
            setShippingInfo(cartShippingInfo);
            setFormData(prev => ({
                ...prev,
                city: cartShippingInfo.city || ''
            }));
        }

        if (formData.city) {
            const shipping = calculateShippingCost(formData.city, total);
            setShippingInfo(shipping);
        }
    }, [refetch, UserData, cartShippingInfo, formData.city, total]);

    useEffect(() => {
        console.log("Cart Items:", cartItems);
    }, [cartItems]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'city') {
            const shipping = calculateShippingCost(value, total);
            setShippingInfo(shipping);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const orderData = {
            address: formData.address,
            phoneNumber: formData.phoneNumber,
            paymentMethod: formData.paymentMethod.toUpperCase(),
            city: formData.city,
            items: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity || 1 // Default quantity set to 1 if not specified
            })),
            total: finalTotal,
            transactionId: formData.transactionId,
            userId: user?.id
        };

        try {
            const response = await createOrder(orderData).unwrap();
            toast.success('Order placed successfully!');
            dispatch(clearCart());
            router.push(`/order-success/${response?.data?.id}`);
        } catch (error: any) {
            console.error('Failed to create order:', error);
            toast.error(error?.data?.message || 'Failed to place order. Please try again.');
        }
    };

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
                <button
                    onClick={() => router.push('/products')}
                    className="text-orange-500 hover:text-orange-600"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Shipping Information Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        disabled
                                        name="fullName"
                                        placeholder="Full Name"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>

                                <div className="relative">
                                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        disabled
                                        name="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>

                                <div className="relative">
                                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        placeholder="Phone Number"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>

                                <div className="relative">
                                    <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <select
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="">Select City</option>
                                        <option value="dhaka">Dhaka</option>
                                        <option value="chittagong">Chittagong</option>
                                        <option value="rajshahi">Rajshahi</option>
                                        <option value="chapainawabganj">Chapainawabganj</option>
                                        <option value="khulna">Khulna</option>
                                        <option value="barishal">Barishal</option>
                                        <option value="sylhet">Sylhet</option>
                                        <option value="rangpur">Rangpur</option>
                                        <option value="mymensingh">Mymensingh</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-4">
                                <textarea
                                    name="address"
                                    placeholder="Full Address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                    rows={3}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                            <select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="cash">Cash on Delivery</option>
                                <option value="card">Credit/Debit Card</option>
                                <option value="bkash">bKash</option>
                                <option value="nagad">Nagad</option>
                                <option value="bank">Bank Transfer</option>
                            </select>
                            {(formData.paymentMethod === 'bkash' || formData.paymentMethod === 'nagad') && (
                                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                                    <h3 className="font-semibold mb-2">Payment Instructions:</h3>
                                    <ol className="list-decimal list-inside">
                                        <li>Open your {formData.paymentMethod} app</li>
                                        <li>Go to "Send Money"</li>
                                        <li>Enter this number: {formData.paymentMethod === 'bkash' ? '01XXXXXXXXX' : '01YYYYYYYYY'}</li>
                                        <li>Enter the amount: ৳{finalTotal.toLocaleString()}</li>
                                        <li>Use reference: {user?.id}</li>
                                        <li>Complete the transaction</li>
                                        <li>Enter the Transaction ID below</li>
                                    </ol>
                                    <input
                                        type="text"
                                        name="transactionId"
                                        placeholder="Enter Transaction ID"
                                        value={formData.transactionId}
                                        onChange={handleInputChange}
                                        className="w-full mt-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required={formData.paymentMethod === 'bkash' || formData.paymentMethod === 'nagad'}
                                    />
                                </div>
                            )}
                            {formData.paymentMethod === 'bank' && (
                                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                                    <h3 className="font-semibold mb-2">Bank Transfer Instructions:</h3>
                                    <ol className="list-decimal list-inside">
                                        <li>Transfer the total amount of ৳{finalTotal.toLocaleString()} to our bank account</li>
                                        <li>Bank Name: Example Bank</li>
                                        <li>Account Name: Your Company Name</li>
                                        <li>Account Number: 1234567890</li>
                                        <li>Branch: Main Branch</li>
                                        <li>Use your Order ID as the reference</li>
                                        <li>After completing the transfer, enter the transaction details below</li>
                                    </ol>
                                    <input
                                        type="text"
                                        name="transactionId"
                                        placeholder="Enter Bank Transaction ID or Reference"
                                        value={formData.transactionId}
                                        onChange={handleInputChange}
                                        className="w-full mt-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required={formData.paymentMethod === 'bank'}
                                    />
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition-colors"
                        >
                            Place Order
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                        <div className="space-y-4">
                            {cartItems?.map((item: any) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative w-20 h-20">
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
                                        <p className="text-sm text-gray-500">Quantity: {item.quantity || 1}</p>
                                        <p className="text-orange-500 font-semibold">
                                            ৳{((item.price * (item.quantity || 1))).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t mt-4 pt-4 space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>৳{total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>৳{shippingInfo.cost.toLocaleString()}</span>
                            </div>
                            {shippingInfo.cost > 0 && (
                                <p className="text-sm text-gray-500">
                                    Estimated delivery: {shippingInfo.estimatedDays} day{shippingInfo.estimatedDays > 1 ? 's' : ''}
                                </p>
                            )}
                            {total >= 5000 && (
                                <p className="text-sm text-green-500">
                                    Free shipping for orders above ৳5,000
                                </p>
                            )}
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span>৳{finalTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageCheckout;