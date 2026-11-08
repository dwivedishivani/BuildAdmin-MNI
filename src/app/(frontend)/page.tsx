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
import { RefreshCw, Sparkles } from 'lucide-react'

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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
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
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#102C60]">
                Inside your network
              </h1>
              <p className="text-sm text-slate-500">Latest updates from MNI</p>
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
        <section className="space-y-5" aria-label="MNI community timeline">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl p-5 border border-slate-100 space-y-3 animate-pulse"
                >
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-48 bg-slate-200 rounded-2xl" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 space-y-3">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-[#102C60]">No posts found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No published timeline posts match the "{activeCategory}" filter right now.
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
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

              </React.Fragment>
            ))
          )}
        </section>

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
