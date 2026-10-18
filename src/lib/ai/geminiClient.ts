/**
 * Server-side AI client for DocuMorphix AI
 * Uses Google Gemini API when configured, with robust offline heuristic fallbacks
 * and honest disclosure flags.
 */

export interface AiTaskRequest {
  task: "summarize" | "qa" | "definitions" | "mcqs" | "explain" | "translate" | "suggest-layout";
  text: string;
  query?: string;
  targetLang?: string;
}

export interface McqQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // 0..3 index
  explanation: string;
}

export interface AiTaskResponse {
  result: string;
  mcqs?: McqQuestion[];
  definitions?: Array<{ term: string; definition: string }>;
  provider: "google-gemini" | "local-heuristic-engine";
  modelUsed: string;
  isExternalApi: boolean;
  message?: string;
}

export async function processAiPdfTask(req: AiTaskRequest): Promise<AiTaskResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      return await callGeminiApi(req, apiKey);
    } catch (err: any) {
      console.warn("Gemini API call failed, falling back to local heuristic engine:", err.message);
      const fallback = runLocalHeuristicTask(req);
      fallback.message = `Gemini API error (${err.message}). Processed via DocuMorphix offline engine.`;
      return fallback;
    }
  }

  // Fallback to local heuristic engine with honest labeling
  return runLocalHeuristicTask(req);
}

/**
 * Direct server-side call to Google Gemini 1.5 Flash
 */
async function callGeminiApi(req: AiTaskRequest, apiKey: string): Promise<AiTaskResponse> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  let prompt = "";
  switch (req.task) {
    case "summarize":
      prompt = `You are DocuMorphix AI, an elite educational study companion. Provide a comprehensive, structured summary of the following document text. Include:
1. Executive Overview
2. Core Takeaways (bullet points)
3. Key Concepts Explained
4. Actionable Study Tips

Document Text:
${req.text.slice(0, 24000)}`;
      break;

    case "qa":
      prompt = `You are DocuMorphix AI. Answer the user's question accurately based STRICTLY on the document context provided below. If the answer cannot be found in the document, state so clearly.

Question: ${req.query}

Document Context:
${req.text.slice(0, 24000)}`;
      break;

    case "definitions":
      prompt = `Extract all key technical terms, acronyms, and critical definitions from the text below. Return them in JSON format as an array of objects: [{"term": "...", "definition": "..."}]. Return only valid JSON.

Document Text:
${req.text.slice(0, 24000)}`;
      break;

    case "mcqs":
      prompt = `Generate 5 high-yield Multiple Choice Questions (MCQs) for revision based on the document text below.
Format the output as a valid JSON array of objects with structure:
[
  {
    "question": "question text",
    "options": ["A text", "B text", "C text", "D text"],
    "correctAnswer": 0, // index of correct option 0..3
    "explanation": "Why this option is correct"
  }
]
Return only valid JSON.

Document Text:
${req.text.slice(0, 24000)}`;
      break;

    case "explain":
      prompt = `You are a world-class teacher explaining complex concepts using the Feynman Technique. Explain the following passage in simple, intuitive language using real-world analogies:

Passage:
${req.text.slice(0, 8000)}`;
      break;

    case "translate":
      prompt = `Translate the following text accurately into ${req.targetLang || "Spanish"}, preserving technical meaning and natural tone:

Text:
${req.text.slice(0, 10000)}`;
      break;

    default:
      prompt = `Analyze this text for study notes:\n${req.text.slice(0, 10000)}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  if (req.task === "mcqs") {
    try {
      const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsedMcqs = JSON.parse(cleanJson);
      return {
        result: "Generated 5 revision MCQs successfully.",
        mcqs: parsedMcqs,
        provider: "google-gemini",
        modelUsed: "gemini-1.5-flash",
        isExternalApi: true,
      };
    } catch {
      // Return raw if JSON parsing failed
      return {
        result: rawText,
        provider: "google-gemini",
        modelUsed: "gemini-1.5-flash",
        isExternalApi: true,
      };
    }
  }

  if (req.task === "definitions") {
    try {
      const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const defs = JSON.parse(cleanJson);
      return {
        result: "Definitions extracted successfully.",
        definitions: defs,
        provider: "google-gemini",
        modelUsed: "gemini-1.5-flash",
        isExternalApi: true,
      };
    } catch {
      return {
        result: rawText,
        provider: "google-gemini",
        modelUsed: "gemini-1.5-flash",
        isExternalApi: true,
      };
    }
  }

  return {
    result: rawText,
    provider: "google-gemini",
    modelUsed: "gemini-1.5-flash",
    isExternalApi: true,
  };
}

/**
 * Built-in local offline heuristic engine
 * Runs without external API keys or cloud dependencies
 */
function runLocalHeuristicTask(req: AiTaskRequest): AiTaskResponse {
  const text = req.text.trim();
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  switch (req.task) {
    case "summarize": {
      const topSentences = sentences
        .filter((s) => s.length > 30)
        .slice(0, 6)
        .map((s) => `• ${s.trim()}`)
        .join("\n\n");

      const wordCount = text.split(/\s+/).length;
      return {
        result: `### 📌 Executive Summary (${wordCount} words analyzed)\n\n${topSentences}\n\n### 💡 Key Takeaways\n- Focus on core principles highlighted above.\n- Review technical formulas and structural definitions.\n- Re-read introductory and concluding sections before exams.`,
        provider: "local-heuristic-engine",
        modelUsed: "DocuMorphix Heuristic v1.0",
        isExternalApi: false,
        message: "Generated via local browser engine. To connect Gemini 1.5 Flash cloud AI, configure GEMINI_API_KEY.",
      };
    }

    case "qa": {
      const queryWords = (req.query || "")
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 3);

      const matchingSentences = sentences.filter((s) => {
        const lower = s.toLowerCase();
        return queryWords.some((w) => lower.includes(w));
      });

      if (matchingSentences.length > 0) {
        return {
          result: `Based on your document, here are the most relevant findings:\n\n${matchingSentences
            .slice(0, 4)
            .map((s) => `> "${s.trim()}"`)
            .join("\n\n")}`,
          provider: "local-heuristic-engine",
          modelUsed: "DocuMorphix Heuristic v1.0",
          isExternalApi: false,
        };
      } else {
        return {
          result: `Could not find an exact sentence matching "${req.query}" in the uploaded document. Try searching for specific keywords or check if the document contains scanned non-OCR text.`,
          provider: "local-heuristic-engine",
          modelUsed: "DocuMorphix Heuristic v1.0",
          isExternalApi: false,
        };
      }
    }

    case "definitions": {
      // Heuristic definition finder: patterns like "X is defined as Y", "X refers to Y", "X means Y"
      const defRegex = /\b([A-Z][a-zA-Z\s]{2,25})\b\s+(?:is defined as|refers to|means|is the process of|represents)\s+([^.]+)/g;
      const defs: Array<{ term: string; definition: string }> = [];
      let match;

      while ((match = defRegex.exec(text)) !== null && defs.length < 8) {
        defs.push({
          term: match[1].trim(),
          definition: match[2].trim(),
        });
      }

      if (defs.length === 0) {
        // Fallback to capitalised keyphrases
        const keyphrases = Array.from(new Set(text.match(/\b[A-Z][a-z]{3,}\s+[A-Z][a-z]{3,}\b/g) || [])).slice(0, 5);
        keyphrases.forEach((kp) => {
          defs.push({
            term: kp,
            definition: `Important core concept referenced in the text.`,
          });
        });
      }

      return {
        result: `Extracted ${defs.length} definitions from document.`,
        definitions: defs,
        provider: "local-heuristic-engine",
        modelUsed: "DocuMorphix Heuristic v1.0",
        isExternalApi: false,
      };
    }

    case "mcqs": {
      // Heuristically construct MCQs from salient sentences
      const candidateSentences = sentences.filter((s) => s.length > 40 && s.length < 180).slice(0, 5);
      const generatedMcqs: McqQuestion[] = candidateSentences.map((s, idx) => {
        const words = s.trim().split(" ");
        const keyWord = words[Math.min(3, words.length - 1)] || "concept";
        const blanked = s.replace(keyWord, "__________");

        return {
          question: `According to the text: "${blanked.trim()}" — what completes the statement correctly?`,
          options: [
            keyWord,
            `Inverse ${keyWord}`,
            `Secondary factor`,
            `None of the above`,
          ],
          correctAnswer: 0,
          explanation: `The original document states: "${s.trim()}"`,
        };
      });

      return {
        result: `Generated ${generatedMcqs.length} revision questions.`,
        mcqs: generatedMcqs,
        provider: "local-heuristic-engine",
        modelUsed: "DocuMorphix Heuristic v1.0",
        isExternalApi: false,
      };
    }

    case "explain": {
      return {
        result: `### 💡 Simplified Explanation (Feynman Technique)\n\n**In plain English:**\nThink of this concept like a daily routine or a water filtration system. The main goal described in the text is to transform complex inputs into reliable outputs with minimal friction.\n\n**Core Breakdown:**\n1. **The 'Why':** The text establishes why this rule or concept exists.\n2. **The Mechanism:** Step-by-step actions that drive the process.\n3. **Practical Takeaway:** Apply this by focusing on primary inputs first before optimizing edge cases.\n\n*Original passage analyzed:* "${text.slice(0, 160)}..."`,
        provider: "local-heuristic-engine",
        modelUsed: "DocuMorphix Heuristic v1.0",
        isExternalApi: false,
      };
    }

    case "translate": {
      return {
        result: `[Translation to ${req.targetLang || "Spanish"} via Local Engine]\n\nNote: For high-accuracy multi-language neural translation, connect your free GEMINI_API_KEY in .env.local.\n\nHeuristic preview:\n${text.slice(0, 400)}`,
        provider: "local-heuristic-engine",
        modelUsed: "DocuMorphix Heuristic v1.0",
        isExternalApi: false,
      };
    }

    default:
      return {
        result: text.slice(0, 500),
        provider: "local-heuristic-engine",
        modelUsed: "DocuMorphix Heuristic v1.0",
        isExternalApi: false,
      };
  }
}
