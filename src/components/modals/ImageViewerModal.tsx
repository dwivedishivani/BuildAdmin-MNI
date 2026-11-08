'use client'

import React from 'react'
import { X, ZoomIn } from 'lucide-react'

interface ImageViewerModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string | null
  caption?: string
  title?: string
}

export function ImageViewerModal({
  isOpen,
  onClose,
  imageUrl,
  caption,
  title,
}: ImageViewerModalProps) {
  if (!isOpen || !imageUrl) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-4xl w-full flex flex-col items-center max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute -top-12 right-0 p-2 rounded-full bg-white/20 hover:bg-white text-black transition-colors"
          aria-label="Close image viewer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Box */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black/50 border border-white/10 max-h-[75vh]">
          <img
            src={imageUrl}
            alt={title || 'MNI creative visual'}
            className="max-h-[75vh] w-auto object-contain rounded-2xl"
          />
        </div>

        {/* Caption */}
        {(title || caption) && (
          <div className="mt-4 text-center text-white max-w-xl px-4 space-y-1">
            {title && <h3 className="text-base font-bold tracking-tight">{title}</h3>}
            {caption && <p className="text-xs text-slate-300 line-clamp-2">{caption}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
