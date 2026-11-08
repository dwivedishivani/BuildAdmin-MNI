import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })

    // 1. Pending submissions (including Profile Updates)
    const submissionsRes = await payload.find({
      collection: 'submissions',
      overrideAccess: true,
      where: {
        status: { equals: 'pending' },
      },
      sort: '-createdAt',
      limit: 10,
    })

    // 2. Pending Access/Login Help Requests
    const helpRequestsRes = await payload.find({
      collection: 'login-help-requests',
      overrideAccess: true,
      where: {
        status: { equals: 'pending' },
      },
      sort: '-createdAt',
      limit: 5,
    })

    // 3. Recent Referrals
    const referralsRes = await payload.find({
      collection: 'referrals',
      overrideAccess: true,
      sort: '-createdAt',
      limit: 5,
    })

    const notifications: any[] = []

    // Map profile updates and requirement submissions
    submissionsRes.docs.forEach((sub: any) => {
      const isProfile = sub.category === 'Profile Update'
      notifications.push({
        id: sub.id,
        type: isProfile ? 'profile_update' : 'submission',
        title: isProfile ? 'Member Profile Updated' : 'New Member Requirement',
        message: isProfile
          ? `${sub.submittedByName} added new business profile details. Live to all members; awaiting Admin review.`
          : `${sub.submittedByName} submitted: "${sub.title}". Awaiting editorial review.`,
        time: sub.createdAt,
        status: sub.status,
        author: sub.submittedByName,
        email: sub.submittedByEmail,
        isActionable: true,
        actionUrl: '/admin-studio',
      })
    })

    // Map login/access requests
    helpRequestsRes.docs.forEach((req: any) => {
      notifications.push({
        id: req.id,
        type: 'access_request',
        title: req.issueType === 'access_request' ? 'Access / Join Request' : 'Login Help Ticket',
        message: `${req.contactIdentifier} requested login details from Admin.`,
        time: req.createdAt,
        status: req.status,
        author: req.contactIdentifier,
        isActionable: true,
        actionUrl: '/admin',
      })
    })

    // Map referrals
    referralsRes.docs.forEach((ref: any) => {
      notifications.push({
        id: ref.id,
        type: 'referral',
        title: 'Referral Registered',
        message: `${ref.referrerName} referred ${ref.candidateName} (+500 MNI Coins credited).`,
        time: ref.createdAt,
        status: ref.status,
        author: ref.referrerName,
        isActionable: false,
      })
    })

    // Sort descending by time
    notifications.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

    const unreadCount = notifications.filter(
      (n) => n.status === 'pending' || n.type === 'profile_update'
    ).length

    return NextResponse.json({
      notifications,
      unreadCount,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
