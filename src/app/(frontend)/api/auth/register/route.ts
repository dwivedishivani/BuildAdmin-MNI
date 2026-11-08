import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function POST(req: Request) {
  try {
    return NextResponse.json(
      {
        error: 'Public registration is disabled. MNI credentials are exclusively provisioned by MNI Administration. Please submit your details at /login-help.',
      },
      { status: 403 }
    )
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
