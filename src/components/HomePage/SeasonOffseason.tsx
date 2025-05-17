"use client"

import React from 'react'
import { useAllProductsQuery } from '../Redux/features/products/productsApi'
import Image from 'next/image'
import Link from 'next/link'
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'
import { ProductCard } from '../Modules/Products/ProductCard'

const SeasonOffseason = () => {
  const { data: seasonProducts, isLoading: seasonLoading } = useAllProductsQuery({ categoryId: '04d19b36-f74e-4a43-aaab-8cc7171bd693' })
  const { data: offseasonProducts, isLoading: offseasonLoading } = useAllProductsQuery({ categoryId: '35cc6647-a818-4e4e-8eaf-663f74287fe7' })

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
