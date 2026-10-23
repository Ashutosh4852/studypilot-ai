import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DocuMorphix AI — Free Online PDF Studio & AI Image Editor";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #0f172a 100%)",
          fontFamily: "sans-serif",
          color: "white",
          padding: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            DM
          </div>
          <span style={{ fontSize: "38px", fontWeight: 800, letterSpacing: "-0.5px" }}>
            DocuMorphix AI
          </span>
          <span
            style={{
              marginLeft: "12px",
              fontSize: "14px",
              fontWeight: 800,
              padding: "6px 14px",
              borderRadius: "999px",
              background: "#10b981",
              color: "#022c22",
            }}
          >
            100% FREE • ZERO WATERMARK
          </span>
        </div>
        <div
          style={{
            fontSize: "46px",
            fontWeight: 900,
            textAlign: "center",
            maxWidth: "960px",
            lineHeight: 1.15,
            marginBottom: "24px",
            background: "linear-gradient(to right, #ffffff, #c7d2fe, #e0e7ff)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Free Online PDF Editor, HD Background Remover & AI Study Copilot
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            fontSize: "18px",
            color: "#94a3b8",
            fontWeight: 600,
          }}
        >
          <span>✨ No Login Required</span>
          <span>•</span>
          <span>📄 Merge & Sign PDFs</span>
          <span>•</span>
          <span>🎯 MCQ Quiz & Notes Maker</span>
          <span>•</span>
          <span>🖼️ Full Resolution Cutout</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
