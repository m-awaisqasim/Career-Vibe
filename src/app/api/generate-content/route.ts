import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { description, projectName, githubUrl, languages } = await request.json()

    if (!description) {
      return NextResponse.json(
        { success: false, error: 'Project description is required' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    // Build context from available information
    let context = `Project Name: ${projectName || 'Not specified'}\n`
    if (githubUrl) {
      context += `GitHub URL: ${githubUrl}\n`
    }
    if (languages && languages.length > 0) {
      context += `Languages/Technologies from repo: ${languages.join(', ')}\n`
    }
    context += `Description: ${description}\n`

    const systemPrompt = `You are an expert portfolio content writer specializing in developer projects. Your task is to create professional, specific, and relevant highlights for project portfolios.

INSTRUCTIONS:
1. Analyze the provided project information (name, description, GitHub URL, languages)
2. Generate 3-5 specific, concrete highlights that describe what the project actually DOES and ACHIEVES
3. Focus on features, technical implementation, and impact - DO NOT make up generic claims
4. Each highlight should be specific to this particular project, not generic buzzwords
5. If description is detailed, extract the actual achievements mentioned
6. If description is brief, make reasonable inferences based on the tech stack and project name
7. Avoid generic statements like "User-friendly interface" or "Modern design" - be specific
8. Technologies should be inferred from description and languages - only list technologies actually mentioned or reasonably inferred

CRITICAL RULES:
- Be SPECIFIC and FACTUAL about what this project does
- Don't mention features not indicated by the description
- Each highlight should be unique and meaningful
- Highlights should showcase technical skills and problem-solving
- Make them achievement-focused when possible

Respond with valid JSON ONLY, in this format:
{
  "highlights": [
    "Specific technical achievement or feature",
    "Another concrete detail about the project",
    "Third highlight showing impact or unique aspect"
  ],
  "technologies": ["Tech1", "Tech2", "Tech3"]
}

No markdown, no code blocks, no explanations, no additional text - ONLY the JSON.`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: systemPrompt
        },
        {
          role: 'user',
          content: context
        }
      ],
      thinking: { type: 'disabled' }
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('No response from AI')
    }

    // Parse JSON response - try to extract clean JSON
    let content
    try {
      // First, try direct parse
      content = JSON.parse(response.trim())
    } catch (e) {
      try {
        // If that fails, look for JSON in markdown code blocks
        const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/)
        if (jsonMatch) {
          content = JSON.parse(jsonMatch[1])
        } else {
          // Last resort: try to find any JSON-like structure
          const jsonMatch = response.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            content = JSON.parse(jsonMatch[0])
          } else {
            throw new Error('Failed to parse AI response as JSON')
          }
        }
      } catch (e2) {
        throw new Error(`Failed to parse AI response: ${response}`)
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
