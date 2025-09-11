"use client";

import { useState, useEffect } from "react";
import { Heart, HeartOff } from "lucide-react";
import { favoritesManager } from "@/lib/favorites";

interface FavoriteButtonProps {
  repo: {
    id: string; // owner/repo format
    name: string;
    description?: string;
    language?: string;
    stargazers_count?: number;
    forks_count?: number;
    owner?: {
      login: string;
      avatar_url: string;
    };
    html_url?: string;
  };
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function FavoriteButton({
  repo,
  size = "md",
  showText = false,
  className = "",
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsFavorite(favoritesManager.isFavorite(repo.id));
  }, [repo.id]);

  useEffect(() => {
    const handleUpdate = () => {
      setIsFavorite(favoritesManager.isFavorite(repo.id));
    };

    window.addEventListener("favoritesUpdated", handleUpdate);
    return () => window.removeEventListener("favoritesUpdated", handleUpdate);
  }, [repo.id]);

  const handleToggle = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (isFavorite) {
        const success = favoritesManager.removeFavorite(repo.id);
        if (success) {
          setIsFavorite(false);
        }
      } else {
        const success = favoritesManager.addFavorite({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          language: repo.language,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          owner: repo.owner,
          html_url: repo.html_url,
        });
        if (success) {
          setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`
        flex items-center gap-1 px-2 py-1 rounded-md border transition-all duration-200
        ${
          isFavorite
            ? "bg-red-500/10 text-red-400 border-red-400/20 hover:bg-red-500/20"
            : "bg-slate-800/50 text-slate-400 border-slate-700/30 hover:bg-slate-700/50 hover:text-slate-300"
        }
        ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? (
        <Heart className={`${sizeClasses[size]} fill-current`} />
      ) : (
        <HeartOff className={sizeClasses[size]} />
      )}
      {showText && (
        <span className={`${textSizeClasses[size]} font-medium`}>
          {isFavorite ? "Favorited" : "Favorite"}
        </span>
      )}
    </button>
  );
}
