# RepoVibe

**Discover GitHub Repositories Fast — Find the best open source projects blazingly fast.**

RepoVibe is a free and open-source tool to explore trending and curated GitHub repositories. Built to help developers quickly find and filter repositories by language, popularity, and more — all without complex GitHub queries or bloated UIs.  
Made for speed. Free for everyone. Open for contributors.

**Created by [Shubham Kanaskar](https://github.com/Shubhamkanskar)**
<img width="1920" height="1612" alt="screencapture-repovibe-space-home-issues-ollama-2025-09-12-08_30_48" src="https://github.com/user-attachments/assets/bfc8968a-b2a7-4f32-b0bc-2f07534f40d7" />
<img width="1920" height="1595" alt="screencapture-repovibe-space-home-2025-09-12-08_31_11" src="https://github.com/user-attachments/assets/7e2938b3-94dd-4773-b86a-5086d61da428" />
<img width="1920" height="2336" alt="screencapture-repovibe-space-home-issues-ollama-2025-09-12-08_30_14" src="https://github.com/user-attachments/assets/0f0431db-28ca-4e7f-9e98-583aa9a09f20" />

---

## Features

### Core Functionality

- **Repository Discovery:** Browse trending and curated GitHub repositories
- **Advanced Filtering:** Filter by programming language, popularity, and difficulty
- **Issue Tracking:** View and analyze GitHub issues with AI-powered suggestions
- **Favorites System:** Save and manage your favorite repositories
- **Real-time Search:** Fast, responsive search across repositories and issues

### Technical Features

- **Technologies:** Next.js 14 + Tailwind CSS + PostgreSQL + GitHub API
- **Authentication:** BetterAuth with Google OAuth integration
- **AI Integration:** Gemini AI for intelligent issue analysis and suggestions
- **Responsive Design:** Dark theme with modern UI/UX
- **Performance:** Optimized with caching and pagination
- **Database:** Drizzle ORM with PostgreSQL for data persistence

---

## Prerequisites

Make sure the following are installed on your system before running the project:

- Node.js (v18 or later)
- Bun (v1.2.7 or later) – used for development and script execution
- PostgreSQL – required for database operations via Drizzle ORM
- A package manager – Bun, npm, or pnpm (Bun recommended)

To verify installation:

```sh
node --version
bun --version
psql --version
```

---

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```sh
git clone https://github.com/Shubhamkanskar/RepoVibe.git
cd RepoVibe
```

### 2. Install Dependencies

```sh
bun install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add the following:

```sh
# Database
DATABASE_URL=postgresql://:@localhost:5432/RepoVibe

# Authentication
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-random-secret

# GitHub API
GITHUB_TOKEN=your-github-token

# AI Integration (Optional)
GEMINI_API_KEY=your-gemini-api-key
```

Make sure to replace the placeholders with actual values:

- **GitHub Token:** Get from [GitHub Developer Settings](https://github.com/settings/tokens)
- **Google OAuth:** Set up at [Google Cloud Console](https://console.cloud.google.com/)
- **Gemini API Key:** Get from [Google AI Studio](https://makersuite.google.com/app/apikey) (for AI features)

### 4. Run Database Migrations

```sh
bunx drizzle-kit push
```

This will sync your schema to the PostgreSQL database.

### 5. Start the Development Server

```sh
bun run dev
```

The app will start at:  
[http://localhost:3000](http://localhost:3000)

---

## Usage

Once the app is running, you can use RepoVibe to explore GitHub repositories with ease:

### Main Features

- **Authentication:** Sign in using your Google account to access personalized features
- **Repository Discovery:** Browse trending and curated GitHub repositories
- **Issue Analysis:** View repository issues with AI-powered solution suggestions
- **Advanced Filtering:** Filter by programming language, popularity, difficulty, and more
- **Favorites Management:** Save and organize your favorite repositories

### Navigation

- **Overview:** Browse Y Combinator-backed and curated open-source projects
- **Discover:** Explore repositories by language with advanced filtering
- **Trending:** View the most popular repositories from the last 30 days
- **Issues:** Analyze GitHub issues with intelligent AI suggestions
- **Favorites:** Manage your saved repositories

### AI-Powered Features

- **Issue Analysis:** Get AI-generated suggestions for solving GitHub issues
- **Smart Recommendations:** Intelligent repository recommendations based on your interests
- **Context-Aware Suggestions:** AI understands the repository context and provides relevant solutions

---

## Project Structure

Below is the structure of the RepoVibe project:

```sh
RepoVibe/
├── app/
│   ├── api/
│   │   ├── aiSuggestions/          # AI-powered issue analysis
│   │   ├── auth/[...all]/          # Authentication routes
│   │   ├── githubDiscover/         # Repository discovery API
│   │   ├── githubIssues/           # GitHub issues API
│   │   ├── githubOverview/         # Repository overview API
│   │   └── githubTrending/         # Trending repositories API
│   ├── auth/                       # Authentication pages
│   ├── home/
│   │   ├── (overview)/             # Main dashboard
│   │   ├── discover/               # Repository discovery
│   │   ├── favorites/              # User favorites
│   │   ├── issues/[repo]/          # Issue analysis pages
│   │   └── trending/               # Trending repositories
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── dashboard/              # Dashboard components
│   │   ├── landing/                # Landing page components
│   │   └── FavoriteButton.tsx
│   ├── Button.tsx
│   ├── GithubButton.tsx
│   ├── Select.tsx
│   └── Sign-in.tsx
├── lib/
│   ├── db/
│   │   └── schema.ts               # Database schema
│   ├── auth.ts                     # Authentication configuration
│   ├── auth-client.ts              # Client-side auth
│   ├── db.ts                       # Database connection
│   ├── favorites.ts                # Favorites management
│   ├── githubTokens.ts             # GitHub API token management
│   ├── session.ts                  # Session management
│   └── YC.json                     # Y Combinator data
├── drizzle/                        # Database migrations
├── public/                         # Static assets
├── types/                          # TypeScript type definitions
├── .env                            # Environment variables
├── drizzle.config.ts               # Drizzle ORM configuration
├── next.config.ts                  # Next.js configuration
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript configuration
└── README.md
```

### Key Directories

- **`app/api/`**: API routes for GitHub integration and AI features
- **`app/home/`**: Main application pages and layouts
- **`components/ui/`**: Reusable UI components
- **`lib/`**: Utility functions and configurations
- **`drizzle/`**: Database schema and migrations

---

## Recent Updates & Improvements

### Latest Fixes (v1.2.0)

- **Fixed Pagination Issues**: Resolved pagination problems across all components
- **Improved Repository Name Resolution**: Better handling of repository names vs filenames
- **Enhanced Error Handling**: More descriptive error messages and better user feedback
- **AI Integration**: Added Gemini AI for intelligent issue analysis and suggestions
- **Performance Optimizations**: Improved loading times and caching strategies
- **UI/UX Improvements**: Consistent pagination controls and better visual feedback

### Key Features Added

- **Smart Repository Detection**: Automatically detects if input is a filename vs repository name
- **AI-Powered Issue Analysis**: Get intelligent suggestions for solving GitHub issues
- **Enhanced Filtering**: Server-side filtering with proper pagination support
- **Favorites System**: Save and manage your favorite repositories
- **Responsive Design**: Optimized for all device sizes with dark theme

---

## Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Enjoy discovering GitHub repositories with RepoVibe!**

---

## Author

**Shubham Kanaskar**

- GitHub: [@Shubhamkanskar](https://github.com/Shubhamkanskar)
- LinkedIn: [shubham-kanaskar-237280157](https://www.linkedin.com/in/shubham-kanaskar-237280157/)
- X (Twitter): [@Shubham_kanaska](https://x.com/Shubham_kanaska)
- Website: [shubhamkanaskardev.xyz](https://www.shubhamkanaskardev.xyz/)
- Email: shubhamkanaskar75@gmail.com
