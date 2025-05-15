"use client"

import React, { useState, useEffect } from 'react'
import { useAllProductsQuery } from '@/components/Redux/features/products/productsApi'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAllcategoriesQuery } from '@/components/Redux/features/category/categoryApi'
import { useAllbrandsQuery } from '@/components/Redux/features/brands/brandsApi'
import { AiOutlineUnorderedList } from 'react-icons/ai'
import { FaCheckCircle } from 'react-icons/fa'
import { BsGrid3X3GapFill, BsGrid } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/components/Redux/features/cart/cartSlice'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'

const AllProducts: React.FC = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000])
  const [sortOrder, setSortOrder] = useState('asc')
  const [columns, setColumns] = useState(3)

  const user = useSelector((state: any) => state.auth.user)

  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    sortBy: 'price',
    sortOrder: 'asc',
    searchTerm: '',
    minPrice: 0,
    maxPrice: 50000,
    categoryId: '',
    brandId: ''
  })

  useEffect(() => {
    setFilters(prevFilters => ({
      ...prevFilters,
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 12,
      sortBy: searchParams.get('sortBy') || 'price',
      sortOrder: searchParams.get('sortOrder') || sortOrder,
      searchTerm: searchParams.get('searchTerm') || '',
      minPrice: Number(searchParams.get('minPrice')) || 0,
      maxPrice: Number(searchParams.get('maxPrice')) || 50000,
      categoryId: searchParams.get('categoryId') || '',
      brandId: searchParams.get('brandId') || ''
    }))
    setPriceRange([Number(searchParams.get('minPrice')) || 0, Number(searchParams.get('maxPrice')) || 50000])
    setSortOrder(searchParams.get('sortOrder') || 'asc')

    // Sync selectedBrands and selectedCategories with query params (for multi-select)
    const brandIdParam = searchParams.get('brandId')
    const categoryIdParam = searchParams.get('categoryId')
    setSelectedBrands(brandIdParam ? brandIdParam.split(',').filter(Boolean) : [])
    setSelectedCategories(categoryIdParam ? categoryIdParam.split(',').filter(Boolean) : [])
  }, [searchParams])

  // Query parameters for API
  const queryParams = {
    brandId: selectedBrands.length > 0 ? selectedBrands.join(',') : undefined,
    categoryId: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 50000 ? priceRange[1] : undefined,
    sortOrder: sortOrder !== 'asc' ? sortOrder : undefined,
    sortBy: 'price'
  }

  // Use the query parameters in the API call
  const { data: filteredProductsData, isLoading: isFilterLoading } = useAllProductsQuery(queryParams)
  const filteredProducts = filteredProductsData?.data?.data || []

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedBrands.length > 0) params.set('brandId', selectedBrands.join(','))
    if (selectedCategories.length > 0) params.set('categoryId', selectedCategories.join(','))
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString())
    if (priceRange[1] < 50000) params.set('maxPrice', priceRange[1].toString())
    if (sortOrder !== 'asc') params.set('sortOrder', sortOrder)

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`
    window.history.replaceState({}, '', newUrl)
  }, [selectedBrands, selectedCategories, priceRange, sortOrder])

  const { data: categories } = useAllcategoriesQuery(undefined)
  const { data: brands } = useAllbrandsQuery(undefined)

  // Dummy rating and discount for demo
  const getRating = () => 4.5
  const getDiscount = () => Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 10 : null


  // Multi-select for brands
  const handleBrandPick = (brandId: string) => {
    setSelectedBrands(prev => {
      const updated = prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
      return updated
    })
  }

  // Multi-select for categories
  const handleCategoryPick = (categoryId: string) => {
    setSelectedCategories(prev => {
      const updated = prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
      return updated
    })
  }

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = Number(event.target.value)
    setPriceRange(prev => {
      const newRange = [...prev] as [number, number]
      newRange[index] = value
      return newRange
    })
  }

  const handlePriceRangeApply = () => {
    // Price range is already updated in state
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value)
  }

  const handleColumnChange = (col: number) => {
    setColumns(col)
    setViewType('grid')
  }

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({ ...product, quantity: 1 }))
    toast.success('Product added to cart')
  }

  const handleBuyNow = (product: any) => {
    if (user) {
      dispatch(addToCart({ ...product, quantity: 1 }))
      router.push('/checkout')
    } else {
      toast.error('Please login first')
      router.push('/login')
    }
  }

  const updateSearchQuery = (newParams: Record<string, string | number>) => {
    const currentParams = new URLSearchParams(window.location.search)
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        currentParams.set(key, value.toString())
      } else {
        currentParams.delete(key)
      }
    })
    router.push(`${window.location.pathname}?${currentParams.toString()}`)
  }

  // Filter Sidebar as a component for reuse
  const FilterSidebar = (
    <aside className='w-full rounded-lg p-6 mb-6 md:mb-0 bg-white h-full overflow-y-auto'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-bold flex items-center gap-2'>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-.293.707l-6.414 6.414A1 1 0 0 0 13 13.414V19a1 1 0 0 1-1.447.894l-2-1A1 1 0 0 1 9 18v-4.586a1 1 0 0 0-.293-.707L2.293 6.707A1 1 0 0 1 2 6V4z" /></svg>
          Filter
        </h2>
        {/* Close button for mobile modal */}
        <button
          className="md:hidden text-gray-500 hover:text-orange-600 text-2xl"
          onClick={() => setIsFilterOpen(false)}
          aria-label="Close filter"
        >
          &times;
        </button>
      </div>
      <div className='mb-6'>
        <h3 className='font-semibold mb-2 text-gray-700'>Brand</h3>
        <div className='flex flex-col gap-2'>
          {brands?.data?.map((brand: any) => {
            const checked = selectedBrands.includes(brand.id)
            return (
              <button
                key={brand.id}
                type="button"
                className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md border transition-colors ${checked
                  ? 'bg-orange-100 border-orange-500 text-orange-700 font-semibold'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-orange-50'
                  }`}
                onClick={() => handleBrandPick(brand.id)}
              >
                <span
                  className={`w-4 h-4 flex items-center justify-center border rounded ${checked ? 'border-orange-500 bg-orange-500' : 'border-gray-400 bg-white'}`}
                  style={{ marginRight: 4 }}
                >
                  {checked && <FaCheckCircle className="text-white text-xs" />}
                </span>
                <span>{brand.name}</span>
              </button>
            )
          })}
        </div>
      </div>
      <div className='mb-6'>
        <h3 className='font-semibold mb-2 text-gray-700'>Category</h3>
        <div className='flex flex-col gap-2'>
          {categories?.data?.map((category: any) => {
            const checked = selectedCategories.includes(category.id)
            return (
              <button
                key={category.id}
                type="button"
                className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md border transition-colors ${checked
                  ? 'bg-orange-100 border-orange-500 text-orange-700 font-semibold'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-orange-50'
                  }`}
                onClick={() => handleCategoryPick(category.id)}
              >
                <span
                  className={`w-4 h-4 flex items-center justify-center border rounded ${checked ? 'border-orange-500 bg-orange-500' : 'border-gray-400 bg-white'}`}
                  style={{ marginRight: 4 }}
                >
                  {checked && <FaCheckCircle className="text-white text-xs" />}
                </span>
                <span>{category.name}</span>
              </button>
            )
          })}
        </div>
      </div>
      <div className='mb-6'>
        <h3 className='font-semibold mb-2 text-gray-700'>Price Range</h3>
        <div className='flex flex-col gap-4'>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">৳{priceRange[0]}</span>
              <span className="text-sm text-gray-600">৳{priceRange[1]}</span>
            </div>
            <div className="flex gap-4">
              <input
                type="range"
                id="minPrice"
                min="0"
                max="50000"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(e, 0)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <input
                type="range"
                id="maxPrice"
                min="0"
                max="50000"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(e, 1)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
            </div>
          </div>
          <button
            onClick={handlePriceRangeApply}
            className="mt-2 w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </aside>
  )

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Mobile Filter Button */}
      <div className="md:hidden flex justify-end mb-4">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold shadow hover:bg-orange-700 transition-colors"
          onClick={() => setIsFilterOpen(true)}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-.293.707l-6.414 6.414A1 1 0 0 0 13 13.414V19a1 1 0 0 1-1.447.894l-2-1A1 1 0 0 1 9 18v-4.586a1 1 0 0 0-.293-.707L2.293 6.707A1 1 0 0 1 2 6V4z" /></svg>
          Filter
        </button>
      </div>
      {/* Mobile Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 bg-opacity-50 transition-opacity duration-500"
            onClick={() => setIsFilterOpen(false)}
          />
          {/* Sidebar Modal */}
          <div
            className="relative w-4/5 max-w-xs h-full bg-white shadow-lg transition-transform duration-300 transform translate-x-0"
            style={{
              animation: 'slideInLeft 0.3s cubic-bezier(0.4,0,0.2,1)'
            }}
          >
            {FilterSidebar}
          </div>
          {/* Animation keyframes */}
          <style jsx global>{`
            @keyframes slideInLeft {
              from { transform: translateX(-100%); }
              to { transform: translateX(0); }
            }
          `}</style>
        </div>
      )}
      <div className='flex flex-col md:flex-row gap-8'>
        {/* Filter Sidebar (hidden on mobile, visible on md+) */}
        <div className="hidden md:block md:w-1/4">{FilterSidebar}</div>
        {/* Product List & Controls */}
        <main className='w-full md:w-3/4'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4'>
            <div className='text-2xl font-bold text-gray-800'>Product List <span className='text-base font-normal text-gray-500'>({filteredProducts.length || 0})</span></div>
            <div className='flex flex-wrap items-center gap-4'>
              <div className='flex items-center gap-2'>
                <label className='text-gray-700 text-sm font-medium whitespace-nowrap'>Sort by</label>
                <select
                  value={sortOrder}
                  onChange={handleSortChange}
                  className='border border-gray-300 rounded-md px-2 py-1 focus:ring-orange-500 focus:border-orange-500 text-sm'
                >
                  <option value='asc'>Price: Low to High</option>
                  <option value='desc'>Price: High to Low</option>
                </select>
              </div>
              <div className='flex items-center gap-2'>
                <button
                  className={`p-2 rounded ${columns === 3 ? 'bg-orange-100 text-orange-600' : 'text-gray-400'}`}
                  onClick={() => handleColumnChange(3)}
                  aria-label='3 Columns'
                >
                  <BsGrid3X3GapFill size={20} />
                </button>
                <button
                  className={`p-2 rounded ${columns === 4 ? 'bg-orange-100 text-orange-600' : 'text-gray-400'}`}
                  onClick={() => handleColumnChange(4)}
                  aria-label='4 Columns'
                >
                  <BsGrid size={20} />
                </button>
                <button
                  className={`p-2 rounded ${viewType === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-400'}`}
                  onClick={() => setViewType('list')}
                  aria-label='List View'
                >
                  <AiOutlineUnorderedList size={20} />
                </button>
              </div>
            </div>
          </div>
          {isFilterLoading && <div className="text-center text-xl">Loading...</div>}
          {!isFilterLoading && filteredProducts.length === 0 && (
            <div className="text-center text-xl text-gray-600">No products found matching your criteria.</div>
          )}
          <div className={viewType === 'grid' ? `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-8` : 'flex flex-col gap-6'}>
            {filteredProducts.map((product: any) => {
              return (
                <div key={product.id} className="h-full bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden">
                  <div className="relative h-56 mb-4">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-5">
                    <div className="block">
                      <Link href={`/product/${product.id}`} className="text-xl font-semibold mb-2 hover:text-orange-600 text-gray-800 transition-colors duration-300">{product.name}</Link>
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-bold text-orange-600">৳{product.price.toFixed(2)}</p>
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors duration-300"
                            onClick={() => handleAddToCart(product)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AllProducts
