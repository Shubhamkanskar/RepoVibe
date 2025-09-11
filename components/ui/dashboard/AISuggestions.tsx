"use client";

import { useState } from "react";
import {
  Brain,
  Code,
  FileText,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

interface AISuggestionsProps {
  issue: any;
  repository: string;
  language: string;
}

interface Suggestions {
  problemAnalysis: {
    summary: string;
    complexity: string;
    estimatedTime: string;
    keyChallenges: string[];
  };
  solutionApproach: {
    steps: string[];
    technologies: string[];
    filesToModify: string[];
  };
  codeExamples: {
    snippets: Array<{
      language: string;
      code: string;
      description: string;
    }>;
  };
  prGuidelines: {
    title: string;
    description: string;
    checklist: string[];
  };
  resources: {
    documentation: string[];
    examples: string[];
    relatedIssues: string[];
  };
  contributionTips: string[];
}

export default function AISuggestions({
  issue,
  repository,
  language,
}: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAISuggestions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/aiSuggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          issue,
          repository,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI suggestions");
      }

      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case "easy":
        return "text-green-400 bg-green-500/10 border-green-400/20";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-400/20";
      case "hard":
        return "text-red-400 bg-red-500/10 border-red-400/20";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-400/20";
    }
  };

  const getTimeColor = (time: string) => {
    if (time.includes("hours")) return "text-green-400";
    if (time.includes("days")) return "text-yellow-400";
    if (time.includes("weeks")) return "text-red-400";
    return "text-slate-400";
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-semibold text-white">
          AI-Powered Issue Analysis
        </h2>
      </div>

      {!suggestions && !isLoading && (
        <div className="text-center py-8">
          <button
            onClick={fetchAISuggestions}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
          >
            <Brain className="w-4 h-4" />
            Get AI Suggestions
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-transparent border-t-purple-300 rounded-full animate-spin" />
          <span className="ml-3 text-slate-400">
            Analyzing issue with AI...
          </span>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>Error: {error}</span>
          </div>
        </div>
      )}

      {suggestions && (
        <div className="space-y-6">
          {/* Problem Analysis */}
          <div className="bg-slate-900/40 border border-purple-800/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-purple-400" />
              Problem Analysis
            </h3>
            <p className="text-slate-300 mb-4">
              {suggestions.problemAnalysis.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Complexity:</span>
                <span
                  className={`px-2 py-1 rounded-md border text-xs font-medium ${getComplexityColor(
                    suggestions.problemAnalysis.complexity
                  )}`}
                >
                  {suggestions.problemAnalysis.complexity}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span
                  className={`text-sm ${getTimeColor(
                    suggestions.problemAnalysis.estimatedTime
                  )}`}
                >
                  {suggestions.problemAnalysis.estimatedTime}
                </span>
              </div>
            </div>

            {suggestions.problemAnalysis.keyChallenges.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-slate-400 mb-2">
                  Key Challenges:
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {suggestions.problemAnalysis.keyChallenges.map(
                    (challenge, index) => (
                      <li key={index} className="text-slate-300 text-sm">
                        {challenge}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Solution Approach */}
          <div className="bg-slate-900/40 border border-purple-800/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Solution Approach
            </h3>

            {suggestions.solutionApproach.steps.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-400 mb-2">
                  Steps:
                </h4>
                <ol className="list-decimal list-inside space-y-2">
                  {suggestions.solutionApproach.steps.map((step, index) => (
                    <li key={index} className="text-slate-300 text-sm">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {suggestions.solutionApproach.technologies.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-400 mb-2">
                  Technologies:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {suggestions.solutionApproach.technologies.map(
                    (tech, index) => (
                      <span
                        key={index}
                        className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded-md text-xs border border-purple-400/20"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            {suggestions.solutionApproach.filesToModify.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">
                  Files to Modify:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {suggestions.solutionApproach.filesToModify.map(
                    (file, index) => (
                      <span
                        key={index}
                        className="bg-slate-700/50 text-slate-300 px-2 py-1 rounded-md text-xs font-mono"
                      >
                        {file}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Code Examples */}
          {suggestions.codeExamples.snippets.length > 0 && (
            <div className="bg-slate-900/40 border border-purple-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-400" />
                Code Examples
              </h3>
              <div className="space-y-4">
                {suggestions.codeExamples.snippets.map((snippet, index) => (
                  <div key={index} className="bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-slate-400 uppercase">
                        {snippet.language}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-sm text-slate-300">
                        {snippet.description}
                      </span>
                    </div>
                    <pre className="text-sm text-slate-200 overflow-x-auto">
                      <code>{snippet.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PR Guidelines */}
          <div className="bg-slate-900/40 border border-purple-800/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-yellow-400" />
              PR Guidelines
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-1">
                  Suggested Title:
                </h4>
                <p className="text-slate-300 text-sm bg-slate-800/50 p-2 rounded border">
                  {suggestions.prGuidelines.title}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-1">
                  Description Template:
                </h4>
                <p className="text-slate-300 text-sm bg-slate-800/50 p-2 rounded border whitespace-pre-wrap">
                  {suggestions.prGuidelines.description}
                </p>
              </div>

              {suggestions.prGuidelines.checklist.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">
                    Checklist:
                  </h4>
                  <ul className="space-y-1">
                    {suggestions.prGuidelines.checklist.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-slate-300 text-sm"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-purple-400"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Resources */}
          {(suggestions.resources.documentation.length > 0 ||
            suggestions.resources.examples.length > 0 ||
            suggestions.resources.relatedIssues.length > 0) && (
            <div className="bg-slate-900/40 border border-purple-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-cyan-400" />
                Resources
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {suggestions.resources.documentation.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-2">
                      Documentation:
                    </h4>
                    <ul className="space-y-1">
                      {suggestions.resources.documentation.map((doc, index) => (
                        <li key={index}>
                          <a
                            href={doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 text-sm"
                          >
                            {doc}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {suggestions.resources.examples.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-2">
                      Examples:
                    </h4>
                    <ul className="space-y-1">
                      {suggestions.resources.examples.map((example, index) => (
                        <li key={index}>
                          <a
                            href={example}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 text-sm"
                          >
                            {example}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {suggestions.resources.relatedIssues.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-2">
                      Related Issues:
                    </h4>
                    <ul className="space-y-1">
                      {suggestions.resources.relatedIssues.map(
                        (related, index) => (
                          <li key={index}>
                            <a
                              href={related}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 text-sm"
                            >
                              {related}
                            </a>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contribution Tips */}
          {suggestions.contributionTips.length > 0 && (
            <div className="bg-slate-900/40 border border-purple-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-400" />
                Contribution Tips
              </h3>
              <ul className="space-y-2">
                {suggestions.contributionTips.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-slate-300 text-sm"
                  >
                    <span className="text-green-400 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
