import AllProducts from '@/components/Modules/Products/AllProducts'
import BrandsSection from '@/components/Shared/BrandsSection'

import HeroSection from '@/components/Shared/HeroSection'
import React from 'react'
import BannerAds from './Advertisment/BannerAds'
import TopProducts from '@/components/HomePage/TopProducts'

const Homepage = () => {
  return (
    <div>
      <HeroSection />
      <BrandsSection/>
      <BannerAds/>
      <TopProducts/>
      {/* <BestPrice/> */}
      {/* <BrandBaseProducts/> */}
    </div>
  )
}

export default Homepage
