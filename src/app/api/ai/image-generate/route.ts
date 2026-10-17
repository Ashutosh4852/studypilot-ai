import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { action, prompt, style, aspectRatio } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { ok: false, error: "Prompt is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Layout / Headline Suggestion action
    if (action === "suggest-layout") {
      if (apiKey) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: `You are an expert social media graphic designer. For the topic/concept: "${prompt}", give:
1. High-converting Main Headline (max 5 words)
2. Subtitle / Call to Action (max 7 words)
3. 3 Color Palette Hex Codes that pop
4. Recommended sticker/badge text
Return output in JSON format:
{
  "headline": "...",
  "subtitle": "...",
  "palette": ["#...", "#...", "#..."],
  "badge": "..."
}`,
                      },
                    ],
                  },
                ],
                generationConfig: { temperature: 0.7 },
              }),
            }
          );
          if (res.ok) {
            const data = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
            const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(clean);
            return NextResponse.json({
              ok: true,
              data: {
                ...parsed,
                provider: "google-gemini",
                isExternalApi: true,
              },
            });
          }
        } catch (e) {
          console.warn("Gemini layout call failed, fallback used:", e);
        }
      }

      // Offline heuristic layout suggestions
      return NextResponse.json({
        ok: true,
        data: {
          headline: prompt.toUpperCase().slice(0, 30),
          subtitle: "Master the concepts with StudyPilot AI",
          palette: ["#6366f1", "#a855f7", "#06b6d4"],
          badge: "NEW GUIDE",
          provider: "local-heuristic-engine",
          isExternalApi: false,
          note: "Generated using built-in design heuristics. Configure GEMINI_API_KEY for dynamic generative copy.",
        },
      });
    }

    // Image generation from prompt
    // We check if external API is configured or use Pollinations free AI generation endpoint
    const cleanPrompt = encodeURIComponent(`${prompt}, ${style || "cinematic studio lighting, high resolution, 8k"}`);
    const width = aspectRatio === "16:9" ? 1280 : aspectRatio === "9:16" ? 720 : 1024;
    const height = aspectRatio === "16:9" ? 720 : aspectRatio === "9:16" ? 1280 : 1024;

    const imageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=${width}&height=${height}&nologo=true`;

    return NextResponse.json({
      ok: true,
      data: {
        imageUrl,
        provider: "pollinations-ai",
        isExternalApi: true,
        message: "Generated via free AI Diffusion model.",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message || "Failed to process image generation" },
      { status: 500 }
    );
  }
}
