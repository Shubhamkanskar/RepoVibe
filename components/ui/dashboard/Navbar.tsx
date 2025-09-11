"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full fixed h-16 sm:px-10 px-5 bg-slate-900/40 backdrop-blur-sm border-b border-purple-800/50 sm:flex hidden justify-between items-center z-50">
      <Link
        href="/"
        className="inline-flex font-instrument items-end font-mono text-white text-[1.9rem] sm:text-[2.5rem] font-medium leading-none tracking-tight"
      >
        <span className="text-white">repo</span>
        <span className="text-purple-400">Vibe</span>
      </Link>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center z-10 w-full sm:w-auto"></div>
    </nav>
  );
}
