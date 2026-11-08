'use client'

import React, { useState, useEffect } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { BottomNav } from '@/components/layout/BottomNav'
import { Trophy, Coins, Calendar, MapPin, Award, Star, ArrowRight, ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react'
import { MemberBadge } from '@/components/common/MemberBadge'
import Link from 'next/link'

interface LeaderboardMember {
  rank: number
  id: string
  name: string
  business: string
  city: string
  initials: string
  tier: string
  mniCoins: number
  referralCount: number
  isLeader?: boolean
}

interface MeetupPrize {
  id: string
  title: string
  minCoins: number
  badge: string
  description: string
  status: string
  eligibility: string
}

export default function RewardsPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardMember[]>([])
  const [prizes, setPrizes] = useState<MeetupPrize[]>([])
  const [nextMeetup, setNextMeetup] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRewardsData = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/rewards')
        if (res.ok) {
          const data = await res.json()
          setLeaderboard(data.leaderboard || [])
          setPrizes(data.meetupPrizes || [])
          setNextMeetup(data.nextMeetup || null)
        }
      } catch (err) {
        console.error('Failed to load rewards data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRewardsData()
  }, [])

  return (
    <div className="min-h-screen bg-[#F3F6F8] pb-28 text-[#12233E]">
      <AppHeader />

      <main className="max-w-xl mx-auto px-4 sm:px-6 pt-4 space-y-5">
        {/* Header Back Row */}
        <div className="flex items-center space-x-3">
          <Link
            href="/refer"
            className="p-2 rounded-xl bg-white border border-slate-200/80 text-slate-600 hover:text-[#102C60] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#215CE5]">
              Meetup Credits & Recognition
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102C60]">Rewards & Leaderboard</h1>
          </div>
        </div>

        {/* UPCOMING MEETUP TARGET CARD */}
        {nextMeetup && (
          <div className="bg-[#102C60] text-white rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/15 text-blue-200">
                Next In-Person Meetup
              </span>
              <span className="text-xs font-extrabold text-amber-300">
                {nextMeetup.daysRemaining} Days to Cutoff
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                {nextMeetup.title}
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center text-xs text-slate-300 gap-y-1 sm:gap-x-4 pt-1">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#215CE5]" />
                  <span>{nextMeetup.date}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#215CE5]" />
                  <span className="truncate">{nextMeetup.venue}</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-blue-200/90 pt-1 border-t border-white/15">
              The top coin collectors will be awarded their prizes and stage honors live at this meetup.
            </p>
          </div>
        )}

        {/* MEETUP PRIZES SHOWCASE */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#102C60] flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Meetup Prize Catalog</span>
            </h3>
            <span className="text-[11px] text-slate-400">Awarded per chapter</span>
          </div>

          <div className="space-y-3">
            {prizes.map((prize, idx) => (
              <div
                key={prize.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#215CE5] block">
                      {prize.badge}
                    </span>
                    <h4 className="text-sm font-bold text-[#102C60]">{prize.title}</h4>
                  </div>

                  <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                    <Coins className="w-3.5 h-3.5 text-amber-600" />
                    <span>{prize.minCoins}+ Coins</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-[#F8FAFC] p-3 rounded-xl border border-slate-100">
                  {prize.description}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                  <span>{prize.eligibility}</span>
                  <span className="font-semibold text-[#102C60]">{prize.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LIVE MNI COINS LEADERBOARD */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#102C60] flex items-center space-x-1.5">
              <Trophy className="w-4 h-4 text-[#215CE5]" />
              <span>Network Leaderboard</span>
            </h3>
            <span className="text-[11px] text-slate-400">Live rankings</span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
            {leaderboard.map((member) => {
              const isTop = member.rank === 1
              const isUser = member.name === 'Shivani Dwivedi'

              return (
                <div
                  key={member.id}
                  className={`p-4 flex items-center justify-between transition-colors ${
                    isUser ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 ${
                        member.rank === 1
                          ? 'bg-amber-400 text-white shadow-xs'
                          : member.rank === 2
                          ? 'bg-slate-300 text-slate-700'
                          : member.rank === 3
                          ? 'bg-amber-600/30 text-amber-900'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {member.rank}
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-[#102C60] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {member.initials}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-[#102C60] truncate">
                          {member.name} {isUser && '(You)'}
                        </span>
                        <MemberBadge tier={member.tier} />
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-[160px]">
                        {member.business}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center space-x-1 text-sm font-black text-[#102C60]">
                      <Coins className="w-4 h-4 text-amber-500" />
                      <span>{member.mniCoins.toLocaleString()}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {member.referralCount} referrals
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            href="/refer"
            className="w-full py-3.5 rounded-xl bg-[#215CE5] hover:bg-[#102C60] text-white text-xs font-bold shadow-md shadow-[#215CE5]/20 flex items-center justify-center space-x-2 transition-all"
          >
            <span>Refer Someone & Earn +500 Coins</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
