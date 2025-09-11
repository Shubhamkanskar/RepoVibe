"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Github, Star, ExternalLink, Trash2 } from "lucide-react";
import { favoritesManager, type FavoriteRepo } from "@/lib/favorites";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setFavorites(favoritesManager.getFavorites());
    setIsLoading(false);

    const handleUpdate = () => {
      setFavorites(favoritesManager.getFavorites());
    };

    window.addEventListener("favoritesUpdated", handleUpdate);
    return () => window.removeEventListener("favoritesUpdated", handleUpdate);
  }, []);

  const handleRemoveFavorite = (repoId: string) => {
    favoritesManager.removeFavorite(repoId);
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to remove all favorites?")) {
      favoritesManager.clearAllFavorites();
    }
  };

  const formatNumber = (n: number) =>
    n >= 1e6
      ? `${+(n / 1e6).toFixed(1)}M`
      : n >= 1e3
      ? `${+(n / 1e3).toFixed(1)}k`
      : n.toString();

  const getRepoName = (repoId: string) => {
    return repoId.split("/")[1] || repoId;
  };

  const filteredFavorites = favorites.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.language?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-transparent border-t-purple-300 rounded-full animate-spin" />
        <span className="ml-3 text-slate-400">Loading favorites...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-full p-8 z-10">
      {/* Header */}
      <div className="flex flex-col gap-5 w-full z-10 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-400 fill-current" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white">
                Favorite Repositories
              </h1>
            </div>
            <p className="text-slate-400 text-sm">
              {favorites.length}{" "}
              {favorites.length === 1 ? "repository" : "repositories"} saved
            </p>
          </div>

          {favorites.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg border border-red-600/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* Search */}
        {favorites.length > 0 && (
          <div className="relative w-full max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your favorites..."
              className="pl-10 pr-4 py-2 w-full text-sm text-slate-300 bg-slate-800/50 border border-purple-800/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-300/40 transition"
            />
          </div>
        )}
      </div>

      {/* Content */}
      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-slate-300 mb-2">
            No favorites yet
          </h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Start exploring repositories and click the heart icon to add them to
            your favorites.
          </p>
          <Link
            href="/home"
            className="inline-flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 px-6 py-3 rounded-lg border border-purple-600/30 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>Explore Repositories</span>
          </Link>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-400 text-sm">
            No favorites match your search query.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFavorites.map((repo) => (
            <div
              key={repo.id}
              className="bg-slate-900/40 backdrop-blur-sm border border-purple-800/50 rounded-lg p-4 hover:border-purple-600/50 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {repo.owner?.avatar_url && (
                    <Image
                      src={`${repo.owner.avatar_url}&s=32`}
                      alt={repo.owner.login}
                      width={32}
                      height={32}
                      className="rounded-full flex-shrink-0"
                      unoptimized
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-white text-sm truncate">
                      {repo.name}
                    </h3>
                    <p className="text-slate-400 text-xs truncate">{repo.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFavorite(repo.id)}
                  className="p-1 text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                  title="Remove from favorites"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>

              {/* Description */}
              {repo.description && (
                <p className="text-slate-400 text-xs mb-3 line-clamp-2">
                  {repo.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-3 mb-4 text-xs text-slate-500">
                {repo.stargazers_count && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span>{formatNumber(repo.stargazers_count)}</span>
                  </div>
                )}
                {repo.language && (
                  <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded text-xs">
                    {repo.language}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/home/issues/${getRepoName(repo.id)}`}
                  className="flex-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 px-3 py-2 rounded text-xs font-medium transition-colors text-center"
                >
                  View Issues
                </Link>
                {repo.html_url && (
                  <Link
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 px-3 py-2 rounded text-xs transition-colors"
                    title="View on GitHub"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
