import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { issue, repository, language } = await req.json();

    if (!issue || !repository) {
      return NextResponse.json(
        { error: "Issue and repository are required" },
        { status: 400 }
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      console.log("Gemini API key not configured, returning fallback response");
      return NextResponse.json({
        success: true,
        suggestions: {
          problemAnalysis: {
            summary:
              "AI analysis is not available. Please configure the GEMINI_API_KEY environment variable to enable AI-powered issue analysis.",
            complexity: "unknown",
            estimatedTime: "unknown",
            keyChallenges: ["AI analysis not available"],
          },
          solutionApproach: {
            steps: [
              "Read the issue description carefully",
              "Understand the problem requirements",
              "Plan your implementation approach",
              "Write and test your solution",
            ],
            technologies: [],
            filesToModify: [],
          },
          codeExamples: {
            snippets: [],
          },
          prGuidelines: {
            title: `Fix: ${issue.title}`,
            description:
              "Please provide a detailed description of your changes and how they address the issue.",
            checklist: [
              "Code follows project style guidelines",
              "All tests pass",
              "Documentation is updated if needed",
              "Changes are properly tested",
            ],
          },
          resources: {
            documentation: [],
            examples: [],
            relatedIssues: [],
          },
          contributionTips: [
            "Read the issue description thoroughly",
            "Ask questions if anything is unclear",
            "Test your changes before submitting",
            "Follow the project's contribution guidelines",
          ],
        },
        rawResponse: "Fallback response - Gemini API not configured",
      });
    }

    // Create the prompt for Gemini
    const prompt = createAnalysisPrompt(issue, repository, language);

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API Error:", {
        status: geminiResponse.status,
        statusText: geminiResponse.statusText,
        error: errorText,
      });
      throw new Error(
        `Gemini API error: ${geminiResponse.status} - ${errorText}`
      );
    }

    const geminiData = await geminiResponse.json();
    const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      throw new Error("No response from Gemini API");
    }

    // Parse the AI response into structured data
    const suggestions = parseAIResponse(aiResponse);

    return NextResponse.json({
      success: true,
      suggestions,
      rawResponse: aiResponse,
    });
  } catch (error) {
    console.error("AI Suggestions error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI suggestions" },
      { status: 500 }
    );
  }
}

interface Issue {
  title: string;
  body: string;
  labels: Array<{ name: string }>;
  comments: number;
}

function createAnalysisPrompt(
  issue: Issue,
  repository: string,
  language: string
): string {
  return `
You are an expert software engineer and open source contributor. Analyze this GitHub issue and provide helpful suggestions for solving it.

Repository: ${repository}
Language: ${language}
Issue Title: ${issue.title}
Issue Body: ${issue.body}
Labels: ${issue.labels.map((l) => l.name).join(", ")}
Comments: ${issue.comments}

Please provide a structured analysis in the following JSON format:

{
  "problemAnalysis": {
    "summary": "Brief summary of what the issue is about",
    "complexity": "easy|medium|hard",
    "estimatedTime": "1-2 hours|1-2 days|1-2 weeks|unknown",
    "keyChallenges": ["challenge1", "challenge2", "challenge3"]
  },
  "solutionApproach": {
    "steps": [
      "Step 1: Description",
      "Step 2: Description",
      "Step 3: Description"
    ],
    "technologies": ["tech1", "tech2", "tech3"],
    "filesToModify": ["file1.js", "file2.js"]
  },
  "codeExamples": {
    "snippets": [
      {
        "language": "javascript",
        "code": "// Example code snippet",
        "description": "What this code does"
      }
    ]
  },
  "prGuidelines": {
    "title": "Suggested PR title",
    "description": "Suggested PR description template",
    "checklist": [
      "Checklist item 1",
      "Checklist item 2",
      "Checklist item 3"
    ]
  },
  "resources": {
    "documentation": ["link1", "link2"],
    "examples": ["example1", "example2"],
    "relatedIssues": ["issue1", "issue2"]
  },
  "contributionTips": [
    "Tip 1 for contributing",
    "Tip 2 for contributing",
    "Tip 3 for contributing"
  ]
}

Focus on practical, actionable advice. If this is a good first issue, provide extra guidance for beginners. If it's complex, break it down into manageable steps.
`;
}

interface AISuggestions {
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
  rawResponse?: string;
}

function parseAIResponse(response: string): AISuggestions {
  try {
    // First, try to clean the response by removing comments and extra text
    let cleanedResponse = response.trim();

    // Remove markdown code blocks if present
    cleanedResponse = cleanedResponse
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "");

    // Try to find JSON object boundaries more precisely
    const jsonStart = cleanedResponse.indexOf("{");
    const jsonEnd = cleanedResponse.lastIndexOf("}");

    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      const jsonString = cleanedResponse.substring(jsonStart, jsonEnd + 1);

      // Try to clean up common JSON issues
      const cleanJson = jsonString
        .replace(/\/\/.*$/gm, "") // Remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
        .replace(/,(\s*[}\]])/g, "$1") // Remove trailing commas
        .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Quote unquoted keys
        .trim();

      try {
        return JSON.parse(cleanJson);
      } catch {
        console.log(
          "First JSON parse attempt failed, trying alternative approach"
        );

        // Alternative approach: try to extract just the main structure
        const lines = jsonString.split("\n");
        const jsonLines = lines.filter((line) => {
          const trimmed = line.trim();
          return (
            trimmed &&
            !trimmed.startsWith("//") &&
            !trimmed.startsWith("/*") &&
            !trimmed.startsWith("*")
          );
        });

        const alternativeJson = jsonLines.join("\n");
        try {
          return JSON.parse(alternativeJson);
        } catch {
          console.log("Alternative JSON parse also failed");
        }
      }
    }

    // Fallback: return structured response even if not perfect JSON
    return {
      problemAnalysis: {
        summary: "AI analysis completed",
        complexity: "medium",
        estimatedTime: "unknown",
        keyChallenges: ["Analysis in progress"],
      },
      solutionApproach: {
        steps: [
          "Review the issue details",
          "Plan your approach",
          "Implement solution",
        ],
        technologies: [],
        filesToModify: [],
      },
      codeExamples: {
        snippets: [],
      },
      prGuidelines: {
        title: "Fix: " + response.substring(0, 50) + "...",
        description: "Please provide a detailed description of your changes.",
        checklist: [
          "Code follows project style",
          "Tests pass",
          "Documentation updated",
        ],
      },
      resources: {
        documentation: [],
        examples: [],
        relatedIssues: [],
      },
      contributionTips: [
        "Read the issue carefully",
        "Ask questions if unclear",
        "Test your changes thoroughly",
      ],
      rawResponse: response,
    };
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return {
      problemAnalysis: {
        summary: "Error parsing AI response",
        complexity: "unknown",
        estimatedTime: "unknown",
        keyChallenges: ["Failed to parse AI response"],
      },
      solutionApproach: {
        steps: ["Please try again"],
        technologies: [],
        filesToModify: [],
      },
      codeExamples: {
        snippets: [],
      },
      prGuidelines: {
        title: "Error in AI Analysis",
        description: "There was an error processing the AI response.",
        checklist: ["Please try again"],
      },
      resources: {
        documentation: [],
        examples: [],
        relatedIssues: [],
      },
      contributionTips: ["Please try again"],
      rawResponse: response,
    };
  }
}
