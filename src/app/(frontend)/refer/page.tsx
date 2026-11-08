'use client'

import React, { useState, useEffect } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { BottomNav } from '@/components/layout/BottomNav'
import { Gift, Coins, Trophy, Users, Copy, Check, ArrowRight, Sparkles, Calendar, ShieldCheck, ChevronRight, Share2 } from 'lucide-react'
import Link from 'next/link'

interface ReferralDoc {
  id: string
  candidateName: string
  candidatePhone: string
  candidateEmail: string
  context?: string
  coinsAwarded: number
  status: 'pending_review' | 'confirmed' | 'meetup_redeemed'
  createdAt: string
}

export default function ReferAndEarnPage() {
  const [activeTab, setActiveTab] = useState<'refer' | 'prizes' | 'history'>('refer')
  const [candidateName, setCandidateName] = useState('')
  const [candidatePhone, setCandidatePhone] = useState('')
  const [candidateEmail, setCandidateEmail] = useState('')
  const [context, setContext] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied] = useState(false)

  const [referrals, setReferrals] = useState<ReferralDoc[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  const [activeMember, setActiveMember] = useState<'nishant' | 'shivani'>('nishant')
  const referralCode = activeMember === 'nishant' ? 'MNI-ND450' : 'MNI-SD184'
  const userCoins = activeMember === 'nishant' ? 2000 : 1500
  const userRank = activeMember === 'nishant' ? 2 : 3
  const referrerName = activeMember === 'nishant' ? 'Nishant Dhiman' : 'Shivani Dwivedi'
  const referrerEmail = activeMember === 'nishant' ? 'nishant@anotherworldindia.com' : 'shivani@example.com'

  const fetchReferrals = async () => {
    try {
      setLoadingHistory(true)
      const res = await fetch('/api/referrals')
      if (res.ok) {
        const data = await res.json()
        setReferrals(data.docs || [])
      }
    } catch (err) {
      console.error('Failed to load referrals:', err)
    } finally {
      setLoadingHistory(false)
    }
  }

  useEffect(() => {
    fetchReferrals()
  }, [])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmitReferral = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!candidateName || !candidatePhone || !candidateEmail) return
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName,
          candidatePhone,
          candidateEmail,
          context,
          referrerName,
          referrerEmail,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to record referral')

      setSubmitted(true)
      fetchReferrals()
    } catch (err: any) {
      alert(err.message || 'Error submitting referral')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F3F6F8] pb-28 text-[#12233E]">
      <AppHeader />

      <main className="max-w-xl mx-auto px-4 sm:px-6 pt-4 space-y-5">
        {/* GAMIFIED HERO CARD: 500 MNI COINS & MEETUP PRIZES */}
        <div className="bg-gradient-to-br from-[#102C60] via-[#153775] to-[#215CE5] text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden space-y-4">
          {/* Subtle decorative circles */}
          <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute right-12 bottom-0 w-24 h-24 bg-amber-400/20 rounded-full blur-xl" />

          <div className="flex items-start justify-between relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[10px] font-bold tracking-widest uppercase text-blue-100">
              <Coins className="w-3.5 h-3.5 text-amber-300" />
              <span>500 Coins Per Confirmed Referral</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-semibold text-blue-200 block">Your Rank</span>
              <span className="text-sm font-extrabold text-amber-300">#{userRank} on Board</span>
            </div>
          </div>

          <div className="space-y-1.5 relative z-10">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Refer & Win Meetup Prizes
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              Earn <span className="font-bold text-amber-300">500 MNI Coins</span> for every verified peer you introduce. The member with the most coins claims keynote spotlights & prizes at the upcoming MNI Meetup!
            </p>
          </div>

          {/* User's Coin Balance Bar */}
          <div className="pt-2 flex items-center justify-between border-t border-white/20 relative z-10">
            <div>
              <span className="text-[10px] uppercase text-blue-200 block font-semibold">Your Balance</span>
              <div className="flex items-center space-x-1.5">
                <Coins className="w-5 h-5 text-amber-300" />
                <span className="text-xl font-black text-white">{userCoins.toLocaleString()}</span>
                <span className="text-xs text-blue-200 font-semibold">MNI Coins</span>
              </div>
            </div>

            <Link
              href="/rewards"
              className="inline-flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white text-white hover:text-[#102C60] text-xs font-bold transition-all backdrop-blur-md active:scale-95"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>Leaderboard</span>
            </Link>
          </div>
        </div>

        {/* Quick Referral Link Share Pill */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Your Exclusive Invite Code</span>
            <p className="text-sm font-mono font-bold text-[#102C60]">{referralCode}</p>
          </div>

          <button
            onClick={handleCopyCode}
            type="button"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#EAF0FC] text-[#215CE5] text-xs font-bold transition-colors active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Navigation Tabs: Refer Someone | Meetup Prizes | Referral History */}
        <div className="flex bg-slate-200/60 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('refer')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'refer'
                ? 'bg-white text-[#102C60] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Introduce a Member
          </button>
          <button
            onClick={() => setActiveTab('prizes')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'prizes'
                ? 'bg-white text-[#102C60] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Meetup Prizes & Rules
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-white text-[#102C60] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            My Activity ({referrals.length})
          </button>
        </div>

        {/* TAB 1: INTRODUCE A MEMBER FORM */}
        {activeTab === 'refer' && (
          <div className="space-y-4">
            {submitted ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm text-center space-y-4">
                <div className="w-16 h-16 bg-blue-50 text-[#215CE5] rounded-full flex items-center justify-center mx-auto ring-8 ring-blue-50/50">
                  <Coins className="w-9 h-9 text-amber-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#102C60]">Referral Submitted!</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    We have received your introduction for <span className="font-semibold text-slate-700">{candidateName}</span>. Once verified by the membership committee, <span className="font-bold text-[#215CE5]">500 MNI Coins</span> will be credited to your account!
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-center space-x-3">
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setCandidateName('')
                      setCandidatePhone('')
                      setCandidateEmail('')
                      setContext('')
                    }}
                    type="button"
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  >
                    Refer Another Leader
                  </button>
                  <Link
                    href="/rewards"
                    className="px-5 py-2.5 rounded-xl bg-[#215CE5] hover:bg-[#102C60] text-white text-xs font-bold shadow-md shadow-[#215CE5]/20 transition-all"
                  >
                    View Meetup Leaderboard
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitReferral} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[#102C60]">Introduce a Qualified Network Candidate</h3>
                  <p className="text-xs text-slate-400">
                    500 MNI Coins will be automatically credited to you upon admin verification.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Candidate Full Name *</label>
                  <input
                    type="text"
                    required
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    placeholder="+91 98..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Work / Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    placeholder="name@business.com"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Why are they a strong fit for MNI?</label>
                  <textarea
                    rows={3}
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Mention their business sector, company size, and how you know them..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#215CE5] outline-none resize-none"
                  />
                </div>

                {/* Coin Reward Assurance Pill */}
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-center space-x-2.5 text-xs text-amber-900">
                  <Coins className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <span className="font-semibold leading-tight">
                    You earn 500 MNI Coins when this candidate's membership is verified by MNI.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#215CE5] hover:bg-[#102C60] disabled:opacity-60 text-white text-xs font-bold shadow-md shadow-[#215CE5]/20 transition-all flex items-center justify-center space-x-2"
                >
                  <Gift className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Referral (+500 Coins)'}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: MEETUP PRIZES & GAME MECHANICS */}
        {activeTab === 'prizes' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center space-x-2.5">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-[#102C60]">How the Meetup Rewards Game Works</h3>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#102C60] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-[#102C60]">Introduce Business Peers</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Share verified business owners or directors through your invite link or referral form.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#215CE5] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-[#102C60]">Collect 500 MNI Coins Each Time</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Each successful verification automatically deposits 500 MNI Coins directly into your balance.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-[#102C60]">Claim Prizes at the MNI Meetup</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      The top coin collectors will receive prestigious on-stage honors, keynote privileges, and executive awards at the upcoming MNI chapter meetup!
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/rewards"
                  className="w-full py-3 rounded-xl bg-[#102C60] hover:bg-[#215CE5] text-white text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>Explore Live Meetup Leaderboard & Prizes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REFERRAL HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {loadingHistory ? (
              <div className="space-y-3">
                {[1, 2].map((n) => (
                  <div key={n} className="bg-white rounded-2xl p-4 border animate-pulse h-20" />
                ))}
              </div>
            ) : referrals.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 text-center space-y-2">
                <Users className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-[#102C60]">No referrals yet</h4>
                <p className="text-xs text-slate-400">
                  Introduce your first peer to start earning MNI Coins toward the next meetup awards.
                </p>
              </div>
            ) : (
              referrals.map((ref) => {
                const isConfirmed = ref.status === 'confirmed'
                return (
                  <div
                    key={ref.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-[#102C60]">{ref.candidateName}</h4>
                        <p className="text-[11px] text-slate-500">{ref.candidateEmail}</p>
                      </div>

                      <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                        <Coins className="w-3.5 h-3.5 text-amber-600" />
                        <span>+500 Coins</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-400">
                        Status: <span className="font-semibold text-slate-700">{isConfirmed ? 'Confirmed (Credited)' : 'Under Admin Review'}</span>
                      </span>
                      <span className="text-slate-400">Redeemable at Meetup</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
