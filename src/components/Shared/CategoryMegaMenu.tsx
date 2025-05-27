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
          className="absolute top-full min-w-[500px] left-0 bg-white backdrop-blur-md shadow-lg rounded-md z-50 pt-2"
        >
          <div className="w-full py-3 px-2">
            <div className="flex items-center justify-between mb-2 px-2">
              <h3 className="text-base font-semibold text-gray-800">Popular Brands</h3>
            </div>

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