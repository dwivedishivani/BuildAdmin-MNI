'use client'

import React, { useState } from 'react'
import { BannerItem } from '../timeline/AdCarousel'
import { Plus, Check, Trash2 } from 'lucide-react'

interface BannerManagerProps {
  banners: BannerItem[]
  onUpdate: () => void
}

export function BannerManager({ banners, onUpdate }: BannerManagerProps) {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [category, setCategory] = useState('SPONSORED')
  const [imageUrl, setImageUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle,
          category,
          imageUrlFallback: imageUrl,
        }),
      })

      if (!res.ok) throw new Error('Failed to create banner')

      setTitle('')
      setSubtitle('')
      setImageUrl('')
      onUpdate()
    } catch (err: any) {
      alert(err.message || 'Error saving banner')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-base font-bold text-[#102C60]">Home Top Banner Placements</h3>
        <p className="text-xs text-slate-500">
          Curate the carousel of 2 to 3 featured ad banners at the top of the member Home screen.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {banners.slice(0, 3).map((b, idx) => (
          <div
            key={b.id}
            className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 p-3 space-y-2"
          >
            <div className="h-20 bg-slate-800 rounded-xl overflow-hidden relative">
              <img
                src={b.imageUrlFallback || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'}
                alt={b.title}
                className="w-full h-full object-cover opacity-60"
              />
              <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white uppercase">
                Slot {idx + 1}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#215CE5] uppercase">{b.category}</span>
              <h4 className="text-xs font-bold text-[#102C60] line-clamp-1">{b.title}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-1">{b.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {banners.length < 3 && (
        <form onSubmit={handleAddBanner} className="space-y-3 pt-3 border-t border-slate-100">
          <span className="text-xs font-bold text-[#102C60] block">Add New Banner Placement</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Banner Title"
              className="text-xs p-2.5 rounded-xl border border-slate-200"
            />
            <input
              type="text"
              required
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Subtitle"
              className="text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category (e.g. SPONSORED)"
              className="text-xs p-2.5 rounded-xl border border-slate-200"
            />
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL"
              className="text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#215CE5] text-white rounded-xl text-xs font-semibold disabled:opacity-60"
          >
            {isSubmitting ? 'Adding...' : 'Add Placement'}
          </button>
        </form>
      )}
    </div>
  )
}
