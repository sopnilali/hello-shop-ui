'use client'

import React, { useEffect } from 'react'
import Footer from '../Shared/Footer'
import Navbar from '../Shared/Navbar'


const LayoutWraper = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className='px-2 sm:px-4 lg:px-4'>
        <Navbar />
        <main className='min-h-screen'>{children}</main>
      <Footer />
    </div>
  )
}

export default LayoutWraper
