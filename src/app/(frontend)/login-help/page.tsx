'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { AppHeader } from '@/components/layout/AppHeader'
import { ArrowLeft, Send, CheckCircle2, ShieldCheck, Phone, Mail, Building2, User, MessageSquare } from 'lucide-react'

export default function RequestLoginDetailsPage() {
  const [fullName, setFullName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [requestReason, setRequestReason] = useState('new_credentials')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !contactPhone || !contactEmail) return
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/login-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactIdentifier: `${fullName} • ${contactEmail} • ${contactPhone}`,
          issueType: requestReason === 'new_credentials' ? 'admin_assisted' : 'forgot_password',
          details: `Enterprise: ${businessName || 'N/A'}. Reason: ${requestReason}. Additional Notes: ${notes || 'None'}`,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch request')

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Error submitting request')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F6F8] pb-16 text-[#12233E]">
      <AppHeader />

      <main className="max-w-md mx-auto px-4 sm:px-6 pt-5 space-y-5">
        <Link
          href="/login"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-[#102C60] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>

        {submitted ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 bg-blue-50 text-[#215CE5] rounded-full flex items-center justify-center mx-auto ring-8 ring-blue-50/50">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-[#102C60]">Request Dispatched to Admin</h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-slate-700">{fullName}</span>. The MNI administration team has received your contact details.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 text-left space-y-1">
              <span className="font-bold text-[#102C60] block text-[11px] uppercase tracking-wider">
                What happens next:
              </span>
              <p className="text-[11px] text-slate-500">
                MNI Admin will verify your membership records and send your official Login ID and Password directly to your phone ({contactPhone}) and email ({contactEmail}).
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                className="w-full py-3 rounded-xl bg-[#215CE5] hover:bg-[#102C60] text-white text-xs font-bold shadow-md block transition-all"
              >
                Return to Login Page
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#215CE5]">
                Admin Credential Provisioning
              </span>
              <h1 className="text-xl font-bold text-[#102C60]">Request Login Details</h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provide your contact coordinates. MNI Admin will verify your membership and provide your login ID & password directly to your contact.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Vikram Malhotra"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Contact Phone Number (For SMS / WhatsApp Credentials) *
              </label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Work / Business Email Address *
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="name@business.com"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Enterprise / Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Malhotra Precision Tooling"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">Nature of Request *</label>
              <select
                value={requestReason}
                onChange={(e) => setRequestReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="new_credentials">Request New Member Login ID & Password</option>
                <option value="forgot_password">Lost Existing Password / Need Access Reset</option>
                <option value="verification_status">Inquire on Membership Verification Status</option>
                <option value="other">Other Admin Inquiry</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Notes or Context for Admin (Optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any details on your chapter, previous meetup attendance, or sponsor..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none resize-none"
              />
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl text-[11px] text-[#102C60] leading-snug">
              Credentials are issued only by MNI Administration after verification. No self-registration is permitted.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#215CE5] hover:bg-[#102C60] disabled:opacity-60 text-white text-xs font-bold shadow-md shadow-[#215CE5]/20 transition-all flex items-center justify-center space-x-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting to Admin...' : 'Request Credentials from Admin'}</span>
            </button>
          </form>
        )}
      </main>
    </div>
  )
}
