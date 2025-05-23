'use client'

import React from 'react'
import { toast } from 'sonner'

const customToast = (message: string, type: 'success' | 'error' | 'warning' | 'info', toastId: string) => {
  if(toastId){
    return toast[type](message, {
      id: toastId,
      style: {
        backgroundColor: "#ff4500",
        color: "white",
        fontSize: "16px",
        fontWeight: "bold",
        textAlign: "center",
      },
    })
  }

    return toast[type](message, {
        id: toastId,
        style: {
          backgroundColor: "#ff4500",
          color: "white",
          fontSize: "16px",
          fontWeight: "bold",
          textAlign: "center",
        },
      })
}

export default customToast
