'use client'

import React from 'react'

interface FilterChipsProps {
  activeCategory: string
  onSelectCategory: (category: string) => void
}

const CATEGORIES = ['All', 'Opportunity', 'Requirement', 'Member Spotlight', 'Community Meetup']

export function FilterChips({ activeCategory, onSelectCategory }: FilterChipsProps) {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            type="button"
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
              isActive
                ? 'bg-[#102C60] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70'
            }`}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
