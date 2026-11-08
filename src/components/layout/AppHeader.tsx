'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { NotificationsModal } from '../modals/NotificationsModal'

interface AppHeaderProps {
  unreadCount?: number
  onNotificationClick?: () => void
}

export function AppHeader({ unreadCount: initialCount, onNotificationClick }: AppHeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [count, setCount] = useState(initialCount ?? 1)

  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const res = await fetch('/api/notifications')
        if (res.ok) {
          const data = await res.json()
          if (typeof data.unreadCount === 'number') {
            setCount(data.unreadCount)
          }
        }
      } catch {
        // Keep fallback count
      }
    }
    checkNotifications()
  }, [])

  const handleBellClick = () => {
    if (onNotificationClick) {
      onNotificationClick()
    } else {
      setIsNotificationsOpen(true)
    }
  }

  return (
    <>
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 transition-all pt-[max(env(safe-area-inset-top),0.75rem)] pb-3 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        {/* Left: ONLY MNI LOGO WITH TEXT MNI */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-xl overflow-hidden shadow-sm shadow-[#102C60]/15 ring-1 ring-slate-200/60 flex-shrink-0 bg-[#0B224E]">
            <img
              src="/mni-logo.png"
              alt="MNI Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-extrabold tracking-tight text-[#102C60] text-base leading-none">
            MNI
          </span>
        </Link>

        {/* Right: ONLY BELL BUTTON */}
        <button
          onClick={handleBellClick}
          type="button"
          className="relative p-2 text-slate-600 hover:text-[#102C60] hover:bg-slate-100 rounded-full transition-colors active:scale-95"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {count > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#215CE5] rounded-full ring-2 ring-white" />
          )}
        </button>
      </div>
    </header>

    <NotificationsModal
      isOpen={isNotificationsOpen}
      onClose={() => setIsNotificationsOpen(false)}
    />
    </>
  )
}
