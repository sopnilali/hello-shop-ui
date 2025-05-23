'use client'

import React, { useEffect } from 'react'
import Footer from '../Shared/Footer'
import Navbar from '../Shared/Navbar'


export const usePageMeta = ({ title, description }: { title: string, description: string }) => {
  useEffect(() => {
    document.title = title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }
  }, [title, description]);
}

const LayoutWraper = ({ children }: { children: React.ReactNode }) => {

  return (
    <div>
        <Navbar />
        <main className='min-h-screen'>{children}</main>
      <Footer />
    </div>
  )
}

export default LayoutWraper
