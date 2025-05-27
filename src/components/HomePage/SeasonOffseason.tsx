"use client"

import React from 'react'
import { useAllProductsQuery } from '../Redux/features/products/productsApi'
import Image from 'next/image'
import Link from 'next/link'
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'
import { ProductCard } from '../Modules/Products/ProductCard'

const SeasonOffseason = () => {
  const { data: seasonProducts, isLoading: seasonLoading } = useAllProductsQuery({ categoryId: '50ce283a-7d90-4181-ba3f-82f0c6a651c0' })
  const { data: offseasonProducts, isLoading: offseasonLoading } = useAllProductsQuery({ categoryId: '625388a5-1f3d-48c2-95cc-82e704b828ca' })

  // 5 cards per row
  const gridClass = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"

  // Loading skeleton array
  const loadingSkeletons = Array(5).fill(null)

  return (
    <div className="container mx-auto px-1 lg:px-0 py-6">
      {/* Season Mango Section */}
      <h2 className="text-2xl font-bold mb-6">Seasonal Mango</h2>
      <div className={gridClass}>
        {seasonLoading
          ? loadingSkeletons.map((_, idx) => <ProductCard key={idx} loading />)
          : seasonProducts?.data?.data?.length > 0
            ? seasonProducts.data.data.slice(0, 5).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))
            : <div className="col-span-full text-center text-gray-500">Product Not Found</div>
        }
      </div>

      {/* Offseason Mango Section */}
      <h2 className="text-2xl font-bold mt-12 mb-6">Off Seasonal Mango</h2>
      <div className={gridClass}>
        {offseasonLoading
          ? loadingSkeletons.map((_, idx) => <ProductCard key={idx} loading />)
          : offseasonProducts?.data?.data?.length > 0
            ? offseasonProducts.data.data.slice(0, 5).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))
            : <div className="col-span-full text-center text-gray-500">Product Not Found</div>
        }
      </div>
    </div>
  )
}

export default SeasonOffseason
