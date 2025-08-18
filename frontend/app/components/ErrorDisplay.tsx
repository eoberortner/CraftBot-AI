'use client'

import { AlertCircle, RefreshCw, WifiOff, Server, AlertTriangle, Info } from 'lucide-react'

export type ErrorType = 'network' | 'server' | 'validation' | 'not-found' | 'timeout' | 'generic'

interface ErrorDisplayProps {
  error: string
  type?: ErrorType
  onRetry?: () => void
  className?: string
  showDetails?: boolean
}

export default function ErrorDisplay({ 
  error, 
  type = 'generic', 
  onRetry, 
  className = '',
  showDetails = false 
}: ErrorDisplayProps) {
  
  const getErrorConfig = (errorType: ErrorType) => {
    switch (errorType) {
      case 'network':
        return {
          icon: WifiOff,
          title: 'Connection Error',
          color: 'text-orange-500',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          suggestion: 'Check your internet connection and try again.'
        }
      case 'server':
        return {
          icon: Server,
          title: 'Server Error',
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          suggestion: 'Our servers are experiencing issues. Please try again in a moment.'
        }
      case 'validation':
        return {
          icon: AlertTriangle,
          title: 'Input Error',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          suggestion: 'Please check your input and try again.'
        }
      case 'not-found':
        return {
          icon: Info,
          title: 'No Results Found',
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          suggestion: 'Try adjusting your search criteria.'
        }
      case 'timeout':
        return {
          icon: AlertCircle,
          title: 'Request Timeout',
          color: 'text-purple-500',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          suggestion: 'The request is taking longer than expected. Please try again.'
        }
      default:
        return {
          icon: AlertCircle,
          title: 'Error',
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          suggestion: 'An unexpected error occurred.'
        }
    }
  }

  const config = getErrorConfig(type)
  const Icon = config.icon

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <Icon className={`w-5 h-5 ${config.color} mr-3 mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          <h3 className={`${config.color} font-medium text-sm`}>
            {config.title}
          </h3>
          <p className="text-gray-700 text-sm mt-1">
            {error}
          </p>
          {config.suggestion && (
            <p className="text-gray-600 text-xs mt-2">
              {config.suggestion}
            </p>
          )}
          
          {showDetails && process.env.NODE_ENV === 'development' && (
            <details className="mt-3">
              <summary className="text-xs text-gray-500 cursor-pointer">
                Technical Details
              </summary>
              <pre className="text-xs text-gray-600 mt-1 bg-white p-2 rounded border overflow-auto">
                {JSON.stringify({ error, type, timestamp: new Date().toISOString() }, null, 2)}
              </pre>
            </details>
          )}
          
          {onRetry && (
            <button
              onClick={onRetry}
              className={`mt-3 inline-flex items-center text-sm ${config.color} hover:underline`}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Utility function to determine error type from error message
export function classifyError(error: string | Error): ErrorType {
  const message = typeof error === 'string' ? error.toLowerCase() : error.message.toLowerCase()
  
  if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
    return 'network'
  }
  if (message.includes('500') || message.includes('server') || message.includes('internal')) {
    return 'server'
  }
  if (message.includes('400') || message.includes('validation') || message.includes('invalid')) {
    return 'validation'
  }
  if (message.includes('404') || message.includes('not found') || message.includes('no results')) {
    return 'not-found'
  }
  if (message.includes('timeout') || message.includes('slow')) {
    return 'timeout'
  }
  
  return 'generic'
}
