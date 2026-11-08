'use client'

import React, { useState, useEffect } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { BottomNav } from '@/components/layout/BottomNav'
import { SubmissionReviewQueue, SubmissionItem } from '@/components/admin/SubmissionReviewQueue'
import { PostComposer } from '@/components/admin/PostComposer'
import { BannerManager } from '@/components/admin/BannerManager'
import { TaggedMemberData } from '@/components/modals/MemberInfoModal'
import { BannerItem } from '@/components/timeline/AdCarousel'
import { ShieldCheck, Plus, CheckSquare, Layers, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminStudioPage() {
  const [activeTab, setActiveTab] = useState<'submissions' | 'compose' | 'banners'>('submissions')
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([])
  const [members, setMembers] = useState<TaggedMemberData[]>([])
  const [banners, setBanners] = useState<BannerItem[]>([])
  const [loading, setLoading] = useState(true)

  const loadAdminData = async () => {
    try {
      setLoading(true)
      const [subRes, memRes, banRes] = await Promise.all([
        fetch('/api/submissions'),
        fetch('/api/posts'), // Can extract tagged members
        fetch('/api/banners'),
      ])

      if (subRes.ok) {
        const data = await subRes.json()
        setSubmissions(data.docs || [])
      }

      // Hardcoded fallback list of available network members for tagging
      setMembers([
        {
          id: '3427bc75-0df8-4f0c-8000-d9ac98050c97',
          fullName: 'Ananya Mehta',
          email: 'ananya.mehta@example.com',
          phone: '+91 98450 11223',
          city: 'Bengaluru, India',
          memberId: 'MNI-001924',
          businessName: 'Mehta Business Alliances & Networking',
          businessCategory: 'Business Networking & Member Events',
          bio: 'MNI member and November meetup organiser. Leading community business initiatives.',
          avatarInitials: 'AM',
          isVerified: true,
          tier: 'premium',
        },
        {
          id: '078f206c-1646-4452-b4aa-f22446decd65',
          fullName: 'Rohan Shah',
          email: 'rohan.shah@example.com',
          phone: '+91 98765 43210',
          city: 'Bengaluru, India',
          memberId: 'MNI-002045',
          businessName: 'Studio RS Design & Branding',
          businessCategory: 'Brand & Design Partnership',
          bio: 'Award-winning creative director specializing in brand identity and packaging design.',
          avatarInitials: 'RS',
          isVerified: true,
          tier: 'pro',
        },
        {
          id: 'e29b1aee-05a8-4daf-b529-a085776c01c4',
          fullName: 'Priya Kapoor',
          email: 'priya.kapoor@example.com',
          phone: '+91 98112 76543',
          city: 'Mumbai, India',
          memberId: 'MNI-001880',
          businessName: 'Kapoor Luxury Print & Packaging Labs',
          businessCategory: 'Commercial Print & Packaging',
          bio: 'Founder of Kapoor Luxury Print Labs with 14+ years providing high-finish sustainable packaging.',
          avatarInitials: 'PK',
          isVerified: true,
          tier: 'premium',
        },
        {
          id: 'fec62861-85c4-4e08-97b8-ab7f7ac22b01',
          fullName: 'Shivani Dwivedi',
          email: 'shivani@example.com',
          phone: '+91 98765 01234',
          city: 'Bengaluru, India',
          memberId: 'MNI-002184',
          businessName: 'Dwivedi Advisory & Operations',
          businessCategory: 'Business Operations & Strategic Sourcing',
          bio: 'Strategic advisor helping SMEs streamline vendor management and multi-tier supply chain integrity.',
          avatarInitials: 'SD',
          isVerified: true,
          tier: 'starter',
        },
      ])

      if (banRes.ok) {
        const data = await banRes.json()
        setBanners(data.docs || [])
      }
    } catch (err) {
      console.error('Error loading admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  return (
    <div className="min-h-screen bg-[#F3F6F8] pb-28">
      <AppHeader />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-white border border-slate-200/80 text-slate-600 hover:text-[#102C60] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#215CE5]">
                Content Management System
              </span>
              <h1 className="text-xl font-bold text-[#102C60]">MNI Admin Publishing Studio</h1>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-slate-100 text-[#102C60] border border-slate-200 text-xs font-semibold flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Authorized</span>
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="flex bg-slate-200/60 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'submissions'
                ? 'bg-white text-[#102C60] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Review Queue</span>
          </button>
          <button
            onClick={() => setActiveTab('compose')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'compose'
                ? 'bg-white text-[#102C60] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish New Post</span>
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'banners'
                ? 'bg-white text-[#102C60] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Manage Banners</span>
          </button>
        </div>

        {/* Tab 1: Submission Review Queue */}
        {activeTab === 'submissions' && (
          <SubmissionReviewQueue
            submissions={submissions}
            onActionComplete={loadAdminData}
          />
        )}

        {/* Tab 2: Direct Post Composer */}
        {activeTab === 'compose' && (
          <PostComposer
            members={members}
            onPostCreated={loadAdminData}
          />
        )}

        {/* Tab 3: Banner Placements Manager */}
        {activeTab === 'banners' && (
          <BannerManager
            banners={banners}
            onUpdate={loadAdminData}
          />
        )}
      </main>

      <BottomNav />
    </div>
  )
}
