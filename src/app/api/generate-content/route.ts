import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json()

    if (!description) {
      return NextResponse.json(
        { success: false, error: 'Project description is required' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    const systemPrompt = `You are an expert portfolio content writer. Your task is to enhance project descriptions for professional portfolios.

Given a project description, you should:
1. Extract or generate 3-5 key highlights/bullet points that showcase the project's achievements, features, or impact
2. Identify relevant technologies used (if not explicitly mentioned, infer likely technologies based on the description)
3. Make the content professional, concise, and impressive

IMPORTANT: Respond with valid JSON ONLY, in the following format:
{
  "highlights": ["highlight 1", "highlight 2", "highlight 3"],
  "technologies": ["Technology1", "Technology2", "Technology3"]
}

No additional text, no explanations, just the JSON.`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Project Description: "${description}"`
        }
      ],
      thinking: { type: 'disabled' }
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response
    let content
    try {
      content = JSON.parse(response)
    } catch (e) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        content = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Failed to parse AI response as JSON')
      }
    }

    return NextResponse.json({
      success: true,
      content: {
        highlights: content.highlights || [],
        technologies: content.technologies || []
      }
    })
  } catch (error) {
    console.error('Content generation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate content'
      },
      { status: 500 }
    )
  }
}
