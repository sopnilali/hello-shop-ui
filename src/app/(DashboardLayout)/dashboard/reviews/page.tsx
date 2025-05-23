import ManageReviews from '@/components/DashboardLayout/Reviews/ManageReviews'
import React, { Suspense } from 'react'

const ReviewsPages = () => {
  return (
    <div>
      <Suspense>
        <ManageReviews />
      </Suspense>
    </div>
  )
}

export default ReviewsPages
