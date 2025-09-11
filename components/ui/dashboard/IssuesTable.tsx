"use client";

import { useState, useEffect } from "react";
import {
  ChevronUp,
  ChevronDown,
  ExternalLink,
  MessageCircle,
  Tag,
  User,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Link from "next/link";

interface Issue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: "open" | "closed";
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: Array<{
    name: string;
    color: string;
    description: string | null;
  }>;
  assignees: Array<{
    login: string;
    avatar_url: string;
  }>;
  comments: number;
  html_url: string;
  repository_url: string;
  difficulty: "easy" | "medium" | "hard";
  language: string;
}

type ColumnKey = keyof Pick<
  Issue,
  | "number"
  | "title"
  | "state"
  | "labels"
  | "difficulty"
  | "comments"
  | "created_at"
  | "user"
>;

type SortDirection = "asc" | "desc" | null;

const columns: { key: ColumnKey; label: string }[] = [
  { key: "number", label: "#" },
  { key: "title", label: "Title" },
  { key: "state", label: "Status" },
  { key: "labels", label: "Labels" },
  { key: "difficulty", label: "Difficulty" },
  { key: "comments", label: "Comments" },
  { key: "created_at", label: "Created" },
  { key: "user", label: "Author" },
];

const DIFFICULTY_COLORS = {
  easy: "bg-green-500/10 text-green-400 border-green-400/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-400/20",
  hard: "bg-red-500/10 text-red-400 border-red-400/20",
};

const STATE_COLORS = {
  open: "bg-green-500/10 text-green-400 border-green-400/20",
  closed: "bg-gray-500/10 text-gray-400 border-gray-400/20",
};

interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
  total_count: number;
}

interface IssuesTableProps {
  repository: string;
  onIssueSelect?: (issue: Issue) => void;
}

export default function IssuesTable({
  repository,
  onIssueSelect,
}: IssuesTableProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filtered, setFiltered] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortColumn, setSortColumn] = useState<ColumnKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [state, setState] = useState<"open" | "closed" | "all">("open");
  const [difficulty, setDifficulty] = useState<
    "all" | "easy" | "medium" | "hard"
  >("all");
  const [labelFilter, setLabelFilter] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    per_page: 20, // Reduced from 30 to 20 for faster loading
    total_pages: 1,
    has_next_page: false,
    has_prev_page: false,
    total_count: 0,
  });

  const sortData = (
    data: Issue[],
    column: ColumnKey,
    direction: SortDirection
  ): Issue[] => {
    if (!direction) return data;

    return [...data].sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];

      // Handle different data types
      if (column === "number" || column === "comments") {
        aValue = aValue || 0;
        bValue = bValue || 0;
      } else if (column === "labels") {
        aValue = Array.isArray(aValue) ? aValue.length : 0;
        bValue = Array.isArray(bValue) ? bValue.length : 0;
      } else if (column === "difficulty") {
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
        aValue = difficultyOrder[aValue as keyof typeof difficultyOrder] || 0;
        bValue = difficultyOrder[bValue as keyof typeof difficultyOrder] || 0;
      } else if (column === "created_at") {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      } else if (column === "user") {
        aValue = (aValue as any).login;
        bValue = (bValue as any).login;
      } else {
        aValue = String(aValue || "").toLowerCase();
        bValue = String(bValue || "").toLowerCase();
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (column: ColumnKey) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const fetchIssues = async (page: number = 1) => {
    setIsLoading(true);
    try {
      // Build query parameters for server-side filtering
      const params = new URLSearchParams({
        repo: repository,
        state: state === "all" ? "all" : state,
        page: page.toString(),
        per_page: pagination.per_page.toString(),
      });

      // Add server-side filtering parameters
      if (difficulty !== "all") {
        params.append("difficulty", difficulty);
      }
      if (labelFilter) {
        params.append("label", labelFilter);
      }

      const res = await fetch(`/api/githubIssues?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch issues");

      const data = await res.json();
      const issues = data.issues || [];

      setIssues(issues);
      setFiltered(issues); // Don't apply sorting here, let useEffect handle it

      // Update pagination info
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching issues:", error);
      setIssues([]);
      setFiltered([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Reset to page 1 when filters change
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    fetchIssues(1);
  }, [repository, state, difficulty, labelFilter]);

  useEffect(() => {
    const sortedIssues = sortData(issues, sortColumn, sortDirection);
    setFiltered(sortedIssues);
  }, [sortColumn, sortDirection, issues]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchIssues(newPage);
    }
  };

  const renderCell = (issue: Issue, key: ColumnKey) => {
    const value = issue[key];

    switch (key) {
      case "number":
        return (
          <Link
            href={issue.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 font-mono text-sm"
          >
            #{value}
          </Link>
        );

      case "title":
        return (
          <div className="max-w-md">
            <Link
              href={issue.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-purple-300 font-medium text-sm line-clamp-2"
            >
              {value}
            </Link>
          </div>
        );

      case "state":
        const stateColor = STATE_COLORS[value as keyof typeof STATE_COLORS];
        return (
          <span
            className={`capitalize font-semibold text-xs px-2 py-1 rounded-md border ${stateColor}`}
          >
            {value}
          </span>
        );

      case "labels":
        if (Array.isArray(value) && value.length > 0) {
          return (
            <div className="flex flex-wrap gap-1 max-w-xs">
              {value.slice(0, 5).map((label, i) => (
                <span
                  key={`${label.name}-${i}`}
                  className="text-xs px-2 py-1 rounded-sm border font-medium truncate"
                  style={{
                    backgroundColor: `#${label.color}20`,
                    color: `#${label.color}`,
                    borderColor: `#${label.color}40`,
                  }}
                  title={label.description || label.name}
                >
                  {label.name}
                </span>
              ))}
              {value.length > 5 && (
                <span className="text-xs text-slate-400 px-1">
                  +{value.length - 5}
                </span>
              )}
            </div>
          );
        }
        return <span className="text-slate-400 text-sm">-</span>;

      case "difficulty":
        const difficultyColor =
          DIFFICULTY_COLORS[value as keyof typeof DIFFICULTY_COLORS];
        return (
          <span
            className={`capitalize font-semibold text-xs px-2 py-1 rounded-md border ${difficultyColor}`}
          >
            {value}
          </span>
        );

      case "comments":
        return (
          <div className="flex items-center gap-1 text-slate-400">
            <MessageCircle className="w-3 h-3" />
            <span className="text-sm">{value}</span>
          </div>
        );

      case "created_at":
        return (
          <span className="text-slate-400 text-sm">
            {new Date(value as string).toLocaleDateString()}
          </span>
        );

      case "user":
        const user = value as any;
        return (
          <div className="flex items-center gap-2">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-5 h-5 rounded-full"
            />
            <span className="text-slate-400 text-sm">{user.login}</span>
          </div>
        );

      default:
        return <span className="text-slate-400 text-sm">{value ?? "-"}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-transparent border-t-purple-300 rounded-full animate-spin" />
        <span className="ml-3 text-slate-400">Loading issues...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={state}
          onChange={(e) => setState(e.target.value as any)}
          className="bg-slate-900 text-white border border-purple-800/50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/40 transition"
        >
          <option value="open">Open Issues</option>
          <option value="closed">Closed Issues</option>
          <option value="all">All Issues</option>
        </select>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as any)}
          className="bg-slate-900 text-white border border-purple-800/50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/40 transition"
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <input
          type="text"
          value={labelFilter}
          onChange={(e) => setLabelFilter(e.target.value)}
          placeholder="Filter by label..."
          className="bg-slate-900 text-white border border-purple-800/50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-300/40 transition min-w-[150px]"
        />
      </div>

      {/* Issues Table */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-slate-400 text-sm">
              Click on any issue row to get AI-powered suggestions for solving
              it
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse bg-slate-900/40 backdrop-blur-sm border border-purple-800/50 overflow-hidden">
              <thead>
                <tr className="border-b border-purple-800/50">
                  {columns.map(({ key, label }) => (
                    <th
                      key={key}
                      className="py-4 px-6 text-sm font-medium text-slate-400 bg-purple-900/30 cursor-pointer hover:bg-purple-800/40 transition-colors select-none"
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex items-center gap-2">
                        <span>{label}</span>
                        {sortColumn === key && (
                          <div className="flex flex-col">
                            <ChevronUp
                              className={`w-3 h-3 ${
                                sortDirection === "asc"
                                  ? "text-purple-300"
                                  : "text-slate-500"
                              }`}
                            />
                            <ChevronDown
                              className={`w-3 h-3 -mt-1 ${
                                sortDirection === "desc"
                                  ? "text-purple-300"
                                  : "text-slate-500"
                              }`}
                            />
                          </div>
                        )}
                        {sortColumn !== key && (
                          <div className="flex flex-col">
                            <ChevronUp className="w-3 h-3 text-slate-600" />
                            <ChevronDown className="w-3 h-3 -mt-1 text-slate-600" />
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((issue) => (
                  <tr
                    key={issue.id}
                    className="border-b border-purple-800/30 group hover:bg-purple-900/20 hover:border-purple-600/50 transition cursor-pointer"
                    onClick={() => onIssueSelect?.(issue)}
                    title="Click to get AI suggestions for this issue"
                  >
                    {columns.map(({ key }) => (
                      <td key={key} className="py-4 px-6 text-sm">
                        {renderCell(issue, key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-slate-400 font-medium text-base">
            No issues found for this repository.
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {filtered.length > 0 && pagination.total_pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => handlePageChange(1)}
            disabled={pagination.current_page === 1 || isLoading}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsLeft className="w-4 h-4" />
            First
          </button>

          <button
            onClick={() => handlePageChange(pagination.current_page - 1)}
            disabled={!pagination.has_prev_page || isLoading}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronDown className="w-4 h-4 rotate-90" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">
              Page {pagination.current_page} of {pagination.total_pages}
            </span>
            <span className="text-slate-500 text-xs">
              ({pagination.total_count} total issues)
            </span>
          </div>

          <button
            onClick={() => handlePageChange(pagination.current_page + 1)}
            disabled={!pagination.has_next_page || isLoading}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronDown className="w-4 h-4 -rotate-90" />
          </button>

          <button
            onClick={() => handlePageChange(pagination.total_pages)}
            disabled={
              pagination.current_page === pagination.total_pages || isLoading
            }
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Last
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
