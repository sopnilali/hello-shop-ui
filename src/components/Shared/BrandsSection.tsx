"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAllbrandsQuery } from "../Redux/features/brands/brandsApi";
import Link from "next/link";

// const brands = [
//   { name: "Khirsapat/Himsagor", logo: "https://beerbol.com/wp-content/uploads/2024/05/Khirsapat-mango-1024x1024.jpg" },
//   { name: "Amrupali", logo: "https://indiangloriousnursery.com/wp-content/uploads/2023/04/pg-mango-amrapali-800x800-1.jpg" },
//   { name: "Fajli", logo: "https://bazaarmantri.com/images/products/40670.jpg" },
//   { name: "Gopalvog", logo: "https://borobagan.com/wp-content/uploads/2022/05/dsa.png" },
//   { name: "Asina", logo: "https://i.ytimg.com/vi/xeQ6n0jPU5w/maxresdefault.jpg" },
//   { name: "Lengra", logo: "https://www.shutterstock.com/image-photo/juicy-langra-mangoes-bangladesh-260nw-107423399.jpg" },
// ];

const BrandsSection = () => {

  const { data: brands, isLoading, isError } = useAllbrandsQuery(undefined);



  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full py-8 sm:py-10 px-2 sm:px-4 md:px-16 bg-white flex flex-col items-center"
    >
      <h2
        className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6 sm:mb-8"
      >
        Our Brands
      </h2>
      <div className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center items-center gap-6 sm:gap-8 md:gap-12 w-full max-w-5xl overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin snap-x snap-mandatory">
        {brands?.data?.map((brand: any, idx: any) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * idx, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center min-w-full sm:min-w-0 sm:w-auto snap-center"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-24 h-24 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center mb-1 sm:mb-2"
            >
              <Image src={brand.logo} alt={brand.name} width={80} height={80} className="object-contain w-full h-full" />
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