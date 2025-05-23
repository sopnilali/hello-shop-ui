"use client"
import React from 'react'
import { useGetActiveDiscountsQuery } from '../../Redux/features/discount/discountApi'
import Image from 'next/image'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../Redux/features/cart/cartSlice'
import customToast from '@/components/Shared/customToast'
import { RootState } from '../../Redux/store'

const DiscountPagess = () => {
  const {data: discounts, isLoading} = useGetActiveDiscountsQuery(undefined)
  const dispatch = useDispatch()
  const cartItems = useSelector((state: RootState) => state.cart.items)

  const handleAddToCart = (product: any) => {
    const isAlreadyInCart = cartItems.some((item) => item.id === product.id)
    const toastId = 'loading...'
    if (isAlreadyInCart) {
      customToast('Product already in cart!', 'warning', toastId)
      return
    }

    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1
    }))
    customToast('Product added to cart!', 'success', toastId)
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff4500]"></div>
    </div>
  }

  return (
    <div className="container mx-auto ">
      {/* Banner Section */}
      <div className="relative w-full h-[300px] mb-8 rounded-lg overflow-hidden mt-6">
        <Image
          src="https://t4.ftcdn.net/jpg/07/05/76/83/360_F_705768379_6gKmh8xMy2TcauvQnUAhoCh9jnS9ci0n.jpg"
          alt="Discount Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-black">Special Offers</h1>
        </div>
      </div>

      {/* Discounted Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {discounts?.data?.map((discount: any) => (
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
        ))}
      </div>
    </div>
  )
}

export default DiscountPagess
