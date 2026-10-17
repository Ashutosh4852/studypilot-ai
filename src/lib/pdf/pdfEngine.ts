import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";

export interface AnnotationItem {
  id: string;
  type: "text" | "highlight" | "rect" | "circle" | "line" | "arrow" | "freehand" | "stamp" | "signature" | "image";
  x: number; // 0..1 normalized to page width
  y: number; // 0..1 normalized to page height (from top)
  width?: number; // 0..1 normalized
  height?: number; // 0..1 normalized
  color?: string; // hex
  opacity?: number;
  text?: string;
  fontSize?: number;
  points?: Array<{ x: number; y: number }>;
  dataUrl?: string; // for signature, stamp, or image
  page: number; // 1-indexed
}

export interface WatermarkOptions {
  text: string;
  fontSize?: number;
  opacity?: number;
  angle?: number;
  color?: { r: number; g: number; b: number };
}

export interface HeaderFooterOptions {
  header?: string;
  footer?: string;
  fontSize?: number;
  color?: { r: number; g: number; b: number };
}

/** Helper to convert hex #rrggbb to pdf-lib rgb(0..1) */
function hexToPdfRgb(hex: string = "#000000") {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  return rgb(r, g, b);
}

/**
 * Rotates a specific page by angle delta (e.g. 90, -90)
 */
export async function rotatePdfPage(
  pdfBytes: Uint8Array,
  pageIndex: number,
  angleDelta: number
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes);
  const page = doc.getPage(pageIndex);
  const currentAngle = page.getRotation().angle;
  const nextAngle = (currentAngle + angleDelta + 360) % 360;
  page.setRotation(degrees(nextAngle));
  return await doc.save();
}

/**
 * Reorders pages in a PDF document based on new index order
 */
export async function reorderPdfPages(
  pdfBytes: Uint8Array,
  newOrder: number[] // array of original 0-indexed page indices
): Promise<Uint8Array> {
  const srcDoc = await PDFDocument.load(pdfBytes);
  const dstDoc = await PDFDocument.create();

  const copiedPages = await dstDoc.copyPages(srcDoc, newOrder);
  copiedPages.forEach((page) => dstDoc.addPage(page));

  return await dstDoc.save();
}

/**
 * Deletes a page at pageIndex
 */
export async function deletePdfPage(
  pdfBytes: Uint8Array,
  pageIndex: number
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes);
  if (doc.getPageCount() <= 1) {
    throw new Error("Cannot delete the only page in the document.");
  }
  doc.removePage(pageIndex);
  return await doc.save();
}

/**
 * Duplicates a page at pageIndex
 */
export async function duplicatePdfPage(
  pdfBytes: Uint8Array,
  pageIndex: number
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes);
  const [copiedPage] = await doc.copyPages(doc, [pageIndex]);
  doc.insertPage(pageIndex + 1, copiedPage);
  return await doc.save();
}

/**
 * Inserts a blank page at given index
 */
export async function insertBlankPdfPage(
  pdfBytes: Uint8Array,
  atIndex: number,
  width = 595.28,
  height = 841.89 // Standard A4
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes);
  doc.insertPage(atIndex, [width, height]);
  return await doc.save();
}

/**
 * Merges multiple PDF Uint8Arrays into one document
 */
export async function mergePdfs(pdfBuffers: Uint8Array[]): Promise<Uint8Array> {
  const mergedDoc = await PDFDocument.create();

  for (const buffer of pdfBuffers) {
    const doc = await PDFDocument.load(buffer);
    const pages = await mergedDoc.copyPages(doc, doc.getPageIndices());
    pages.forEach((page) => mergedDoc.addPage(page));
  }

  return await mergedDoc.save();
}

/**
 * Splits a PDF into multiple documents based on page groups
 */
export async function splitPdf(
  pdfBytes: Uint8Array,
  ranges: number[][] // e.g. [[0, 1], [2, 3, 4]]
): Promise<Uint8Array[]> {
  const srcDoc = await PDFDocument.load(pdfBytes);
  const results: Uint8Array[] = [];

  for (const pageIndices of ranges) {
    const splitDoc = await PDFDocument.create();
    const copiedPages = await splitDoc.copyPages(srcDoc, pageIndices);
    copiedPages.forEach((page) => splitDoc.addPage(page));
    results.push(await splitDoc.save());
  }

  return results;
}

/**
 * Extracts specific pages into a new PDF
 */
export async function extractPdfPages(
  pdfBytes: Uint8Array,
  pageIndices: number[]
): Promise<Uint8Array> {
  const srcDoc = await PDFDocument.load(pdfBytes);
  const dstDoc = await PDFDocument.create();
  const pages = await dstDoc.copyPages(srcDoc, pageIndices);
  pages.forEach((page) => dstDoc.addPage(page));
  return await dstDoc.save();
}

/**
 * Converts image data URLs (JPEG / PNG) into a single PDF
 */
export async function imagesToPdf(
  images: Array<{ dataUrl: string; width?: number; height?: number }>
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  for (const item of images) {
    const isPng = item.dataUrl.startsWith("data:image/png");
    const base64Data = item.dataUrl.split(",")[1];
    const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    const embeddedImage = isPng
      ? await doc.embedPng(imageBytes)
      : await doc.embedJpg(imageBytes);

    const imgDims = embeddedImage.scale(1);
    // Page matching image dimensions
    const page = doc.addPage([imgDims.width, imgDims.height]);
    page.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: imgDims.width,
      height: imgDims.height,
    });
  }

  return await doc.save();
}

/**
 * Converts raw TXT string into a formatted multi-page PDF
 */
export async function textToPdf(textContent: string, title = "Document"): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 11;
  const lineHeight = 16;
  const margin = 50;
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const maxWidth = pageWidth - margin * 2;

  let page = doc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  // Header Title
  page.drawText(title, {
    x: margin,
    y: y,
    size: 16,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.2),
  });
  y -= 30;

  // Split lines and word wrap
  const paragraphs = textContent.split(/\r?\n/);

  for (const para of paragraphs) {
    const words = para.split(" ");
    let line = "";

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth > maxWidth && line) {
        if (y < margin + lineHeight) {
          page = doc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        page.drawText(line, {
          x: margin,
          y: y,
          size: fontSize,
          font: font,
          color: rgb(0.2, 0.2, 0.2),
        });
        y -= lineHeight;
        line = word;
      } else {
        line = testLine;
      }
    }

    if (line) {
      if (y < margin + lineHeight) {
        page = doc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      page.drawText(line, {
        x: margin,
        y: y,
        size: fontSize,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });
      y -= lineHeight;
    }

    y -= 6; // paragraph spacing
  }

  return await doc.save();
}

/**
 * Adds page numbers, header, and footer to all pages
 */
export async function addPageDecorations(
  pdfBytes: Uint8Array,
  options: {
    addPageNumbers?: boolean;
    pageNumberPosition?: "bottom-center" | "bottom-right" | "top-right";
    pageNumberFormat?: "Page {n} of {total}" | "{n} / {total}" | "{n}";
    headerText?: string;
    footerText?: string;
  }
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  const total = pages.length;

  for (let i = 0; i < total; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const n = i + 1;

    // Header
    if (options.headerText) {
      page.drawText(options.headerText, {
        x: 40,
        y: height - 30,
        size: 9,
        font,
        color: rgb(0.4, 0.4, 0.4),
      });
    }

    // Footer
    if (options.footerText) {
      page.drawText(options.footerText, {
        x: 40,
        y: 25,
        size: 9,
        font,
        color: rgb(0.4, 0.4, 0.4),
      });
    }

    // Page Numbers
    if (options.addPageNumbers) {
      const fmt = options.pageNumberFormat || "Page {n} of {total}";
      const text = fmt.replace("{n}", `${n}`).replace("{total}", `${total}`);
      const textWidth = font.widthOfTextAtSize(text, 9);

      let px = width / 2 - textWidth / 2;
      let py = 25;

      if (options.pageNumberPosition === "bottom-right") {
        px = width - textWidth - 40;
        py = 25;
      } else if (options.pageNumberPosition === "top-right") {
        px = width - textWidth - 40;
        py = height - 30;
      }

      page.drawText(text, {
        x: px,
        y: py,
        size: 9,
        font,
        color: rgb(0.4, 0.4, 0.4),
      });
    }
  }

  return await doc.save();
}

/**
 * Adds watermark (diagonal or centered)
 */
export async function addWatermark(
  pdfBytes: Uint8Array,
  options: WatermarkOptions
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const pages = doc.getPages();
  const fontSize = options.fontSize || 48;
  const opacity = options.opacity !== undefined ? options.opacity : 0.15;
  const angle = options.angle !== undefined ? options.angle : 45;
  const color = options.color
    ? rgb(options.color.r, options.color.g, options.color.b)
    : rgb(0.8, 0.1, 0.1);

  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(options.text, fontSize);

    page.drawText(options.text, {
      x: width / 2 - textWidth / 2,
      y: height / 2,
      size: fontSize,
      font,
      color,
      opacity,
      rotate: degrees(angle),
    });
  }

  return await doc.save();
}

/**
 * Bakes annotations, shapes, texts, drawings, signatures, and stamps onto the real PDF
 */
export async function applyAnnotationsToPdf(
  pdfBytes: Uint8Array,
  annotations: AnnotationItem[]
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const pages = doc.getPages();

  for (const item of annotations) {
    const pageIndex = item.page - 1;
    if (pageIndex < 0 || pageIndex >= pages.length) continue;

    const page = pages[pageIndex];
    const { width, height } = page.getSize();

    const pdfX = item.x * width;
    // PDF coordinates start at bottom-left, while web coordinates start at top-left
    const pdfY = height - item.y * height;
    const itemWidth = (item.width || 0.2) * width;
    const itemHeight = (item.height || 0.05) * height;

    const color = hexToPdfRgb(item.color || "#000000");
    const opacity = item.opacity !== undefined ? item.opacity : 1.0;

    switch (item.type) {
      case "text":
        if (item.text) {
          page.drawText(item.text, {
            x: pdfX,
            y: pdfY - (item.fontSize || 14),
            size: item.fontSize || 14,
            font,
            color,
            opacity,
          });
        }
        break;

      case "highlight":
        // Semi-transparent yellow rectangle over text area
        page.drawRectangle({
          x: pdfX,
          y: pdfY - itemHeight,
          width: itemWidth,
          height: itemHeight,
          color: hexToPdfRgb(item.color || "#facc15"),
          opacity: 0.35,
        });
        break;

      case "rect":
        page.drawRectangle({
          x: pdfX,
          y: pdfY - itemHeight,
          width: itemWidth,
          height: itemHeight,
          borderColor: color,
          borderWidth: 2,
          opacity,
        });
        break;

      case "circle":
        const radius = Math.min(itemWidth, itemHeight) / 2;
        page.drawCircle({
          x: pdfX + radius,
          y: pdfY - radius,
          size: radius,
          borderColor: color,
          borderWidth: 2,
          opacity,
        });
        break;

      case "line":
      case "arrow":
        page.drawLine({
          start: { x: pdfX, y: pdfY },
          end: { x: pdfX + itemWidth, y: pdfY - itemHeight },
          thickness: 2,
          color,
          opacity,
        });
        break;

      case "stamp":
      case "signature":
      case "image":
        if (item.dataUrl) {
          try {
            const isPng = item.dataUrl.startsWith("data:image/png");
            const base64Data = item.dataUrl.split(",")[1];
            const imgBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
            const embedded = isPng
              ? await doc.embedPng(imgBytes)
              : await doc.embedJpg(imgBytes);

            page.drawImage(embedded, {
              x: pdfX,
              y: pdfY - itemHeight,
              width: itemWidth,
              height: itemHeight,
              opacity,
            });
          } catch (e) {
            console.warn("Failed to embed image annotation:", e);
          }
        } else if (item.type === "stamp" && item.text) {
          // Fallback stamped badge
          page.drawRectangle({
            x: pdfX,
            y: pdfY - 32,
            width: itemWidth || 130,
            height: 32,
            borderColor: color,
            borderWidth: 2,
            opacity: 0.85,
          });
          page.drawText(item.text, {
            x: pdfX + 8,
            y: pdfY - 22,
            size: 12,
            font: fontBold,
            color,
            opacity: 0.9,
          });
        }
        break;

      case "freehand":
        if (item.points && item.points.length > 1) {
          for (let p = 0; p < item.points.length - 1; p++) {
            const p1 = item.points[p];
            const p2 = item.points[p + 1];
            page.drawLine({
              start: { x: p1.x * width, y: height - p1.y * height },
              end: { x: p2.x * width, y: height - p2.y * height },
              thickness: 2.5,
              color,
              opacity,
            });
          }
        }
        break;
    }
  }

  return await doc.save();
}
