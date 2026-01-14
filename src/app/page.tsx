'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Github, Plus, Trash2, Eye, Sparkles, Save, Share2, Code, Palette,
  Briefcase, AlertCircle, CheckCircle2, Loader2, ExternalLink,
  Star, GitFork, Globe, Mail, Linkedin, Twitter, ArrowLeft
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Project {
  id: string
  repoUrl: string
  name: string
  description: string
  summary: string
  languages: string[]
  stars: number
  forks: number
  isLoading: boolean
  error?: string
}

interface Theme {
  id: 'dev' | 'creative' | 'corporate'
  name: string
  icon: any
  colors: {
    bg: string
    accent: string
    border: string
  }
  description: string
}

const themes: Theme[] = [
  {
    id: 'dev',
    name: 'Dev',
    icon: Code,
    colors: {
      bg: 'from-slate-900 to-slate-800',
      accent: 'from-cyan-500 to-blue-500',
      border: 'border-cyan-500/50'
    },
    description: 'Dark mode, code-focused, technical aesthetics'
  },
  {
    id: 'creative',
    name: 'Creative',
    icon: Palette,
    colors: {
      bg: 'from-purple-900 via-pink-800 to-rose-900',
      accent: 'from-yellow-400 to-orange-500',
      border: 'border-purple-500/50'
    },
    description: 'Bold, expressive, design-forward visuals'
  },
  {
    id: 'corporate',
    name: 'Corporate',
    icon: Briefcase,
    colors: {
      bg: 'from-blue-900 to-slate-900',
      accent: 'from-emerald-400 to-teal-500',
      border: 'border-emerald-500/50'
    },
    description: 'Clean, professional, results-driven design'
  }
]

const targetRoles = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'UI/UX Designer',
  'Product Manager',
  'DevOps Engineer',
  'Mobile Developer',
  'Software Engineer',
  'Data Scientist'
]

const colorAccents = [
  { name: 'Purple', value: 'from-purple-500 to-pink-500' },
  { name: 'Cyan', value: 'from-cyan-500 to-blue-500' },
  { name: 'Emerald', value: 'from-emerald-500 to-teal-500' },
  { name: 'Orange', value: 'from-orange-500 to-red-500' },
  { name: 'Rose', value: 'from-rose-500 to-pink-500' },
  { name: 'Indigo', value: 'from-indigo-500 to-purple-500' }
]

export default function Home() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedTheme, setSelectedTheme] = useState<Theme['id']>('dev')
  const [selectedAccent, setSelectedAccent] = useState(colorAccents[1].value)
  const [targetRole, setTargetRole] = useState('')
  const [portfolioName, setPortfolioName] = useState('')
  const [bio, setBio] = useState('')
  const [isGeneratingBio, setIsGeneratingBio] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const addProject = () => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      repoUrl: '',
      name: '',
      description: '',
      summary: '',
      languages: [],
      stars: 0,
      forks: 0,
      isLoading: false
    }
    setProjects([...projects, newProject])
  }

  const removeProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id))
  }

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setProjects(projects.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const fetchRepoData = async (id: string) => {
    const project = projects.find(p => p.id === id)
    if (!project?.repoUrl) return

    updateProject(id, 'isLoading', true)
    updateProject(id, 'error', undefined)

    try {
      const response = await fetch('/api/github?XTransformPort=3000', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: project.repoUrl })
      })

      const data = await response.json()

      if (response.ok) {
        updateProject(id, 'name', data.name)
        updateProject(id, 'description', data.description)
        updateProject(id, 'languages', data.languages)
        updateProject(id, 'stars', data.stars)
        updateProject(id, 'forks', data.forks)
      } else {
        updateProject(id, 'error', data.error || 'Failed to fetch repository')
      }
    } catch (error) {
      console.error('Failed to fetch repo data:', error)
      updateProject(id, 'error', 'Network error. Please try again.')
    } finally {
      updateProject(id, 'isLoading', false)
    }
  }

  const generateBio = async () => {
    setIsGeneratingBio(true)
    try {
      const response = await fetch('/api/generate-bio?XTransformPort=3000', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          projects: projects.map(p => p.name)
        })
      })

      if (response.ok) {
        const data = await response.json()
        setBio(data.bio)
      } else {
        alert('Failed to generate bio. Please try again.')
      }
    } catch (error) {
      console.error('Failed to generate bio:', error)
      alert('Failed to generate bio. Please check your connection.')
    } finally {
      setIsGeneratingBio(false)
    }
  }

  const generateProjectSummary = async (id: string) => {
    const project = projects.find(p => p.id === id)
    if (!project) return

    updateProject(id, 'isLoading', true)
    try {
      const response = await fetch('/api/generate-summary?XTransformPort=3000', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl: project.repoUrl,
          description: project.description,
          languages: project.languages
        })
      })

      if (response.ok) {
        const data = await response.json()
        updateProject(id, 'summary', data.summary)
      } else {
        alert('Failed to generate summary. Please try again.')
      }
    } catch (error) {
      console.error('Failed to generate summary:', error)
      alert('Failed to generate summary. Please check your connection.')
    } finally {
      updateProject(id, 'isLoading', false)
    }
  }

  const savePortfolio = async () => {
    try {
      const response = await fetch('/api/portfolio?XTransformPort=3000', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: portfolioName,
          bio,
          targetRole,
          theme: selectedTheme,
          accentColor: selectedAccent,
          projects: projects.map(p => ({
            repoUrl: p.repoUrl,
            name: p.name,
            description: p.description,
            summary: p.summary,
            languages: p.languages,
            stars: p.stars,
            forks: p.forks
          }))
        })
      })

      if (response.ok) {
        alert('Portfolio saved successfully!')
      } else {
        alert('Failed to save portfolio. Please try again.')
      }
    } catch (error) {
      console.error('Failed to save portfolio:', error)
      alert('Failed to save portfolio. Please check your connection.')
    }
  }

  const generateAndShare = async () => {
    try {
      const response = await fetch('/api/portfolio?XTransformPort=3000', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: portfolioName,
          bio,
          targetRole,
          theme: selectedTheme,
          accentColor: selectedAccent,
          projects: projects.map(p => ({
            repoUrl: p.repoUrl,
            name: p.name,
            description: p.description,
            summary: p.summary,
            languages: p.languages,
            stars: p.stars,
            forks: p.forks
          }))
        })
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/portfolio/${data.portfolio.id}`)
      } else {
        alert('Failed to generate portfolio. Please try again.')
      }
    } catch (error) {
      console.error('Failed to generate portfolio:', error)
      alert('Failed to generate portfolio. Please check your connection.')
    }
  }

  if (showPreview) {
    return <PortfolioPreview
      portfolioName={portfolioName}
      bio={bio}
      targetRole={targetRole}
      theme={selectedTheme}
      accentColor={selectedAccent}
      projects={projects}
      onBack={() => setShowPreview(false)}
    />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950">
      {/* Header */}
      <header className="border-b bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                Career-Vibe
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Portfolio Generator</p>
            </div>
          </motion.div>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
            Beta v1.0
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
            🚀 Transform GitHub repos into stunning portfolios
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-purple-900 to-pink-900 dark:from-slate-100 dark:via-purple-100 dark:to-pink-100 bg-clip-text text-transparent">
            Your Portfolio, Your Vibe
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Create a professional portfolio in minutes. Import your GitHub projects, choose a theme, and share your proof of work with recruiters.
          </p>
        </motion.div>

        <Tabs defaultValue="builder" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-slate-100 dark:bg-slate-900 p-1">
            <TabsTrigger value="builder" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 shadow-sm">
              <Code className="w-4 h-4 mr-2" />
              Builder
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              onClick={() => setShowPreview(true)}
              disabled={projects.length === 0}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 shadow-sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            {/* Portfolio Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-500" />
                    Portfolio Details
                  </CardTitle>
                  <CardDescription>Set up your portfolio basics</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="portfolioName" className="text-sm font-medium">Portfolio Name</Label>
                      <Input
                        id="portfolioName"
                        placeholder="e.g., John's Developer Portfolio"
                        value={portfolioName}
                        onChange={(e) => setPortfolioName(e.target.value)}
                        className="border-slate-300 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="targetRole" className="text-sm font-medium">Target Role</Label>
                      <Select value={targetRole} onValueChange={setTargetRole}>
                        <SelectTrigger id="targetRole" className="border-slate-300 focus:ring-purple-500 focus:border-purple-500">
                          <SelectValue placeholder="Select your target role" />
                        </SelectTrigger>
                        <SelectContent>
                          {targetRoles.map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateBio}
                        disabled={!targetRole || isGeneratingBio}
                        className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 hover:from-purple-100 hover:to-pink-100"
                      >
                        {isGeneratingBio ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                            AI Generate
                          </>
                        )}
                      </Button>
                    </div>
                    <Textarea
                      id="bio"
                      placeholder="Tell recruiters about yourself and what makes you unique..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      className="border-slate-300 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Color Accent Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20">
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-cyan-500" />
                    Color Accent
                  </CardTitle>
                  <CardDescription>Choose your signature color</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {colorAccents.map((color) => (
                      <motion.button
                        key={color.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedAccent(color.value)}
                        className={`relative p-4 rounded-xl border-2 transition-all ${
                          selectedAccent === color.value
                            ? 'border-slate-900 dark:border-white shadow-lg'
                            : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className={`w-full h-12 rounded-lg bg-gradient-to-br ${color.value} mb-2`} />
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{color.name}</p>
                        {selectedAccent === color.value && (
                          <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-green-500 bg-white dark:bg-slate-900 rounded-full" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Theme Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-amber-500" />
                    Choose Your Vibe
                  </CardTitle>
                  <CardDescription>Select the aesthetic that matches your target job</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    {themes.map((theme) => (
                      <motion.div
                        key={theme.id}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all ${
                            selectedTheme === theme.id
                              ? `${theme.colors.border} border-2 shadow-xl ring-2 ring-purple-500/20`
                              : 'border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                          onClick={() => setSelectedTheme(theme.id)}
                        >
                          <CardContent className="p-6">
                            <div className={`w-full h-28 rounded-xl bg-gradient-to-br ${theme.colors.bg} mb-4 shadow-inner`} />
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <theme.icon className="w-4 h-4 text-white" />
                              </div>
                              <h3 className="font-bold text-lg">{theme.name}</h3>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                              {theme.description}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Projects Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Github className="w-5 h-5 text-green-500" />
                        Your Projects
                      </CardTitle>
                      <CardDescription>Add up to 6 projects from GitHub</CardDescription>
                    </div>
                    <Button
                      onClick={addProject}
                      disabled={projects.length >= 6}
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <AnimatePresence>
                    {projects.map((project) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="border-2 border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 bg-white dark:bg-slate-900/50 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-2">
                              <Github className="w-5 h-5 text-slate-500" />
                              <Input
                                placeholder="https://github.com/username/repo"
                                value={project.repoUrl}
                                onChange={(e) => updateProject(project.id, 'repoUrl', e.target.value)}
                                className="flex-1 border-slate-300 focus:ring-purple-500 focus:border-purple-500"
                              />
                              <Button
                                variant="outline"
                                onClick={() => fetchRepoData(project.id)}
                                disabled={!project.repoUrl || project.isLoading}
                                size="sm"
                                className="border-purple-300 text-purple-600 hover:bg-purple-50"
                              >
                                {project.isLoading ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Loading
                                  </>
                                ) : (
                                  <>
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Fetch
                                  </>
                                )}
                              </Button>
                            </div>

                            {project.error && (
                              <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-800">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{project.error}</AlertDescription>
                              </Alert>
                            )}

                            {project.name && (
                              <div className="space-y-4 pl-7">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-bold text-xl text-slate-900 dark:text-slate-100">{project.name}</h4>
                                  <div className="flex items-center gap-4">
                                    <Badge variant="secondary" className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                                      <Star className="w-3 h-3" />
                                      {project.stars}
                                    </Badge>
                                    <Badge variant="secondary" className="flex items-center gap-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300">
                                      <GitFork className="w-3 h-3" />
                                      {project.forks}
                                    </Badge>
                                  </div>
                                </div>

                                {project.languages.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {project.languages.map((lang) => (
                                      <Badge key={lang} className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                                        {lang}
                                      </Badge>
                                    ))}
                                  </div>
                                )}

                                <Textarea
                                  placeholder="Project description from README"
                                  value={project.description}
                                  onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                                  rows={3}
                                  className="border-slate-300 focus:ring-purple-500 focus:border-purple-500"
                                />

                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">AI-Generated Summary</Label>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => generateProjectSummary(project.id)}
                                      disabled={project.isLoading}
                                      className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-300 text-cyan-600 hover:from-cyan-100 hover:to-blue-100"
                                    >
                                      {project.isLoading ? (
                                        <>
                                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                          Generating
                                        </>
                                      ) : (
                                        <>
                                          <Sparkles className="w-4 h-4 mr-2" />
                                          Generate
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                  <Textarea
                                    placeholder="Executive summary highlighting your problem-solving skills..."
                                    value={project.summary}
                                    onChange={(e) => updateProject(project.id, 'summary', e.target.value)}
                                    rows={2}
                                    className="border-slate-300 focus:ring-purple-500 focus:border-purple-500"
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProject(project.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {projects.length === 0 && (
                    <div className="text-center py-16 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                      <Github className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400 mb-2">No projects yet</p>
                      <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
                        Add your first GitHub repository to get started
                      </p>
                      <Button onClick={addProject} variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Button
                size="lg"
                onClick={() => setShowPreview(true)}
                disabled={projects.length === 0}
                variant="outline"
                className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400"
              >
                <Eye className="w-5 h-5 mr-2" />
                Preview Portfolio
              </Button>
              <Button
                size="lg"
                onClick={savePortfolio}
                disabled={!portfolioName || projects.length === 0}
                variant="outline"
                className="border-2 border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Portfolio
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                disabled={!portfolioName || projects.length === 0}
                onClick={generateAndShare}
              >
                <Share2 className="w-5 h-5 mr-2" />
                Generate & Share
              </Button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl mt-auto">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Career-Vibe © 2026 — Transforming GitHub repos into stunning portfolios
          </p>
        </div>
      </footer>
    </div>
  )
}

function PortfolioPreview({
  portfolioName,
  bio,
  targetRole,
  theme,
  accentColor,
  projects,
  onBack
}: {
  portfolioName: string
  bio: string
  targetRole: string
  theme: 'dev' | 'creative' | 'corporate'
  accentColor: string
  projects: Project[]
  onBack: () => void
}) {
  const themeStyles = {
    dev: {
      bg: 'from-slate-950 via-slate-900 to-slate-950',
      text: 'text-slate-100',
      cardBg: 'bg-slate-800/40',
      cardBorder: 'border-slate-700/50',
      accent: accentColor
    },
    creative: {
      bg: 'from-purple-950 via-pink-900 to-rose-950',
      text: 'text-white',
      cardBg: 'bg-white/5',
      cardBorder: 'border-white/10',
      accent: accentColor
    },
    corporate: {
      bg: 'from-blue-950 via-slate-900 to-slate-950',
      text: 'text-slate-100',
      cardBg: 'bg-white/5',
      cardBorder: 'border-white/10',
      accent: accentColor
    }
  }

  const styles = themeStyles[theme]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${styles.bg}`}>
      <header className="border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl bg-black/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">{portfolioName}</h1>
          </div>
          <Button variant="outline" onClick={onBack} className="text-white border-white/20 hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Builder
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <Badge className={`mb-6 bg-gradient-to-r ${styles.accent} text-white border-0 shadow-lg`}>
            {theme.charAt(0).toUpperCase() + theme.slice(1)} Theme
          </Badge>
          <h2 className={`text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r ${styles.accent} bg-clip-text text-transparent`}>
            {targetRole}
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-8">
            {bio}
          </p>
          <div className="flex justify-center gap-4">
            <a href="mailto:contact@example.com" className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <Mail className="w-5 h-5 text-white" />
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <Linkedin className="w-5 h-5 text-white" />
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <Twitter className="w-5 h-5 text-white" />
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <Globe className="w-5 h-5 text-white" />
            </a>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.filter(p => p.name).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`${styles.cardBg} ${styles.cardBorder} backdrop-blur-xl border-2 text-white h-full hover:border-white/30 transition-all hover:scale-[1.02]`}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-6">
                    <Github className="w-10 h-10 text-white/60" />
                    <div className="flex items-center gap-4">
                      <Badge className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border-amber-500/30">
                        <Star className="w-3 h-3" />
                        {project.stars}
                      </Badge>
                      <Badge className="flex items-center gap-1 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                        <GitFork className="w-3 h-3" />
                        {project.forks}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-white text-2xl mb-2">{project.name}</CardTitle>
                  <CardDescription className="text-white/60">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {project.languages.map((lang) => (
                      <Badge key={lang} className={`bg-gradient-to-r ${styles.accent} bg-opacity-20 text-white/90 border-white/20`}>
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
                    className="w-full text-white border-white/20 hover:bg-white/10 hover:border-white/30"
                    asChild
                  >
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                      <Github className="w-4 h-4" />
                      View on GitHub
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-sm text-white/60">
            Generated with Career-Vibe © 2026
          </p>
        </div>
      </footer>
    </div>
  )
}
