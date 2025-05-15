"use client"

import React from 'react'
import { useAllProductsQuery } from '../Redux/features/products/productsApi'
import Image from 'next/image'
import Link from 'next/link'

const TopProducts = () => {
  const { data: Allproducts, isLoading } = useAllProductsQuery(undefined)


  return (
    <div className='container mx-auto px-4 py-8'>
      <h2 className='text-2xl font-bold mb-6'>Mousumi Amm</h2>
      <div className='text-center text-2xl font-bold mb-6'>
        {isLoading && <h1>Loading...</h1> }
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {Allproducts?.data?.data?.slice(0, 4).map((product: any) => (
          <Link href={`/product/${product.id}`} key={product.id} className='block'>
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
                <h3 className='text-xl font-semibold mb-2 text-gray-800 truncate'>{product.name}</h3>
                <div className='flex justify-between items-center'>
                  <p className='text-lg font-bold text-orange-600'>${product.price.toFixed(2)}</p>
                  <button className='px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors duration-300'>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TopProducts
