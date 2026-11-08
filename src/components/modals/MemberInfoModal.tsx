'use client'

import React from 'react'
import { X, MapPin, Briefcase, Calendar, ArrowRight, Globe, Clock, Target, Compass, Sparkles, PhoneCall } from 'lucide-react'
import { MemberBadge, MemberTier } from '../common/MemberBadge'

export interface TaggedMemberData {
  id: string
  fullName: string
  email: string
  phone: string
  city: string
  memberId: string
  memberSince?: string
  businessName: string
  businessCategory: string
  bio: string
  avatarInitials: string
  isVerified?: boolean
  tier?: MemberTier | string
  // Additional Business & Networking Details
  whatWeDo?: string
  keyProductService?: string
  idealClient?: string
  opportunityLookingFor?: string
  targetConnections?: string
  preferredCallDay?: string
  preferredCallTime?: string
  websiteUrl?: string
  additionalNotes?: string
}

interface MemberInfoModalProps {
  isOpen: boolean
  onClose: () => void
  member: TaggedMemberData | null
  postTitle?: string
  onRequestContact?: (member: TaggedMemberData) => void
}

export function MemberInfoModal({
  isOpen,
  onClose,
  member,
  postTitle,
  onRequestContact,
}: MemberInfoModalProps) {
  if (!isOpen || !member) return null

  // Ensure website URL has protocol
  const formattedWebsite = member.websiteUrl
    ? member.websiteUrl.startsWith('http')
      ? member.websiteUrl
      : `https://${member.websiteUrl}`
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#102C60]/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Navy Profile Header */}
        <div className="relative bg-[#102C60] text-white p-5 sm:p-6 pb-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3.5">
            {/* Avatar Initials */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white text-[#102C60] font-extrabold text-xl flex items-center justify-center shadow-lg ring-4 ring-white/10 flex-shrink-0">
              {member.avatarInitials}
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white truncate">
                  {member.fullName}
                </h2>
                <MemberBadge
                  tier={member.tier || 'pro'}
                  isVerified={member.isVerified !== false}
                  showTier={true}
                />
              </div>

              <p className="text-xs text-blue-200 font-medium">
                {member.businessName}
              </p>
              <p className="text-[11px] text-slate-300">
                MNI member since {member.memberSince || 'October 2024'} • {member.memberId}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Modal Body: Comprehensive Business & Networking Profile */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* 1. What We Do / Business Expertise */}
          <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-[#102C60]">
              <Compass className="w-4 h-4 text-[#215CE5]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#102C60]">
                What We Do & Expertise
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {member.whatWeDo || member.bio}
            </p>
          </div>

          {/* 2. Key Product or Service */}
          {member.keyProductService && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-1.5 shadow-2xs">
              <div className="flex items-center space-x-2 text-[#102C60]">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#102C60]">
                  Key Product or Service
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {member.keyProductService}
              </p>
            </div>
          )}

          {/* 3. Ideal Client & Business Opportunities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {member.idealClient && (
              <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-3.5 space-y-1">
                <div className="flex items-center space-x-1.5 text-slate-700">
                  <Target className="w-3.5 h-3.5 text-[#215CE5]" />
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Ideal Client / Customer
                  </h5>
                </div>
                <p className="text-xs text-slate-800 font-semibold leading-snug">
                  {member.idealClient}
                </p>
              </div>
            )}

            {member.opportunityLookingFor && (
              <div className="bg-[#EAF0FC]/60 border border-blue-100 rounded-2xl p-3.5 space-y-1">
                <div className="flex items-center space-x-1.5 text-[#102C60]">
                  <Briefcase className="w-3.5 h-3.5 text-[#215CE5]" />
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#215CE5]">
                    Opportunities Seeking
                  </h5>
                </div>
                <p className="text-xs text-[#102C60] font-bold leading-snug">
                  {member.opportunityLookingFor}
                </p>
              </div>
            )}
          </div>

          {/* 4. Target Connections */}
          {member.targetConnections && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Target Connections & Strategic Introductions
              </span>
              <p className="text-xs text-slate-700">
                {member.targetConnections}
              </p>
            </div>
          )}

          {/* 5. Preferred Call Availability & Website */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#215CE5]" />
                <span className="font-semibold text-slate-700">Preferred Day for Call:</span>
              </div>
              <span className="font-bold text-[#102C60] bg-white px-2 py-0.5 rounded-md border border-slate-200 text-xs">
                {member.preferredCallDay || 'Wednesday'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-[#215CE5]" />
                <span className="font-semibold text-slate-700">Preferred Time Slot:</span>
              </div>
              <span className="font-bold text-[#102C60] bg-white px-2 py-0.5 rounded-md border border-slate-200 text-xs">
                {member.preferredCallTime || '11:00 AM - 1:00 PM'}
              </span>
            </div>

            {formattedWebsite && (
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                <div className="flex items-center space-x-2 text-slate-700">
                  <Globe className="w-3.5 h-3.5 text-[#215CE5]" />
                  <span className="font-semibold">Official Website:</span>
                </div>
                <a
                  href={formattedWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#215CE5] hover:underline text-xs flex items-center space-x-1"
                >
                  <span>{member.websiteUrl}</span>
                </a>
              </div>
            )}
          </div>

          {/* 6. Additional Notes */}
          {member.additionalNotes && (
            <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/60 text-xs text-amber-900 space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                Additional Notes
              </span>
              <p>{member.additionalNotes}</p>
            </div>
          )}

          {postTitle && (
            <div className="p-3 rounded-xl bg-[#EAF0FC]/60 border border-blue-100 text-xs text-[#102C60] flex items-center justify-between">
              <span className="font-medium truncate mr-2">Referenced in: {postTitle}</span>
              <span className="text-[10px] font-bold text-[#215CE5] uppercase tracking-wider flex-shrink-0">
                MNI Bulletin
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between space-x-3">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose()
              onRequestContact?.(member)
            }}
            type="button"
            className="flex-1 inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-[#215CE5] hover:bg-[#102C60] text-white text-xs font-bold shadow-md shadow-[#215CE5]/20 transition-all active:scale-98"
          >
            <span>Request {member.fullName.split(' ')[0]}'s Contact</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
