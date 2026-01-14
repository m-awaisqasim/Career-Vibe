import { NextRequest, NextResponse } from 'next/server'
import { LLM } from 'z-ai-web-dev-sdk'

export async function POST(req: NextRequest) {
  try {
    const { repoUrl, description, languages } = await req.json()

    if (!description && !languages) {
      return NextResponse.json({ error: 'Project information is required' }, { status: 400 })
    }

    const languageList = Array.isArray(languages) ? languages.join(', ') : languages || 'various technologies'

    const prompt = `Write a compelling 2-3 sentence executive summary for a project with the following details:

    Project Description: ${description || 'No description provided'}
    Technologies Used: ${languageList}

    The summary should:
    - Highlight the problem this project solves
    - Emphasize technical skills and problem-solving abilities
    - Show the impact and value created
    - Be professional and concise (under 150 words)

    Summary:`

    const llm = new LLM()

    const response = await llm.chat({
      messages: [
        {
          role: 'system',
          content: 'You are a technical writer who helps developers create impactful project summaries for their portfolios. Focus on highlighting technical achievements, problem-solving skills, and measurable impact.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7
    })

    const summary = response?.choices?.[0]?.message?.content || ''

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Summary generation error:', error)
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 })
  }
}
