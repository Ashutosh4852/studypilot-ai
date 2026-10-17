import { NextRequest, NextResponse } from "next/server";
import { processAiPdfTask, AiTaskRequest } from "@/lib/ai/geminiClient";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AiTaskRequest;

    if (!body || !body.text || !body.task) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: 'task' and 'text'" },
        { status: 400 }
      );
    }

    if (body.text.length > 500000) {
      return NextResponse.json(
        { ok: false, error: "Document text exceeds maximum allowed size (500,000 characters)." },
        { status: 413 }
      );
    }

    const response = await processAiPdfTask(body);
    return NextResponse.json({ ok: true, data: response });
  } catch (error: any) {
    console.error("API error in /api/ai/pdf-summary:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
