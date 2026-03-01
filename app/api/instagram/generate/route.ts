import { NextResponse } from 'next/server'
import { generatePost, convertNewsToPost } from '@/lib/instagram/pipeline'
import type { ContentCategory } from '@/types/instagram'

export async function POST(request: Request) {
  const body = await request.json()

  try {
    let post

    if (body.news_title && body.news_description) {
      // News-to-Instagram pipeline
      post = await convertNewsToPost(
        body.news_title,
        body.news_description,
        body.news_url
      )
    } else {
      // Regular content generation
      post = await generatePost(
        body.category as ContentCategory | undefined,
        body.custom_topic,
        body.template_id
      )
    }

    return NextResponse.json({ data: post, message: 'Content generated successfully' }, { status: 201 })
  } catch (error) {
    console.error('Content generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 }
    )
  }
}
