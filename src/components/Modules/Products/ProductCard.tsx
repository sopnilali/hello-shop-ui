import { Rating } from "@smastrom/react-rating"
import Link from "next/link"
import Image from "next/image"

export const ProductCard = ({ product, loading }: { product?: any, loading?: boolean }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-0 flex flex-col h-full transition hover:shadow-lg">
        <div className="rounded-t-2xl overflow-hidden">
          <div className="relative w-full h-40 bg-gray-200 animate-pulse" />
        </div>
        <div className="p-4 flex flex-col flex-1">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
          <div className="flex items-center gap-1 mb-2">
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
          </div>
          <div className="flex flex-col gap-2 mt-auto">
            <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-0 flex flex-col h-full transition hover:shadow-lg">
      <div className="rounded-t-2xl overflow-hidden">
        <div className="relative w-full h-40">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            style={{ borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}
            sizes="(max-width: 768px) 100vw, 20vw"
          />
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div>
          <div className="font-roboto text-base font-semibold text-gray-800 leading-tight">
         <Link className="hover:text-[#ff4500] transition-colors duration-300" href={`/product/${product.id}`}>{product.name}</Link>
          </div>
          {product.rating && (
            <div className="mt-1">
              <Rating 
                value={product.rating} 
                readOnly 
                style={{ maxWidth: 80 }}
              />
            </div>
          )}
        </div>

        {/* Footer section always at the bottom */}
        <div className="flex flex-row justify-between items-center gap-2 mt-auto pt-4">
          <p className="text-lg font-bold text-orange-600">৳{product.price?.toFixed(2)}</p>
          <Link
            href={`/product/${product.id}`}
            className="px-5 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors duration-300 text-sm font-semibold text-center"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}
