"use client";
import { motion } from "framer-motion";

const ProductSkeleton = () => {
  // Create an array of 5 items for the skeleton
  const skeletonItems = Array(5).fill(null);

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-full mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8">
          <div className="h-8 w-48 bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-gray-700 rounded-lg animate-pulse" />
        </div>

        <div className="rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1024px]">
              <thead className="bg-gray-800 transition-colors">
                <tr>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base">Name</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base hidden md:table-cell">Category</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base hidden md:table-cell">Brand</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base">Price</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base hidden lg:table-cell">Weight</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base hidden lg:table-cell">Shop</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base hidden md:table-cell">Quantity</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base">Status</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm md:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {skeletonItems.map((_, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-gray-700"
                  >
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 hidden md:table-cell">
                      <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 hidden md:table-cell">
                      <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 hidden lg:table-cell">
                      <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 hidden lg:table-cell">
                      <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 hidden md:table-cell">
                      <div className="h-4 w-12 bg-gray-700 rounded animate-pulse" />
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <div className="h-6 w-20 bg-gray-700 rounded-full animate-pulse" />
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <div className="flex gap-2 md:gap-3">
                        <div className="h-6 w-6 bg-gray-700 rounded animate-pulse" />
                        <div className="h-6 w-6 bg-gray-700 rounded animate-pulse" />
                        <div className="h-6 w-6 bg-gray-700 rounded animate-pulse" />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton; 