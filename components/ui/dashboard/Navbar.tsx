"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { favoritesManager } from "@/lib/favorites";
import FavoritesSidebar from "./FavoritesSidebar";

export default function Navbar() {
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setFavoriteCount(favoritesManager.getFavoriteCount());

    const handleUpdate = () => {
      setFavoriteCount(favoritesManager.getFavoriteCount());
    };

    window.addEventListener("favoritesUpdated", handleUpdate);
    return () => window.removeEventListener("favoritesUpdated", handleUpdate);
  }, []);

  return (
    <>
      <nav className="w-full fixed h-16 sm:px-10 px-5 bg-slate-900/40 backdrop-blur-sm border-b border-purple-800/50 sm:flex hidden justify-between items-center z-50">
        <Link
          href="/"
          className="inline-flex font-instrument items-end font-mono text-white text-[1.9rem] sm:text-[2.5rem] font-medium leading-none tracking-tight"
        >
          <span className="text-white">repo</span>
          <span className="text-purple-400">Vibe</span>
        </Link>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center z-10 w-full sm:w-auto">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-2 rounded-lg border border-red-500/30 transition-colors"
          >
            <Heart className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">Favorites</span>
            {favoriteCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                {favoriteCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      <FavoritesSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
}
