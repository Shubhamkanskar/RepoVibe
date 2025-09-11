import Link from "next/link";
import { Mail, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full text-xs font-mono text-neutral-400 py-12 px-4 border-t border-white/[0.08] bg-black/90 backdrop-blur-sm relative">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col gap-8">
          <div className="flex sm:flex-row flex-col sm:justify-between sm:items-end items-center gap-6">
            <div className="flex flex-col items-center sm:items-start gap-1">
              <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                © 2025 All Rights Reserved
              </div>
            </div>

            <div className="text-white text-sm font-medium tracking-wide">
              repoVibe
            </div>

            <div className="flex items-center gap-8">
              <Link
                href="https://github.com/Shubhamkanskar"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 hover:text-white transition-colors duration-200"
              >
                <Github className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-wider">
                  GitHub
                </span>
              </Link>

              <Link
                href="https://www.linkedin.com/in/shubham-kanaskar-237280157/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 hover:text-white transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span className="text-[10px] uppercase tracking-wider">
                  LinkedIn
                </span>
              </Link>

              <Link
                href="https://x.com/Shubham_kanaska"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 hover:text-white transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="text-[10px] uppercase tracking-wider">X</span>
              </Link>

              <Link
                href="mailto:shubhamkanaskar75@gmail.com"
                className="group flex items-center gap-2 hover:text-white transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-wider">
                  Email
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
