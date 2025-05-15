"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const BannerAds = () => {
  const banners = [
    {
      id: 1,
      image: "https://example.com/banner1.jpg", // Replace with actual banner image URL
      title: "Special Mango Offer",
      description: "Get 20% off on all premium mangoes",
      link: "/offers/mango"
    },
    {
      id: 2, 
      image: "https://example.com/banner2.jpg", // Replace with actual banner image URL
      title: "New Season Collection",
      description: "Fresh fruits straight from the garden",
      link: "/new-arrivals"
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
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
          >
            <div className="relative h-[200px] w-full">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center px-6">
                <h3 className="text-white text-2xl font-bold mb-2">
                  {banner.title}
                </h3>
                <p className="text-white text-sm mb-4">
                  {banner.description}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#ff4500] text-white px-6 py-2 rounded-full w-fit"
                >
                  Shop Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BannerAds;
