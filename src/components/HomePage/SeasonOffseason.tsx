"use client"

import React, { useState, useEffect } from 'react'
import { useAllProductsQuery } from '../Redux/features/products/productsApi'
import Image from 'next/image'
import Link from 'next/link'
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'

const SeasonOffseason = () => {
  const { data: seasonProducts, isLoading: seasonLoading } = useAllProductsQuery({ categoryId: '04d19b36-f74e-4a43-aaab-8cc7171bd693' })
  const { data: offseasonProducts, isLoading: offseasonLoading } = useAllProductsQuery({ categoryId: '35cc6647-a818-4e4e-8eaf-663f74287fe7' })
  const [columns, setColumns] = useState(1)

  // Loading skeleton array
  const loadingSkeletons = Array(4).fill(null)

  // Add useEffect for automatic column selection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) { // sm breakpoint
        setColumns(1);
      } else if (width < 768) { // md breakpoint
        setColumns(2);
      } else if (width < 1024) { // lg breakpoint
        setColumns(2);
      } else if (width < 1280) { // xl breakpoint
        setColumns(2);
      } else { // 2xl and above
        setColumns(2);
      }
    };

    // Initial call
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='container mx-auto px-4 py-4 sm:py-6 md:py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8'>
        {/* Season Mango Section */}
        <div>
          <h2 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6'>Season Mango</h2>
          <div className={`grid grid-cols-${columns} gap-3 sm:gap-4`}>
            {seasonLoading ? (
              // Loading skeletons
              loadingSkeletons.map((_, index) => (
                <div key={index} className='block'>
                  <div className='h-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden'>
                    <div className='relative h-40 sm:h-48 md:h-56 mb-3 sm:mb-4 bg-gray-200 animate-pulse'></div>
                    <div className='p-3 sm:p-4 md:p-5'>
                      <div className='flex items-center justify-between mb-2'>
                        <div className='h-6 bg-gray-200 rounded animate-pulse w-3/4'></div>
                        <div className='h-6 bg-gray-200 rounded animate-pulse w-1/4'></div>
                      </div>
                      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0'>
                        <div className='h-6 bg-gray-200 rounded animate-pulse w-1/3'></div>
                        <div className='h-10 bg-gray-200 rounded animate-pulse w-1/3'></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              seasonProducts?.data?.data?.slice(0, 4).map((product: any) => (
                <div key={product.id} className='block'>
                  <div className='h-full bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden'>
                    <div className='relative h-40 sm:h-48 md:h-56 mb-3 sm:mb-4'>
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className='object-cover rounded-t-lg'
                      />
                    </div>
                    <div className='p-3 sm:p-4 md:p-5'>
                      <div className='flex items-center justify-between mb-2'>
                        <Link href={`/product/${product.id}`} className='text-base sm:text-lg md:text-xl hover:text-orange-600 font-semibold text-gray-800 truncate'>{product.name}</Link>
                        <div className='flex items-center gap-1'>
                          <Rating
                            style={{ maxWidth: 80 }}
                            value={product.averageRating}
                            readOnly
                            transition="colors"
                          />
                          <span className='text-sm text-gray-600 ml-1'>({product.averageRating || 0})</span>
                        </div>
                      </div>

                      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0'>
                        <p className='text-base sm:text-lg font-bold text-orange-600'>BDT {product.price.toFixed(2)}</p>
                        <Link href={`/product/${product.id}`} className='w-full sm:w-auto px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 text-sm sm:text-base bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors duration-300 text-center whitespace-nowrap'>
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Offseason Mango Section */}
        <div>
          <h2 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6'>Off Season Mango</h2>
          <div className={`grid grid-cols-${columns} gap-3 sm:gap-4`}>
            {offseasonLoading ? (
              // Loading skeletons
              loadingSkeletons.map((_, index) => (
                <div key={index} className='block'>
                  <div className='h-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden'>
                    <div className='relative h-40 sm:h-48 md:h-56 mb-3 sm:mb-4 bg-gray-200 animate-pulse'></div>
                    <div className='p-3 sm:p-4 md:p-5'>
                      <div className='flex items-center justify-between mb-2'>
                        <div className='h-6 bg-gray-200 rounded animate-pulse w-3/4'></div>
                        <div className='h-6 bg-gray-200 rounded animate-pulse w-1/4'></div>
                      </div>
                      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0'>
                        <div className='h-6 bg-gray-200 rounded animate-pulse w-1/3'></div>
                        <div className='h-10 bg-gray-200 rounded animate-pulse w-1/3'></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              offseasonProducts?.data?.data?.slice(0, 4).map((product: any) => (
                <div key={product.id} className='block'>
                  <div className='h-full bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden'>
                    <div className='relative h-40 sm:h-48 md:h-56 mb-3 sm:mb-4'>
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className='object-cover rounded-t-lg'
                      />
                    </div>
                    <div className='p-3 sm:p-4 md:p-5'>
                      <div className='flex items-center justify-between mb-2'>
                        <Link href={`/product/${product.id}`} className='text-base sm:text-lg md:text-xl hover:text-orange-600 font-semibold text-gray-800 truncate'>{product.name}</Link>
                        <div className='flex items-center gap-1'>
                          <Rating
                            style={{ maxWidth: 80 }}
                            value={product.averageRating}
                            readOnly
                            transition="colors"
                          />
                          <span className='text-sm text-gray-600 ml-1'>({product.averageRating || 0})</span>
                        </div>
                      </div>

                      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0'>
                        <p className='text-base sm:text-lg font-bold text-orange-600'>BDT {product.price.toFixed(2)}</p>
                        <Link href={`/product/${product.id}`} className='w-full sm:w-auto px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 text-sm sm:text-base bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors duration-300 text-center whitespace-nowrap'>
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeasonOffseason
