// app/api/githubDiscover/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getGithubTokens } from "@/lib/githubTokens";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const language = searchParams.get("language") || "";
  const page = searchParams.get("page") || "1";
  const q = searchParams.get("q") || ""; // Support for repository name search
  const per_page = searchParams.get("per_page") || "100";

  // Build query based on whether we're searching by name or filtering by language
  let query: string;
  if (q) {
    // Search by repository name (for repository resolution)
    query = `${q} in:name`;
  } else {
    // Filter by language and stars (for discover page)
    query = `stars:>1${language ? `+language:${language}` : ""}`;
  }

  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(
    query
  )}&sort=${
    q ? "best-match" : "forks"
  }&order=desc&per_page=${per_page}&page=${page}`;

  const token = getGithubTokens();
  if (!token) {
    return NextResponse.json(
      { error: "GitHub token not configured" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "GitHub API error", status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Add pagination metadata and ensure repos field exists for compatibility
    const response = NextResponse.json({
      ...data,
      repos: data.items || [], // Add repos field for repository resolution
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(per_page),
        total_pages: Math.ceil((data.total_count || 0) / parseInt(per_page)),
        has_next_page: data.items && data.items.length === parseInt(per_page),
        has_prev_page: parseInt(page) > 1,
        total_count: data.total_count || 0,
      },
    });

    response.headers.set(
      "Cache-Control",
      "public, s-maxage=600, stale-while-revalidate"
    );

    return response;
  } catch (err) {
    console.error("GitHub fetch failed:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
