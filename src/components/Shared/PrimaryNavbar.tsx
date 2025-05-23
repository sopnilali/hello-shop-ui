import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FiSearch, FiShoppingCart, FiUser, FiGrid, FiLogOut, FiMenu, FiX, FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../Redux/hooks";
import { setUser } from "../Redux/features/auth/authSlice";
import Cookies from 'js-cookie';
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { removeFromCart, updateQuantity } from "../Redux/features/cart/cartSlice";
import CategoryMegaMenu from './CategoryMegaMenu';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const PrimaryNavbar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCategoryHovered, setIsCategoryHovered] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth) as { user: User | null };
  const { items } = useAppSelector((state) => state.cart);
  const cartModalRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/product?searchTerm=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
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

  const handleCheckout = () => {
    setCartModalOpen(false);
    if (user) {
      router.push('/checkout');
    } else {
      toast.error('Please login to proceed with checkout');
      router.push('/login');
    }
  };

  return (
    <>
      <div className="h-[72px]" /> {/* Placeholder div for navbar height */}
      <nav className={`w-full flex items-center px-2 sm:px-4 lg:px-8 py-4 bg-white shadow-sm z-50 fixed top-0 left-0 right-0 transition-all duration-300`}>
        <div className="container mx-auto flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
              <FiMenu className="w-6 h-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start items-center">
            <Link href="/" className="flex items-center text-xl sm:text-2xl font-bold text-black">
              Hello
              <span className="text-[#ff4500] rotate-12 inline-block" style={{ fontSize: 24, margin: "0 2px" }}>✔</span>
              Shop
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-[#ff4500] transition-colors">Home</Link>
            <Link href="/product" className="text-gray-700 hover:text-[#ff4500] transition-colors">Products</Link>
            <Link href="/offers" className="text-gray-700 hover:text-[#ff4500] transition-colors">Offers</Link>
            <Link href="/blog" className="text-gray-700 hover:text-[#ff4500] transition-colors">Blog</Link>
            <div 
              className="relative"
              onMouseEnter={() => setIsCategoryHovered(true)}
              onMouseLeave={() => setIsCategoryHovered(false)}
            >
              <Link 
                href="/product?sortOrder=asc&sortBy=price&categoryId" 
                className="text-gray-700 hover:text-[#ff4500] transition-colors"
              >
                Category
              </Link>
              <div className="absolute top-full left-0 w-[500px]  bg-transparent" />
              <CategoryMegaMenu isOpen={isCategoryHovered} />
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff4500]"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#ff4500]"
                >
                  <FiSearch size={20} />
                </button>
              </div>
            </form>
          </div>

          {/* Actions Right */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Cart Icon */}
            <div className="relative">
              <button onClick={handleCartClick} className="relative p-2">
                <FiShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
                <span className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 bg-[#ff4500] text-white text-xs rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center">{items.length}</span>
              </button>
            </div>
            {/* User Icon */}
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
                      {user?.role === "ADMIN" || user?.role === "SELLER" ? (
                        <button onClick={handleDashboardClick} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <span className="inline-flex items-center">
                            <FiGrid className="w-4 h-4 mr-2" />
                            Dashboard
                          </span>
                        </button>
                      ) : null}
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
                  <button className="bg-[#ff4500] hover:bg-[#e63e00] text-white px-3 sm:px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors text-sm sm:text-base">
                    <FiUser className="w-4 h-4 sm:w-5 sm:h-5" />
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
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
              className="fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-[#ff4500] transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-4 border-b">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#ff4500]"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#ff4500]"
                  >
                    <FiSearch size={20} />
                  </button>
                </form>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <Link href="/" className="block text-gray-700 hover:text-[#ff4500] transition-colors">Home</Link>
                  <Link href="/product" className="block text-gray-700 hover:text-[#ff4500] transition-colors">Products</Link>
                  <Link href="/offers" className="block text-gray-700 hover:text-[#ff4500] transition-colors">Offers</Link>
                  <Link href="/blog" className="block text-gray-700 hover:text-[#ff4500] transition-colors">Blog</Link>
                  <Link href="/category" className="block text-gray-700 hover:text-[#ff4500] transition-colors">Category</Link>
                </div>
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
                          <Image
                            src={Array.isArray(item.images) && item.images.length > 0 
                              ? item.images[0] 
                              : item.image || '/placeholder.png'}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
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
    </>
  );
};

export default PrimaryNavbar; 