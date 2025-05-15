import ProductDetails from '@/components/Modules/Products/ProductDetails'
import React, { Suspense } from 'react'

const ProductDetailsPage = () => {
  return (
    <div>
      <Suspense >
        <ProductDetails/>
        </Suspense>
    </div>
  )
}

export default ProductDetailsPage
