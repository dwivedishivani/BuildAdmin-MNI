'use client'

import React from 'react'
import { Info, UserCheck, Maximize2 } from 'lucide-react'
import { TaggedMemberData } from '../modals/MemberInfoModal'
import { MemberBadge, MemberTier } from '../common/MemberBadge'

export interface PostItem {
  id: string
  title: string
  postType: 'image_only' | 'text_only' | 'image_text'
  category: string
  badgeText?: string | null
  content?: string | null
  image?: any
  imageUrlFallback?: string | null
  taggedMember?: TaggedMemberData | null
  publishedAt?: string
  displayOrder?: number
}

interface TimelineCardProps {
  post: PostItem
  onInfoClick: (post: PostItem) => void
  onRequestClick: (post: PostItem) => void
  onExpandClick?: (imageUrl: string, title: string, caption?: string) => void
  isRequested?: boolean
}

export function TimelineCard({
  post,
  onInfoClick,
  onRequestClick,
  onExpandClick,
  isRequested = false,
}: TimelineCardProps) {
  const isImageOnly = post.postType === 'image_only'
  const isTextOnly = post.postType === 'text_only'
  const isHybrid = post.postType === 'image_text'

  const imageUrl = post.image?.url || post.imageUrlFallback
  const taggedMember = post.taggedMember

  return (
    <article className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden transition-colors hover:border-slate-300">
      {/* 1. Subtle, light header: "Posted by MNI Admin" & category pill */}
      <div className="px-5 sm:px-7 pt-5 pb-3 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-400">
          Posted by MNI Admin
        </span>

        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/50">
          {post.category}
        </span>
      </div>

      {/* 2. Main Media & Creative Content */}
      <div className="px-5 sm:px-7 pb-5 space-y-4">
        {/* Clean visual image without repetitive clunky overlay boxes */}
        {!isTextOnly && imageUrl && (
          <div className="relative rounded-xl overflow-hidden aspect-[16/9] lg:aspect-[2/1] bg-slate-100 group">
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.01]"
              loading="lazy"
            />
          </div>
        )}

        {/* Post Title Headline */}
        <h3 className="text-lg sm:text-xl font-semibold text-[#102C60] leading-snug">
          {post.title}
        </h3>

        {/* Post Content (if hybrid or text_only) */}
        {!isImageOnly && post.content && (
          <p className="max-w-4xl text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
            {post.content}
          </p>
        )}

        {/* 3. Clean Tagged Member Strip: Avatar, Name, Verified Checkmark & Tier Badge */}
        {taggedMember && (
          <div
            onClick={() => onInfoClick(post)}
            className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100/80 cursor-pointer hover:bg-slate-100/70 transition-colors"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onInfoClick(post)
            }}
            aria-label="View member details"
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#102C60] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-xs">
                {taggedMember.avatarInitials || 'MN'}
              </div>
              <div className="flex items-center space-x-2 truncate">
                <span className="text-xs font-bold text-[#102C60] truncate">
                  {taggedMember.fullName}
                </span>
                <MemberBadge
                  tier={taggedMember.tier || 'pro'}
                  isVerified={taggedMember.isVerified !== false}
                  showTier={true}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Action Buttons Bar: Info, Request, and Expand Image (image only) */}
      <div className="px-5 sm:px-7 py-3 border-t border-slate-100 flex items-center justify-end gap-2">
        <div className="flex items-center space-x-2">
          {/* Info Button */}
          {taggedMember && <button
            onClick={() => onInfoClick(post)}
            type="button"
            className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-[#102C60] hover:bg-[#EAF0FC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#215CE5] focus-visible:ring-offset-2"
          >
            <Info className="w-3.5 h-3.5 text-[#215CE5]" />
            <span>Info</span>
          </button>}

          {/* Request Contact Button */}
          {taggedMember && <button
            onClick={() => onRequestClick(post)}
            type="button"
            className={`inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#215CE5] focus-visible:ring-offset-2 ${
              isRequested
                ? 'bg-slate-100 text-slate-700'
                : 'bg-[#215CE5] hover:bg-[#102C60] text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{isRequested ? 'Requested' : 'Request'}</span>
          </button>}
        </div>

        {/* Expand Image Button: strictly hidden for text-only posts */}
        {!isTextOnly && imageUrl && onExpandClick && (
          <button
            onClick={() => onExpandClick(imageUrl, post.title, post.content || '')}
            type="button"
            className="inline-flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-[#102C60] hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#215CE5] focus-visible:ring-offset-2"
            title="Expand Image"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Expand</span>
          </button>
        )}
      </div>
    </article>
  )
}
