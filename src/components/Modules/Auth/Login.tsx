"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLoginMutation } from '@/components/Redux/features/auth/authApi';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/components/Redux/hooks';
import { verifyToken } from '@/components/Utils/verifyToken';
import { setUser } from '@/components/Redux/features/auth/authSlice';
import Cookies from 'js-cookie';

const Login = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [Login] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastId = toast.loading('Logging in');
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const email = formData.get('email');
      const password = formData.get('password');

      const userInfo = {
        email,
        password
      }
      const res = await Login(userInfo).unwrap();
      const user = verifyToken(res?.data?.accessToken);
      // ✅ Set tokens as cookies
      Cookies.set('accessToken', res?.data?.accessToken, { expires: 7, secure: true });

      dispatch(setUser({
        user: user,
        token: res?.data?.accessToken
      }))
      router.push("/");
      toast.success(res.message, { id: toastId });
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong! Please try again.', { id: toastId });
    }
  }

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 items-center justify-center p-4">
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
        {/* Login Form Section */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex-1 p-8 md:p-12 flex flex-col justify-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-black"> Log In To Your Account.</h2>
          <form className="mt-6 md:mt-8" onSubmit={handleSubmit}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="mb-4 md:mb-6"
            >
              <input
                type="text"
                name="email"
                placeholder="Username or Email Address"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm md:text-base"
              />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
              className="mb-4 md:mb-6 relative"
            >
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 text-sm md:text-base"
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
              Login
            </motion.button>
          </form>
          <p className='text-sm text-gray-500 mt-3'>Don't have an account? <Link href="/register" className='text-[#ff4500] font-bold hover:text-[#e63e00] '>Register</Link></p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;