"use client";

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/components/Redux/hooks';
import { useGetUserQuery, useUpdateUserMutation } from '@/components/Redux/features/user/useApi';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiShoppingBag, FiHeart, FiCreditCard, FiLogOut } from 'react-icons/fi';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';
import { useGetOrderByIdQuery, useGetorderHistoryQuery, } from '@/components/Redux/features/order/orderApi';
import Image from 'next/image';
import Wishlist from '@/components/DashboardLayout/Wishlist/Wishlist';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const UserProfile = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const user = useAppSelector((state) => state.auth.user) as User | null;
    const { data: userData, refetch } = useGetUserQuery(user?.id as string);
    const [updateUser] = useUpdateUserMutation();
    const { data: orderHistory } = useGetorderHistoryQuery(undefined);

    console.log(orderHistory);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        city: '',
        shippingAddress: ''
    });

    useEffect(() => {
        if (userData?.data) {
            setFormData({
                name: userData.data.name || '',
                email: userData.data.email || '',
                phoneNumber: userData.data.phoneNumber || '',
                address: userData.data.address || '',
                city: userData.data.city || '',
                shippingAddress: userData.data.shippingAddress || ''
            });
        }
    }, [userData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateUser({
                id: user?.id,
                userData: formData
            }).unwrap();
            toast.success('Profile updated successfully');
            setIsEditing(false);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update profile');
        }
    };

    const handleLogout = () => {
        deleteCookie('accessToken');
        router.push('/login');
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: FiUser },
        { id: 'orders', label: 'Orders', icon: FiShoppingBag },
        { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
    ];

    return (
        <div className=" px-4 py-8">
            <div className=" container mx-auto">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-4">
                        {/* Sidebar */}
                        <div className="bg-gray-50 p-6 ">
                            <div className="text-center mb-6">
                                <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto flex items-center justify-center mb-4">
                                    <FiUser className="w-12 h-12 text-orange-500" />
                                </div>
                                <h2 className="text-xl font-semibold">{userData?.data?.name}</h2>
                                <p className="text-gray-500">{userData?.data?.email}</p>
                            </div>

                            <nav className="space-y-2">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-orange-500 text-white'
                                                : 'text-gray-600 hover:bg-orange-50'
                                        }`}
                                    >
                                        <tab.icon className="w-5 h-5" />
                                        {tab.label}
                                    </button>
                                ))}
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <FiLogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </nav>
                        </div>

                        {/* Main Content */}
                        <div className="md:col-span-3 p-6">
                            {activeTab === 'profile' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-2xl font-semibold">Profile Information</h3>
                                        <button
                                            onClick={() => setIsEditing(!isEditing)}
                                            className="flex items-center gap-2 text-orange-500 hover:text-orange-600"
                                        >
                                            <FiEdit2 className="w-5 h-5" />
                                            {isEditing ? 'Cancel' : 'Edit Profile'}
                                        </button>
                                    </div>

                                    {isEditing ? (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="relative">
                                                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        placeholder="Full Name"
                                                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    />
                                                </div>

                                                <div className="relative">
                                                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        placeholder="Email Address"
                                                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    />
                                                </div>

                                                <div className="relative">
                                                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="tel"
                                                        name="phoneNumber"
                                                        value={formData.phoneNumber}
                                                        onChange={handleInputChange}
                                                        placeholder="Phone Number"
                                                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    />
                                                </div>

                                                <div className="relative">
                                                    <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                    <select
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                    >
                                                        <option value="">Select City</option>
                                                        <option value="dhaka">Dhaka</option>
                                                        <option value="chittagong">Chittagong</option>
                                                        <option value="rajshahi">Rajshahi</option>
                                                        <option value="khulna">Khulna</option>
                                                        <option value="barishal">Barishal</option>
                                                        <option value="sylhet">Sylhet</option>
                                                        <option value="rangpur">Rangpur</option>
                                                        <option value="mymensingh">Mymensingh</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <textarea
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    placeholder="Full Address"
                                                    rows={3}
                                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                />
                                            </div>

                                            <div>
                                                <textarea
                                                    name="shippingAddress"
                                                    value={formData.shippingAddress}
                                                    onChange={handleInputChange}
                                                    placeholder="Shipping Address"
                                                    rows={3}
                                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                />
                                            </div>

                                            <div className="flex justify-end gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditing(false)}
                                                    className="px-6 py-2 border rounded-md hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                                    <FiUser className="w-6 h-6 text-orange-500" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Full Name</p>
                                                        <p className="font-medium">{userData?.data?.name}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                                    <FiMail className="w-6 h-6 text-orange-500" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Email Address</p>
                                                        <p className="font-medium">{userData?.data?.email}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                                    <FiPhone className="w-6 h-6 text-orange-500" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Phone Number</p>
                                                        <p className="font-medium">{userData?.data?.phoneNumber || 'Not provided'}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                                    <FiMapPin className="w-6 h-6 text-orange-500" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">City</p>
                                                        <p className="font-medium">{userData?.data?.city || 'Not provided'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-500 mb-2">Full Address</p>
                                                <p className="font-medium">{userData?.data?.address || 'Not provided'}</p>
                                            </div>

                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-500 mb-2">Shipping Address</p>
                                                <p className="font-medium">{userData?.data?.shippingAddress || 'Not provided'}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div>
                                    <h3 className="text-2xl font-semibold mb-6">My Orders</h3>
                                    {orderHistory?.data?.length > 0 ? (
                                        <div className="space-y-6">
                                            {orderHistory.data.map((order: any, index: number) => (
                                                <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h4 className="text-lg font-semibold">Order #{index + 1}</h4>
                                                        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                                        <div>
                                                            <p className="text-gray-500">Order Date</p>
                                                            <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500">Total Amount</p>
                                                            <p className="font-medium">${order.total.toFixed(2)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500">Payment Method</p>
                                                            <p className="font-medium">{order.paymentMethod}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500">Shipping Address</p>
                                                            <p className="font-medium">{order.address}</p>
                                                        </div>
                                                    </div>
                                                    <div className="border-t pt-4">
                                                        <h5 className="font-semibold mb-2">Order Items</h5>
                                                        <div className="space-y-3">
                                                            {order.items.map((item: any, itemIndex: number) => (
                                                                <div key={itemIndex} className="flex items-center space-x-4">
                                                                    <Image 
                                                                        src={item.product.images[0]} 
                                                                        alt={item.product.name} 
                                                                        width={48} 
                                                                        height={48} 
                                                                        className="rounded-md"
                                                                    />
                                                                    <div className="flex-1">
                                                                        <h6 className="font-medium">{item.product.name}</h6>
                                                                        <p className="text-sm text-gray-500">
                                                                            Quantity: {item.quantity} | Price: ${item.price.toFixed(2)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                                            <FiShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <h4 className="text-xl font-medium mb-2">No Orders Yet</h4>
                                            <p className="text-gray-500 mb-4">Start shopping to see your orders here</p>
                                            <button
                                                onClick={() => router.push('/product')}
                                                className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                                            >
                                                Start Shopping
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'wishlist' && (
                                <div>
                                    <Wishlist />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile; 