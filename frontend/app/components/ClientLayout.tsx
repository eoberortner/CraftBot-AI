'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import ChatSidebar, { FloatingChatButton } from './ChatSidebar'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const pathname = usePathname()
  
  // Don't show floating chat button on the main chat page
  const showFloatingChat = pathname !== '/chat'

  return (
    <>
      {children}
      {showFloatingChat && (
        <>
          <FloatingChatButton onClick={() => setIsChatOpen(true)} />
          <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
      )}
    </>
  )
}
