"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import IssuesTable from "@/components/ui/dashboard/IssuesTable";
import AISuggestions from "@/components/ui/dashboard/AISuggestions";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function IssuesPage() {
  const params = useParams();
  const repoName = params.repo as string;
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [repoInfo, setRepoInfo] = useState<any>(null);
  const [fullRepoName, setFullRepoName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const constructRepoName = async () => {
      if (!repoName) return;

      setIsLoading(true);
      setError("");

      // Check if repoName already contains a slash (owner/repo format)
      if (repoName.includes("/")) {
        // Already in owner/repo format, use as-is
        setFullRepoName(repoName);
        try {
          const res = await fetch(`/api/githubOverview?repo=${repoName}`);
          if (res.ok) {
            const repoData = await res.json();
            setRepoInfo(repoData);
            setIsLoading(false);
          } else {
            setError(
              `Repository "${repoName}" not found. Please check the repository name and try again.`
            );
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error fetching repo info:", error);
          setError("Failed to fetch repository information. Please try again.");
          setIsLoading(false);
        }
        return;
      }

      // Check if the repoName looks like a filename (contains extension)
      const hasFileExtension =
        /\.(md|txt|json|js|ts|py|java|cpp|c|h|css|html|xml|yml|yaml)$/i.test(
          repoName
        );

      if (hasFileExtension) {
        // If it looks like a filename, search for repositories that might contain this file
        try {
          const searchRes = await fetch(
            `/api/githubDiscover?q=${encodeURIComponent(repoName)}&per_page=10`
          );
          if (searchRes.ok) {
            const searchData = await searchRes.json();
            const repos = searchData.repos || [];

            if (repos.length > 0) {
              // Use the first result (most relevant)
              setFullRepoName(repos[0].full_name);
              setRepoInfo(repos[0]);
              setIsLoading(false);
              return;
            }
          }
        } catch (error) {
          console.error("Error searching for repo:", error);
        }

        // If search failed, show a helpful error message
        setError(
          `"${repoName}" appears to be a filename, not a repository name. Please provide a repository name in the format "owner/repository" or just the repository name.`
        );
        setFullRepoName(repoName);
        setIsLoading(false);
        return;
      }

      // First, try to search for the repo using githubDiscover API
      // This is more efficient than trying hardcoded patterns and avoids 404 errors
      try {
        const searchRes = await fetch(
          `/api/githubDiscover?q=${encodeURIComponent(repoName)}&per_page=10`
        );
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const repos = searchData.repos || [];

          // Find exact match first
          const exactMatch = repos.find(
            (repo: any) => repo.name.toLowerCase() === repoName.toLowerCase()
          );

          if (exactMatch) {
            setFullRepoName(exactMatch.full_name);
            setRepoInfo(exactMatch);
            setIsLoading(false);
            return;
          }

          // If no exact match, try to find a close match
          const closeMatch = repos.find(
            (repo: any) =>
              repo.name.toLowerCase().includes(repoName.toLowerCase()) ||
              repo.full_name.toLowerCase().includes(repoName.toLowerCase())
          );

          if (closeMatch) {
            setFullRepoName(closeMatch.full_name);
            setRepoInfo(closeMatch);
            setIsLoading(false);
            return;
          }

          // If still no match, use the first result if available
          if (repos.length > 0) {
            setFullRepoName(repos[0].full_name);
            setRepoInfo(repos[0]);
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error searching for repo:", error);
      }

      // If search didn't work, try a few common patterns as fallback
      const commonPatterns = [
        repoName, // Direct repo name
        `supabase/${repoName}`, // Common YC pattern
        `ollama/${repoName}`, // Another common pattern
      ];

      // Try to fetch repo info for each pattern
      for (const fullName of commonPatterns) {
        try {
          const res = await fetch(`/api/githubOverview?repo=${fullName}`);
          if (res.ok) {
            const repoData = await res.json();
            setFullRepoName(fullName);
            setRepoInfo(repoData);
            setIsLoading(false);
            return; // Found a valid repo, exit
          }
        } catch (error) {
          // Continue to next pattern
          continue;
        }
      }

      // If all else fails, show an error message with suggestions
      setError(
        `Repository "${repoName}" not found. Please check the repository name and try again. Make sure to use the format "owner/repository" or provide a valid repository name.`
      );
      setFullRepoName(repoName);
      setIsLoading(false);
    };

    constructRepoName();
  }, [repoName]);

  const handleIssueSelect = (issue: any) => {
    setSelectedIssue(issue);
    setShowAISuggestions(true);
  };

  const handleBackToIssues = () => {
    setShowAISuggestions(false);
    setSelectedIssue(null);
  };

  if (!repoName) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-400">Repository not found</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-400">Loading repository...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-400 mb-4">{error}</div>
          <Link
            href="/home"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Back to Repositories
          </Link>
        </div>
      </div>
    );
  }

  if (!fullRepoName) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-400">Repository not found</div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-full p-8 z-10">
      {/* Header */}
      <div className="flex flex-col gap-5 w-full z-10 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/home"
            className="flex items-center gap-2 text-slate-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Repositories</span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {repoInfo?.owner?.avatar_url && (
                <img
                  src={repoInfo.owner.avatar_url}
                  alt={repoInfo.owner.login}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white">
                  {fullRepoName}
                </h1>
                {repoInfo?.description && (
                  <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                    {repoInfo.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-400">
              {repoInfo?.language && (
                <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded-md border border-purple-400/20">
                  {repoInfo.language}
                </span>
              )}
              {repoInfo?.stargazers_count && (
                <span>
                  ⭐ {repoInfo.stargazers_count.toLocaleString()} stars
                </span>
              )}
              {repoInfo?.forks_count && (
                <span>🍴 {repoInfo.forks_count.toLocaleString()} forks</span>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href={`https://github.com/${fullRepoName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 text-white px-4 py-2 rounded-lg border border-purple-800/50 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>View on GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      {showAISuggestions && selectedIssue ? (
        <div>
          {/* AI Suggestions Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleBackToIssues}
              className="flex items-center gap-2 text-slate-400 hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Issues</span>
            </button>
            <div className="h-6 w-px bg-purple-800/50" />
            <div>
              <h2 className="text-lg font-semibold text-white">
                Issue #{selectedIssue.number}: {selectedIssue.title}
              </h2>
              <p className="text-slate-400 text-sm">
                Analyzing with AI to provide solution suggestions
              </p>
            </div>
          </div>

          {/* AI Suggestions Component */}
          <AISuggestions
            issue={selectedIssue}
            repository={fullRepoName}
            language={repoInfo?.language || "Unknown"}
          />
        </div>
      ) : (
        <div>
          {/* Issues Table */}
          <IssuesTable
            repository={fullRepoName}
            onIssueSelect={handleIssueSelect}
          />
        </div>
      )}
    </div>
  );
}
