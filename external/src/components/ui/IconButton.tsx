import React from 'react'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  active?: boolean
}

export function IconButton({ label, active = false, className = '', children, ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`w-7 h-7 flex items-center justify-center border transition-all duration-100
        focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1
        ${active
          ? 'bg-zinc-900 text-white border-zinc-900'
          : 'text-zinc-400 border-transparent hover:bg-zinc-100 hover:border-zinc-200 hover:text-zinc-900'
        } ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
