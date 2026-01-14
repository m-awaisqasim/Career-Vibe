'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Github, ArrowLeft, Share2, Sparkles, Star, GitFork,
  Mail, Linkedin, Twitter, Globe, MapPin, Calendar, ExternalLink
} from 'lucide-react'
import { motion } from 'framer-motion'

interface Project {
  id: string
  repoUrl: string
  name: string
  description: string
  summary: string
  languages: string[]
  stars: number
  forks: number
}

interface Portfolio {
  id: string
  name: string
  bio: string
  targetRole: string
  theme: 'dev' | 'creative' | 'corporate'
  accentColor?: string
  projects: Project[]
}

export default function PortfolioView() {
  const params = useParams()
  const router = useRouter()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`/api/portfolio?id=${params.id}&XTransformPort=3000`)
        const data = await response.json()

        if (response.ok && data.portfolio) {
          setPortfolio(data.portfolio)
        } else {
          setError('Portfolio not found')
        }
      } catch (err) {
        setError('Failed to load portfolio')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPortfolio()
    }
  }, [params.id])

  const sharePortfolio = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: portfolio?.name || 'Portfolio',
          url
        })
      } catch (err) {
        // User cancelled
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(url)
      alert('Portfolio link copied to clipboard!')
    }
  }

  const themeStyles = {
    dev: {
      bg: 'from-slate-950 via-slate-900 to-slate-950',
      text: 'text-slate-100',
      cardBg: 'bg-slate-800/40',
      cardBorder: 'border-slate-700/50',
      accent: portfolio?.accentColor || 'from-cyan-500 to-blue-500'
    },
    creative: {
      bg: 'from-purple-950 via-pink-900 to-rose-950',
      text: 'text-white',
      cardBg: 'bg-white/5',
      cardBorder: 'border-white/10',
      accent: portfolio?.accentColor || 'from-yellow-400 to-orange-500'
    },
    corporate: {
      bg: 'from-blue-950 via-slate-900 to-slate-950',
      text: 'text-slate-100',
      cardBg: 'bg-white/5',
      cardBorder: 'border-white/10',
      accent: portfolio?.accentColor || 'from-emerald-400 to-teal-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl text-white/80">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <ArrowLeft className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white">Portfolio Not Found</h2>
          <p className="text-white/60 mb-8">{error}</p>
          <Button onClick={() => router.push('/')} variant="outline" className="text-white border-white/20 hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Builder
          </Button>
        </div>
      </div>
    )
  }

  const styles = themeStyles[portfolio.theme as keyof typeof themeStyles] || themeStyles.dev

  return (
    <div className={`min-h-screen bg-gradient-to-br ${styles.bg}`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl bg-black/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-white">{portfolio.name}</h1>
              <p className="text-xs text-white/60">Portfolio</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={sharePortfolio}
              className="text-white border-white/20 hover:bg-white/10 hover:border-white/30"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/')}
              className="text-white border-white/20 hover:bg-white/10 hover:border-white/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Builder
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 max-w-7xl relative">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block mb-8"
          >
            <Badge className={`bg-gradient-to-r ${styles.accent} text-white border-0 shadow-2xl px-6 py-2 text-sm font-medium`}>
              {portfolio.theme.charAt(0).toUpperCase() + portfolio.theme.slice(1)} Theme
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={`text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r ${styles.accent} bg-clip-text text-transparent leading-tight`}
          >
            {portfolio.targetRole}
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-12"
          >
            {portfolio.bio}
          </motion.p>

          {/* Social Links */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex justify-center gap-4"
          >
            <motion.a
              href="mailto:contact@example.com"
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all border border-white/20"
            >
              <Mail className="w-6 h-6 text-white" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all border border-white/20"
            >
              <Linkedin className="w-6 h-6 text-white" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all border border-white/20"
            >
              <Twitter className="w-6 h-6 text-white" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all border border-white/20"
            >
              <Globe className="w-6 h-6 text-white" />
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        {portfolio.projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          >
            {[
              { label: 'Projects', value: portfolio.projects.length },
              { label: 'Total Stars', value: portfolio.projects.reduce((sum, p) => sum + p.stars, 0) },
              { label: 'Total Forks', value: portfolio.projects.reduce((sum, p) => sum + p.forks, 0) },
              { label: 'Languages', value: [...new Set(portfolio.projects.flatMap(p => p.languages))].length }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`text-center p-6 rounded-2xl ${styles.cardBg} backdrop-blur-xl border border-white/10`}
              >
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent bg-white">
                  {stat.value}
                </p>
                <p className="text-sm text-white/60 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Featured Projects
          </h3>

          {portfolio.projects.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {portfolio.projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.15 }}
                >
                  <Card className={`${styles.cardBg} ${styles.cardBorder} backdrop-blur-xl border-2 text-white h-full hover:border-white/30 transition-all hover:scale-[1.02] group`}>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-6">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center group-hover:from-white/20 group-hover:to-white/10 transition-all"
                        >
                          <Github className="w-7 h-7 text-white/80" />
                        </motion.div>
                        <div className="flex items-center gap-3">
                          <Badge className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border-amber-500/30 backdrop-blur-sm">
                            <Star className="w-3 h-3 fill-current" />
                            {project.stars}
                          </Badge>
                          <Badge className="flex items-center gap-1 bg-cyan-500/20 text-cyan-300 border-cyan-500/30 backdrop-blur-sm">
                            <GitFork className="w-3 h-3" />
                            {project.forks}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-white text-2xl mb-3">{project.name}</CardTitle>
                      <CardDescription className="text-white/60 text-base">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex flex-wrap gap-2">
                        {project.languages.map((lang) => (
                          <Badge
                            key={lang}
                            className={`bg-gradient-to-r ${styles.accent} bg-opacity-20 text-white/90 border-white/20 backdrop-blur-sm`}
                          >
                            {lang}
                          </Badge>
                        ))}
                      </div>
                      {project.summary && (
                        <p className="text-white/80 leading-relaxed text-sm">
                          {project.summary}
                        </p>
                      )}
                      <Button
                        variant="outline"
                        className="w-full text-white border-white/20 hover:bg-white/10 hover:border-white/30 transition-all group"
                        asChild
                      >
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <Github className="w-4 h-4" />
                          View on GitHub
                          <ExternalLink className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center py-24 ${styles.cardBg} backdrop-blur-xl border border-white/10 rounded-3xl`}
            >
              <Github className="w-20 h-20 text-white/20 mx-auto mb-6" />
              <p className="text-xl text-white/60">No projects in this portfolio yet.</p>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-24 backdrop-blur-xl bg-black/20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <p className="text-sm text-white/60 mb-2">
              Generated with Career-Vibe © 2026
            </p>
            <p className="text-xs text-white/40">
              Transforming GitHub repos into stunning portfolios
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
