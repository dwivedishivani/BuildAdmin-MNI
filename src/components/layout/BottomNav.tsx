'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Gift, User, Plus } from 'lucide-react'

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Requests', href: '/requests', icon: Users },
    { label: 'Submit', href: '/submit', icon: Plus, isHighlight: true },
    { label: 'Refer & Earn', href: '/refer', icon: Gift },
    { label: 'Profile', href: '/profile', icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/70 px-3 pt-1.5 pb-[max(env(safe-area-inset-bottom),0.65rem)] shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
      <div className="max-w-2xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          if (item.isHighlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center group -mt-4 active:scale-95 transition-transform"
                title="Submit Business Requirement to Admin"
              >
                <div className="w-12 h-12 rounded-full bg-[#215CE5] text-white flex items-center justify-center shadow-lg shadow-[#215CE5]/30 group-hover:bg-[#102C60] transition-colors border-2 border-white">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold text-[#215CE5] mt-0.5">Submit</span>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all active:scale-95 ${
                isActive ? 'text-[#215CE5] font-semibold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.4px]' : 'stroke-[1.8px]'}`} />
              <span className="text-[10px] sm:text-[11px]">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
