"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, X, Github, Star } from "lucide-react";
import { favoritesManager, type FavoriteRepo } from "@/lib/favorites";

interface FavoritesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FavoritesSidebar({
  isOpen,
  onClose,
}: FavoritesSidebarProps) {
  const [favorites, setFavorites] = useState<FavoriteRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const formatNumber = (n: number) =>
    n >= 1e6
      ? `${+(n / 1e6).toFixed(1)}M`
      : n >= 1e3
      ? `${+(n / 1e3).toFixed(1)}k`
      : n.toString();

  const getRepoName = (repoId: string) => {
    return repoId.split("/")[1] || repoId;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-slate-900/95 backdrop-blur-sm border-l border-purple-800/50 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-800/50">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400 fill-current" />
            <h2 className="text-lg font-semibold text-white">
              Favorite Repos ({favorites.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-transparent border-t-purple-300 rounded-full animate-spin" />
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">
                No favorite repositories yet.
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Click the heart icon on any repo to add it here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {favorites.map((repo) => (
                <div
                  key={repo.id}
                  className="bg-slate-800/50 border border-purple-800/30 rounded-lg p-3 hover:border-purple-600/50 transition-colors"
                >
                  {/* Repo Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white text-sm truncate">
                        {repo.name}
                      </h3>
                      <p className="text-slate-400 text-xs truncate">
                        {repo.id}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveFavorite(repo.id)}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors ml-2"
                      title="Remove from favorites"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Description */}
                  {repo.description && (
                    <p className="text-slate-400 text-xs mb-2 line-clamp-2">
                      {repo.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
                    {repo.stargazers_count && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        <span>{formatNumber(repo.stargazers_count)}</span>
                      </div>
                    )}
                    {repo.language && (
                      <span className="bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded text-xs">
                        {repo.language}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/home/issues/${getRepoName(repo.id)}`}
                      className="flex-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 px-2 py-1 rounded text-xs font-medium transition-colors text-center"
                    >
                      View Issues
                    </Link>
                    {repo.html_url && (
                      <Link
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 px-2 py-1 rounded text-xs transition-colors"
                        title="View on GitHub"
                      >
                        <Github className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="p-4 border-t border-purple-800/50">
            <Link
              href="/home/favorites"
              className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center block"
            >
              View All Favorites
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
