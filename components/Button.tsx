'use client'

import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  className?: string
  href?: string
}

export default function Button({ children, onClick, variant = 'primary', className = '', href }: ButtonProps) {
  const baseStyles = 'inline-block px-8 py-3 font-semibold rounded-lg transition-all duration-200 text-center'

  const variantStyles = {
    primary: 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white hover:opacity-90 hover:scale-105',
    secondary: 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-2 border-[var(--border-color)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)]'
  }

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${className}`

  if (href) {
    return (
      <a href={href} className={combinedStyles} onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={combinedStyles}>
      {children}
    </button>
  )
}
