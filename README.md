# 🎨 Career-Vibe Portfolio Generator

<div align="center">

![GitHub Stars](https://img.shields.io/github/stars/yourusername/career-vibe?style=social)
![GitHub Forks](https://img.shields.io/github/forks/yourusername/career-vibe?style=social)
![License](https://img.shields.io/github/license/yourusername/career-vibe)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)

**Transform your GitHub repositories into stunning, shareable portfolios in minutes**

[View Demo](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## ✨ Overview

Career-Vibe Portfolio Generator is a modern web application that solves "application fatigue" by transforming static GitHub repositories into beautiful, responsive portfolio links. Instead of sending recruiters a plain resume or PDF, you can now share a live, interactive portfolio that showcases your proof of work.

Perfect for developers, designers, and creators who want to stand out in 2026's competitive job market.

## 🚀 Key Features

### 🔄 GitHub-to-Site Sync
- **Automatic Data Fetching**: Paste a GitHub repository URL and instantly fetch:
  - Repository name and description
  - Primary programming languages
  - Star and fork counts
  - README content
- **Support for up to 6 projects** per portfolio

### 🎨 Three "Vibe" Themes
Choose from three professionally designed themes to match your target role:
- **Dev Theme**: Dark mode, code-focused, technical aesthetics with cyan accents
- **Creative Theme**: Bold, expressive, design-forward with purple/pink gradients
- **Corporate Theme**: Clean, professional, results-driven with emerald/teal colors

### 🌈 Custom Color Accents
Personalize your portfolio with 6 vibrant accent colors:
- Purple
- Cyan
- Emerald
- Orange
- Rose
- Indigo

### 🤖 AI-Powered Content Generation
- **Smart Bio Generation**: Create compelling professional bios tailored to your target role
- **Project Summaries**: Generate impactful executive summaries highlighting problem-solving skills
- Powered by advanced LLM technology

### 📊 Portfolio Analytics
Visual stats showcasing your impact:
- Total Projects
- Total Stars
- Total Forks
- Languages Used

### 🔗 Easy Sharing
- **Unique Portfolio URLs**: Generate shareable links like `/portfolio/[id]`
- **Social Media Integration**: Display email, LinkedIn, Twitter, and website links
- **One-Click Share**: Built-in sharing functionality with clipboard fallback

### 🎯 Live Preview
Real-time portfolio preview as you build:
- See changes instantly
- Switch themes on the fly
- Compare different color accents

### 💾 Data Persistence
- Save and edit portfolios anytime
- SQLite database with Prisma ORM
- Automatic updates to existing portfolios

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) (New York style)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/)

### Backend
- **API Routes**: Next.js Route Handlers
- **AI SDK**: [z-ai-web-dev-sdk](https://sdk.z.ai/)
- **GitHub API**: Public REST API
- **Database**: [Prisma ORM](https://www.prisma.io/) with SQLite
- **State Management**: React Hooks (useState, useEffect)

### Development Tools
- **Package Manager**: Bun
- **Linting**: ESLint with Next.js config
- **Hot Reload**: Next.js dev server

## 📦 Installation

### Prerequisites
- Node.js 18+ or Bun 1.3+
- Git

### Clone the Repository

```bash
git clone https://github.com/yourusername/career-vibe.git
cd career-vibe
```

### Install Dependencies

```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install

# Or using yarn
yarn install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./db/custom.db"
```

### Database Setup

```bash
# Push the schema to the database
bun run db:push

# Or generate Prisma Client
bun run db:generate
```

## 🚀 Usage

### Development Server

Start the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
bun run build
bun run start
```

### Linting

```bash
bun run lint
```

## 📖 How to Use

### 1. Create Your Portfolio

1. Visit the builder at `/`
2. Enter your portfolio name and target role
3. Add your GitHub repository URLs
4. Click **"Fetch"** to automatically pull project data
5. Choose your theme and color accent
6. Optionally generate AI-powered bio and project summaries
7. Click **"Preview"** to see your portfolio

### 2. Generate & Share

1. Click **"Generate & Share"** button
2. Your portfolio is saved and a unique URL is created
3. Share the link with recruiters (e.g., in job applications)
4. Update your GitHub repos and portfolio automatically syncs

### 3. Customize for Specific Jobs

Create multiple portfolios for different companies:
- Use the company's brand colors
- Tailor your bio to match the role
- Highlight relevant projects
- Create a custom portfolio in minutes!

## 📁 Project Structure

```
career-vibe/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── github/       # GitHub integration
│   │   │   ├── portfolio/     # Portfolio CRUD
│   │   │   ├── generate-bio/  # AI bio generation
│   │   │   └── generate-summary/ # AI summary generation
│   │   ├── portfolio/[id]/    # Portfolio view pages
│   │   ├── page.tsx          # Main builder page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/                # React hooks
│   └── lib/
│       ├── db.ts             # Prisma client
│       └── utils.ts         # Utility functions
├── .env.example              # Environment variables template
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                # This file
```

## 🎨 Themes & Customization

### Theme Customization

Themes are defined in `src/app/page.tsx`:

```typescript
const themes: Theme[] = [
  {
    id: 'dev',
    name: 'Dev',
    colors: {
      bg: 'from-slate-900 to-slate-800',
      accent: 'from-cyan-500 to-blue-500',
      border: 'border-cyan-500/50'
    }
  },
  // ... more themes
]
```

### Color Accents

Color accents are fully customizable:

```typescript
const colorAccents = [
  { name: 'Purple', value: 'from-purple-500 to-pink-500' },
  { name: 'Cyan', value: 'from-cyan-500 to-blue-500' },
  // ... more colors
]
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | Database connection string | `file:./db/custom.db` | Yes |

### Next.js Configuration

Configure additional options in `next.config.ts`:

```typescript
const nextConfig = {
  // Add your configuration here
}
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Reporting Bugs

1. Check existing [issues](../../issues)
2. Create a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details

### Suggesting Features

1. Check existing [feature requests](../../issues)
2. Create a new issue with:
   - Feature description
   - Use case
   - Potential implementation

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [your-profile](https://linkedin.com/in/your-profile)
- Twitter: [@yourhandle](https://twitter.com/yourhandle)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Prisma](https://www.prisma.io/) - Modern database toolkit
- [Framer Motion](https://www.framer.com/) - Animation library
- [Lucide](https://lucide.dev/) - Beautiful icons
- [z-ai-web-dev-sdk](https://sdk.z.ai/) - AI capabilities

## 📞 Support

Need help? Here are some resources:

- 📖 [Documentation](#)
- 💬 [Discord Community](#)
- 🐛 [Report Issues](../../issues)
- 📧 Email: support@example.com

## 🌟 Show Your Support

If you find this project helpful, consider:

- ⭐ Starring the repository
- 🔗 Sharing it with your network
- 📝 Writing about it
- 💡 Suggesting improvements

---

<div align="center">

**Built with ❤️ using Next.js and TypeScript**

[⬆ Back to Top](#-career-vibe-portfolio-generator)

</div>
