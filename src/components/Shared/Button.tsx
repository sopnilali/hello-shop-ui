import React from 'react'

const Button = ({title, type, className, onClick}: {title: string, type: "button" | "submit" | "reset", className?: string, onClick?: () => void}) => {
  return (
    <div>
        <button type={type} className={className} onClick={onClick}>{title}</button>
    </div>
  )
}

export default Button
