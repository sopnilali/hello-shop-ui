"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const BannerAds = () => {
  const banners = [
    {
      id: 1,
      title: "Special Mango Offer - SUMMER50",
      description: "Get 50% off on all premium mangoes",
      link: "/offers",
      backgroundImage: "https://i.pinimg.com/736x/9d/45/1f/9d451fd38e78e0775582d3880feb9a39.jpg"
    },
    {
      id: 2,
      title: "New Season Collection",
      description: "Fresh fruits straight from the garden",
      link: "/product",
      backgroundImage: "https://png.pngtree.com/background/20210711/original/pngtree-green-delicious-fruit-food-mango-banner-picture-image_1082988.jpg"
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 0.98 }}
            className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer h-[200px]"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${banner.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="h-full flex flex-col justify-center px-6">
              <h3 className="text-white text-2xl font-bold mb-2">
                {banner.title}
              </h3>
              <p className="text-white text-sm mb-4">
                {banner.description}
              </p>
              <Link href={banner.link}>
                <button
                  className="bg-orange-600 text-white px-6 py-2 rounded-full w-fit font-semibold hover:bg-orange-800 transition-colors duration-500"
                >
                  Shop Now
                </button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BannerAds;
