import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await req.json()
    const { id, calledContact, conversationTookPlace, businessGenerated, gaveBusiness, remarks } = body

    if (!id) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 })
    }

    const updated = await payload.update({
      collection: 'contact-requests',
      id,
      data: {
        status: 'outcome_recorded',
        followUp: {
          calledContact: Boolean(calledContact),
          conversationTookPlace: Boolean(conversationTookPlace),
          businessGenerated: Boolean(businessGenerated),
          gaveBusiness: gaveBusiness || 'gave',
          remarks: remarks || '',
          recordedAt: new Date().toISOString(),
        },
      },
    })

    return NextResponse.json({ success: true, request: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
