
import UserProfile from '@/components/Modules/User/UserProfile'
import React from 'react'


export const metadata = {
  title: 'Profile',
  description: 'View and manage your profile settings, orders, wishlist and payment methods.',
}


const ProfilePage = () => {




  return (
    <div>
      <UserProfile />
    </div>
  )
}

export default ProfilePage
