'use client'

import React, { useState } from 'react'
import { Check, X, MessageSquare, AlertCircle, ArrowUpRight, ShieldCheck, Clock } from 'lucide-react'

export interface SubmissionItem {
  id: string
  title: string
  category: string
  description: string
  status: 'pending' | 'changes_requested' | 'approved' | 'published' | 'rejected'
  submittedByName?: string
  submittedByEmail?: string
  supportingImageUrl?: string
  adminFeedback?: string
  createdAt?: string
}

interface SubmissionReviewQueueProps {
  submissions: SubmissionItem[]
  onActionComplete: () => void
}

export function SubmissionReviewQueue({ submissions, onActionComplete }: SubmissionReviewQueueProps) {
  const [selectedSub, setSelectedSub] = useState<SubmissionItem | null>(null)
  const [actionType, setActionType] = useState<'request_changes' | 'reject' | 'approve' | null>(null)
  const [feedback, setFeedback] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [badgeText, setBadgeText] = useState('MEMBER REQUIREMENT')
  const [postCategory, setPostCategory] = useState('Requirement')
  const [postType, setPostType] = useState<'text_only' | 'image_text'>('text_only')

  const handleAcknowledgeProfile = async (sub: SubmissionItem) => {
    setIsProcessing(true)
    try {
      const res = await fetch('/api/submissions/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: sub.id,
          action: 'approve',
          adminFeedback: 'Profile updates reviewed and acknowledged by Admin.',
        }),
      })
      if (!res.ok) throw new Error('Failed to acknowledge')
      onActionComplete()
    } catch (err: any) {
      alert(err.message || 'Error acknowledging profile')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleActionSubmit = async (sub: SubmissionItem, action: 'request_changes' | 'reject' | 'approve_and_publish') => {
    setIsProcessing(true)
    try {
      const res = await fetch('/api/submissions/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: sub.id,
          action,
          adminFeedback: feedback,
          postData: action === 'approve_and_publish' ? {
            title: sub.title,
            category: postCategory,
            postType: sub.supportingImageUrl ? postType : 'text_only',
            badgeText: badgeText || 'MEMBER REQUIREMENT',
            content: sub.description,
            imageUrl: sub.supportingImageUrl || '',
          } : undefined,
        }),
      })

      if (!res.ok) throw new Error('Failed to process submission')

      setSelectedSub(null)
      setActionType(null)
      setFeedback('')
      onActionComplete()
    } catch (err: any) {
      alert(err.message || 'Error executing admin action')
    } finally {
      setIsProcessing(false)
    }
  }

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending' || s.status === 'changes_requested')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#102C60] flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#215CE5]" />
            <span>Member Submissions Awaiting Review</span>
          </h3>
          <p className="text-xs text-slate-500">
            {pendingSubmissions.length} submission{pendingSubmissions.length === 1 ? '' : 's'} waiting for editorial approval. Only published items appear on the member timeline.
          </p>
        </div>
      </div>

      {pendingSubmissions.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/80 space-y-2">
          <ShieldCheck className="w-8 h-8 text-[#215CE5] mx-auto" />
          <h4 className="text-sm font-bold text-[#102C60]">Queue is clear</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            All member requirements have been reviewed. No pending approvals at this time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingSubmissions.map((sub) => {
            const isChangesReq = sub.status === 'changes_requested'
            return (
              <div
                key={sub.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EAF0FC] text-[#215CE5]">
                        {sub.category}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isChangesReq
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {isChangesReq ? 'Changes Requested' : 'Pending Approval'}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[#102C60]">{sub.title}</h4>
                    <p className="text-xs text-slate-400">
                      Submitted by <span className="font-semibold text-slate-700">{sub.submittedByName}</span> ({sub.submittedByEmail})
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 bg-[#F8FAFC] p-3 rounded-xl border border-slate-100">
                  {sub.description}
                </p>

                {sub.supportingImageUrl && (
                  <div className="flex items-center space-x-3 text-xs text-slate-500">
                    <img
                      src={sub.supportingImageUrl}
                      alt="Supporting creative"
                      className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                    />
                    <div className="text-[11px]">
                      <span className="font-semibold text-slate-700 block">Supporting Image Attached</span>
                      <span>Can be used as artwork for an Image + Text timeline post.</span>
                    </div>
                  </div>
                )}

                {sub.adminFeedback && (
                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60 text-xs text-amber-800 space-y-0.5">
                    <span className="font-semibold block text-[10px] uppercase tracking-wider text-amber-600">
                      Previous Admin Notes
                    </span>
                    <p>{sub.adminFeedback}</p>
                  </div>
                )}

                {/* Action Toolbar */}
                <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-100">
                  {sub.category === 'Profile Update' ? (
                    <button
                      onClick={() => handleAcknowledgeProfile(sub)}
                      disabled={isProcessing}
                      type="button"
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Acknowledge & Mark Reviewed</span>
                    </button>
                  ) : (
                  <button
                    onClick={() => {
                      setSelectedSub(sub)
                      setActionType('approve')
                    }}
                    type="button"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#215CE5] hover:bg-[#102C60] text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve & Publish to Timeline</span>
                  </button>
                  )}

                  <button
                    onClick={() => {
                      setSelectedSub(sub)
                      setActionType('request_changes')
                    }}
                    type="button"
                    className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Request Changes</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedSub(sub)
                      setActionType('reject')
                    }}
                    type="button"
                    className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Admin Review Action Modal */}
      {selectedSub && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102C60]/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-base font-bold text-[#102C60]">
                {actionType === 'approve'
                  ? 'Approve and Publish to Timeline'
                  : actionType === 'request_changes'
                  ? 'Request Changes from Member'
                  : 'Reject Member Submission'}
              </h4>
              <button
                onClick={() => {
                  setSelectedSub(null)
                  setActionType(null)
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionType === 'approve' ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  This submission will become immediately visible to all MNI members on the Home timeline.
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Badge Text</label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                    placeholder="e.g. MEMBER REQUIREMENT"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Category Tag</label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="Requirement">Requirement</option>
                    <option value="Opportunity">Opportunity</option>
                    <option value="Announcement">Announcement</option>
                    <option value="Promotion">Promotion</option>
                    <option value="Member Spotlight">Member Spotlight</option>
                  </select>
                </div>

                {selectedSub.supportingImageUrl && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Post Format</label>
                    <select
                      value={postType}
                      onChange={(e) => setPostType(e.target.value as any)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                    >
                      <option value="image_text">Image + Text Post</option>
                      <option value="text_only">Text-Only Post</option>
                    </select>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">
                  {actionType === 'request_changes' ? 'Feedback / Change Request Instructions' : 'Reason for Rejection'}
                </label>
                <textarea
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={
                    actionType === 'request_changes'
                      ? 'Specify what details or pricing parameters the member should clarify...'
                      : 'Provide an internal or external reason for declining publication...'
                  }
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none resize-none"
                />
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedSub(null)
                  setActionType(null)
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                disabled={isProcessing}
                onClick={() =>
                  handleActionSubmit(
                    selectedSub,
                    actionType === 'approve'
                      ? 'approve_and_publish'
                      : actionType === 'request_changes'
                      ? 'request_changes'
                      : 'reject'
                  )
                }
                className="px-5 py-2.5 rounded-xl bg-[#215CE5] hover:bg-[#102C60] text-white text-xs font-semibold shadow-md disabled:opacity-60"
              >
                {isProcessing ? 'Processing...' : 'Confirm Decision'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
