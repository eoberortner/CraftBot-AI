'use client'

import { Loader2, Search, BarChart3, FileText, Beaker, Clock } from 'lucide-react'

export type LoadingType = 'search' | 'analysis' | 'scraping' | 'calculation' | 'export' | 'generic'

interface LoadingStateProps {
  type?: LoadingType
  message?: string
  progress?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

export default function LoadingState({ 
  type = 'generic',
  message,
  progress,
  className = '',
  size = 'md',
  showIcon = true
}: LoadingStateProps) {
  
  const getLoadingConfig = (loadingType: LoadingType) => {
    switch (loadingType) {
      case 'search':
        return {
          icon: Search,
          defaultMessage: 'Searching breweries...',
          color: 'text-blue-600'
        }
      case 'analysis':
        return {
          icon: BarChart3,
          defaultMessage: 'Analyzing market data...',
          color: 'text-green-600'
        }
      case 'scraping':
        return {
          icon: Beaker,
          defaultMessage: 'Gathering brewery information...',
          color: 'text-purple-600'
        }
      case 'calculation':
        return {
          icon: Clock,
          defaultMessage: 'Processing calculations...',
          color: 'text-orange-600'
        }
      case 'export':
        return {
          icon: FileText,
          defaultMessage: 'Preparing export...',
          color: 'text-indigo-600'
        }
      default:
        return {
          icon: Loader2,
          defaultMessage: 'Loading...',
          color: 'text-gray-600'
        }
    }
  }

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return {
          spinner: 'w-4 h-4',
          text: 'text-sm',
          container: 'p-2'
        }
      case 'lg':
        return {
          spinner: 'w-8 h-8',
          text: 'text-lg',
          container: 'p-8'
        }
      default:
        return {
          spinner: 'w-6 h-6',
          text: 'text-base',
          container: 'p-4'
        }
    }
  }

  const config = getLoadingConfig(type)
  const sizeClasses = getSizeClasses(size)
  const Icon = config.icon
  const displayMessage = message || config.defaultMessage

  return (
    <div className={`flex items-center justify-center ${sizeClasses.container} ${className}`}>
      <div className="text-center">
        {showIcon && (
          <div className="flex justify-center mb-2">
            {type === 'generic' ? (
              <Loader2 className={`${sizeClasses.spinner} ${config.color} animate-spin`} />
            ) : (
              <Icon className={`${sizeClasses.spinner} ${config.color} animate-pulse`} />
            )}
          </div>
        )}
        
        <p className={`${config.color} ${sizeClasses.text} font-medium`}>
          {displayMessage}
        </p>
        
        {progress !== undefined && (
          <div className="mt-3 w-48 mx-auto">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${config.color.replace('text-', 'bg-')}`}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Full-page loading overlay
interface LoadingOverlayProps {
  isLoading: boolean
  type?: LoadingType
  message?: string
  progress?: number
}

export function LoadingOverlay({ isLoading, type, message, progress }: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg">
        <LoadingState 
          type={type}
          message={message}
          progress={progress}
          size="lg"
          className="min-w-[300px]"
        />
      </div>
    </div>
  )
}

// Inline skeleton loader for content
export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  )
}

// Loading states for specific data types
export function BreweryListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
          <div className="flex space-x-4">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="flex-1 h-2 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
