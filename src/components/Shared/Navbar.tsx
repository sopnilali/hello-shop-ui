"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiGrid, FiLogOut, FiShoppingCart, FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../Redux/hooks";
import { setUser } from "../Redux/features/auth/authSlice";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useGetUserQuery } from "../Redux/features/user/useApi";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Products", href: "/product" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth) as { user: User | null };

  const { items } = useAppSelector((state) => state.cart);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove('accessToken');
    dispatch(setUser({
      user: null,
      token: null
    }));
    toast.success('Logged out successfully');
    router.push('/');
    setUserMenuOpen(false);
  };

  const handleDashboardClick = () => {
    router.push('/dashboard');
    setUserMenuOpen(false);
  };

  const handleProfileClick = () => {
    router.push('/profile');
    setUserMenuOpen(false);
  };

  return (
    <>
      {isSticky && <div style={{ height: '72px' }} />} {/* Placeholder div to prevent content jump */}
      <nav className={`w-full flex items-center px-8 py-4 bg-white shadow-sm z-50 transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 right-0' : ''}`}>
        <div className="container mx-auto flex items-center">
          {/* Logo */}
          <div className="flex-1 flex items-center">
            <Link href="/" className="flex items-center text-2xl font-bold text-black">
              Hello
              <span className="text-[#ff4500] rotate-12 inline-block" style={{ fontSize: 28, margin: "0 2px" }}>✔</span>
              Shop
            </Link>
          </div>
          {/* Nav Links Centered (desktop only) */}
          <div className="flex-1 hidden md:flex justify-center">
            <div className="flex items-center gap-8 text-base font-medium">
              {navLinks.map((link) =>
                <div key={link.name} className="relative group">
                  <Link
                    href={link.href}
                    className={`hover:text-[#ff4500] transition-colors relative ${activeMenu === link.name ? 'text-[#ff4500]' : ''}`}
                    onClick={() => setActiveMenu(link.name)}
                  >
                    {link.name}
                    <span
                      className={`absolute left-0 -bottom-1 w-full h-0.5 bg-[#ff4500] transition-transform duration-300 origin-left
                        ${activeMenu === link.name ? 'scale-x-100' : 'scale-x-0'}
                        group-hover:scale-x-100`}
                    ></span>
                  </Link>
                </div>
              )}
            </div>
          </div>
          {/* Actions Right */}
          <div className="flex-1 flex items-center justify-end gap-4">
            {/* Cart Icon */}
            <div className="relative">
              <Link href="/cart" className="relative">
                <FiShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-[#ff4500] text-white text-xs rounded-full px-1.5">{items.length}</span>
              </Link>
            </div>
            {/* User Icon as Button */}
            <div className="relative">
              {user ? (
                <>
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="bg-[#ff4500] hover:bg-[#e63e00] text-white p-2 rounded-full font-semibold flex items-center justify-center transition-colors"
                  >
                    <FiUser className="w-5 h-5" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      {user?.role === "ADMIN" || user?.role === "SELLER" ? <button onClick={handleDashboardClick} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <span className="inline-flex items-center">
                          <FiGrid className="w-4 h-4 mr-2" />
                          Dashboard
                        </span>
                      </button>: <></>}
                      <button onClick={handleProfileClick} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <span className="inline-flex items-center">
                          <FiUser className="w-4 h-4 mr-2" />
                          Profile
                        </span>
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <span className="inline-flex items-center">
                          <FiLogOut className="w-4 h-4 mr-2" />
                          Logout
                        </span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/login">
                  <button className="bg-[#ff4500] hover:bg-[#e63e00] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                    <FiUser className="w-5 h-5" />
                    Login
                  </button>
                </Link>
              )}
            </div>
            {/* Hamburger for mobile (right) */}
            <button
              className="md:hidden text-2xl p-2 focus:outline-none ml-2"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg> : <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>}
            </button>
          </div>
        </div>
        {/* Mobile Menu Overlay and Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/40 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                className="fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 flex flex-col p-6 overflow-auto"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
              >
                <button
                  className="self-end mb-6 text-2xl focus:outline-none"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex flex-col gap-4 text-base font-medium">
                  {navLinks.map((link) =>
                    <div key={link.name}>
                      <Link
                        href={link.href}
                        className="hover:text-[#ff4500] transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;