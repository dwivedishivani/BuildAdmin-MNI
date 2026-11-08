'use client'

import React, { useState } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { BottomNav } from '@/components/layout/BottomNav'
import { ArrowLeft, Send, CheckCircle2, ShieldAlert, Sparkles, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

export default function SubmitRequirementPage() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Business Requirement')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          description,
          supportingImageUrl: imageUrl,
          submittedByName: 'Shivani Dwivedi',
          submittedByEmail: 'shivani@example.com',
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit requirement')

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Error sending submission')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F6F8] pb-28">
      <AppHeader />

      <main className="max-w-xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-white border border-slate-200/80 text-slate-600 hover:text-[#102C60] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#215CE5]">
              Member Submissions
            </span>
            <h1 className="text-xl font-bold text-[#102C60]">Send it to MNI. Not to the timeline.</h1>
          </div>
        </div>

        {/* Clear Policy Banner */}
        <div className="p-4 rounded-2xl bg-[#EAF0FC] border border-blue-100 flex items-start space-x-3 text-xs text-[#102C60]">
          <ShieldAlert className="w-5 h-5 text-[#215CE5] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Reviewed before publication</span>
            <p className="text-slate-600 leading-relaxed">
              Only MNI Admin can create and publish timeline posts. Your submission is received in the admin review queue. Admin can approve, reject, or request changes before any post appears on the live timeline.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-[#215CE5] rounded-full flex items-center justify-center mx-auto ring-8 ring-blue-50/50">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#102C60]">Requirement Submitted to Admin</h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Status is set to <span className="font-semibold text-[#215CE5]">Pending Approval</span>. You can track admin review feedback or view other opportunities while our team reviews the parameters.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-center space-x-3">
              <Link
                href="/"
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Return to Home
              </Link>
              <Link
                href="/rewards"
                className="px-5 py-2.5 rounded-xl bg-[#215CE5] hover:bg-[#102C60] text-white text-xs font-semibold shadow-md shadow-[#215CE5]/20 transition-all"
              >
                Explore Chapter Rewards
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label htmlFor="title" className="block text-xs font-semibold text-slate-700">
                Your Requirement or Proposed Announcement *
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Describe your business need, vendor request, or announcement"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] focus:ring-2 focus:ring-[#215CE5]/20 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label htmlFor="category" className="block text-xs font-semibold text-slate-700">
                Requirement Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none bg-white"
              >
                <option value="Business Requirement">Business Requirement</option>
                <option value="Vendor / Supplier Needed">Vendor / Supplier Needed</option>
                <option value="Business Opportunity">Business Opportunity</option>
                <option value="Offer / Announcement">Offer / Announcement</option>
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label htmlFor="desc" className="block text-xs font-semibold text-slate-700">
                Detailed Context & Specifications *
              </label>
              <textarea
                id="desc"
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include key details such as scope, desired timeline, certifications, target volumes, or location specifications..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] focus:ring-2 focus:ring-[#215CE5]/20 outline-none transition-all placeholder:text-slate-400 resize-none"
              />
            </div>

            {/* Optional Supporting Image */}
            <div className="space-y-1.5">
              <label htmlFor="img" className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Attach Supporting Image (Optional)</span>
                <span className="text-[10px] text-slate-400">Artwork or poster URL</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="img"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none placeholder:text-slate-400"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Optional supporting material for the admin team. Admin will decide formatting (image vs text) during publication.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 p-3.5 rounded-xl bg-[#215CE5] hover:bg-[#102C60] disabled:opacity-60 text-white text-xs font-bold shadow-md shadow-[#215CE5]/20 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending to Admin...' : 'Submit to MNI Admin'}</span>
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-2">
                Status after submission: <span className="font-semibold text-slate-600">Pending Approval</span>. Only admin controls the final timeline post.
              </p>
            </div>
          </form>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
