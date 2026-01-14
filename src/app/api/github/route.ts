import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { repoUrl } = await req.json()

    if (!repoUrl) {
      return NextResponse.json({ error: 'Repository URL is required' }, { status: 400 })
    }

    // Parse GitHub URL
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!match) {
      return NextResponse.json({ error: 'Invalid GitHub repository URL' }, { status: 400 })
    }

    const [, owner, repo] = match

    // Fetch repository data from GitHub API
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json'
      }
    })

    if (!repoResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch repository data' }, { status: 400 })
    }

    const repoData = await repoResponse.json()

    // Fetch languages
    const languagesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
      headers: {
        Accept: 'application/vnd.github.v3+json'
      }
    })

    const languagesData = languagesResponse.ok ? await languagesResponse.json() : {}
    const languages = Object.keys(languagesData)

    // Fetch README
    const readmeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: {
        Accept: 'application/vnd.github.v3+json'
      }
    })

    let description = repoData.description || ''

    if (readmeResponse.ok) {
      const readmeData = await readmeResponse.json()
      // Decode base64 content
      const content = Buffer.from(readmeData.content, 'base64').toString('utf-8')

      // Extract first paragraph from README
      const firstParagraph = content.split('\n\n')[0]
        .replace(/[#*`]/g, '')
        .trim()

      if (firstParagraph && firstParagraph.length < 500) {
        description = firstParagraph
      }
    }

    return NextResponse.json({
      name: repoData.name,
      description,
      languages,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      url: repoData.html_url
    })
  } catch (error) {
    console.error('GitHub API error:', error)
    return NextResponse.json({ error: 'Failed to fetch repository data' }, { status: 500 })
  }
}
