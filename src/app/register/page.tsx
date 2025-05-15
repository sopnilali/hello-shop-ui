import Register from '@/components/Modules/Auth/Register'
import React, { Suspense } from 'react'

const RegisterPage = () => {
  return (
    <div>
      <Suspense>
        <Register />
      </Suspense>
    </div>
  )
}

export default RegisterPage 
