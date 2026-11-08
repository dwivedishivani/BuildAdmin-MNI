'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ChevronRight, Sparkles } from 'lucide-react'

export interface BannerItem {
  id: string
  title: string
  subtitle: string
  category: string
  imageUrlFallback?: string | null
  image?: any
  actionLabel?: string
  actionLink?: string
}

interface AdCarouselProps {
  banners: BannerItem[]
  onBannerClick?: (banner: BannerItem) => void
}

export function AdCarousel({ banners, onBannerClick }: AdCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)

  // Maximum 2 to 3 banners
  const displayBanners = banners.slice(0, 3)

  useEffect(() => {
    if (displayBanners.length <= 1 || isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayBanners.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [displayBanners.length, isPaused])

  if (displayBanners.length === 0) return null

  const currentBanner = displayBanners[currentIndex]

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX

    if (diff > 40) {
      setCurrentIndex((prev) => (prev + 1) % displayBanners.length)
    } else if (diff < -40) {
      setCurrentIndex((prev) => (prev - 1 + displayBanners.length) % displayBanners.length)
    }
    touchStartX.current = null
  }

  const imageUrl =
    currentBanner.image?.url ||
    currentBanner.imageUrlFallback ||
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden shadow-sm bg-[#102C60] text-white transition-all group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-40 sm:h-44 w-full flex items-end p-5">
        {/* Backdrop imagery with cinematic subtle gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src={imageUrl}
            alt={currentBanner.title}
            className="w-full h-full object-cover opacity-40 transition-transform duration-700 ease-out group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#102C60] via-[#102C60]/75 to-transparent" />
        </div>

        {/* Content information */}
        <div className="relative z-10 w-full flex justify-between items-end">
          <div className="space-y-1 max-w-[78%]">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[9px] font-bold tracking-widest uppercase text-blue-100">
              {currentBanner.category || 'PROMOTIONAL'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white line-clamp-1">
              {currentBanner.title}
            </h3>
            <p className="text-xs text-slate-300 line-clamp-1 font-normal">
              {currentBanner.subtitle}
            </p>
          </div>

          <button
            onClick={() => onBannerClick?.(currentBanner)}
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-[#215CE5] text-white transition-all backdrop-blur-sm self-end active:scale-95"
            aria-label="View promotional details"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="absolute top-3.5 right-4 z-10 flex space-x-1.5 bg-black/25 backdrop-blur-md px-2 py-1 rounded-full">
          {displayBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              type="button"
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
