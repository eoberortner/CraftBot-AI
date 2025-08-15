'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageCircle, X, Sparkles } from 'lucide-react'

export default function FloatingChatButton() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Button */}
      <div className="relative">
        {/* Pulse animation for attention */}
        <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-75"></div>
        
        {/* Main button */}
        <Link href="/chat">
          <div className="relative bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 group">
            <MessageCircle className="w-6 h-6" />
            
            {/* Tooltip */}
            <div className="absolute bottom-16 right-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              Ask CraftBot AI
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
            
            {/* Sparkle indicator */}
            <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
              <Sparkles className="w-3 h-3 text-yellow-800" />
            </div>
          </div>
        </Link>
        
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -left-2 bg-gray-400 hover:bg-gray-500 text-white rounded-full p-1 text-xs transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
