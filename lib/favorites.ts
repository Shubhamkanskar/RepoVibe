export interface FavoriteRepo {
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
  addedAt: string; // ISO timestamp
}

class FavoritesManager {
  private readonly STORAGE_KEY = "RepoVibe";

  // Get all favorite repositories
  getFavorites(): FavoriteRepo[] {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading favorites from localStorage:", error);
      return [];
    }
  }

  // Add a repository to favorites
  addFavorite(repo: Omit<FavoriteRepo, "addedAt">): boolean {
    if (typeof window === "undefined") return false;

    try {
      const favorites = this.getFavorites();

      // Check if already exists
      if (favorites.some((fav) => fav.id === repo.id)) {
        return false; // Already exists
      }

      const newFavorite: FavoriteRepo = {
        ...repo,
        addedAt: new Date().toISOString(),
      };

      favorites.push(newFavorite);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));

      // Dispatch custom event for UI updates
      window.dispatchEvent(new CustomEvent("favoritesUpdated"));

      return true;
    } catch (error) {
      console.error("Error adding favorite to localStorage:", error);
      return false;
    }
  }

  // Remove a repository from favorites
  removeFavorite(repoId: string): boolean {
    if (typeof window === "undefined") return false;

    try {
      const favorites = this.getFavorites();
      const filtered = favorites.filter((fav) => fav.id !== repoId);

      if (filtered.length === favorites.length) {
        return false; // Not found
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));

      // Dispatch custom event for UI updates
      window.dispatchEvent(new CustomEvent("favoritesUpdated"));

      return true;
    } catch (error) {
      console.error("Error removing favorite from localStorage:", error);
      return false;
    }
  }

  // Check if a repository is favorited
  isFavorite(repoId: string): boolean {
    const favorites = this.getFavorites();
    return favorites.some((fav) => fav.id === repoId);
  }

  // Get favorite count
  getFavoriteCount(): number {
    return this.getFavorites().length;
  }

  // Clear all favorites
  clearAllFavorites(): boolean {
    if (typeof window === "undefined") return false;

    try {
      localStorage.removeItem(this.STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("favoritesUpdated"));
      return true;
    } catch (error) {
      console.error("Error clearing favorites from localStorage:", error);
      return false;
    }
  }
}

// Export singleton instance
export const favoritesManager = new FavoritesManager();

// Hook for React components
export function useFavorites() {
  const [favorites, setFavorites] = React.useState<FavoriteRepo[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Initial load
    setFavorites(favoritesManager.getFavorites());
    setIsLoading(false);

    // Listen for updates
    const handleUpdate = () => {
      setFavorites(favoritesManager.getFavorites());
    };

    window.addEventListener("favoritesUpdated", handleUpdate);

    return () => {
      window.removeEventListener("favoritesUpdated", handleUpdate);
    };
  }, []);

  const addFavorite = React.useCallback(
    (repo: Omit<FavoriteRepo, "addedAt">) => {
      return favoritesManager.addFavorite(repo);
    },
    []
  );

  const removeFavorite = React.useCallback((repoId: string) => {
    return favoritesManager.removeFavorite(repoId);
  }, []);

  const isFavorite = React.useCallback((repoId: string) => {
    return favoritesManager.isFavorite(repoId);
  }, []);

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    count: favorites.length,
  };
}

// Import React for the hook
import React from "react";
