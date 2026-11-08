'use client'

import React, { useState } from 'react'
import { Plus, Eye, Send, Image as ImageIcon, FileText, CheckCircle2 } from 'lucide-react'
import { TaggedMemberData } from '../modals/MemberInfoModal'

interface PostComposerProps {
  members: TaggedMemberData[]
  onPostCreated: () => void
}

export function PostComposer({ members, onPostCreated }: PostComposerProps) {
  const [postType, setPostType] = useState<'text_only' | 'image_only' | 'image_text'>('image_text')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Opportunity')
  const [badgeText, setBadgeText] = useState('OPPORTUNITY')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [taggedMemberId, setTaggedMemberId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          postType,
          category,
          badgeText: badgeText || undefined,
          content: content || undefined,
          imageUrlFallback: imageUrl || undefined,
          taggedMemberId: taggedMemberId || undefined,
        }),
      })

      if (!res.ok) throw new Error('Failed to create post')

      setSuccess(true)
      setTitle('')
      setContent('')
      setImageUrl('')
      onPostCreated()
      setTimeout(() => setSuccess(false), 2000)
    } catch (err: any) {
      alert(err.message || 'Error publishing post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedMember = members.find((m) => m.id === taggedMemberId)

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-[#102C60]">Admin Timeline Post Publishing</h3>
          <p className="text-xs text-slate-500">
            Publish directly to the member Home timeline as an authorized MNI Administrator.
          </p>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          type="button"
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          <Eye className="w-3.5 h-3.5 text-[#215CE5]" />
          <span>{showPreview ? 'Hide Preview' : 'Mobile Preview'}</span>
        </button>
      </div>

      {success && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-[#215CE5] text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Post published successfully to the member timeline.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Post Type Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Choose Post Format</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { type: 'image_text', label: 'Image + Text', desc: 'Creative banner & body' },
              { type: 'image_only', label: 'Image Only', desc: 'Promotional creative' },
              { type: 'text_only', label: 'Text Only', desc: 'Announcement or RFP' },
            ].map((fmt) => (
              <button
                key={fmt.type}
                type="button"
                onClick={() => setPostType(fmt.type as any)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  postType === fmt.type
                    ? 'border-[#215CE5] bg-[#EAF0FC]/60 text-[#102C60] shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <span className="block text-xs font-bold">{fmt.label}</span>
                <span className="block text-[10px] text-slate-400">{fmt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Post Title / Headline *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Looking for a local print partner for upcoming brand launch"
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none"
          />
        </div>

        {/* Category & Badge */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Category Tag</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                setBadgeText(e.target.value.toUpperCase())
              }}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
            >
              <option value="Opportunity">Opportunity</option>
              <option value="Requirement">Requirement</option>
              <option value="Announcement">Announcement</option>
              <option value="Promotion">Promotion</option>
              <option value="Member Spotlight">Member Spotlight</option>
              <option value="Community Meetup">Community Meetup</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Badge Text (Optional)</label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="e.g. BUILT BY MEMBERS"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>
        </div>

        {/* Tagged Network Member (Promotes a member) */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            Tag Network Member (Featured Member for 'Info' and 'Request' actions)
          </label>
          <select
            value={taggedMemberId}
            onChange={(e) => setTaggedMemberId(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
          >
            <option value="">No member tagged (General MNI Announcement)</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.fullName} • {m.businessName} ({m.city})
              </option>
            ))}
          </select>
        </div>

        {/* Image URL (for image_only and image_text) */}
        {postType !== 'text_only' && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Creative Artwork / Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>
        )}

        {/* Content Body (for text_only and image_text) */}
        {postType !== 'image_only' && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Detailed Copy / Body Description</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide context, parameters, and instructions for interested members..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none resize-none"
            />
          </div>
        )}

        {/* Live Preview Box */}
        {showPreview && (
          <div className="p-4 bg-[#F3F6F8] rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Live Timeline Card Preview
            </span>
            <div className="max-w-md mx-auto bg-white rounded-2xl border p-4 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                <div className="w-5 h-5 rounded bg-[#102C60] text-white flex items-center justify-center text-[9px] font-bold">
                  {selectedMember ? selectedMember.avatarInitials : 'MNI'}
                </div>
                <span>MNI Admin {selectedMember ? `• Featuring ${selectedMember.fullName}` : ''}</span>
              </div>
              <h4 className="text-sm font-bold text-[#102C60]">{title || 'Post Title Headline'}</h4>
              {postType !== 'text_only' && (
                <div className="h-32 bg-slate-200 rounded-xl overflow-hidden flex items-center justify-center text-xs text-slate-400">
                  {imageUrl ? (
                    <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <span>Creative Image Banner</span>
                  )}
                </div>
              )}
              {content && <p className="text-xs text-slate-600 line-clamp-2">{content}</p>}
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#215CE5] hover:bg-[#102C60] text-white text-xs font-semibold shadow-md shadow-[#215CE5]/20 disabled:opacity-60 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Publishing...' : 'Publish to Live Timeline'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
