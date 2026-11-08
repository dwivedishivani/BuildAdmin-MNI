import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    const submissions = await payload.find({
      collection: 'submissions',
      sort: '-createdAt',
      limit: 50,
      depth: 2,
    })
    return NextResponse.json(submissions)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await req.json()

    const { title, category, description, submittedByName, submittedByEmail, supportingImageUrl } = body

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required.' }, { status: 400 })
    }

    // Direct publishing by members is strictly prohibited.
    // Status is always initialized as 'pending' for Admin review.
    const newDoc = await payload.create({
      collection: 'submissions',
      data: {
        title,
        category: category || 'Business Requirement',
        description,
        submittedByName: submittedByName || 'Shivani Dwivedi',
        submittedByEmail: submittedByEmail || 'shivani@example.com',
        supportingImageUrl: supportingImageUrl || '',
        status: 'pending',
      },
    })

    return NextResponse.json({ success: true, submission: newDoc })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
