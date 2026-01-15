import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'GitHub URL is required' },
        { status: 400 }
      )
    }

    // Extract owner and repo name from GitHub URL
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!match) {
      return NextResponse.json(
        { success: false, error: 'Invalid GitHub URL format' },
        { status: 400 }
      )
    }

    const [, owner, repo] = match

    // Fetch repository data from GitHub API
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!repoResponse.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch repository data' },
        { status: repoResponse.status }
      )
    }

    const repoData = await repoResponse.json()

    // Try to fetch languages to extract technologies
    let technologies: string[] = []
    try {
      const languagesResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/languages`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        }
      )

      if (languagesResponse.ok) {
        const languagesData = await languagesResponse.json()
        technologies = Object.keys(languagesData)
          .slice(0, 5)
          .map(lang => lang.charAt(0).toUpperCase() + lang.slice(1))
      }
    } catch (error) {
      console.error('Failed to fetch languages:', error)
    }

    return NextResponse.json({
      success: true,
      repo: {
        name: repoData.name,
        description: repoData.description || '',
        technologies,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        url: repoData.html_url
      }
    })
  } catch (error) {
    console.error('GitHub repo fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch repository data' },
      { status: 500 }
    )
  }
}
