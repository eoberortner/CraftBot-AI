'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ArrowLeft, Beer } from 'lucide-react'

interface NavigationProps {
  title?: string
  showBackButton?: boolean
  backHref?: string
  backLabel?: string
}

export default function Navigation({ 
  title, 
  showBackButton = true, 
  backHref = '/', 
  backLabel = 'Home' 
}: NavigationProps) {
  const pathname = usePathname()
  
  // Don't show navigation on home page
  if (pathname === '/') {
    return null
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Back button and title */}
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Link 
                href={backHref}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">{backLabel}</span>
              </Link>
            )}
            
            {title && (
              <>
                {showBackButton && <div className="h-6 w-px bg-gray-300" />}
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              </>
            )}
          </div>

          {/* Right side - Brand and Home */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <Beer className="w-6 h-6" />
              <span className="text-lg font-bold">CraftBot</span>
            </Link>
            
            {pathname !== '/' && (
              <Link 
                href="/"
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

// Breadcrumb component for more complex navigation
export function Breadcrumb({ items }: { items: Array<{ label: string, href?: string }> }) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            
            {item.href ? (
              <Link 
                href={item.href}
                className="ml-1 text-sm font-medium text-gray-500 hover:text-gray-700 md:ml-2"
              >
                {item.label}
              </Link>
            ) : (
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
