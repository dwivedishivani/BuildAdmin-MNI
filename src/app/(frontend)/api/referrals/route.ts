import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    const referrals = await payload.find({
      collection: 'referrals',
      sort: '-createdAt',
      limit: 50,
    })
    return NextResponse.json(referrals)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await req.json()
    const { candidateName, candidatePhone, candidateEmail, context, referrerName, referrerEmail } = body

    if (!candidateName || !candidatePhone || !candidateEmail) {
      return NextResponse.json({ error: 'Candidate name, phone, and email are required.' }, { status: 400 })
    }

    const normalizedEmail = String(candidateEmail).trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid candidate email address.' }, { status: 400 })
    }

    // Check if candidate is already referred
    const existingReferral = await payload.find({
      collection: 'referrals',
      where: { candidateEmail: { equals: normalizedEmail } },
      limit: 1,
    })
    if (existingReferral.totalDocs > 0) {
      return NextResponse.json(
        { error: 'This business leader has already been referred to MNI.' },
        { status: 409 }
      )
    }

    // Check if candidate is already an active member
    const existingMember = await payload.find({
      collection: 'members',
      where: { email: { equals: normalizedEmail } },
      limit: 1,
    })
    if (existingMember.totalDocs > 0) {
      return NextResponse.json(
        { error: 'This business owner is already an active MNI member.' },
        { status: 409 }
      )
    }

    // Look up referrer to attach member relationship and credit coins
    let referrerMemberId: string | null = null
    if (referrerEmail) {
      const referrerRecord = await payload.find({
        collection: 'members',
        where: { email: { equals: String(referrerEmail).trim().toLowerCase() } },
        limit: 1,
      })
      if (referrerRecord.totalDocs > 0) {
        const ref = referrerRecord.docs[0]
        referrerMemberId = ref.id
        await payload.update({
          collection: 'members',
          id: ref.id,
          data: {
            mniCoins: (ref.mniCoins || 0) + 500,
            referralCount: (ref.referralCount || 0) + 1,
          },
        })
      }
    }

    const referral = await payload.create({
      collection: 'referrals',
      data: {
        candidateName: String(candidateName).trim(),
        candidatePhone: String(candidatePhone).trim(),
        candidateEmail: normalizedEmail,
        context: context || '',
        referrerMember: referrerMemberId || undefined,
        referrerName: referrerName || 'Nishant Dhiman',
        referrerEmail: referrerEmail || 'nishant@anotherworldindia.com',
        coinsAwarded: 500, // 500 MNI Coins rule
        status: 'confirmed',
      },
    })

    return NextResponse.json({ success: true, referral, coinsEarned: 500 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
