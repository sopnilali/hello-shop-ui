"use client"

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useRegisterMutation } from '@/components/Redux/features/user/useApi';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface RegisterFormInputs {
    name: string;
    email: string;
    password: string;
}

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirectPath");
    const router = useRouter();

    const [registerUser, { isLoading: isSubmitting, isError, error }] = useRegisterMutation();

    const onSubmit = async (data: RegisterFormInputs) => {
        try {

            const result = await registerUser(data);
            if (result?.data?.success) {
                toast.success(result?.data?.message);
                if (redirect) {
                    router.push('/login');
                } else {
                    router.push("/login");
                }
            } else {
                toast.error(result?.data?.message);
            }
            return result;
        } catch (error: any) {
            toast.error(error.message || "Registration failed");
            return Error(error);
        }
        // fetch('/api/register', { method: 'POST', body: formData });
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row bg-white/30 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden max-w-4xl w-full"
            >
                {/* Illustration Section */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex-1 flex items-center justify-center p-8 md:p-12"
                >
                    <img
                        src="https://live.templately.com/wp-content/uploads/2021/02/56468664-image_.png"
                        alt="Shopping Illustration"
                        className="max-w-full h-auto"
                    />
                </motion.div>
                {/* Register Form Section */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex-1 p-8 md:p-12 flex flex-col justify-center"
                >
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-black">Create Your Account</h2>
                    <form className="mt-6 md:mt-8" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.3 }}
                            className="mb-4 md:mb-6"
                        >
                            <input
                                type="text"
                                placeholder="Full Name"
                                className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-400' : 'border-gray-300'} text-sm md:text-base`}
                                {...register('name', { required: 'Name is required' })}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </motion.div>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.65, duration: 0.3 }}
                            className="mb-4 md:mb-6"
                        >
                            <input
                                type="email"
                                placeholder="Email Address"
                                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-400' : 'border-gray-300'} text-sm md:text-base`}
                                {...register('email', { required: 'Email is required', pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Invalid email address' } })}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.3 }}
                            className="mb-4 md:mb-6 relative"
                        >
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                className={`w-full px-4 py-3 pr-12 rounded-lg border ${errors.password ? 'border-red-400' : 'border-gray-300'} text-sm md:text-base`}
                                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                            />
                            <span
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#f87171]"
                                title={showPassword ? 'Hide Password' : 'Show Password'}
                            >
                                <svg height="20" width="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <ellipse cx="10" cy="10" rx="7" ry="5" stroke="#f87171" strokeWidth="2" />
                                    <circle cx="10" cy="10" r="2" fill={showPassword ? '#f87171' : 'none'} stroke="#f87171" strokeWidth="2" />
                                </svg>
                            </span>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </motion.div>
                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.0, duration: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="w-full bg-[#ff4500] text-white border-none rounded-lg py-3 px-6 text-sm md:text-base font-semibold cursor-pointer hover:bg-[#e63e00] transition-colors"
                        >
                            {isSubmitting ? "REGISTERING..." : "REGISTER"}
                        </motion.button>
                    </form>
                    <p className='text-sm text-gray-500 mt-3'>Already have an account? <Link href="/login" className='text-[#ff4500] font-bold hover:text-[#e63e00] '>Login</Link></p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Register; 