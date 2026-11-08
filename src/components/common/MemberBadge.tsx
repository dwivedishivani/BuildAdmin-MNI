'use client'

import React from 'react'
import { Star, Sparkles } from 'lucide-react'

export type MemberTier = 'starter' | 'pro' | 'premium'

interface MemberBadgeProps {
  tier?: MemberTier | string
  isVerified?: boolean
  showTier?: boolean
  size?: 'sm' | 'md'
}

export function MemberBadge({
  tier = 'pro',
  showTier = true,
}: MemberBadgeProps) {
  const normalizedTier = (tier || 'pro').toLowerCase() as MemberTier

  if (!showTier) return null

  return (
    <div className="inline-flex items-center">
      {/* Tier Badges: Starter, Pro, Premium (Green check button removed) */}
      {normalizedTier === 'premium' && (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
          <Star className="w-2.5 h-2.5 fill-current" />
          <span>Premium</span>
        </span>
      )}

      {normalizedTier === 'pro' && (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#215CE5] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
          <Sparkles className="w-2.5 h-2.5" />
          <span>Pro</span>
        </span>
      )}

      {normalizedTier === 'starter' && (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 text-[10px] font-semibold tracking-wider uppercase">
          <span>Starter</span>
        </span>
      )}
    </div>
  )
}
