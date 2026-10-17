# StudyPilot AI — PDF Studio & AI Image Studio

StudyPilot AI is an advanced, browser-first educational and creative productivity platform tailored for students, researchers, educators, and creators.

---

## 🌟 Modules Overview

### MODULE 1: PDF STUDIO
A browser-based, client-side visual PDF editor, converter, and AI study copilot.

#### A. Basic PDF Editing
- **Drag-and-Drop Upload**: Fast file selection supporting documents up to 50 MB.
- **Document Viewer**: High-definition page rendering powered by Mozilla PDF.js.
- **Text & Annotations**: Add text boxes, highlights, underlines, strikethroughs, and comments.
- **Freehand Drawing**: Smooth pen tool with custom stroke sizes and color palettes.
- **Shapes & Connectors**: Rectangles, circles, lines, and directional arrows.
- **Signatures & Stamps**: Draw signature by hand, type cursive initials, choose official stamps (APPROVED, CONFIDENTIAL, DRAFT, REVIEWED, FINAL), or upload image seals.
- **Page Management**: Rotate clockwise/counterclockwise (90°/180°/270°), reorder pages, delete, duplicate, and insert blank pages.
- **Watermarking**: Diagonal/centered text watermark with opacity and angle controls.
- **Page Numbering & Headers**: Add formal academic headers, footers, and page numbers ("Page {n} of {total}").
- **Undo / Redo**: Complete history tracking with keyboard shortcuts (`Ctrl+Z`, `Ctrl+Y`).
- **Standard PDF Export**: Bakes vector annotations, drawings, and stamps directly onto the PDF using `pdf-lib` for 100% Adobe Acrobat & Preview compatibility.

#### B. PDF Conversion & Document Tools
- **PDF to JPG & PNG**: Render and export pages as high-resolution images or packaged ZIP archives.
- **Images to PDF**: Convert multi-image selections into a single compiled PDF.
- **PDF to Extracted Text**: Extract the raw text layer from documents into clean `.txt` files.
- **TXT to PDF**: Format notes, essays, or code drafts into standard A4 PDF pages.
- **Merge Multiple PDFs**: Append separate PDF documents into a single unified file.
- **Split & Extract Pages**: Extract custom page ranges into a new standalone PDF.

#### C. AI PDF Tools
- **Document Summarizer**: Executive overview, core takeaways, and study tips.
- **Document Q&A**: Interactive chat grounded directly in the document text.
- **Definitions & Key Terms**: Automatically detects and catalogs technical concepts.
- **MCQ Revision Quiz**: Generates 5 multiple choice questions with answers and explanations.
- **Language Translation**: Translate document sections into 10+ languages.
- **ELI5 Concept Explainer**: Simplifies dense academic jargon using the Feynman Technique.
- **Client-Side OCR**: Recognizes text in scanned documents via Tesseract WebAssembly directly in the browser.

#### D. Security & Privacy
- **100% In-Browser First**: Documents are edited on your device using WebAssembly without external uploads.
- **Explicit Consent**: Documents are only sent to AI endpoints upon user interaction.
- **Digital Signature Protection**: Clear warnings to alert users that modifying signed documents invalidates cryptographic PKI certificates.

---

### MODULE 2: AI IMAGE STUDIO
A modern, browser-based image editor with pixel adjustments, filters, canvas presets, and generative tools.

#### A. Basic Image Editor
- **Multi-Format Support**: JPG, JPEG, PNG, and WebP.
- **Crop & Resize**: Freeform and aspect ratio presets (1:1 Square, 16:9 YouTube, 4:5 Instagram Portrait, 9:16 Reels/Stories).
- **Transformations**: 90° CW/CCW rotation, horizontal flip, vertical flip.
- **Adjustments**: Brightness, contrast, saturation, sharpness (convolution kernel), exposure, and soft blur.
- **Filter Presets**: B&W Mono, Sepia, Retro Film, Cyberpunk, Dramatic Noir, Warm Sunset, Cool Blue, Invert, and High Contrast.
- **Overlays**: Add titles, subtitles, background banner pills, shapes, arrows, and emoji stickers.
- **Privacy Redaction**: Click and drag to pixelate sensitive information (passwords, faces, ID numbers).
- **Watermark**: Imprint custom watermarks with opacity and angle controls.
- **Compare Before/After**: Instant preview toggle against the original unedited photo.
- **Export**: PNG (with alpha transparency preserved), JPG, and WebP with custom quality slider.

#### B. AI Image Editing
- **Background Remover**: Fast in-browser edge detection and subject isolation with alpha feathering.
- **Background Replacement**: Composite cutouts on solid studio colors, luxury marble, or gradients.
- **Enhance & Upscale**: Contrast normalization and micro-edge sharpening.
- **Text-to-Image AI Diffusion**: Generate artwork and scenes from text descriptions.
- **Product Studio**: One-click commercial e-commerce backdrops.
- **Thumbnail Assistant**: Generates high-CTR headlines, subtitles, and color palettes.

#### C. Ready-Made Design Presets
- Instagram Post (1080 × 1080)
- Instagram Portrait (1080 × 1350)
- Instagram Stories & Reels (1080 × 1920)
- YouTube Thumbnail (1280 × 720)
- LinkedIn Post Banner (1200 × 627)
- Resume & Avatar Profile (400 × 400)
- Presentation Graphic (1920 × 1080)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun 1.0+

### Installation
```bash
# Install dependencies
bun install
# or
npm install
```

### Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure optional server-side API keys:
```env
# Optional: Google Gemini API Key for AI PDF Summarization and Q&A
GEMINI_API_KEY=your_gemini_api_key_here

NEXT_PUBLIC_APP_NAME="StudyPilot AI"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> **Note**: If `GEMINI_API_KEY` is not provided, StudyPilot AI automatically operates using its built-in local heuristic engine, clearly indicated in the UI.

### Running the App
```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view StudyPilot AI.

### Running Automated Tests
```bash
node test/suite.js
# or
npm test
```

---

## 🛠 Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Lucide Icons
- **PDF Engine**: pdf-lib (MIT) & Mozilla PDF.js
- **OCR Engine**: Tesseract.js (Apache-2.0 WebAssembly)
- **Archive Engine**: JSZip
- **AI Integrations**: Google Gemini 1.5 Flash API + Local Heuristic Engine
