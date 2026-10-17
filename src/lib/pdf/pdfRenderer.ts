/**
 * Client-side PDF page rendering & text extraction using PDF.js
 */

export interface RenderedPageInfo {
  pageNumber: number;
  width: number;
  height: number;
  dataUrl: string;
}

export interface ExtractedPageText {
  pageNumber: number;
  text: string;
}

let pdfjsLibInstance: any = null;

async function getPdfJs() {
  if (typeof window === "undefined") return null;
  if (pdfjsLibInstance) return pdfjsLibInstance;

  try {
    const pdfjs = await import("pdfjs-dist");
    // Configure worker
    if (pdfjs.GlobalWorkerOptions && !pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version || "3.11.174"}/pdf.worker.min.js`;
    }
    pdfjsLibInstance = pdfjs;
    return pdfjs;
  } catch (err) {
    console.error("Failed to load pdfjs-dist:", err);
    return null;
  }
}

/**
 * Renders a specific page of a PDF Uint8Array to a high-resolution canvas DataURL
 */
export async function renderPdfPageToDataUrl(
  pdfBytes: Uint8Array,
  pageNumber: number,
  scale = 1.5
): Promise<{ dataUrl: string; width: number; height: number }> {
  const pdfjs = await getPdfJs();
  if (!pdfjs) throw new Error("PDF.js renderer is not initialized");

  const loadingTask = pdfjs.getDocument({ data: pdfBytes.slice(0) });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(pageNumber);

  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Failed to get 2D canvas context");

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: ctx,
    viewport,
  }).promise;

  return {
    dataUrl: canvas.toDataURL("image/png"),
    width: viewport.width,
    height: viewport.height,
  };
}

/**
 * Extracts raw textual content from all pages of a PDF
 */
export async function extractPdfText(
  pdfBytes: Uint8Array,
  onProgress?: (current: number, total: number) => void
): Promise<ExtractedPageText[]> {
  const pdfjs = await getPdfJs();
  if (!pdfjs) throw new Error("PDF.js renderer is not initialized");

  const loadingTask = pdfjs.getDocument({ data: pdfBytes.slice(0) });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const results: ExtractedPageText[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str || "")
      .join(" ");

    results.push({
      pageNumber: i,
      text: pageText.trim(),
    });

    if (onProgress) onProgress(i, numPages);
  }

  return results;
}

/**
 * Renders all pages of a PDF to image DataURLs (JPG / PNG)
 */
export async function renderAllPdfPages(
  pdfBytes: Uint8Array,
  format: "png" | "jpeg" = "png",
  scale = 1.5,
  onProgress?: (current: number, total: number) => void
): Promise<RenderedPageInfo[]> {
  const pdfjs = await getPdfJs();
  if (!pdfjs) throw new Error("PDF.js renderer is not initialized");

  const loadingTask = pdfjs.getDocument({ data: pdfBytes.slice(0) });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const pages: RenderedPageInfo[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    pages.push({
      pageNumber: i,
      width: viewport.width,
      height: viewport.height,
      dataUrl: canvas.toDataURL(`image/${format}`, 0.92),
    });

    if (onProgress) onProgress(i, numPages);
  }

  return pages;
}
