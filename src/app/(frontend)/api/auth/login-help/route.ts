import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await req.json()
    const { contactIdentifier, email, phone, whatsapp, issueType, details } = body

    const resolvedIdentifier = contactIdentifier || email || phone || whatsapp
    if (!resolvedIdentifier) {
      return NextResponse.json({ error: 'Email or contact number is required.' }, { status: 400 })
    }

    const helpReq = await payload.create({
      collection: 'login-help-requests',
      data: {
        contactIdentifier: String(resolvedIdentifier).trim(),
        email: email ? String(email).trim().toLowerCase() : undefined,
        phone: phone ? String(phone).trim() : undefined,
        whatsapp: whatsapp ? String(whatsapp).trim() : undefined,
        issueType: issueType || 'access_request',
        details: details || (whatsapp ? `WhatsApp Contact: ${whatsapp}` : 'Access request from login screen'),
        status: 'pending',
      },
    })

    return NextResponse.json({ success: true, ticket: helpReq })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
