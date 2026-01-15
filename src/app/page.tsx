'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Github, Download, Eye, Plus, Trash2, Loader2, User, Code, Layers, Palette, Briefcase } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import PortfolioPreview from '@/components/portfolio-preview'
import ThemeSelector from '@/components/theme-selector'

interface Project {
  id: string
  name: string
  description: string
  githubLink?: string
  technologies?: string[]
  highlights?: string[]
}

interface PortfolioData {
  name: string
  title: string
  email: string
  linkedin?: string
  github?: string
  bio: string
  skills: string[]
  projects: Project[]
  theme: string
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'builder' | 'preview'>('builder')
  const [loading, setLoading] = useState(false)
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    name: '',
    title: '',
    email: '',
    linkedin: '',
    github: '',
    bio: '',
    skills: [],
    projects: [],
    theme: 'modern'
  })

  const [skillInput, setSkillInput] = useState('')
  const [currentProject, setCurrentProject] = useState<Project>({
    id: crypto.randomUUID(),
    name: '',
    description: '',
    githubLink: '',
    technologies: [],
    highlights: []
  })
  const [techInput, setTechInput] = useState('')

  const addSkill = () => {
    if (skillInput.trim() && !portfolioData.skills.includes(skillInput.trim())) {
      setPortfolioData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }))
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    setPortfolioData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }

  const addTechnology = () => {
    if (techInput.trim() && !currentProject.technologies?.includes(techInput.trim())) {
      setCurrentProject(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), techInput.trim()]
      }))
      setTechInput('')
    }
  }

  const removeTechnology = (tech: string) => {
    setCurrentProject(prev => ({
      ...prev,
      technologies: prev.technologies?.filter(t => t !== tech) || []
    }))
  }

  const addProject = () => {
    if (currentProject.name && currentProject.description) {
      setPortfolioData(prev => ({
        ...prev,
        projects: [...prev.projects, currentProject]
      }))
      setCurrentProject({
        id: crypto.randomUUID(),
        name: '',
        description: '',
        githubLink: '',
        technologies: [],
        highlights: []
      })
    }
  }

  const removeProject = (projectId: string) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== projectId)
    }))
  }

  const generateContent = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: currentProject.description,
          projectName: currentProject.name,
          githubUrl: currentProject.githubLink,
          languages: currentProject.technologies
        })
      })

      const data = await response.json()
      if (data.success) {
        setCurrentProject(prev => ({
          ...prev,
          highlights: data.content.highlights || [],
          technologies: data.content.technologies || []
        }))
        toast({
          title: 'Success',
          description: 'Project content enhanced with AI'
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to generate content',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate content',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchGitHubRepo = async () => {
    if (!currentProject.githubLink) return

    setLoading(true)
    try {
      const response = await fetch('/api/github-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: currentProject.githubLink })
      })

      const data = await response.json()
      if (data.success) {
        setCurrentProject(prev => ({
          ...prev,
          name: data.repo.name || prev.name,
          description: data.repo.description || prev.description,
          technologies: data.repo.technologies || prev.technologies || []
        }))
        toast({
          title: 'Success',
          description: 'Repository data fetched successfully'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch repository data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const exportPortfolio = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/export-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portfolioData)
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${portfolioData.name.replace(/\s+/g, '-').toLowerCase()}-portfolio.html`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: 'Success',
        description: 'Portfolio exported successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export portfolio',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Career-Vibe
                </h1>
                <p className="text-sm text-muted-foreground">Portfolio Generator</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('preview')}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                size="sm"
                onClick={exportPortfolio}
                disabled={loading || !portfolioData.name}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-8">
            {/* Personal Info */}
            <Card className="border-l-4 border-l-violet-500 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Personal Information</CardTitle>
                    <CardDescription>Tell us about yourself</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={portfolioData.name}
                      onChange={(e) => setPortfolioData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title *</Label>
                    <Input
                      id="title"
                      placeholder="Full Stack Developer"
                      value={portfolioData.title}
                      onChange={(e) => setPortfolioData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={portfolioData.email}
                      onChange={(e) => setPortfolioData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn (optional)</Label>
                    <Input
                      id="linkedin"
                      placeholder="linkedin.com/in/johndoe"
                      value={portfolioData.linkedin}
                      onChange={(e) => setPortfolioData(prev => ({ ...prev, linkedin: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub (optional)</Label>
                    <Input
                      id="github"
                      placeholder="github.com/johndoe"
                      value={portfolioData.github}
                      onChange={(e) => setPortfolioData(prev => ({ ...prev, github: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio *</Label>
                  <Textarea
                    id="bio"
                    placeholder="A passionate developer with expertise in building modern web applications..."
                    value={portfolioData.bio}
                    onChange={(e) => setPortfolioData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="border-l-4 border-l-emerald-500 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Skills</CardTitle>
                    <CardDescription>Add your technical skills</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill (e.g., React, TypeScript)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    className="border-emerald-200 focus:border-emerald-400 dark:border-emerald-800 dark:focus:border-emerald-600"
                  />
                  <Button onClick={addSkill} className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {portfolioData.skills.map(skill => (
                    <Badge key={skill} className="gap-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200 hover:from-emerald-200 hover:to-teal-200">
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card className="border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Projects</CardTitle>
                    <CardDescription>Add your showcase projects</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 p-6 bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-xl border-2 border-dashed border-orange-200 dark:border-orange-800">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-name">Project Name *</Label>
                      <Input
                        id="project-name"
                        placeholder="My Awesome Project"
                        value={currentProject.name}
                        onChange={(e) => setCurrentProject(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="github-link">GitHub Link</Label>
                      <div className="flex gap-2">
                        <Input
                          id="github-link"
                          placeholder="https://github.com/username/repo"
                          value={currentProject.githubLink}
                          onChange={(e) => setCurrentProject(prev => ({ ...prev, githubLink: e.target.value }))}
                        />
                        <Button
                          variant="outline"
                          onClick={fetchGitHubRepo}
                          disabled={loading || !currentProject.githubLink}
                          className="border-orange-300 hover:border-orange-400 hover:bg-orange-50 dark:border-orange-700 dark:hover:border-orange-600"
                        >
                          <Github className="w-4 h-4 mr-2 text-orange-600 dark:text-orange-400" />
                          Fetch
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-desc">Description *</Label>
                    <Textarea
                      id="project-desc"
                      placeholder="Describe your project, what it does, and your role..."
                      value={currentProject.description}
                      onChange={(e) => setCurrentProject(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={generateContent}
                      disabled={loading || !currentProject.description}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                      )}
                      AI Enhance
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Technologies</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add technology (e.g., React, Node.js)"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                      />
                      <Button onClick={addTechnology} variant="outline" className="border-orange-300 hover:border-orange-400 hover:bg-orange-50 dark:border-orange-700 dark:hover:border-orange-600">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentProject.technologies?.map(tech => (
                        <Badge key={tech} className="gap-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-orange-200 hover:from-orange-200 hover:to-amber-200">
                          {tech}
                          <button
                            onClick={() => removeTechnology(tech)}
                            className="ml-1 hover:text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Key Highlights (AI-generated or manual)</Label>
                    <div className="space-y-2">
                      {currentProject.highlights?.map((highlight, idx) => (
                        <div key={idx} className="flex gap-2 items-start p-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                          <span className="text-orange-600 dark:text-orange-400 mt-1.5">•</span>
                          <span className="text-sm flex-1">{highlight}</span>
                          <button
                            onClick={() => setCurrentProject(prev => ({
                              ...prev,
                              highlights: prev.highlights?.filter((_, i) => i !== idx) || []
                            }))}
                            className="ml-auto text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button onClick={addProject} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                  {currentProject.highlights && currentProject.highlights.length > 0 && (
                    <p className="text-xs text-muted-foreground text-center">
                      ✓ Highlights generated! Click "Add Project" to save them and see in preview
                    </p>
                  )}
                </div>

                {/* Project List */}
                {portfolioData.projects.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent flex items-center gap-2">
                      <Layers className="w-5 h-5" />
                      Added Projects ({portfolioData.projects.length})
                    </h3>
                    <div className="grid gap-3">
                      {portfolioData.projects.map(project => (
                        <Card key={project.id} className="p-4 border-l-4 border-l-orange-300 dark:border-l-orange-700 hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold">{project.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {project.description}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {project.technologies?.map(tech => (
                                  <Badge key={tech} variant="outline" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProject(project.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Theme Selection */}
            <Card className="border-l-4 border-l-pink-500 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Choose Your Theme</CardTitle>
                    <CardDescription>Select a color scheme for your portfolio</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ThemeSelector
                  currentTheme={portfolioData.theme}
                  onThemeChange={(theme) => setPortfolioData(prev => ({ ...prev, theme }))}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <PortfolioPreview data={portfolioData} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          <p>Career-Vibe Portfolio Generator • Built with Next.js & AI</p>
        </div>
      </footer>
    </div>
  )
}
