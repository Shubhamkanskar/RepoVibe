import { NextRequest, NextResponse } from "next/server";
import { getGithubTokens } from "@/lib/githubTokens";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const repo = searchParams.get("repo");
  const state = searchParams.get("state") || "open";
  const sort = searchParams.get("sort") || "created";
  const direction = searchParams.get("direction") || "desc";
  const per_page = searchParams.get("per_page") || "20"; // Reduced from 30 to 20 for faster loading
  const page = searchParams.get("page") || "1";
  const difficulty = searchParams.get("difficulty"); // Server-side difficulty filtering
  const label = searchParams.get("label"); // Server-side label filtering

  if (!repo) {
    return NextResponse.json(
      { error: "Repository name is required" },
      { status: 400 }
    );
  }

  const token = getGithubTokens();
  if (!token) {
    return NextResponse.json(
      { error: "GitHub token not configured" },
      { status: 500 }
    );
  }

  try {
    const url = `https://api.github.com/repos/${repo}/issues?state=${state}&sort=${sort}&direction=${direction}&per_page=${per_page}&page=${page}`;

    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "GitHub API error", status: res.status },
        { status: res.status }
      );
    }

    const issues = await res.json();

    // Get pagination info from headers
    const linkHeader = res.headers.get("link");
    const totalPages = linkHeader ? extractTotalPages(linkHeader) : 1;
    const hasNextPage = linkHeader ? linkHeader.includes('rel="next"') : false;
    const hasPrevPage = linkHeader ? linkHeader.includes('rel="prev"') : false;

    // Get total count from GitHub API response headers
    const totalCountHeader = res.headers.get("x-total-count");
    const totalCount = totalCountHeader
      ? parseInt(totalCountHeader)
      : issues.length;

    // Process issues to include additional metadata
    let processedIssues = issues.map((issue: GitHubIssue) => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body,
      state: issue.state,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      closed_at: issue.closed_at,
      user: {
        login: issue.user.login,
        avatar_url: issue.user.avatar_url,
      },
      labels: issue.labels.map((label: GitHubLabel) => ({
        name: label.name,
        color: label.color,
        description: label.description,
      })),
      assignees: issue.assignees.map((assignee: GitHubUser) => ({
        login: assignee.login,
        avatar_url: assignee.avatar_url,
      })),
      comments: issue.comments,
      html_url: issue.html_url,
      repository_url: issue.repository_url,
      // Calculate difficulty based on labels and comments
      difficulty: calculateDifficulty(issue.labels, issue.comments),
      // Extract language from repository URL
      language: extractLanguageFromRepo(repo),
    }));

    // Apply server-side filtering
    if (difficulty && difficulty !== "all") {
      processedIssues = processedIssues.filter(
        (issue: ProcessedIssue) => issue.difficulty === difficulty
      );
    }

    if (label) {
      processedIssues = processedIssues.filter((issue: ProcessedIssue) =>
        issue.labels.some((l: ProcessedLabel) =>
          l.name.toLowerCase().includes(label.toLowerCase())
        )
      );
    }

    const response = NextResponse.json({
      issues: processedIssues,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(per_page),
        total_pages: totalPages,
        has_next_page: hasNextPage,
        has_prev_page: hasPrevPage,
        total_count: totalCount, // Use actual total count from GitHub API
      },
      repository: repo,
    });

    response.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate"
    );

    return response;
  } catch (err) {
    console.error("GitHub Issues fetch failed:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Type definitions
interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  user: GitHubUser;
  labels: GitHubLabel[];
  assignees: GitHubUser[];
  comments: number;
  html_url: string;
  repository_url: string;
}

interface GitHubUser {
  login: string;
  avatar_url: string;
}

interface GitHubLabel {
  name: string;
  color: string;
  description: string | null;
}

interface ProcessedIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  user: GitHubUser;
  labels: ProcessedLabel[];
  assignees: GitHubUser[];
  comments: number;
  html_url: string;
  repository_url: string;
  difficulty: "easy" | "medium" | "hard";
  language: string;
}

interface ProcessedLabel {
  name: string;
  color: string;
  description: string | null;
}

// Helper function to calculate issue difficulty
function calculateDifficulty(
  labels: GitHubLabel[],
  comments: number
): "easy" | "medium" | "hard" {
  const labelNames = labels.map((label) => label.name.toLowerCase());

  // Check for explicit difficulty labels first
  if (
    labelNames.includes("good first issue") ||
    labelNames.includes("beginner") ||
    labelNames.includes("first-timers-only") ||
    labelNames.includes("good first issue") ||
    labelNames.includes("easy") ||
    labelNames.includes("help wanted")
  ) {
    return "easy";
  }

  if (
    labelNames.includes("hard") ||
    labelNames.includes("complex") ||
    labelNames.includes("advanced") ||
    labelNames.includes("expert") ||
    labelNames.includes("difficult")
  ) {
    return "hard";
  }

  // Check for type-based difficulty
  if (
    labelNames.includes("bug") ||
    labelNames.includes("enhancement") ||
    labelNames.includes("feature") ||
    labelNames.includes("improvement")
  ) {
    return "medium";
  }

  // Check for priority-based difficulty
  if (
    labelNames.includes("priority: high") ||
    labelNames.includes("priority: critical") ||
    labelNames.includes("urgent")
  ) {
    return "hard";
  }

  if (
    labelNames.includes("priority: low") ||
    labelNames.includes("nice to have")
  ) {
    return "easy";
  }

  // Use comments and other factors as fallback
  if (comments > 15) return "hard";
  if (comments > 5) return "medium";

  // If it has many labels, it might be more complex
  if (labels.length > 5) return "medium";

  return "easy";
}

// Helper function to extract total pages from GitHub API link header
function extractTotalPages(linkHeader: string): number {
  // GitHub API link header format: <url>; rel="last"
  const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
  return lastPageMatch ? parseInt(lastPageMatch[1]) : 1;
}

// Helper function to extract language from repo name
function extractLanguageFromRepo(repo: string): string {
  // This is a simple heuristic - in a real app, you'd fetch from GitHub API
  const repoLower = repo.toLowerCase();
  if (repoLower.includes("react") || repoLower.includes("next"))
    return "JavaScript";
  if (repoLower.includes("vue")) return "JavaScript";
  if (repoLower.includes("angular")) return "TypeScript";
  if (
    repoLower.includes("python") ||
    repoLower.includes("django") ||
    repoLower.includes("flask")
  )
    return "Python";
  if (repoLower.includes("go") || repoLower.includes("golang")) return "Go";
  if (repoLower.includes("rust")) return "Rust";
  if (repoLower.includes("java")) return "Java";
  if (repoLower.includes("csharp") || repoLower.includes("dotnet")) return "C#";
  return "Unknown";
}
