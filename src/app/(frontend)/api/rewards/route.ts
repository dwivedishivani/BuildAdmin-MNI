import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Fetch members sorted by mniCoins descending
    const membersRes = await payload.find({
      collection: 'members',
      sort: '-mniCoins',
      limit: 20,
    })

    const leaderboard = (membersRes.docs || []).map((m: any, index: number) => ({
      rank: index + 1,
      id: m.id,
      name: m.fullName,
      business: m.businessName,
      city: m.city,
      initials: m.avatarInitials,
      tier: m.tier || 'pro',
      mniCoins: m.mniCoins || 0,
      referralCount: m.referralCount || Math.floor((m.mniCoins || 0) / 500),
      isLeader: index === 0,
    }))

    // Meetup Prizes Catalog
    const meetupPrizes = [
      {
        id: 'grand-champion',
        title: 'MNI Meetup Grand Champion Trophy & Keynote',
        minCoins: 3000,
        badge: 'Top Leaderboard #1',
        description: 'Exclusive 15-min Mainstage Keynote Spotlight to present your enterprise to 400+ attendees at The Leela Palace, plus Lifetime VIP Meetup Pass.',
        status: 'Locked to #1 Rank',
        eligibility: 'Member with the most MNI Coins at the Meetup cutoff.',
      },
      {
        id: 'spotlight-exhibition',
        title: 'Executive Exhibition Suite & Priority Showcase',
        minCoins: 2000,
        badge: 'Top 3 Qualifiers',
        description: 'Dedicated branded networking kiosk at the upcoming chapter meetup + feature interview in the MNI Network Bulletin.',
        status: 'Qualified for Top 3',
        eligibility: 'Members holding 2,000+ MNI Coins.',
      },
      {
        id: 'silver-partner',
        title: 'MNI Executive Gift Box & VIP Networking Access',
        minCoins: 1000,
        badge: 'Top 5 Qualifiers',
        description: 'Curated artisanal hamper from Kapoor Luxury Print Labs and access to the Closed-Door Founders Roundtable prior to the main mixer.',
        status: 'Claimable at Meetup',
        eligibility: 'Members holding 1,000+ MNI Coins.',
      },
    ]

    return NextResponse.json({
      leaderboard,
      meetupPrizes,
      nextMeetup: {
        title: 'MNI November Annual Meetup',
        date: '21 November 2026',
        venue: 'The Grand Ballroom, The Leela Palace, Bengaluru',
        daysRemaining: 13,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
