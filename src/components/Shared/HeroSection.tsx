"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    image: "https://beerbol.com/wp-content/uploads/2024/05/Khirsapat-mango-1024x1024.jpg",
    heading: "Fresh & Delicious Khirsapat Mangoes",
    subheading: "Enjoy the king of mangoes, handpicked and delivered fresh to your doorstep.",
    button: "Shop Khirsapat",
    link: "/product",
    background: "https://tds-images.thedailystar.net/sites/default/files/styles/very_big_201/public/feature/images/khirsapat.jpg"
  },
  {
    image: "https://indiangloriousnursery.com/wp-content/uploads/2023/04/pg-mango-amrapali-800x800-1.jpg",
    heading: "Juicy Amrupali Mangoes",
    subheading: "Taste the sweetness of Amrupali, perfect for your summer cravings.",
    button: "Shop Amrupali",
    link: "/product?brandId=fac51e15-986d-4191-b685-edccc5ad71c9",
    background: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtsWT7UbqxibmIZIzNdD0CIiGF1mBdqjHJ_A&s"
  },
  {
    image: "https://bazaarmantri.com/images/products/40670.jpg",
    heading: "Fajli Mangoes - Big & Bold",
    subheading: "Big in size, bold in flavor. Fajli mangoes are a must-try!",
    button: "Shop Fajli",
    link: "/product?brandId=984d6ebd-4c62-432e-837b-da8d1a9a9cad",
    background: "https://tds-images.thedailystar.net/sites/default/files/styles/very_big_201/public/images/2022/05/25/capainawabganj.jpg"
  },
  {
    image: "https://borobagan.com/wp-content/uploads/2022/05/dsa.png",
    heading: "Gopalvog Mangoes",
    subheading: "A local favorite, Gopalvog mangoes are known for their unique taste.",
    button: "Shop Gopalvog",
    link: "/product?brandId=bf5130dc-3d24-462e-b713-23e3a7babe59",
    background: "https://today.thefinancialexpress.com.bd/uploads/1559152134.jpg"
  },
];

const HeroSection = () => {
  const [selected, setSelected] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    const interval = setInterval(() => {
      setSelected((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col md:flex-row items-center justify-between py-10 md:py-16 px-2 sm:px-4 md:px-16 lg:min-h-[60vh] overflow-hidden gap-8 md:gap-0 bg-cover bg-center relative shadow-lg"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.85) 60%, rgba(255,255,255,0.7)), url('${slides[selected].background}')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        clipPath: 'inset(0 0 -100px 0)'
      }}
    >
      {/* Left Side: Large Image and Text */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-[2_1_0%] max-w-2xl w-full flex flex-col items-start justify-center mb-6 md:mb-0 px-2 sm:px-0"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-6 p-6 md:p-8"
            style={{minHeight: '220px'}}
          >
            <Image
              src={slides[selected].image}
              alt={slides[selected].heading}
              width={400}
              height={320}
              className="object-contain w-full h-full max-h-64 md:max-h-80"
              priority
            />
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.h1
            key={`heading-${selected}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4 leading-tight"
          >
            {slides[selected].heading}
          </motion.h1>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.p
            key={`subheading-${selected}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8"
          >
            {slides[selected].subheading}
          </motion.p>
        </AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href={slides[selected].link}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#ff4500] hover:bg-[#e63e00] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-base sm:text-lg shadow-lg transition-colors"
            >
              {slides[selected].button}
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
      {/* Right Side: Vertical Thumbnails */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-row md:flex-col gap-4 md:gap-6 items-center justify-center flex-[0_0_auto] w-auto"
      >
        {slides.map((slide, idx) => (
          <motion.button
            key={idx}
            onClick={() => setSelected(idx)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`focus:outline-none rounded-2xl overflow-hidden shadow-md border-2 transition-all duration-200 flex items-center justify-center
              ${selected === idx ? 'border-[#ff4500] scale-105' : 'border-transparent hover:border-[#ff4500]'}
            `}
            style={{ width: 80, height: 80 }}
            aria-label={slide.heading}
          >
            <Image
              src={slide.image}
              alt={slide.heading}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </motion.button>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;