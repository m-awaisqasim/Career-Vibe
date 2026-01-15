import { NextRequest, NextResponse } from 'next/server'

interface PortfolioData {
  name: string
  title: string
  email: string
  linkedin?: string
  github?: string
  bio: string
  skills: string[]
  projects: Array<{
    id: string
    name: string
    description: string
    githubLink?: string
    technologies?: string[]
    highlights?: string[]
  }>
  theme: string
}

const themes = {
  modern: {
    container: 'bg-gradient-to-br from-slate-50 via-white to-slate-100',
    header: 'bg-gradient-to-r from-violet-600 to-purple-600',
    card: 'bg-white border-slate-200 shadow-lg',
    text: 'text-slate-900',
    muted: 'text-slate-600',
    accent: 'text-violet-600',
    badge: 'bg-violet-100 text-violet-700 border-violet-200'
  },
  elegant: {
    container: 'bg-gradient-to-br from-amber-50 via-white to-orange-50',
    header: 'bg-gradient-to-r from-amber-600 to-orange-600',
    card: 'bg-white border-amber-200 shadow-lg',
    text: 'text-amber-950',
    muted: 'text-amber-800',
    accent: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  minimal: {
    container: 'bg-gradient-to-br from-slate-100 via-white to-gray-100',
    header: 'bg-gradient-to-r from-slate-800 to-slate-900',
    card: 'bg-white border-slate-300 shadow-md',
    text: 'text-slate-900',
    muted: 'text-slate-700',
    accent: 'text-slate-700',
    badge: 'bg-slate-100 text-slate-700 border-slate-200'
  },
  vibrant: {
    container: 'bg-gradient-to-br from-pink-50 via-white to-purple-50',
    header: 'bg-gradient-to-r from-pink-500 to-violet-600',
    card: 'bg-white border-pink-200 shadow-lg',
    text: 'text-pink-950',
    muted: 'text-pink-800',
    accent: 'text-pink-600',
    badge: 'bg-pink-100 text-pink-700 border-pink-200'
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: PortfolioData = await request.json()

    if (!data.name || !data.email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      )
    }

    const theme = themes[data.theme as keyof typeof themes] || themes.modern

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name} - ${data.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="${theme.container} min-h-screen">
  <!-- Header Section -->
  <header class="${theme.header} text-white py-16 px-4">
    <div class="max-w-5xl mx-auto text-center">
      <div class="mb-6">
        <div class="w-32 h-32 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl font-bold">
          ${data.name.charAt(0).toUpperCase()}
        </div>
      </div>
      <h1 class="text-4xl md:text-5xl font-bold mb-3">${data.name}</h1>
      <p class="text-xl md:text-2xl text-white/90 mb-6">${data.title}</p>
      <div class="flex justify-center gap-4 flex-wrap">
        <a href="mailto:${data.email}" class="flex items-center gap-2 hover:underline">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          ${data.email}
        </a>
        ${data.linkedin ? `
        <a href="${data.linkedin}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 hover:underline">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </a>` : ''}
        ${data.github ? `
        <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 hover:underline">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>` : ''}
      </div>
    </div>
  </header>

  <!-- Bio Section -->
  <section class="py-12 px-4">
    <div class="max-w-5xl mx-auto">
      <div class="${theme.card} rounded-2xl p-8">
        <h2 class="text-3xl font-bold mb-4">About Me</h2>
        <p class="text-lg ${theme.muted} leading-relaxed">${data.bio}</p>
      </div>
    </div>
  </section>

  ${data.skills.length > 0 ? `
  <!-- Skills Section -->
  <section class="py-12 px-4">
    <div class="max-w-5xl mx-auto">
      <h2 class="text-3xl font-bold mb-6 text-center">Skills & Technologies</h2>
      <div class="${theme.card} rounded-2xl p-8">
        <div class="flex flex-wrap gap-3 justify-center">
          ${data.skills.map(skill => `<span class="px-4 py-2 text-base font-medium ${theme.badge}">${skill}</span>`).join('')}
        </div>
      </div>
    </div>
  </section>` : ''}

  ${data.projects.length > 0 ? `
  <!-- Projects Section -->
  <section class="py-12 px-4">
    <div class="max-w-5xl mx-auto">
      <h2 class="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
      <div class="grid md:grid-cols-2 gap-6">
        ${data.projects.map(project => `
        <div class="${theme.card} overflow-hidden hover:shadow-xl transition-shadow">
          <div class="p-6">
            <div class="flex items-start justify-between mb-3">
              <h3 class="text-xl font-bold">${project.name}</h3>
              ${project.githubLink ? `
              <a href="${project.githubLink}" target="_blank" rel="noopener noreferrer" class="${theme.accent} hover:underline">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>` : ''}
            </div>
            <p class="mb-4 ${theme.muted}">${project.description}</p>
            ${project.highlights && project.highlights.length > 0 ? `
            <ul class="space-y-2 mb-4">
              ${project.highlights.map(highlight => `
              <li class="flex items-start gap-2 text-sm">
                <span class="mt-1.5 ${theme.accent}">•</span>
                <span class="${theme.muted}">${highlight}</span>
              </li>`).join('')}
            </ul>` : ''}
            ${project.technologies && project.technologies.length > 0 ? `
            <div class="flex flex-wrap gap-2">
              ${project.technologies.map(tech => `<span class="text-xs ${theme.badge}">${tech}</span>`).join('')}
            </div>` : ''}
          </div>
        </div>`).join('')}
      </div>
    </div>
  </section>` : ''}

  <!-- Footer -->
  <footer class="${theme.header} text-white py-8 px-4">
    <div class="max-w-5xl mx-auto text-center">
      <p class="text-white/90">
        © ${new Date().getFullYear()} ${data.name}. Built with Career-Vibe Portfolio Generator.
      </p>
    </div>
  </footer>
</body>
</html>`

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="${data.name.replace(/\s+/g, '-').toLowerCase()}-portfolio.html"`
      }
    })
  } catch (error) {
    console.error('Portfolio export error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export portfolio' },
      { status: 500 }
    )
  }
}
