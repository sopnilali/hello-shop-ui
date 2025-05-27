"use client"
import React from 'react'
import { useGetActiveDiscountsQuery } from '../../Redux/features/discount/discountApi'
import Image from 'next/image'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../Redux/features/cart/cartSlice'
import { RootState } from '../../Redux/store'
import { toast } from 'sonner'

const DiscountPagess = () => {
  const {data: discounts, isLoading} = useGetActiveDiscountsQuery(undefined)
  const dispatch = useDispatch()
  const cartItems = useSelector((state: RootState) => state.cart.items)

  const handleAddToCart = (product: any) => {
    const isAlreadyInCart = cartItems.some((item) => item.id === product.id)
    const toastId = toast.loading('Adding to cart...')
    if (isAlreadyInCart) {
      toast.warning('Product already in cart!', { id: toastId })
      return
    }

    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1
    }))
    toast.success('Product added to cart!', { id: toastId })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto">
        {/* Banner Skeleton */}
        <div className="relative w-full h-[300px] mb-8  rounded-lg overflow-hidden mt-6 bg-gray-200 animate-pulse" />

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48 bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      {/* Banner Section */}
      <div className="relative w-full h-[300px] mb-8 rounded-lg overflow-hidden mt-6">
        <Image
          src="https://t4.ftcdn.net/jpg/07/05/76/83/360_F_705768379_6gKmh8xMy2TcauvQnUAhoCh9jnS9ci0n.jpg"
          alt="Discount Banner"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 flex items-center bg-black/40 justify-center">
          <h1 className="text-4xl font-bold text-white ">Special Offers</h1>
        </div>
      </div>

      {/* Discounted Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {discounts?.data && discounts?.data.length > 0 ? discounts?.data.map((discount: any) => (
          <div key={discount.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48">
              <Image
                src={discount.product.images[0]}
                alt={discount.product.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 bg-[#ff4500] text-white px-2 py-1 rounded">
                {discount.value}% OFF
              </div>
            </div>
            <div className="p-4">
              <Link href={`/product/${discount.product.id}`}>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {discount.product.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-gray-500 line-through">
                  ৳{discount.product.price}
                </span>
                <span className="text-[#ff4500] font-bold">
                  ৳{(discount.product.price * (1 - discount.value/100)).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Available: {discount.product.quantity}
                </span>
                <button
                  onClick={() => handleAddToCart(discount.product)}
                  className="bg-[#ff4500] text-white px-4 py-2 rounded hover:bg-[#ff5722] transition-colors duration-300"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="flex items-center justify-center h-full">
            <h1 className="text-2xl text-gray-500 text-center">No discounts found</h1>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscountPagess
