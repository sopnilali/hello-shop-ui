'use client';

import { useAllbrandsQuery } from "../Redux/features/brands/brandsApi";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";

const CategoryMegaMenu = ({ isOpen }: { isOpen: boolean }) => {
  const { data: brands, isLoading } = useAllbrandsQuery(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const filteredBrands = brands?.data?.filter((brand: any) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full min-w-[500px] left-0 bg-white/2 backdrop-blur-md shadow-lg rounded-md z-50 pt-2"
        >
          <div className="w-full py-3 px-2">
            <div className="flex items-center justify-between mb-2 px-2">
              <h3 className="text-base font-semibold text-gray-800">Popular Brands</h3>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiSearch className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="px-2 mb-3"
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search brands..."
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#ff4500]"
                    />
                    <FiSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-3 gap-0">
              {filteredBrands?.map((brand: any) => (
                <Link 
                  key={brand.id} 
                  href={`/product?brandId=${brand.id}`}
                  className="group block w-full"
                >
                  <div className="flex flex-col items-center p-1.5 rounded-lg hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <div className="w-14 h-14 sm:w-14 sm:h-14 relative mb-1">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        className="rounded-[300%]"
                        sizes="(max-width: 500px) 40px, 56px"
                      />
                    </div>
                    <span className="text-xs text-gray-600 group-hover:text-[#ff4500] transition-colors text-center line-clamp-2">
                      {brand.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CategoryMegaMenu; 