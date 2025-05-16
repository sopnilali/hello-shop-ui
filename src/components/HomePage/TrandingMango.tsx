"use client"

import React from 'react'
import { useAllProductsQuery } from '../Redux/features/products/productsApi'
import Image from 'next/image'
import Link from 'next/link'
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'

const TrandingMango = () => {
  const { data: Allproducts, isLoading } = useAllProductsQuery({ sortBy: 'rating', sortOrder: 'desc' })

  // Loading skeleton array
  const loadingSkeletons = Array(4).fill(null)

  return (
    <div className='container mx-auto px-4 py-8'>
      <h2 className='text-2xl font-bold mb-6'>Most Popular</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {isLoading ? (
          // Loading skeletons
          loadingSkeletons.map((_, index) => (
            <div key={index} className='block'>
              <div className='h-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden'>
                <div className='relative h-56 mb-4 bg-gray-200 animate-pulse'></div>
                <div className='p-5'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='h-6 bg-gray-200 rounded animate-pulse w-3/4'></div>
                    <div className='h-6 bg-gray-200 rounded animate-pulse w-1/4'></div>
                  </div>
                  <div className='flex justify-between items-center'>
                    <div className='h-6 bg-gray-200 rounded animate-pulse w-1/3'></div>
                    <div className='h-10 bg-gray-200 rounded animate-pulse w-1/3'></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Actual content
          Allproducts?.data?.data?.slice(0, 4).map((product: any) => (
            <div key={product.id} className='block'>
              <div className='h-full bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden'>
                <div className='relative h-56 mb-4'>
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className='object-cover rounded-t-lg'
                  />
                </div>
                <div className='p-5'>
                  <div className='flex items-center justify-between mb-2'>
                    <Link href={`/product/${product.id}`} className='text-xl hover:text-orange-600 font-semibold text-gray-800 truncate'>{product.name}</Link>
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

                  <div className='flex justify-between items-center'>
                    <p className='text-lg font-bold text-orange-600'>BDT {product.price.toFixed(2)}</p>
                    <Link href={`/product/${product.id}`} className='px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors duration-300'>
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
  )
}

export default TrandingMango
