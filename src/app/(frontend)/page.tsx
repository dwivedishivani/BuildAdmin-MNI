'use client'

import React, { useState, useEffect } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { BottomNav } from '@/components/layout/BottomNav'
import { AdCarousel, BannerItem } from '@/components/timeline/AdCarousel'
import { TimelineCard, PostItem } from '@/components/timeline/TimelineCard'
import { FilterChips } from '@/components/timeline/FilterChips'
import { MemberInfoModal, TaggedMemberData } from '@/components/modals/MemberInfoModal'
import { ContactRequestModal } from '@/components/modals/ContactRequestModal'
import { ImageViewerModal } from '@/components/modals/ImageViewerModal'
import Link from 'next/link'
import { RefreshCw, Sparkles, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const [banners, setBanners] = useState<BannerItem[]>([])
  const [posts, setPosts] = useState<PostItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  // Modals state
  const [infoModalOpen, setInfoModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null)

  const [requestModalOpen, setRequestModalOpen] = useState(false)
  const [targetMember, setTargetMember] = useState<TaggedMemberData | null>(null)
  const [requestedPostId, setRequestedPostId] = useState<string | undefined>()

  const [imageViewerOpen, setImageViewerOpen] = useState(false)
  const [viewerImage, setViewerImage] = useState<string | null>(null)
  const [viewerTitle, setViewerTitle] = useState<string | undefined>()
  const [viewerCaption, setViewerCaption] = useState<string | undefined>()

  const [requestedIds, setRequestedIds] = useState<Record<string, boolean>>({})

  const fetchData = async () => {
    try {
      setLoading(true)
      const [bannersRes, postsRes, requestsRes] = await Promise.all([
        fetch('/api/banners'),
        fetch('/api/posts'),
        fetch('/api/requests'),
      ])

      if (bannersRes.ok) {
        const data = await bannersRes.json()
        setBanners(data.docs || [])
      }

      if (postsRes.ok) {
        const data = await postsRes.json()
        setPosts(data.docs || [])
      }

      if (requestsRes.ok) {
        const data = await requestsRes.json()
        const reqMap: Record<string, boolean> = {}
        ;(data.docs || []).forEach((r: any) => {
          if (r.post?.id) reqMap[r.post.id] = true
          if (r.targetMember?.id) reqMap[r.targetMember.id] = true
        })
        setRequestedIds(reqMap)
      }
    } catch (err) {
      console.error('Failed to fetch home timeline data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Handlers
  const handleOpenInfo = (post: PostItem) => {
    setSelectedPost(post)
    setInfoModalOpen(true)
  }

  const handleOpenRequest = (post: PostItem) => {
    if (!post.taggedMember) return
    setTargetMember(post.taggedMember)
    setRequestedPostId(post.id)
    setRequestModalOpen(true)
  }

  const handleRequestFromModal = (member: TaggedMemberData) => {
    setTargetMember(member)
    setRequestedPostId(selectedPost?.id)
    setRequestModalOpen(true)
  }

  const handleExpandImage = (imageUrl: string, title: string, caption?: string) => {
    setViewerImage(imageUrl)
    setViewerTitle(title)
    setViewerCaption(caption)
    setImageViewerOpen(true)
  }

  // Filter posts by category
  const filteredPosts = posts.filter((p) => {
    if (activeCategory === 'All') return true
    return p.category.toLowerCase().includes(activeCategory.toLowerCase())
  })

  return (
    <div className="min-h-screen bg-[#F3F6F8] pb-28 text-[#12233E]">
      {/* MNI Official Navigation Header with safe area padding */}
      <AppHeader />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-4 space-y-5">
        {/* TOP PROMOTIONAL AD CAROUSEL (2-3 Banners Max with 4s auto-rotation) */}
        <section aria-label="Featured Banners" className="w-full">
          <AdCarousel
            banners={banners}
            onBannerClick={(banner) => {
              if (banner.actionLink && banner.actionLink !== '#') {
                window.location.href = banner.actionLink
              }
            }}
          />
        </section>

        {/* TIMELINE SECTION: Placed directly under the carousel */}
        <section className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#102C60]">
                Inside your network
              </h1>
              <p className="text-xs text-slate-400">
                Opportunities and introductions curated by MNI Admin
              </p>
            </div>

            <button
              onClick={fetchData}
              type="button"
              className="p-2 text-slate-400 hover:text-[#215CE5] hover:bg-white rounded-full transition-all active:scale-90"
              title="Refresh timeline"
              aria-label="Refresh timeline"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <FilterChips
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </section>

        {/* TIMELINE FEED */}
        <section className="space-y-4" aria-label="Member Timeline Feed">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-3xl p-5 border border-slate-100 space-y-3 animate-pulse"
                >
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-48 bg-slate-200 rounded-2xl" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-[#102C60]">No posts found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No published timeline posts match the "{activeCategory}" filter right now.
              </p>
            </div>
          ) : (
            filteredPosts.map((post, index) => (
              <React.Fragment key={post.id}>
                <TimelineCard
                  post={post}
                  onInfoClick={handleOpenInfo}
                  onRequestClick={handleOpenRequest}
                  onExpandClick={handleExpandImage}
                  isRequested={Boolean(
                    requestedIds[post.id] ||
                      (post.taggedMember?.id && requestedIds[post.taggedMember.id])
                  )}
                />

                {/* INLINE REQUIREMENT SUBMISSION CALLOUT: placed smoothly after post 2 */}
                {index === 1 && (
                  <div className="my-2 p-5 rounded-3xl bg-gradient-to-br from-[#102C60] to-[#153775] text-white shadow-sm flex items-center justify-between space-x-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-blue-200 block">
                        Looking for a partner or vendor?
                      </span>
                      <h4 className="text-sm sm:text-base font-bold leading-tight">
                        Submit a requirement to MNI Admin
                      </h4>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        Share your business scope for review and curated publication to the network.
                      </p>
                    </div>

                    <Link
                      href="/submit"
                      className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#215CE5] hover:bg-white hover:text-[#102C60] text-white text-xs font-bold shadow-md transition-all flex-shrink-0 active:scale-95"
                    >
                      <span>Submit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </React.Fragment>
            ))
          )}
        </section>

        {/* Footer Note */}
        <div className="pt-4 pb-2 text-center text-[11px] text-slate-400">
          MNI Business Bulletin • Timeline managed by MNI Administration
        </div>
      </main>

      {/* FIXED BOTTOM NAVIGATION */}
      <BottomNav />

      {/* MODALS */}
      {/* 1. Info Dialog: Tagged Candidate & Business Details */}
      <MemberInfoModal
        isOpen={infoModalOpen}
        onClose={() => {
          setInfoModalOpen(false)
          setSelectedPost(null)
        }}
        member={selectedPost?.taggedMember || null}
        postTitle={selectedPost?.title}
        onRequestContact={handleRequestFromModal}
      />

      {/* 2. Request Dialog: Custom Agenda / Requirements Textarea */}
      <ContactRequestModal
        isOpen={requestModalOpen}
        onClose={() => {
          setRequestModalOpen(false)
          setTargetMember(null)
          setRequestedPostId(undefined)
        }}
        member={targetMember}
        postId={requestedPostId}
        onSuccess={() => {
          if (requestedPostId) {
            setRequestedIds((prev) => ({ ...prev, [requestedPostId]: true }))
          }
          if (targetMember?.id) {
            setRequestedIds((prev) => ({ ...prev, [targetMember.id]: true }))
          }
        }}
      />

      {/* 3. Expand Image Modal */}
      <ImageViewerModal
        isOpen={imageViewerOpen}
        onClose={() => {
          setImageViewerOpen(false)
          setViewerImage(null)
        }}
        imageUrl={viewerImage}
        title={viewerTitle}
        caption={viewerCaption}
      />
    </div>
  )
}
