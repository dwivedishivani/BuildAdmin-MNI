import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    const banners = await payload.find({
      collection: 'banners',
      where: {
        isActive: { equals: true },
      },
      sort: 'sortOrder',
      limit: 10,
      depth: 2,
    })
    return NextResponse.json(banners)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await req.json()
    const { title, subtitle, category, imageUrlFallback, actionLabel, actionLink } = body

    const banner = await payload.create({
      collection: 'banners',
      overrideAccess: true,
      data: {
        title,
        subtitle,
        category: category || 'SPONSORED',
        imageUrlFallback: imageUrlFallback || '',
        actionLabel: actionLabel || 'Learn more',
        actionLink: actionLink || '#',
        isActive: true,
        sortOrder: 0,
      },
    })

    return NextResponse.json({ success: true, banner })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
