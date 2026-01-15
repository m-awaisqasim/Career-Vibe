'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Github, Linkedin, Mail, MapPin, ExternalLink, Github as GithubIcon } from 'lucide-react'
import type { PortfolioData } from '@/app/page'

interface PortfolioPreviewProps {
  data: PortfolioData
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

export default function PortfolioPreview({ data }: PortfolioPreviewProps) {
  const theme = themes[data.theme as keyof typeof themes] || themes.modern

  if (!data.name) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Please fill in your information to see the preview</p>
        </Card>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme.container}`}>
      {/* Header Section */}
      <header className={`${theme.header} text-white py-16 px-4`}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-6">
            <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl font-bold">
              {data.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{data.name}</h1>
          <p className="text-xl md:text-2xl text-white/90 mb-6">{data.title}</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href={`mailto:${data.email}`} className="flex items-center gap-2 hover:underline">
              <Mail className="w-5 h-5" />
              {data.email}
            </a>
            {data.linkedin && (
              <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </a>
            )}
            {data.github && (
              <a href={data.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                <Github className="w-5 h-5" />
                GitHub
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Bio Section */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className={`${theme.card} rounded-2xl p-8`}>
            <h2 className="text-3xl font-bold mb-4">About Me</h2>
            <p className={`text-lg ${theme.muted} leading-relaxed`}>{data.bio}</p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {data.skills.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Skills & Technologies</h2>
            <div className={`${theme.card} rounded-2xl p-8`}>
              <div className="flex flex-wrap gap-3 justify-center">
                {data.skills.map(skill => (
                  <Badge key={skill} className={`px-4 py-2 text-base font-medium ${theme.badge}`}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {data.projects.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {data.projects.map(project => (
                <Card key={project.id} className={`${theme.card} overflow-hidden hover:shadow-xl transition-shadow`}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold">{project.name}</h3>
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-1 ${theme.accent} hover:underline`}
                        >
                          <GithubIcon className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className={`mb-4 ${theme.muted}`}>{project.description}</p>

                    {project.highlights && project.highlights.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {project.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className={`mt-1.5 ${theme.accent}`}>•</span>
                            <span className={theme.muted}>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map(tech => (
                          <Badge key={tech} className={`text-xs ${theme.badge}`}>
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={`${theme.header} text-white py-8 px-4 mt-auto`}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-white/90">
            © {new Date().getFullYear()} {data.name}. Built with Career-Vibe Portfolio Generator.
          </p>
        </div>
      </footer>
    </div>
  )
}
