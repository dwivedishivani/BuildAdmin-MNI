import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    const requests = await payload.find({
      collection: 'contact-requests',
      sort: '-createdAt',
      limit: 50,
      depth: 2,
    })
    return NextResponse.json(requests)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await req.json()

    const {
      postId,
      targetMemberId,
      targetMemberName,
      targetMemberRole,
      targetMemberEmail,
      targetMemberPhone,
      agendaNote,
    } = body

    if (!targetMemberName) {
      return NextResponse.json({ error: 'Target member name is required.' }, { status: 400 })
    }

    const newRequest = await payload.create({
      collection: 'contact-requests',
      data: {
        post: postId || null,
        targetMember: targetMemberId || null,
        targetMemberName,
        targetMemberRole: targetMemberRole || 'Network Member',
        targetMemberEmail: targetMemberEmail || 'contact@mni.network',
        targetMemberPhone: targetMemberPhone || '+91 98000 00000',
        requestedByName: 'Shivani Dwivedi',
        requestedByEmail: 'shivani@example.com',
        agendaNote: agendaNote || '',
        status: 'pending',
      },
    })

    return NextResponse.json({ success: true, request: newRequest })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
