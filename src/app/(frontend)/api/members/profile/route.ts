import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function GET(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const memberId = searchParams.get('memberId')

    let where: any = {}
    if (email) {
      where = { email: { equals: email.trim().toLowerCase() } }
    } else if (memberId) {
      where = { memberId: { equals: memberId.trim() } }
    } else {
      // Default to Nishant Dhiman or first member
      where = { fullName: { equals: 'Nishant Dhiman' } }
    }

    const result = await payload.find({
      collection: 'members',
      where,
      limit: 1,
    })

    if (result.totalDocs === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    return NextResponse.json({ member: result.docs[0] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await req.json()
    const {
      id,
      email,
      memberId,
      fullName,
      phone,
      city,
      businessName,
      businessCategory,
      bio,
      whatWeDo,
      keyProductService,
      idealClient,
      opportunityLookingFor,
      targetConnections,
      preferredCallDay,
      preferredCallTime,
      websiteUrl,
      additionalNotes,
    } = body

    // 1. Locate member
    let memberDoc: any = null
    if (id) {
      memberDoc = await payload.findByID({ collection: 'members', id })
    } else if (email) {
      const found = await payload.find({
        collection: 'members',
        where: { email: { equals: String(email).trim().toLowerCase() } },
        limit: 1,
      })
      if (found.totalDocs > 0) memberDoc = found.docs[0]
    } else if (memberId) {
      const found = await payload.find({
        collection: 'members',
        where: { memberId: { equals: String(memberId).trim() } },
        limit: 1,
      })
      if (found.totalDocs > 0) memberDoc = found.docs[0]
    }

    if (!memberDoc) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    // 2. Prepare allowlisted updates
    const updateData: Record<string, any> = {}
    if (fullName !== undefined) updateData.fullName = String(fullName).trim()
    if (phone !== undefined) updateData.phone = String(phone).trim()
    if (city !== undefined) updateData.city = String(city).trim()
    if (businessName !== undefined) updateData.businessName = String(businessName).trim()
    if (businessCategory !== undefined) updateData.businessCategory = String(businessCategory).trim()
    if (bio !== undefined) updateData.bio = String(bio).trim()
    if (whatWeDo !== undefined) updateData.whatWeDo = String(whatWeDo).trim()
    if (keyProductService !== undefined) updateData.keyProductService = String(keyProductService).trim()
    if (idealClient !== undefined) updateData.idealClient = String(idealClient).trim()
    if (opportunityLookingFor !== undefined) updateData.opportunityLookingFor = String(opportunityLookingFor).trim()
    if (targetConnections !== undefined) updateData.targetConnections = String(targetConnections).trim()
    if (preferredCallDay !== undefined) updateData.preferredCallDay = preferredCallDay
    if (preferredCallTime !== undefined) updateData.preferredCallTime = preferredCallTime
    if (websiteUrl !== undefined) updateData.websiteUrl = String(websiteUrl).trim()
    if (additionalNotes !== undefined) updateData.additionalNotes = String(additionalNotes).trim()

    // 3. Immediately update the member document in Payload -> STILL IT WILL BE UPDATED TO ALL
    const updatedMember = await payload.update({
      collection: 'members',
      id: memberDoc.id,
      overrideAccess: true,
      data: updateData,
    })

    // 4. Summarize changes for Admin review queue
    const changedFields: string[] = []
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== (memberDoc as any)[key]) {
        changedFields.push(key)
      }
    })

    const summaryText = changedFields.length > 0
      ? `Updated fields: ${changedFields.join(', ')}.

Key details:
- What We Do: ${updateData.whatWeDo || '(unchanged)'}
- Key Product/Service: ${updateData.keyProductService || '(unchanged)'}
- Opportunities Seeking: ${updateData.opportunityLookingFor || '(unchanged)'}
- Preferred Call: ${updateData.preferredCallDay || memberDoc.preferredCallDay} • ${updateData.preferredCallTime || memberDoc.preferredCallTime}`
      : 'Profile details re-confirmed by member.'

    // 5. Create Review Task in Submissions Collection -> ADMIN WILL REVIEW IT
    const reviewSubmission = await payload.create({
      collection: 'submissions',
      overrideAccess: true,
      data: {
        title: `Profile Update: ${updatedMember.fullName} (${updatedMember.businessName})`,
        category: 'Profile Update',
        description: summaryText,
        profileChanges: JSON.stringify(updateData, null, 2),
        submittedByName: updatedMember.fullName,
        submittedByEmail: updatedMember.email,
        submittedBy: updatedMember.id,
        status: 'pending',
        adminFeedback: 'New profile details applied live. Awaiting Admin review and verification.',
      },
    })

    return NextResponse.json({
      success: true,
      member: updatedMember,
      reviewSubmission,
      message: 'Profile updated immediately for all network members. Admin has been notified for editorial review.',
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
