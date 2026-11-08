'use client'

import React, { useState, useEffect } from 'react'
import { X, Bell, UserCheck, Clock, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export interface NotificationItem {
  id: string
  type: 'profile_update' | 'submission' | 'access_request' | 'referral'
  title: string
  message: string
  time: string
  status: string
  author?: string
  email?: string
  isActionable?: boolean
  actionUrl?: string
}

interface NotificationsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
      }
    } catch (err) {
      console.error('Failed to load notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#102C60]/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Navy Header */}
        <div className="bg-[#102C60] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Activity & Notifications
              </h3>
              <p className="text-[11px] text-blue-200">
                Network events & admin review notifications
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Loading recent activity...
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-[#102C60]">You're all caught up!</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                No pending admin reviews or unread alerts right now.
              </p>
            </div>
          ) : (
            notifications.map((item) => {
              const isProfile = item.type === 'profile_update'
              const isSubmission = item.type === 'submission'
              const isAccess = item.type === 'access_request'
              const isReferral = item.type === 'referral'

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isProfile
                      ? 'bg-blue-50/70 border-blue-200'
                      : isSubmission
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-[#F8FAFC] border-slate-200/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          isProfile
                            ? 'bg-[#215CE5] text-white'
                            : isSubmission
                            ? 'bg-amber-500 text-white'
                            : isAccess
                            ? 'bg-[#102C60] text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {isProfile
                          ? 'Profile Update'
                          : isSubmission
                          ? 'Requirement'
                          : isAccess
                          ? 'Access Request'
                          : 'Referral'}
                      </span>
                      <span className="text-[11px] font-bold text-[#102C60]">
                        {item.title}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 flex-shrink-0">
                      {item.time ? new Date(item.time).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed mb-2">
                    {item.message}
                  </p>

                  {/* Action Link for Admin */}
                  {item.isActionable && item.actionUrl && (
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-500">
                        Admin Review Required
                      </span>
                      <Link
                        href={item.actionUrl}
                        onClick={onClose}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-[#215CE5] hover:underline"
                      >
                        <span>Inspect in Admin Studio</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <Link
            href="/admin-studio"
            onClick={onClose}
            className="text-xs font-bold text-[#102C60] hover:text-[#215CE5] flex items-center space-x-1"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Review Queue</span>
          </Link>

          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
