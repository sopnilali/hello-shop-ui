"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FiGrid, FiLogOut, FiShoppingCart, FiUser, FiX, FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../Redux/hooks";
import { setUser } from "../Redux/features/auth/authSlice";
import { removeFromCart, updateQuantity } from "../Redux/features/cart/cartSlice";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const router = useRouter();
  const cartModalRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartModalRef.current && !cartModalRef.current.contains(event.target as Node)) {
        setCartModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setCartModalOpen(true);
  };

  const handleCheckout = () => {
    setCartModalOpen(false);
    router.push('/checkout');
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
    toast.success('Item removed from cart');
  };

  const handleIncreaseQuantity = (itemId: string) => {
    const item = items.find(item => item.id === itemId);
    if (item) {
      dispatch(updateQuantity({ id: itemId, quantity: item.quantity + 1 }));
    }
  };

  const handleDecreaseQuantity = (itemId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      dispatch(updateQuantity({ id: itemId, quantity: currentQuantity - 1 }));
    }
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
              <button onClick={handleCartClick} className="relative p-2">
                <FiShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-[#ff4500] text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">{items.length}</span>
              </button>
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

        {/* Cart Modal */}
        <AnimatePresence>
          {cartModalOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/40 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setCartModalOpen(false)}
              />
              <motion.div
                ref={cartModalRef}
                className="fixed top-0 right-0 h-full w-80 md:w-96 bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-xl font-bold">Your Cart ({items.length})</h2>
                  <button
                    onClick={() => setCartModalOpen(false)}
                    className="text-gray-500 hover:text-[#ff4500] transition-colors"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <FiShoppingCart size={48} className="text-gray-300 mb-4" />
                      <p className="text-gray-500 mb-4">Your cart is empty</p>
                      <button
                        onClick={() => {
                          setCartModalOpen(false);
                          router.push('/product');
                        }}
                        className="bg-[#ff4500] hover:bg-[#e63e00] text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item: any) => (
                        <div key={item.id} className="flex gap-3 border-b pb-3">
                          <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                            {item.images && item.images[0] && (
                              <Image
                                src={item.images[0]}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                              <button 
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                            <p className="text-[#ff4500] font-bold mt-1">৳{item.price}</p>
                            <div className="flex justify-between items-center mt-2">
                              <div className="flex items-center border rounded-md">
                                <button 
                                  onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                                  className="p-1 hover:bg-gray-100 text-gray-500"
                                  disabled={item.quantity <= 1}
                                >
                                  <FiMinus size={14} />
                                </button>
                                <span className="px-2 py-1 text-sm">{item.quantity}</span>
                                <button 
                                  onClick={() => handleIncreaseQuantity(item.id)}
                                  className="p-1 hover:bg-gray-100 text-gray-500"
                                >
                                  <FiPlus size={14} />
                                </button>
                              </div>
                              <p className="text-gray-600 text-sm">৳{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {items.length > 0 && (
                  <div className="p-4 border-t">
                    <div className="flex justify-between mb-4">
                      <span className="font-medium">Subtotal:</span>
                      <span className="font-bold">৳{items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
                    </div>
                    <div className="flex gap-3">
                      <Link href="/cart" className="flex-1">
                        <button
                          onClick={() => setCartModalOpen(false)}
                          className="w-full border border-[#ff4500] text-[#ff4500] hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          View Cart
                        </button>
                      </Link>
                      <button
                        onClick={handleCheckout}
                        className="flex-1 bg-[#ff4500] hover:bg-[#e63e00] text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;