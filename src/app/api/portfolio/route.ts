import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { name, bio, targetRole, theme, accentColor, projects } = await req.json()

    if (!name) {
      return NextResponse.json({ error: 'Portfolio name is required' }, { status: 400 })
    }

    // Check if portfolio with same name exists
    const existingPortfolio = await db.portfolio.findFirst({
      where: { name }
    })

    let portfolio

    if (existingPortfolio) {
      // Update existing portfolio
      portfolio = await db.portfolio.update({
        where: { id: existingPortfolio.id },
        data: {
          bio,
          targetRole,
          theme,
          accentColor,
          projects: {
            deleteMany: {},
            create: projects.map((p: any) => ({
              repoUrl: p.repoUrl,
              name: p.name,
              description: p.description,
              summary: p.summary,
              languages: JSON.stringify(p.languages),
              stars: p.stars,
              forks: p.forks
            }))
          }
        },
        include: { projects: true }
      })
    } else {
      // Create new portfolio
      portfolio = await db.portfolio.create({
        data: {
          name,
          bio,
          targetRole,
          theme,
          accentColor,
          projects: {
            create: projects.map((p: any) => ({
              repoUrl: p.repoUrl,
              name: p.name,
              description: p.description,
              summary: p.summary,
              languages: JSON.stringify(p.languages),
              stars: p.stars,
              forks: p.forks
            }))
          }
        },
        include: { projects: true }
      })
    }

    return NextResponse.json({
      success: true,
      portfolio: {
        ...portfolio,
        projects: portfolio.projects.map(p => ({
          ...p,
          languages: JSON.parse(p.languages)
        }))
      }
    })
  } catch (error) {
    console.error('Portfolio save error:', error)
    return NextResponse.json({ error: 'Failed to save portfolio' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      // Return all portfolios
      const portfolios = await db.portfolio.findMany({
        include: { projects: true },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({
        portfolios: portfolios.map(p => ({
          ...p,
          projects: p.projects.map(proj => ({
            ...proj,
            languages: JSON.parse(proj.languages)
          }))
        }))
      })
    }

    // Return specific portfolio
    const portfolio = await db.portfolio.findUnique({
      where: { id },
      include: { projects: true }
    })

    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
    }

    return NextResponse.json({
      portfolio: {
        ...portfolio,
        projects: portfolio.projects.map(p => ({
          ...p,
          languages: JSON.parse(p.languages)
        }))
      }
    })
  } catch (error) {
    console.error('Portfolio fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
  }
}
