'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Github, Linkedin, Mail, ExternalLink, Github as GithubIcon, Code2, Award, Star, ArrowRight } from 'lucide-react'
import type { PortfolioData } from '@/app/page'
import { useEffect, useRef } from 'react'

interface PortfolioPreviewProps {
  data: PortfolioData
}

const themes = {
  modern: {
    container: 'bg-gradient-to-br from-violet-50 via-white to-purple-50',
    header: 'bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-700',
    card: 'bg-white border-violet-100 shadow-xl hover:shadow-2xl hover:-translate-y-1',
    text: 'text-slate-900',
    muted: 'text-slate-600',
    accent: 'text-violet-600',
    badge: 'bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border-violet-200',
    button: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700'
  },
  elegant: {
    container: 'bg-gradient-to-br from-amber-50 via-white to-orange-50',
    header: 'bg-gradient-to-br from-amber-600 via-orange-600 to-red-600',
    card: 'bg-white border-amber-100 shadow-xl hover:shadow-2xl hover:-translate-y-1',
    text: 'text-amber-950',
    muted: 'text-amber-800',
    accent: 'text-amber-600',
    badge: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-200',
    button: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
  },
  minimal: {
    container: 'bg-gradient-to-br from-slate-100 via-white to-gray-100',
    header: 'bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900',
    card: 'bg-white border-slate-200 shadow-xl hover:shadow-2xl hover:-translate-y-1',
    text: 'text-slate-900',
    muted: 'text-slate-700',
    accent: 'text-slate-700',
    badge: 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border-slate-200',
    button: 'bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900'
  },
  vibrant: {
    container: 'bg-gradient-to-br from-pink-50 via-white to-purple-50',
    header: 'bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600',
    card: 'bg-white border-pink-100 shadow-xl hover:shadow-2xl hover:-translate-y-1',
    text: 'text-pink-950',
    muted: 'text-pink-800',
    accent: 'text-pink-600',
    badge: 'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 border-pink-200',
    button: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'
  }
}

// Animation variants
const fadeInUp = 'animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards'

export default function PortfolioPreview({ data }: PortfolioPreviewProps) {
  const theme = themes[data.theme as keyof typeof themes] || themes.modern
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0')
            entry.target.classList.remove('opacity-0', 'translate-y-8')
          }
        })
      },
      { threshold: 0.1 }
    )

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  if (!data.name) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="p-12 text-center max-w-md border-2 border-dashed shadow-xl">
          <Code2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">Please fill in your information to see the preview</p>
        </Card>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme.container}`}>
      {/* Animated background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Header Section */}
      <header className={`${theme.header} text-white py-20 px-4 relative overflow-hidden`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Animated Avatar */}
          <div className="mb-8 animate-in fade-in zoom-in-95 duration-1000">
            <div className="relative inline-block">
              <div className="w-40 h-40 mx-auto bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-6xl font-bold shadow-2xl border-4 border-white/30">
                {data.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 rounded-full" />
            </div>
          </div>

          {/* Animated name and title */}
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-in slide-in-from-bottom-4 duration-700 delay-200">
            {data.name}
          </h1>
          <p className="text-2xl md:text-3xl text-white/95 mb-8 font-light animate-in slide-in-from-bottom-4 duration-700 delay-300">
            {data.title}
          </p>

          {/* Social Links */}
          <div className="flex justify-center gap-6 flex-wrap animate-in slide-in-from-bottom-4 duration-700 delay-500">
            <a
              href={`mailto:${data.email}`}
              className="group flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-105"
            >
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">{data.email}</span>
            </a>
            {data.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-105"
              >
                <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">LinkedIn</span>
              </a>
            )}
            {data.github && (
              <a
                href={data.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-105"
              >
                <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">GitHub</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Bio Section */}
      <section
        ref={(el) => (sectionRefs.current[0] = el)}
        className="py-16 px-4 opacity-0 translate-y-8 transition-all duration-700"
      >
        <div className="max-w-4xl mx-auto">
          <div className={`${theme.card} rounded-3xl p-10 border-2`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-xl ${theme.badge}`}>
                <Award className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold">About Me</h2>
            </div>
            <p className={`text-lg ${theme.muted} leading-relaxed`}>{data.bio}</p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {data.skills.length > 0 && (
        <section
          ref={(el) => (sectionRefs.current[1] = el)}
          className="py-16 px-4 opacity-0 translate-y-8 transition-all duration-700"
        >
          <div className="max-w-4xl mx-auto">
            <div className={`${theme.card} rounded-3xl p-10 border-2`}>
              <div className="flex items-center gap-3 mb-8">
                <div className={`p-3 rounded-xl ${theme.badge}`}>
                  <Code2 className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold">Skills & Technologies</h2>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                {data.skills.map((skill, index) => (
                  <Badge
                    key={skill}
                    className={`px-5 py-3 text-base font-semibold ${theme.badge} transform transition-all duration-300 hover:scale-110 hover:-translate-y-1 cursor-default`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
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
        <section
          ref={(el) => (sectionRefs.current[2] = el)}
          className="py-16 px-4 opacity-0 translate-y-8 transition-all duration-700"
        >
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8 justify-center">
              <div className={`p-3 rounded-xl ${theme.badge}`}>
                <Star className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold">Featured Projects</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {data.projects.map((project, index) => (
                <Card
                  key={project.id}
                  className={`${theme.card} overflow-hidden border-2 group transition-all duration-500 hover:-translate-y-2`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-bold">{project.name}</h3>
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme.button} text-white transition-all duration-300 hover:scale-105 group-hover:translate-x-1`}
                        >
                          <GithubIcon className="w-4 h-4" />
                          <span className="hidden sm:inline">View</span>
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                        </a>
                      )}
                    </div>
                    <p className={`mb-6 text-base leading-relaxed ${theme.muted}`}>{project.description}</p>

                    {project.highlights && project.highlights.length > 0 && (
                      <ul className="space-y-3 mb-6">
                        {project.highlights.map((highlight, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-sm transition-all duration-300 hover:translate-x-2"
                          >
                            <div className={`mt-1.5 w-2 h-2 rounded-full ${theme.button.replace(/text.*/g, '').replace(/bg-.*/g, 'bg-gradient-to-r from-violet-500 to-purple-500').replace('from-violet-500 to-purple-500', theme.button.includes('violet') ? 'from-violet-500 to-purple-500' : theme.button.includes('amber') ? 'from-amber-500 to-orange-500' : theme.button.includes('slate') ? 'from-slate-500 to-slate-600' : 'from-pink-500 to-rose-500')}`} />
                            <span className={`${theme.muted} flex-1 leading-relaxed`}>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {project.technologies && project.technologies.length > 0 && (
                      <div className="pt-4 border-t-2 border-dashed">
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, idx) => (
                            <Badge
                              key={tech}
                              className={`text-xs font-medium px-3 py-1.5 ${theme.badge} transform transition-all duration-300 hover:scale-110`}
                              style={{ animationDelay: `${idx * 30}ms` }}
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <a
            href={`mailto:${data.email}`}
            className={`inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white rounded-full ${theme.button} transition-all duration-300 hover:scale-105 hover:shadow-xl`}
          >
            Get in Touch
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${theme.header} text-white py-10 px-4 mt-auto`}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5" />
              <span className="font-semibold">Career-Vibe Portfolio Generator</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-white/30" />
            <p className="text-white/90">
              © {new Date().getFullYear()} {data.name}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
