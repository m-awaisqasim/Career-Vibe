import { NextRequest, NextResponse } from 'next/server'
import { LLM } from 'z-ai-web-dev-sdk'

export async function POST(req: NextRequest) {
  try {
    const { targetRole, projects } = await req.json()

    if (!targetRole) {
      return NextResponse.json({ error: 'Target role is required' }, { status: 400 })
    }

    const projectNames = projects?.filter(Boolean).join(', ') || 'various projects'

    const prompt = `Write a compelling professional bio for a ${targetRole} who has built the following projects: ${projectNames}.

    The bio should:
    - Be 3-4 sentences long
    - Highlight problem-solving skills and technical expertise
    - Be professional yet authentic
    - Show enthusiasm for the role
    - Avoid clichés and generic statements

    Bio:`

    const llm = new LLM()

    const response = await llm.chat({
      messages: [
        {
          role: 'system',
          content: 'You are a professional career coach who helps developers write compelling bios for their portfolios. Write bios that are authentic, professional, and highlight unique strengths.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7
    })

    const bio = response?.choices?.[0]?.message?.content || ''

    return NextResponse.json({ bio })
  } catch (error) {
    console.error('Bio generation error:', error)
    return NextResponse.json({ error: 'Failed to generate bio' }, { status: 500 })
  }
}
