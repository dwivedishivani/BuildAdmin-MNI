'use client'

import React, { useState, useEffect } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { BottomNav } from '@/components/layout/BottomNav'
import { Users, Clock, CheckCircle2, Phone, Mail, FileText, ArrowRight, MessageSquare } from 'lucide-react'

export interface ContactRequestRecord {
  id: string
  targetMemberName: string
  targetMemberRole?: string
  targetMemberEmail?: string
  targetMemberPhone?: string
  agendaNote?: string
  status: 'pending' | 'contact_received' | 'followup_required' | 'outcome_recorded'
  followUp?: {
    calledContact?: boolean
    conversationTookPlace?: boolean
    businessGenerated?: boolean
    gaveBusiness?: 'gave' | 'did_not_give'
    remarks?: string
    recordedAt?: string
  }
  createdAt?: string
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<ContactRequestRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'received'>('all')

  // Outcome Follow-up Form Modal State
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<ContactRequestRecord | null>(null)
  const [calledContact, setCalledContact] = useState(true)
  const [conversationTookPlace, setConversationTookPlace] = useState(true)
  const [businessGenerated, setBusinessGenerated] = useState(true)
  const [gaveBusiness, setGaveBusiness] = useState<'gave' | 'did_not_give'>('gave')
  const [remarks, setRemarks] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/requests')
      if (res.ok) {
        const data = await res.json()
        setRequests(data.docs || [])
      }
    } catch (err) {
      console.error('Failed to load contact requests:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleOpenFollowUp = (req: ContactRequestRecord) => {
    setSelectedRequest(req)
    if (req.followUp) {
      setCalledContact(req.followUp.calledContact ?? true)
      setConversationTookPlace(req.followUp.conversationTookPlace ?? true)
      setBusinessGenerated(req.followUp.businessGenerated ?? true)
      setGaveBusiness(req.followUp.gaveBusiness || 'gave')
      setRemarks(req.followUp.remarks || '')
    } else {
      setRemarks('')
    }
    setFollowUpModalOpen(true)
  }

  const handleSaveFollowUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRequest) return
    setIsSaving(true)

    try {
      const res = await fetch('/api/requests/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedRequest.id,
          calledContact,
          conversationTookPlace,
          businessGenerated,
          gaveBusiness,
          remarks,
        }),
      })

      if (!res.ok) throw new Error('Failed to save follow-up')

      setFollowUpModalOpen(false)
      setSelectedRequest(null)
      fetchRequests()
    } catch (err: any) {
      alert(err.message || 'Error recording outcome')
    } finally {
      setIsSaving(false)
    }
  }

  const filteredRequests = requests.filter((r) => {
    if (activeTab === 'pending') return r.status === 'pending'
    if (activeTab === 'received') return r.status === 'contact_received' || r.status === 'outcome_recorded'
    return true
  })

  return (
    <div className="min-h-screen bg-[#F3F6F8] pb-28">
      <AppHeader />

      <main className="max-w-xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#215CE5]">
            Contact & Interaction History
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#102C60]">Your connections, in one place.</h1>
          <p className="text-xs text-slate-400">
            Track status of member introductions requested through timeline bulletins.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex bg-slate-200/60 p-1 rounded-2xl">
          {[
            { id: 'all', label: 'All Requests' },
            { id: 'pending', label: 'Pending' },
            { id: 'received', label: 'Received' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-[#102C60] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse h-28" />
              ))}
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 text-center space-y-2">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-[#102C60]">No requests found</h3>
              <p className="text-xs text-slate-400">
                You haven't requested any contact details in this view. Use the Request button on any timeline post.
              </p>
            </div>
          ) : (
            filteredRequests.map((req) => {
              const isPending = req.status === 'pending'
              const isReceived = req.status === 'contact_received'
              const isOutcomeRecorded = req.status === 'outcome_recorded'

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-[#102C60] text-white flex items-center justify-center font-bold text-xs">
                        {req.targetMemberName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#102C60]">{req.targetMemberName}</h3>
                        <p className="text-xs text-slate-500">{req.targetMemberRole || 'Network Member'}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        isPending
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : isOutcomeRecorded
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-blue-50 text-[#215CE5] border border-blue-200'
                      }`}
                    >
                      {isPending
                        ? 'Pending'
                        : isOutcomeRecorded
                        ? 'Outcome recorded'
                        : 'Contact received'}
                    </span>
                  </div>

                  {req.agendaNote && (
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-100 text-xs text-slate-600 space-y-0.5">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Your Stated Agenda:
                      </span>
                      <p>{req.agendaNote}</p>
                    </div>
                  )}

                  {/* If Contact Received, Display Provided Details */}
                  {!isPending && (
                    <div className="p-3 bg-[#EAF0FC]/60 rounded-xl border border-blue-100 text-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[#215CE5] tracking-wider block">
                        Verified Contact Coordinates
                      </span>
                      <div className="flex items-center space-x-4 text-slate-700">
                        {req.targetMemberEmail && (
                          <div className="flex items-center space-x-1">
                            <Mail className="w-3.5 h-3.5 text-[#215CE5]" />
                            <span>{req.targetMemberEmail}</span>
                          </div>
                        )}
                        {req.targetMemberPhone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="w-3.5 h-3.5 text-[#215CE5]" />
                            <span>{req.targetMemberPhone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Outcome summary if recorded */}
                  {req.followUp?.remarks && (
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">Follow-up Remarks: </span>
                      <span>{req.followUp.remarks}</span>
                    </div>
                  )}

                  {/* Action button */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                    <span className="text-[11px] text-slate-400">
                      {isPending ? "We'll notify you when details are shared" : 'Follow-up tracking'}
                    </span>

                    {!isPending && (
                      <button
                        onClick={() => handleOpenFollowUp(req)}
                        type="button"
                        className="px-3.5 py-1.5 rounded-xl bg-[#215CE5] hover:bg-[#102C60] text-white text-xs font-semibold shadow-sm transition-colors"
                      >
                        {isOutcomeRecorded ? 'Edit Outcome' : 'Add Follow-up'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </main>

      {/* Follow-up / Business Outcome Form Modal */}
      {followUpModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102C60]/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div>
              <span className="text-[10px] font-bold text-[#215CE5] uppercase tracking-wider">
                REQUEST • {selectedRequest.targetMemberName}
              </span>
              <h3 className="text-lg font-bold text-[#102C60]">From introduction to business.</h3>
              <p className="text-xs text-slate-500">
                Record the business outcome against this contact request.
              </p>
            </div>

            <form onSubmit={handleSaveFollowUp} className="space-y-4">
              {/* Question 1: Did you call the contact? */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Did you call the contact?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCalledContact(true)}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                      calledContact ? 'bg-[#215CE5] text-white border-[#215CE5]' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalledContact(false)}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                      !calledContact ? 'bg-[#215CE5] text-white border-[#215CE5]' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Question 2: Did a conversation take place? */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Did a conversation take place?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConversationTookPlace(true)}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                      conversationTookPlace ? 'bg-[#215CE5] text-white border-[#215CE5]' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setConversationTookPlace(false)}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                      !conversationTookPlace ? 'bg-[#215CE5] text-white border-[#215CE5]' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Question 3: Was business generated? */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Was business generated?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBusinessGenerated(true)}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                      businessGenerated ? 'bg-[#215CE5] text-white border-[#215CE5]' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setBusinessGenerated(false)}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                      !businessGenerated ? 'bg-[#215CE5] text-white border-[#215CE5]' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Question 4: Did you give business? */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Did you give business?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGaveBusiness('gave')}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                      gaveBusiness === 'gave' ? 'bg-[#215CE5] text-white border-[#215CE5]' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    Gave business
                  </button>
                  <button
                    type="button"
                    onClick={() => setGaveBusiness('did_not_give')}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                      gaveBusiness === 'did_not_give' ? 'bg-[#215CE5] text-white border-[#215CE5]' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    Did not give business
                  </button>
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Remarks / Outcome Notes
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add context about the conversation or agreement..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setFollowUpModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-[#215CE5] hover:bg-[#102C60] text-white text-xs font-semibold rounded-xl shadow-md disabled:opacity-60"
                >
                  {isSaving ? 'Saving...' : 'Save Business Outcome'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
