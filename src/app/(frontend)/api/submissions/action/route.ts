import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await req.json()
    const { id, action, adminFeedback, postData } = body

    if (!id || !action) {
      return NextResponse.json({ error: 'Submission ID and action are required.' }, { status: 400 })
    }

    if (action === 'request_changes') {
      const updated = await payload.update({
        collection: 'submissions',
        id,
        overrideAccess: true,
        data: {
          status: 'changes_requested',
          adminFeedback: adminFeedback || 'Please provide additional specifications before publication.',
        },
      })
      return NextResponse.json({ success: true, submission: updated })
    }

    if (action === 'reject') {
      const updated = await payload.update({
        collection: 'submissions',
        id,
        overrideAccess: true,
        data: {
          status: 'rejected',
          adminFeedback: adminFeedback || 'Submission does not meet MNI network criteria.',
        },
      })
      return NextResponse.json({ success: true, submission: updated })
    }

    if (action === 'approve') {
      const updated = await payload.update({
        collection: 'submissions',
        id,
        overrideAccess: true,
        data: {
          status: 'approved',
          adminFeedback: adminFeedback || 'Profile changes reviewed and acknowledged by Admin.',
        },
      })
      return NextResponse.json({ success: true, submission: updated })
    }

    if (action === 'approve_and_publish') {
      // 1. Create published Post
      const createdPost = await payload.create({
        collection: 'posts',
        overrideAccess: true,
        data: {
          title: postData?.title || 'MNI Approved Member Requirement',
          category: postData?.category || 'Requirement',
          postType: postData?.postType || 'text_only',
          badgeText: postData?.badgeText || 'MEMBER REQUIREMENT',
          content: postData?.content || '',
          imageUrlFallback: postData?.imageUrl || '',
          taggedMember: postData?.taggedMemberId || null,
          isPublished: true,
          publishedAt: new Date().toISOString(),
        },
      })

      // 2. Mark submission as published
      const updatedSubmission = await payload.update({
        collection: 'submissions',
        id,
        overrideAccess: true,
        data: {
          status: 'published',
          associatedPost: createdPost.id,
          adminFeedback: 'Approved and published to timeline.',
        },
      })

      return NextResponse.json({ success: true, post: createdPost, submission: updatedSubmission })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
