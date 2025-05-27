"use client"

import React, { useState, useEffect } from 'react'
import { useAllProductsQuery } from '@/components/Redux/features/products/productsApi'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAllcategoriesQuery } from '@/components/Redux/features/category/categoryApi'
import { useAllbrandsQuery } from '@/components/Redux/features/brands/brandsApi'
import { AiOutlineUnorderedList } from 'react-icons/ai'
import { FaCheckCircle } from 'react-icons/fa'
import { BsGrid3X3GapFill, BsGrid } from 'react-icons/bs'
import { FiX } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/components/Redux/features/cart/cartSlice'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'
import { useAppSelector } from '@/components/Redux/hooks'


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
  const [columns, setColumns] = useState(4)
  const [searchQuery, setSearchQuery] = useState('')
  const { items } = useAppSelector((state: any) => state.cart)

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
    ...filters,
    brandId: selectedBrands.length > 0 ? selectedBrands.join(',') : undefined,
    categoryId: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 50000 ? priceRange[1] : undefined,
    sortOrder: sortOrder,
    sortBy: 'price'
  }

  // Use the query parameters in the API call
  const { data: filteredProductsData, isLoading: isFilterLoading } = useAllProductsQuery(queryParams)
  const filteredProducts = filteredProductsData?.data?.data || []

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (selectedBrands.length > 0) params.set('brandId', selectedBrands.join(','))
    if (selectedCategories.length > 0) params.set('categoryId', selectedCategories.join(','))
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString())
    if (priceRange[1] < 50000) params.set('maxPrice', priceRange[1].toString())
    params.set('sortOrder', sortOrder)
    params.set('sortBy', 'price')
    
    router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false })
  }, [selectedBrands, selectedCategories, priceRange, sortOrder, router])

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
    const newSortOrder = e.target.value as 'asc' | 'desc'
    setSortOrder(newSortOrder)
    setFilters(prev => ({
      ...prev,
      sortOrder: newSortOrder,
      sortBy: 'price'
    }))

    // Update query params immediately
    const params = new URLSearchParams(window.location.search)
    params.set('sortOrder', newSortOrder)
    params.set('sortBy', 'price')
    router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false })
  }

  const handleColumnChange = (col: number) => {
    setColumns(col)
    setViewType('grid')
  }

  const handleAuthCheck = () => {
    if (!user) {
      toast.error('Please login first to continue');
      router.push('/login?redirectPath=/products');
      return false;
    }
    return true;
  };

  const handleAddToCart = (product: any) => {
    if (!handleAuthCheck()) return;

    // Check if product is already in cart
    const existingItem = items.find((item: any) => item.id === product.id);
    if (existingItem) {
      toast.error('Product is already in your cart');
      return;
    }

    // Ensure we have a valid image URL
    const imageUrl = Array.isArray(product.images) && product.images.length > 0 
      ? product.images[0] 
      : product.image || '/placeholder.png';

    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: imageUrl
    }));
    toast.success('Product added to cart');
  };

  // const handleBuyNow = (product: any) => {
  //   if (!handleAuthCheck()) return;

  //   // Ensure we have a valid image URL
  //   const imageUrl = Array.isArray(product.images) && product.images.length > 0 
  //     ? product.images[0] 
  //     : product.image || '/placeholder.png';

  //   dispatch(addToCart({
  //     id: product.id,
  //     name: product.name,
  //     price: product.price,
  //     quantity: 1,
  //     image: imageUrl // Use the first image from the array or fallback to single image
  //   }));
  //   router.push('/checkout');
  // };

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
    <aside className='w-full  rounded-lg p-2 mb-6 md:mb-0 h-full overflow-y-auto'>
      <div className='flex items-center justify-between mb-6 '>
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
        <h3 className='font-semibold mb-2 text-gray-700'>Search</h3>
        <div className='relative'>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              setSearchQuery(value);
              // Debounce search to avoid too many API calls
              const timeoutId = setTimeout(() => {
                updateSearchQuery({ searchTerm: value });
              }, 500);
              return () => clearTimeout(timeoutId);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateSearchQuery({ search: searchQuery });
              }
            }}
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors'
          />
          <button
            onClick={() => {
              setSearchQuery('');
              updateSearchQuery({ searchTerm: '' });
            }}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors'
            aria-label="Clear search"
          >
            {searchQuery && <FiX className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <div className='mb-6'>
        <h3 className='font-semibold mb-2 text-gray-700'>Sub Category</h3>
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
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="minPrice" className="block text-sm text-gray-600 mb-1">Min Price</label>
                <input
                  type="number"
                  id="minPrice"
                  min="0"
                  max="50000"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="maxPrice" className="block text-sm text-gray-600 mb-1">Max Price</label>
                <input
                  type="number"
                  id="maxPrice"
                  min="0"
                  max="50000"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <input
                type="range"
                id="minPriceRange"
                min="0"
                max="50000"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(e, 0)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <input
                type="range"
                id="maxPriceRange"
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


  // Add useEffect for automatic column selection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) { // sm breakpoint
        setColumns(2);
      } else if (width < 1024) { // lg breakpoint
        setColumns(3);
      } else if (width < 1280) { // xl breakpoint
        setColumns(4);
      } else { // 2xl and above
        setColumns(5);
      }
    };

    // Initial call
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 container mx-auto">
      {/* Top Banner */}
      <div className="relative container mx-auto rounded-md w-full h-[300px] mb-8 overflow-hidden mt-6 ">
                        <Image
          src="https://t4.ftcdn.net/jpg/07/05/76/83/360_F_705768379_6gKmh8xMy2TcauvQnUAhoCh9jnS9ci0n.jpg"
          alt="Products Banner"
                          fill
                          className="object-cover"
          priority
                        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center ">
          <div className="text-center ">
            <h1 className="text-4xl font-bold text-white mb-4">Our Products</h1>
            <p className="text-white text-lg">Discover our amazing collection of products</p>
                      </div>
                        </div>
                      </div>

      {/* Main Content */}
      <div className="container mx-auto  ">
    <div className='w-full overflow-x-hidden'>
          <div className='container mx-auto py-6 sm:py-8 lg:py-8'>
        {/* Mobile Filter Button */}
        <div className="md:hidden flex justify-end mb-6 ">
          <button
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg font-semibold shadow-md hover:bg-orange-700 transition-all duration-300 active:transform active:scale-95"
            onClick={() => setIsFilterOpen(true)}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-.293.707l-6.414 6.414A1 1 0 0 0 13 13.414V19a1 1 0 0 1-1.447.894l-2-1A1 1 0 0 1 9 18v-4.586a1 1 0 0 0-.293-.707L2.293 6.707A1 1 0 0 1 2 6V4z" /></svg>
            Filter
          </button>
        </div>
        {/* Mobile Filter Modal */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500"
              onClick={() => setIsFilterOpen(false)}
            />
            {/* Sidebar Modal */}
            <div
              className="relative w-[85%] max-w-sm h-full bg-white shadow-xl transition-transform duration-300 transform translate-x-0 overflow-y-auto"
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
        <div className='flex flex-col md:flex-row gap-6 lg:gap-8'>
          {/* Filter Sidebar (hidden on mobile, visible on md+) */}
          <div className="hidden md:block md:w-1/4 lg:w-1/5 xl:w-1/6 shrink-0">
            <div className="sticky top-4">{FilterSidebar}</div>
          </div>
          {/* Product List & Controls */}
          <main className='flex-1 min-w-0'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4'>
              <div className='text-xl sm:text-2xl font-bold text-gray-800'>
                Product List 
                <span className='text-base font-normal text-gray-500 ml-2'>
                  ({filteredProducts.length || 0})
                </span>
              </div>
              <div className='flex flex-wrap items-center gap-3 sm:gap-4'>
                <div className='flex items-center gap-2 order-2 sm:order-1'>
                  <label className='text-gray-700 text-sm font-medium whitespace-nowrap'>Sort by</label>
                  <select
                    value={sortOrder}
                    onChange={handleSortChange}
                    className='border border-gray-300 rounded-md px-2 py-1.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm min-w-[140px]'
                  >
                    <option value='asc'>Price: Low to High</option>
                    <option value='desc'>Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>
            {isFilterLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {Array(8).fill(null).map((_, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                    <div className="relative h-48 bg-gray-200 animate-pulse rounded-t-2xl"></div>
                    <div className="p-4">
                      <div className="space-y-3">
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        <div className="flex justify-between items-center gap-4">
                          <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
                          <div className="h-10 bg-gray-200 rounded animate-pulse w-1/3"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 14h.01M12 16h.01M12 18h.01M12 20h.01M12 22h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {filteredProducts.map((product: any) => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-md border border-gray-200 p-0 flex flex-col h-full transition hover:shadow-lg">
                    <div className="rounded-t-2xl overflow-hidden">
                      <div className="relative w-full h-48">
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
                        <Link href={`/product/${product.id}`} className="font-roboto  hover:text-orange-600 text-base font-semibold text-gray-800 leading-tight line-clamp-2">
                          {product.name}
                        </Link>
                        <div className="flex justify-between items-center mt-1 relative">
                          {product.rating && (
                            <Rating 
                              value={product.rating} 
                              readOnly 
                              style={{ maxWidth: 80 }}
                            />
                          )}

                        </div>
                      </div>

                      {/* Footer section always at the bottom */}
                      <div className="flex items-center justify-between mt-auto pt-4">
                        <p className="text-lg font-bold text-orange-600">৳{product.price?.toFixed(2)}</p>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="px-2 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors duration-300 text-sm font-semibold flex items-center gap-2"
                        >
                           
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>Add Cart
                        </button>
                      </div>
                    </div>
                  </div> 
                ))}
              </div>
            )}
          </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllProducts
