"use client";

import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/components/Redux/hooks';
import { clearCart } from '@/components/Redux/features/cart/cartSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import { FiMapPin, FiPhone, FiMail, FiUser, FiTag } from 'react-icons/fi';
import { calculateShippingCost } from '@/components/Utils/shippingCost';
import { useGetUserQuery } from '@/components/Redux/features/user/useApi';
import { useCreateOrderMutation } from '@/components/Redux/features/order/orderApi';
import { getCookie } from 'cookies-next';
import { verifyToken } from '@/components/Utils/verifyToken';
import { useVerifyCouponMutation } from '@/components/Redux/features/coupon/couponApi';

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
    const [verifyCoupon] = useVerifyCouponMutation();
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{
        code: string;
        type: string;
        value: number;
        minPurchase: number;
        maxDiscount: number;
    } | null>(null);
    const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phoneNumber: '',
        address: '',
        transactionId: '',
        city: cartShippingInfo?.city || '',
        paymentMethod: 'CASH_ON_DELIVERY',
        couponCode: ''
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

    const handleCouponApply = async () => {
        if (!couponCode.trim()) {
            toast.error('Please enter a coupon code');
            return;
        }

        setIsVerifyingCoupon(true);
        try {
            const response = await verifyCoupon({
                code: couponCode,
                totalAmount: total
            }).unwrap();
            
            if (response?.data?.coupon) {
                setAppliedCoupon({
                    code: response.data.coupon.code,
                    type: response.data.coupon.type,
                    value: response.data.coupon.value,
                    minPurchase: response.data.coupon.minPurchase,
                    maxDiscount: response.data.coupon.maxDiscount
                });
                setFormData(prev => ({
                    ...prev,
                    couponCode: couponCode
                }));
                toast.success('Coupon applied successfully!');
            } else {
                toast.error(response?.message || 'Invalid coupon code');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Invalid coupon code');
        } finally {
            setIsVerifyingCoupon(false);
        }
    };

    const calculateDiscount = () => {
        if (!appliedCoupon) return 0;
        
        let discountAmount = 0;
        if (appliedCoupon.type === 'PERCENTAGE') {
            discountAmount = (total * appliedCoupon.value) / 100;
            if (appliedCoupon.maxDiscount) {
                discountAmount = Math.min(discountAmount, appliedCoupon.maxDiscount);
            }
        } else if (appliedCoupon.type === 'FIXED') {
            discountAmount = appliedCoupon.value;
        }
        
        return Math.round(discountAmount);
    };

    const discount = calculateDiscount();
    const subtotal = total - discount;
    const finalTotal = subtotal + shippingInfo.cost;

    useEffect(() => {
        refetch();
        if (UserData?.data) {
            setFormData(prev => ({
                ...prev,
                phoneNumber: UserData.data.phoneNumber || '',
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

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setFormData(prev => ({
            ...prev,
            couponCode: ''
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate required fields
        if (!formData.address || !formData.phoneNumber || !formData.city) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Validate payment method specific fields
        if ((formData.paymentMethod === 'BKASH' || formData.paymentMethod === 'NAGAD' || formData.paymentMethod === 'bank') && !formData.transactionId) {
            toast.error('Please enter the transaction ID');
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading('Processing your order...');

        const orderData = {
            address: formData.address,
            phoneNumber: formData.phoneNumber,
            paymentMethod: formData.paymentMethod.toUpperCase(),
            city: formData.city,
            items: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity || 1
            })),
            total: finalTotal,
            transactionId: formData.transactionId,
            userId: user?.id,
            couponCode: formData.couponCode
        };

        try {
            const response = await createOrder(orderData).unwrap();
            
            if (formData.paymentMethod === 'SSL_COMMERZ') {
                toast.success('Redirecting to payment gateway...', { id: toastId });
                window.location.href = response?.data?.paymentUrl;
                dispatch(clearCart());
            } else {
                toast.success('Order placed successfully!', { id: toastId });
                dispatch(clearCart());
                router.push(`/order-success?tran_id=${response?.data?.order?.transactionId}`);
            }
        } catch (error: any) {
            console.error('Failed to create order:', error);
            toast.error(error?.data?.message || 'Failed to place order. Please try again.', { id: toastId });
        } finally {
            setIsSubmitting(false);
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
                                    placeholder="Shipping Address"
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
                                <option value="SSL_COMMERZ">SSLCOMMERZ</option>
                                <option value="BKASH">bKash</option>
                                <option value="NAGAD">Nagad</option>
                                <option value="bank">Bank Transfer</option>
                            </select>
                            {(formData.paymentMethod === 'BKASH' || formData.paymentMethod === 'NAGAD') && (
                                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                                    <h3 className="font-semibold mb-2">Payment Instructions:</h3>
                                    <ol className="list-decimal list-inside">
                                        <li>Open your {formData.paymentMethod} app</li>
                                        <li>Go to "Send Money"</li>
                                        <li>Enter this number: {formData.paymentMethod === 'BKASH' ? '01737055870' : '01YYYYYYYYY'}</li>
                                        <li>Enter the amount: ৳{finalTotal.toLocaleString()}</li>
                                        <li>Use reference: 1</li>
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
                                        required={formData.paymentMethod === 'BKASH' || formData.paymentMethod === 'NAGAD'}
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
                            {formData.paymentMethod === 'SSL_COMMERZ' && (
                                <div className="mt-4 p-4 bg-blue-100 rounded-md">
                                    <h3 className="font-semibold mb-2">SSLCOMMERZ Payment Gateway</h3>
                                    <p>
                                        You will be redirected to the SSLCOMMERZ secure payment gateway after placing your order to complete the payment.
                                    </p>
                                    <ul className="list-disc list-inside mt-2 text-sm text-gray-700">
                                        <li>Supports Visa, MasterCard, bKash, Nagad, Rocket, and more.</li>
                                        <li>Make sure to complete the payment to confirm your order.</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                        {/* Coupon Section */}
                        <div className="mb-4">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Enter coupon code"
                                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        disabled={!!appliedCoupon}
                                    />
                                </div>
                                {!appliedCoupon ? (
                                    <button
                                        onClick={handleCouponApply}
                                        disabled={isVerifyingCoupon}
                                        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
                                    >
                                        {isVerifyingCoupon ? 'Applying...' : 'Apply'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleRemoveCoupon}
                                        className="px-4 py-2 text-red-500 border border-red-500 rounded-md hover:bg-red-50"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            {appliedCoupon && (
                                <p className="mt-2 text-sm text-green-600">
                                    Coupon applied: {appliedCoupon.code} ({appliedCoupon.value}% off)
                                </p>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="space-y-4 mb-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <div className="relative w-16 h-16">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">{item.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {item.quantity} x ৳{item.price}
                                        </p>
                                    </div>
                                    <p className="font-medium">৳{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>

                        {/* Order Totals */}
                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>৳{total.toLocaleString()}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount ({appliedCoupon.value}%)</span>
                                    <span>-৳{discount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span>৳{shippingInfo.cost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg border-t pt-2">
                                <span>Total</span>
                                <span>৳{finalTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Place Order Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`w-full mt-6 bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition-colors ${
                                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isSubmitting ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageCheckout;