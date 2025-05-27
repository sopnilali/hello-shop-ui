"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAllbrandsQuery } from "../Redux/features/brands/brandsApi";
import Link from "next/link";

const BrandsSection = () => {
  const { data: brands, isLoading, isError } = useAllbrandsQuery(undefined);

  // Create skeleton items array
  const skeletonItems = Array(6).fill(null);

  if (isLoading) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full py-8 sm:py-10 px-2 sm:px-4 md:px-16 bg-white flex flex-col items-center"
      >
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-6 sm:mb-8" />
        <div className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center items-center gap-6 sm:gap-8 md:gap-12 w-full max-w-5xl overflow-x-auto pb-2 -mx-2 px-2">
          {skeletonItems.map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * idx, duration: 0.3 }}
              className="flex flex-col items-center min-w-full sm:min-w-0 sm:w-auto snap-center"
            >
              <div className="h-20 w-20 rounded-[300%] bg-gray-200 animate-pulse mb-1 sm:mb-2" />
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            </motion.div>
          ))}
        </div>
      </motion.section>
    );
  }

  if (isError) {
    return (
      <div className="w-full py-8 text-center text-red-500">
        Error loading brands
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full py-8 sm:py-10 px-2 sm:px-4 md:px-16 bg-white flex flex-col items-center"
    >
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
        Sub Category
      </h2>
      <div className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center items-center gap-6 sm:gap-8 md:gap-12 w-full max-w-5xl overflow-x-auto pb-2 -mx-2 px-2">
        {brands?.data?.map((brand: any, idx: any) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * idx, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center min-w-full sm:min-w-0 sm:w-auto snap-center"
          >
            <motion.div className="h-20 w-20 rounded-[300%] flex items-center justify-center mb-1 sm:mb-2 overflow-hidden">
              <Image 
                src={brand.logo} 
                alt={brand.name} 
                width={50} 
                height={50} 
                className="w-full h-full object-cover"
              />
            </motion.div>
            <Link href={`/product?brandId=${brand.id}`}>
              <motion.span
                whileHover={{ scale: 1.1 }}
                className="text-base sm:text-sm md:text-base text-gray-700 font-semibold text-center"
              >
                {brand.name}
              </motion.span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default BrandsSection;