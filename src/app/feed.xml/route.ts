import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://studypilot-app-seven.vercel.app";
  const now = new Date().toUTCString();

  const pages = [
    {
      title: "DocuMorphix AI — Free Online PDF Studio & AI Image Editor",
      url: baseUrl,
      description: "100% Free online visual PDF editor, digital signatures, AI notes summarizer, and background remover with zero watermarks.",
      pubDate: now,
    },
    {
      title: "Free Online PDF Editor without Watermark",
      url: `${baseUrl}/pdf-studio`,
      description: "Edit text, annotate, draw, and sign PDF documents directly in your browser with zero watermark.",
      pubDate: now,
    },
    {
      title: "Free AI Background Remover HD",
      url: `${baseUrl}/background-remover`,
      description: "Remove background from images, photos, and signatures 100% free with unlimited full resolution downloads.",
      pubDate: now,
    },
    {
      title: "Generate MCQs from PDF Free Online",
      url: `${baseUrl}/generate-mcqs`,
      description: "Create interactive multiple choice test questions and flashcards directly from lecture notes or syllabus PDF.",
      pubDate: now,
    },
    {
      title: "Sign PDF Online Free without Adobe",
      url: `${baseUrl}/sign-pdf`,
      description: "Add digital draw signature, name initials, or stamp to contracts and forms without subscription.",
      pubDate: now,
    },
    {
      title: "AI PDF Summarizer and Revision Notes",
      url: `${baseUrl}/ai-pdf-summarizer`,
      description: "Summarize textbook chapters and research papers into core takeaways and Feynman technique explanations.",
      pubDate: now,
    },
    {
      title: "Merge PDF Files Free Online",
      url: `${baseUrl}/merge-pdf`,
      description: "Combine multiple PDF documents into a single organized file in seconds.",
      pubDate: now,
    },
    {
      title: "Split PDF Pages Online Free",
      url: `${baseUrl}/split-pdf`,
      description: "Extract specific pages from large PDF books or documents without loss of formatting.",
      pubDate: now,
    },
    {
      title: "PDF to JPG Converter Online Free",
      url: `${baseUrl}/pdf-to-jpg`,
      description: "Convert PDF pages into high resolution JPG and PNG images instantly.",
      pubDate: now,
    },
  ];

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DocuMorphix AI Updates & Tools</title>
    <link>${baseUrl}</link>
    <description>Free Online PDF Editor, HD Background Remover, and AI Study Copilot with zero watermarks.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${pages
      .map(
        (p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${p.url}</link>
      <guid isPermaLink="true">${p.url}</guid>
      <description><![CDATA[${p.description}]]></description>
      <pubDate>${p.pubDate}</pubDate>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
