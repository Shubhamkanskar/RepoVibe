import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "repoVibe - Discover GitHub Repositories Fast | Find Open Source Projects",
  description:
    "Discover the best GitHub repositories in seconds. Free repository discovery platform for developers. Browse trending projects and find your next open source contribution.",
  keywords:
    "github repositories, github search, find github projects, github trending, repository discovery, open source software, github explorer, free developer tools, github project finder, repository search engine, github trending projects, best github projects, github repo search, developer tools, programming tools, software development tools, github alternatives, repository directory, github discovery tool, find open source libraries, github project discovery, repository finder, github trends, popular github projects, top github repos, github stars, github forks, programming resources, developer resources, coding tools, software libraries, github awesome lists, open source contributions, github projects 2025, trending repositories, developer productivity tools, free programming tools, github search tool, repository finder, code search, programming projects, software projects, github trending today, repository recommendations, github project recommendations, repovibe, repository vibe, repo discovery, repo tools, repo search, repo finder, repo directory, repo explorer, github browse, repository browser, code discovery, project discovery, software discovery, find projects fast, discover projects in seconds, fast github search, quick project discovery",
  openGraph: {
    title:
      "repoVibe - Discover GitHub Repositories Fast | Find Best Open Source Projects",
    description:
      "Discover the best GitHub repositories in seconds. Free repository discovery platform for developers. Browse trending projects and find your next open source contribution.",
    url: "https://repovibe.dev",
    siteName: "repoVibe",
    images: [
      {
        url: "https://repovibe.dev/og.png",
        width: 1200,
        height: 630,
        alt: "repoVibe - Find the best GitHub repositories and open source projects",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "repoVibe - Find the Best GitHub Repositories Fast",
    description:
      "Discover the best GitHub repositories in seconds. Free repository discovery platform for developers. Browse trending projects and find your next open source contribution.",
    images: ["https://repovibe.dev/og.png"],
    creator: "@shubhamkanskar",
    site: "@shubhamkanskar",
  },
  other: {
    "twitter:image": "https://repovibe.dev/og.png",
    "twitter:card": "summary_large_image",
    "twitter:url": "https://repovibe.dev",
    "twitter:domain": "repovibe.dev",
    "twitter:title":
      "repoVibe - Discover GitHub Repositories Fast | Find Best Open Source Projects",
    "twitter:description":
      "Discover the best GitHub repositories in seconds. Free repository discovery platform for developers. Browse trending projects and find your next open source contribution.",
    "twitter:creator": "@shubhamkanskar",
    "twitter:site": "@shubhamkanskar",
    "og:url": "https://repovibe.dev",
    "og:type": "website",
    "og:title":
      "repoVibe - Discover GitHub Repositories Fast | Find Best Open Source Projects",
    "og:description":
      "Discover the best GitHub repositories in seconds. Free repository discovery platform for developers. Browse trending projects and find your next open source contribution.",
    "og:image": "https://repovibe.dev/og.png",
    "og:site_name": "repoVibe",
    "og:locale": "en_US",
    // Schema.org structured data
    "application-name": "repoVibe",
    "msapplication-TileColor": "#000000",
    "theme-color": "#000000",
    // Additional SEO meta tags
    author: "Shubham Kanaskar",
    publisher: "Shubham Kanaskar",
    copyright: "Shubham Kanaskar",
    language: "English",
    "revisit-after": "1 day",
    distribution: "global",
    rating: "general",
    robots:
      "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    // Geo targeting
    "geo.region": "IN",
    "geo.country": "India",
    // Mobile optimization
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "repoVibe",
    // Alternative titles for different contexts
    "og:title:alt":
      "GitHub Repository Discovery | Repository Browser | repoVibe",
    "twitter:title:alt":
      "GitHub Repository Explorer | Repository Discovery Tool",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Additional metadata for better SEO
  alternates: {
    canonical: "https://repovibe.dev",
  },
  // App-specific metadata
  applicationName: "repoVibe",
  category: "Technology",
};
const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-instrument-serif",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
