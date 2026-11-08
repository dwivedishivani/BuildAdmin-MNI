'use client'

import React, { useState } from 'react'
import { X, Send, User, CheckCircle2, AlertCircle } from 'lucide-react'
import { TaggedMemberData } from './MemberInfoModal'
import { MemberBadge } from '../common/MemberBadge'

interface ContactRequestModalProps {
  isOpen: boolean
  onClose: () => void
  member: TaggedMemberData | null
  postId?: string
  onSuccess?: () => void
}

export function ContactRequestModal({
  isOpen,
  onClose,
  member,
  postId,
  onSuccess,
}: ContactRequestModalProps) {
  const [agendaNote, setAgendaNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen || !member) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: postId || null,
          targetMemberId: member.id,
          targetMemberName: member.fullName,
          targetMemberRole: member.businessCategory,
          targetMemberEmail: member.email,
          targetMemberPhone: member.phone,
          agendaNote,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit contact request')

      setSubmitted(true)
      onSuccess?.()
      setTimeout(() => {
        setSubmitted(false)
        setAgendaNote('')
        onClose()
      }, 1800)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102C60]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#EAF0FC] text-[#215CE5] flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#102C60]">Request Contact Details</h3>
              <p className="text-[11px] text-slate-500">Initiate MNI Business Introduction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-blue-50 text-[#215CE5] rounded-full flex items-center justify-center mx-auto ring-8 ring-blue-50/50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-[#102C60]">Contact Request Sent</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your request for {member.fullName} has been recorded in <span className="font-semibold text-slate-700">My Requests</span>. The MNI admin team will connect you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Target Candidate Pill */}
            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#102C60] text-white font-bold text-xs flex items-center justify-center">
                  {member.avatarInitials}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#102C60]">{member.fullName}</h4>
                  <p className="text-[11px] text-slate-500">{member.businessName}</p>
                </div>
              </div>
              <MemberBadge tier={member.tier || 'pro'} />
            </div>

            {/* Prompt Requirement: Textarea for Requirements / Agenda */}
            <div className="space-y-1.5">
              <label htmlFor="agenda" className="block text-xs font-semibold text-slate-700">
                Any specific requirements or agenda? (Optional)
              </label>
              <textarea
                id="agenda"
                rows={4}
                value={agendaNote}
                onChange={(e) => setAgendaNote(e.target.value)}
                placeholder="e.g. Looking to collaborate on a new commercial design RFP, or need pricing for 500 units..."
                className="w-full text-xs text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] focus:ring-2 focus:ring-[#215CE5]/20 outline-none transition-all placeholder:text-slate-400 resize-none bg-slate-50/50 focus:bg-white"
              />
              <p className="text-[11px] text-slate-400">
                Adding context helps the admin team prioritize and coordinate a tailored introduction.
              </p>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#215CE5] hover:bg-[#102C60] disabled:opacity-60 text-white text-xs font-semibold shadow-md shadow-[#215CE5]/20 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending Request...' : 'Submit Request'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
