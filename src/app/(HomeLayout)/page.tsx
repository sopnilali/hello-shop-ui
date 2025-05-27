import AllProducts from '@/components/Modules/Products/AllProducts'
import BrandsSection from '@/components/Shared/BrandsSection'

import HeroSection from '@/components/Shared/HeroSection'
import React from 'react'
import BannerAds from './Advertisment/BannerAds'
import TrandingMango from '@/components/HomePage/TrandingMango'
import SeasonOffseason from '@/components/HomePage/SeasonOffseason'

const Homepage = () => {
  return (
    <div className=' container mx-auto'>
      <HeroSection />
      <BrandsSection/>
      <BannerAds/>
      <SeasonOffseason/>
      <TrandingMango/>
      {/* <BestPrice/> */}
      {/* <BrandBaseProducts/> */}
    </div>
  )
}

export default Homepage
