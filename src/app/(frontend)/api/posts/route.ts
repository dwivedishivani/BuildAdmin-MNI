import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    const posts = await payload.find({
      collection: 'posts',
      where: {
        isPublished: { equals: true },
        isArchived: { not_equals: true },
      },
      sort: 'displayOrder',
      limit: 50,
      depth: 2,
    })
    return NextResponse.json(posts)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: req.headers })
    if (user?.collection !== 'admins') {
      return NextResponse.json({ error: 'Only MNI Admin can publish timeline posts.' }, { status: 403 })
    }
    const body = await req.json()
    const { title, postType, category, badgeText, content, imageUrlFallback, taggedMemberId } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const newPost = await payload.create({
      collection: 'posts',
      overrideAccess: false,
      user,
      data: {
        title,
        postType: postType || 'text_only',
        category: category || 'Opportunity',
        badgeText: badgeText || 'MNI BULLETIN',
        content: content || '',
        imageUrlFallback: imageUrlFallback || '',
        taggedMember: taggedMemberId || null,
        isPublished: true,
        publishedAt: new Date().toISOString(),
        displayOrder: 0,
      },
    })

    return NextResponse.json({ success: true, post: newPost })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
