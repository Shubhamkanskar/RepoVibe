"use client";

import Button from "../../Button";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

export default function Hero() {
  const pings = [
    { top: "20%", left: "35%" },
    { top: "40%", left: "60%" },
    { top: "30%", left: "80%" },
    { top: "50%", left: "20%" },
    { top: "35%", left: "50%" },
    { top: "70%", left: "50%" },
    { top: "55%", left: "75%" },
    { top: "60%", left: "68%" },
  ];

  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/grill.png"
          as="image"
          type="image/png"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="/bluePurpleYellowGradient2.png"
          as="image"
          type="image/png"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="/worldMap.png"
          as="image"
          type="image/png"
          fetchPriority="high"
        />
      </Head>

      <main className="relative w-full min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
        <section className="relative w-full min-h-screen px-4 sm:px-8 md:px-16 lg:px-32 xl:px-44 flex flex-col items-center justify-center">
          <div className="hidden">
            <Image
              src="/grill.png"
              alt=""
              width={1920}
              height={1080}
              priority
              quality={85}
            />
            <Image
              src="/bluePurpleYellowGradient2.png"
              alt=""
              width={1920}
              height={1080}
              priority
              quality={85}
            />
            <Image
              src="/worldMap.png"
              alt=""
              width={1200}
              height={600}
              priority
              quality={85}
            />
          </div>

          <div className="absolute inset-0 z-0 pointer-events-none opacity-30 animate-fadeIn">
            <Image
              src="/grill.png"
              alt=""
              fill
              priority
              quality={85}
              className="object-cover"
            />
          </div>
          {/* <div className="absolute inset-0 z-0 pointer-events-none animate-fadeIn">
            <Image
              src="/bluePurpleYellowGradient2.png"
              alt=""
              fill
              priority
              quality={85}
              className="object-cover"
            />
          </div> */}

          <div className="absolute top-4 sm:top-6 md:top-8 left-0 w-full px-4 sm:px-8 md:px-16 lg:px-32 xl:px-44 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 z-10">
            <Link
              href="/"
              className="inline-flex font-instrument items-center font-mono text-white text-[1.9rem] sm:text-[2.5rem] font-medium leading-none tracking-tight"
            >
              <span className="text-white">repo</span>
              <span className="text-purple-400">Vibe</span>
            </Link>

            <div className="hidden sm:flex flex-row gap-2 sm:gap-4 w-full sm:w-auto items-start sm:items-center">
              <Button
                label="Get started"
                href="/auth"
                className="z-10 transition duration-300 shadow-lg flex hover:shadow-xl sm:w-auto"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row w-full justify-between items-center gap-14 lg:gap-4 z-10 mt-24 sm:mt-32 md:mt-20 lg:mt-0 px-4 sm:px-0">
            <div className="flex flex-col gap-6 w-full items-center lg:items-start text-center lg:text-left">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-[100%] animate-fade-in w-fit">
                <h1 className="bg-gradient-to-r font-medium font-instrument leading-[110%] space-x-1 sm:space-x-2 text-slate-400">
                  <span>Discover</span>
                  <span className="text-white">GitHub</span>
                  <span className="text-white">Repos</span>
                  <span>&</span>
                  <span className="text-purple-400">Solve</span>
                  <span className="text-purple-400">Issues</span>
                  <br />
                  <span>With</span>
                  <span className="text-purple-400">AI</span>
                  <span>Power</span>
                </h1>

                <div
                  className="mt-2 sm:mt-3 mx-auto lg:mx-0 px-2 py-1 w-fit text-xs sm:text-sm font-medium text-purple-400 tracking-tight border-[2px] transition-all duration-300"
                  style={{
                    borderImage:
                      "conic-gradient(#d4d4d4 0deg, #171717 90deg, #d4d4d4 180deg, #171717 270deg, #d4d4d4 360deg) 1",
                  }}
                  role="banner"
                  aria-label="Project tagline"
                >
                  AI-Powered GitHub Issue Analysis & Solutions
                </div>
              </div>

              <div className="text-slate-400 font-medium leading-5 transition-all duration-300 text-sm sm:text-base">
                <p>
                  Discover trending repositories and get AI-powered solutions
                  for GitHub issues. <br className="hidden sm:block" />
                  Transform complex problems into actionable development plans.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center sm:justify-start items-center gap-4 w-full sm:w-auto">
                <Button
                  label="Get started"
                  href="/auth"
                  className="z-10 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 w-fit sm:w-auto"
                  aria-label="Get started with repoVibe"
                />

                <button
                  className="group px-4 py-2 text-sm font-semibold flex items-center border border-neutral-700/30 justify-center sm:justify-between gap-1.5 text-white bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 z-10 shadow-lg hover:shadow-xl w-fit sm:w-auto"
                  type="button"
                  aria-label="Information about Y Combinator backing"
                >
                  Not backed by{" "}
                  <span className="text-white bg-orange-500 px-1.5 transition-transform duration-200 group-hover:scale-110">
                    Y
                  </span>
                </button>
              </div>

              {/* Feature Highlights */}
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span className="text-sm text-purple-300">
                    AI-Powered Analysis
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                  <svg
                    className="w-4 h-4 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="text-sm text-blue-300">Smart Discovery</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm text-green-300">
                    Instant Solutions
                  </span>
                </div>
              </div>

              {/* Stats Section */}
              <div className="flex flex-wrap justify-center gap-8 mt-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-sm text-slate-400">
                    Repositories Analyzed
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-white">95%</div>
                  <div className="text-sm text-slate-400">
                    Issue Resolution Rate
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-white">2.5s</div>
                  <div className="text-sm text-slate-400">
                    Average Analysis Time
                  </div>
                </div>
              </div>
            </div>

            <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-[22.5rem] pointer-events-none scale-[1.05] animate-fadeIn">
              <Image
                src="/worldMap.png"
                alt=""
                fill
                priority
                quality={85}
                className="object-contain lg:object-cover"
              />
              {pings.map((pos, i) => (
                <span
                  key={i}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    top: pos.top,
                    left: pos.left,
                    animationDelay: `${(i % 5) * 0.4}s`,
                  }}
                >
                  <span className="relative flex h-[0.6rem] w-[0.6rem] items-center justify-center">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-70 blur-sm animate-pulse" />
                    <span className="relative inline-flex h-[0.15rem] w-[0.15rem] rounded-full bg-yellow-400" />
                  </span>
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
