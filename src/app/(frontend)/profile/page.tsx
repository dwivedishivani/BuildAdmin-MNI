'use client'

import React, { useState, useEffect } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { BottomNav } from '@/components/layout/BottomNav'
import { MemberBadge } from '@/components/common/MemberBadge'
import {
  Mail,
  Phone,
  MapPin,
  Award,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  LogIn,
  Compass,
  Sparkles,
  Target,
  Briefcase,
  PhoneCall,
  Clock,
  Globe,
  User,
  Edit3,
  CheckCircle2,
  X,
  Save,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

interface ProfileData {
  id?: string
  fullName: string
  avatarInitials: string
  businessName: string
  businessCategory: string
  email: string
  phone: string
  city: string
  memberId: string
  memberSince: string
  tier: 'premium' | 'pro' | 'starter'
  whatWeDo: string
  keyProductService: string
  idealClient: string
  opportunityLookingFor: string
  targetConnections: string
  preferredCallDay: string
  preferredCallTime: string
  websiteUrl: string
  additionalNotes?: string
}

const NISHANT_FALLBACK: ProfileData = {
  fullName: 'Nishant Dhiman',
  avatarInitials: 'ND',
  businessName: 'Another World India Pvt Ltd',
  businessCategory: 'Luxury Boutique Destination & Travel Management',
  email: 'nishant@anotherworldindia.com',
  phone: '+91 98100 88990',
  city: 'New Delhi / Bengaluru, India',
  memberId: 'MNI-002450',
  memberSince: 'October 2024',
  tier: 'premium',
  whatWeDo: '"Another World India" a luxury boutique destination and travel management company committed to serving its customers by providing personalised and memorable travel experiences in the Indian Subcontinent and worldwide. We offer excellent professional service and the best standards in luxury travel by providing the finest of cultural, natural, architectural, and adventure travel experiences worldwide. \'Another World India\' is a prominent, independent, and progressive travel company devoted to providing unique travel experiences to its guests.',
  keyProductService: 'We offer excellent professional service and the best standards in luxury travel by providing the finest of cultural, natural, architectural, and adventure travel experiences worldwide.',
  idealClient: 'Business Travel , Leisure Travel with in India and overseas .',
  opportunityLookingFor: 'B2B AND B2C TRAVEL Meetings',
  targetConnections: '',
  preferredCallDay: 'Wednesday',
  preferredCallTime: '11:00 AM - 1:00 PM',
  websiteUrl: 'www.anotherworldindia.com',
  additionalNotes: 'please go through website www.anotherworldindia.com',
}

const SHIVANI_FALLBACK: ProfileData = {
  fullName: 'Shivani Dwivedi',
  avatarInitials: 'SD',
  businessName: 'Dwivedi Advisory & Operations',
  businessCategory: 'Business Operations & Strategic Sourcing',
  email: 'shivani@example.com',
  phone: '+91 98765 01234',
  city: 'Bengaluru, India',
  memberId: 'MNI-002184',
  memberSince: 'October 2024',
  tier: 'premium',
  whatWeDo: 'Strategic advisory helping SMEs streamline vendor management, contract negotiation, and multi-tier supply chain integrity across Southeast Asia.',
  keyProductService: 'Vendor audit, contract optimization, and executive procurement alignment.',
  idealClient: 'Medium-to-large industrial enterprises and regional manufacturers.',
  opportunityLookingFor: 'Cross-border manufacturing audits and logistics supplier connections.',
  targetConnections: 'Chief Operating Officers, procurement heads, and factory owners.',
  preferredCallDay: 'Tuesday',
  preferredCallTime: '3:00 PM - 5:00 PM',
  websiteUrl: 'www.dwivediadvisory.com',
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(NISHANT_FALLBACK)
  const [activeSection, setActiveSection] = useState<'business' | 'preferences' | 'account'>('business')

  // Edit Profile Dialog State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<ProfileData>>({})

  // Fetch latest member record from Payload on mount / switch
  const loadLiveMember = async (email: string) => {
    try {
      const res = await fetch(`/api/members/profile?email=${encodeURIComponent(email)}`)
      if (res.ok) {
        const data = await res.json()
        if (data.member) {
          setProfile((prev) => ({
            ...prev,
            ...data.member,
            avatarInitials: data.member.avatarInitials || prev.avatarInitials,
          }))
        }
      }
    } catch (err) {
      console.error('Failed to load member profile:', err)
    }
  }

  useEffect(() => {
    loadLiveMember(profile.email)
  }, [profile.email])

  const handleOpenEdit = () => {
    setEditForm({
      fullName: profile.fullName,
      phone: profile.phone,
      city: profile.city,
      businessName: profile.businessName,
      businessCategory: profile.businessCategory,
      whatWeDo: profile.whatWeDo,
      keyProductService: profile.keyProductService,
      idealClient: profile.idealClient,
      opportunityLookingFor: profile.opportunityLookingFor,
      targetConnections: profile.targetConnections,
      preferredCallDay: profile.preferredCallDay,
      preferredCallTime: profile.preferredCallTime,
      websiteUrl: profile.websiteUrl,
      additionalNotes: profile.additionalNotes,
    })
    setIsEditModalOpen(true)
    setSaveSuccessMessage(null)
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const res = await fetch('/api/members/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profile.email,
          memberId: profile.memberId,
          ...editForm,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      // Update state immediately with the new details
      setProfile((prev) => ({
        ...prev,
        ...data.member,
      }))

      setSaveSuccessMessage(
        'Profile updated live for all MNI members! An admin notification has been dispatched for editorial review.'
      )

      setTimeout(() => {
        setIsEditModalOpen(false)
        setSaveSuccessMessage(null)
      }, 1800)
    } catch (err: any) {
      alert(err.message || 'Error updating profile')
    } finally {
      setIsSaving(false)
    }
  }

  const formattedWebsite = profile.websiteUrl?.startsWith('http')
    ? profile.websiteUrl
    : `https://${profile.websiteUrl}`

  return (
    <div className="min-h-screen bg-[#F3F6F8] pb-28 text-[#12233E]">
      <AppHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Navy Profile Card with Plan Tier Badge & Edit CTA */}
        <div className="bg-[#102C60] text-white rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 relative">
          {/* Top Edit Button */}
          <div className="w-full flex justify-end sm:order-3 sm:w-auto">
            <button
              onClick={handleOpenEdit}
              type="button"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#215CE5] hover:bg-blue-700 text-white text-xs font-semibold transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#102C60]"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-200" />
              <span>Edit Profile</span>
            </button>
          </div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white text-[#102C60] font-extrabold text-2xl flex items-center justify-center flex-shrink-0">
            {profile.avatarInitials}
          </div>

          <div className="space-y-1 sm:flex-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold">{profile.fullName}</h1>
              <MemberBadge tier={profile.tier} showTier={false} />
            </div>
            <p className="text-xs text-blue-200 font-medium">
              {profile.businessName}
            </p>
            <p className="text-[11px] text-blue-100">{profile.businessCategory} · Member since {profile.memberSince}</p>
          </div>

        </div>

        {/* Section Tabs: What We Do | Networking & Call Times | Account */}
        <div className="flex bg-slate-200/60 p-1 rounded-2xl">
          <button
            onClick={() => setActiveSection('business')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'business'
                ? 'bg-white text-[#102C60] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Business
          </button>
          <button
            onClick={() => setActiveSection('preferences')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'preferences'
                ? 'bg-white text-[#102C60] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Networking
          </button>
          <button
            onClick={() => setActiveSection('account')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'account'
                ? 'bg-white text-[#102C60] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Contact
          </button>
        </div>

        {/* SECTION 1: WHAT WE DO & KEY OFFERINGS */}
        {activeSection === 'business' && (
          <div className="space-y-4">
            {/* What Exactly Do You Do */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 space-y-2">
              <div className="flex items-center space-x-2 text-[#102C60]">
                <Compass className="w-4 h-4 text-[#215CE5]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#102C60]">
                  What Exactly Do You Do?
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-[#F8FAFC] p-3.5 rounded-2xl border border-slate-100">
                {profile.whatWeDo}
              </p>
            </div>

            {/* Key Product or Service */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
              <div className="flex items-center space-x-2 text-[#102C60]">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#102C60]">
                  Key Product or Service
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium bg-[#F8FAFC] p-3.5 rounded-2xl border border-slate-100">
                {profile.keyProductService}
              </p>
            </div>

            {/* Official Website */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-700 text-xs">
                <Globe className="w-4 h-4 text-[#215CE5]" />
                <span className="font-semibold">Company Website:</span>
              </div>
              <a
                href={formattedWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#215CE5] hover:underline"
              >
                {profile.websiteUrl}
              </a>
            </div>
          </div>
        )}

        {/* SECTION 2: NETWORKING PREFERENCES, CALL SCHEDULE & GOALS */}
        {activeSection === 'preferences' && (
          <div className="space-y-4">
            {/* Ideal Client & Opportunity Looking For */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-slate-700">
                  <Target className="w-3.5 h-3.5 text-[#215CE5]" />
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Ideal Client / Customer
                  </h4>
                </div>
                <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                  {profile.idealClient}
                </p>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-blue-100 bg-[#EAF0FC]/40 shadow-2xs space-y-1.5">
                <div className="flex items-center space-x-1.5 text-[#102C60]">
                  <Briefcase className="w-3.5 h-3.5 text-[#215CE5]" />
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#215CE5]">
                    Opportunities Looking For
                  </h4>
                </div>
                <p className="text-xs text-[#102C60] font-bold leading-relaxed">
                  {profile.opportunityLookingFor}
                </p>
              </div>
            </div>

            {/* Target Connections */}
            {profile.targetConnections && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Connections You Would Like to Meet
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-[#F8FAFC] p-3 rounded-2xl border border-slate-100">
                  {profile.targetConnections}
                </p>
              </div>
            )}

            {/* Preferred Call Day & Time Slot */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Preferred Call Schedule
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="flex items-center space-x-1 text-slate-500 text-[11px]">
                    <PhoneCall className="w-3 h-3 text-[#215CE5]" />
                    <span>Preferred Day:</span>
                  </div>
                  <span className="font-bold text-sm text-[#102C60] block">
                    {profile.preferredCallDay}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="flex items-center space-x-1 text-slate-500 text-[11px]">
                    <Clock className="w-3 h-3 text-[#215CE5]" />
                    <span>Time Slot:</span>
                  </div>
                  <span className="font-bold text-sm text-[#102C60] block">
                    {profile.preferredCallTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            {profile.additionalNotes && (
              <div className="p-4 bg-amber-50/70 rounded-3xl border border-amber-200/60 text-xs text-amber-900 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                  Additional Context
                </span>
                <p>{profile.additionalNotes}</p>
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: ACCOUNT COORDINATES */}
        {activeSection === 'account' && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/70 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Account Coordinates
              </h2>

              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Registered Email</span>
                    <p className="text-xs font-bold text-slate-800">{profile.email}</p>
                  </div>
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Phone Number</span>
                    <p className="text-xs font-bold text-slate-800">{profile.phone}</p>
                  </div>
                  <Phone className="w-4 h-4 text-slate-400" />
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Chapter Location</span>
                    <p className="text-xs font-bold text-slate-800">{profile.city}</p>
                  </div>
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Member ID</span>
                    <p className="text-xs font-bold text-[#215CE5]">{profile.memberId}</p>
                  </div>
                  <Award className="w-4 h-4 text-[#215CE5]" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Link: Rewards & Meetup Leaderboard */}
        <Link
          href="/rewards"
          className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl shadow-2xs flex items-center justify-between group transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-950">Meetup Rewards & Prize Catalog</h3>
              <p className="text-[11px] text-amber-800/80">View prizes claimable at the next chapter meetup</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        {/* Auth & Access Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/login"
            className="p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between transition-colors text-xs font-bold text-[#102C60]"
          >
            <div className="flex items-center space-x-2">
              <LogIn className="w-4 h-4 text-[#215CE5]" />
              <span>Sign In / Switch</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <Link
            href="/login-help"
            className="p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between transition-colors text-xs font-bold text-[#102C60]"
          >
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-[#215CE5]" />
              <span>Login Help</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </main>

      <BottomNav />

      {/* EDIT PROFILE DIALOG (USER CAN EDIT HIS/HER PROFILE AS PER THEIR NEEDS) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#102C60]/60 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 text-[#12233E]"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="bg-[#102C60] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold">Edit Business Profile</h3>
                <p className="text-xs text-blue-200">Submit updates for Admin review.</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success Banner if Saved */}
            {saveSuccessMessage && (
              <div className="m-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start space-x-2 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Updates Saved Live</span>
                  <span>{saveSuccessMessage}</span>
                </div>
              </div>
            )}

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveProfile} className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Basic Business Details */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  General Coordinates
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.fullName || ''}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, fullName: e.target.value }))}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Phone</label>
                    <input
                      type="text"
                      required
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Business / Company</label>
                    <input
                      type="text"
                      required
                      value={editForm.businessName || ''}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, businessName: e.target.value }))}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Business Category</label>
                    <input
                      type="text"
                      required
                      value={editForm.businessCategory || ''}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, businessCategory: e.target.value }))}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Chapter City</label>
                    <input
                      type="text"
                      required
                      value={editForm.city || ''}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, city: e.target.value }))}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Company Website</label>
                    <input
                      type="text"
                      value={editForm.websiteUrl || ''}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, websiteUrl: e.target.value }))}
                      placeholder="www.yourcompany.com"
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* What We Do & Offerings */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Core Offerings & Scope
                </span>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    What exactly do you do? (Describe business, expertise, and offerings)
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={editForm.whatWeDo || ''}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, whatWeDo: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Key Product or Service (Main offering for MNI members)
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={editForm.keyProductService || ''}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, keyProductService: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none resize-none"
                  />
                </div>
              </div>

              {/* Networking & Referral Preferences */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Referral Preferences & Call Schedule
                </span>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Ideal Client / Customer you want to connect with
                  </label>
                  <input
                    type="text"
                    value={editForm.idealClient || ''}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, idealClient: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Business Opportunity / Referral you are looking for right now
                  </label>
                  <input
                    type="text"
                    value={editForm.opportunityLookingFor || ''}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, opportunityLookingFor: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Target Connections (Specific person, profession, or company)
                  </label>
                  <input
                    type="text"
                    value={editForm.targetConnections || ''}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, targetConnections: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Preferred Day for Call</label>
                    <select
                      value={editForm.preferredCallDay || 'Wednesday'}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, preferredCallDay: e.target.value }))}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none"
                    >
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Preferred Time Slot</label>
                    <select
                      value={editForm.preferredCallTime || '11:00 AM - 1:00 PM'}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, preferredCallTime: e.target.value }))}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none"
                    >
                      <option value="9:00 AM - 11:00 AM">9:00 AM - 11:00 AM</option>
                      <option value="11:00 AM - 1:00 PM">11:00 AM - 1:00 PM</option>
                      <option value="1:00 PM - 3:00 PM">1:00 PM - 3:00 PM</option>
                      <option value="3:00 PM - 5:00 PM">3:00 PM - 5:00 PM</option>
                      <option value="5:00 PM - 7:00 PM">5:00 PM - 7:00 PM</option>
                      <option value="7:00 PM - 9:00 PM">7:00 PM - 9:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Additional Notes / Context</label>
                  <textarea
                    rows={2}
                    value={editForm.additionalNotes || ''}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none resize-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#215CE5] hover:bg-[#102C60] text-white text-xs font-bold shadow-md shadow-[#215CE5]/20 disabled:opacity-60 transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving & Notifying Admin...' : 'Save & Update Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
