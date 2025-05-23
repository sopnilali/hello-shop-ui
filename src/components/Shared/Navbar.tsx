"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FiGrid, FiLogOut, FiShoppingCart, FiUser, FiX, FiPlus, FiMinus, FiTrash2, FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../Redux/hooks";
import { setUser } from "../Redux/features/auth/authSlice";
import { removeFromCart, updateQuantity } from "../Redux/features/cart/cartSlice";
import Cookies from 'js-cookie';
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import PrimaryNavbar from "./PrimaryNavbar";
import SecondaryNavbar from "./SecondaryNavbar";


const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <PrimaryNavbar />
    </>
  );
};

export default Navbar;