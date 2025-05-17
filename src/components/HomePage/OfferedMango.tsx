"use client"

import React from 'react'
import { useAllProductsQuery } from '../Redux/features/products/productsApi'
import { ProductCard } from '../Modules/Products/ProductCard'

const OfferedMango = () => {
  const { data: Allproducts, isLoading } = useAllProductsQuery({ sortBy: 'price', sortOrder: 'asc' })

  // 5 cards per row
  const gridClass = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"

  // Loading skeleton array
  const loadingSkeletons = Array(5).fill(null)

  return (
    <div className="container mx-auto px-1 lg:px-0 py-6">
      <h2 className="text-2xl font-bold mb-6">Best Offers</h2>
      <div className={gridClass}>
        {isLoading
          ? loadingSkeletons.map((_, idx) => <ProductCard key={idx} loading />)
          : Allproducts?.data?.data?.length > 0
            ? Allproducts.data.data.slice(0, 5).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))
            : <div className="col-span-full text-center text-gray-500">Product Not Found</div>
        }
      </div>
    </div>
  )
}

export default OfferedMango
