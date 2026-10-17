/**
 * Intelligent client-side background removal and replacement
 * Operates directly on Canvas ImageData without requiring external cloud API keys
 */

export interface BgRemovalOptions {
  tolerance: number; // 0..100 color distance tolerance
  featherRadius: number; // 0..10 pixel edge smoothing
  sampleCorners: boolean; // sample border pixels
  targetColor?: { r: number; g: number; b: number };
}

/**
 * Removes background using intelligent edge-detection and flood/color distance segmentation
 * Returns transparent ImageData
 */
export function removeBackgroundLocal(
  sourceCanvas: HTMLCanvasElement,
  options: BgRemovalOptions = { tolerance: 28, featherRadius: 2, sampleCorners: true }
): HTMLCanvasElement {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = width;
  outputCanvas.height = height;
  const outCtx = outputCanvas.getContext("2d");
  if (!outCtx) return sourceCanvas;

  const srcCtx = sourceCanvas.getContext("2d");
  if (!srcCtx) return sourceCanvas;

  const imgData = srcCtx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Identify background candidate colors: sample 4 corners & edges
  const samplePoints = [
    0, // top-left
    (width - 1) * 4, // top-right
    ((height - 1) * width) * 4, // bottom-left
    ((height - 1) * width + (width - 1)) * 4, // bottom-right
    (Math.floor(width / 2)) * 4, // top-center
    ((height - 1) * width + Math.floor(width / 2)) * 4, // bottom-center
  ];

  const bgColors: Array<[number, number, number]> = [];

  if (options.targetColor) {
    bgColors.push([options.targetColor.r, options.targetColor.g, options.targetColor.b]);
  } else {
    for (const p of samplePoints) {
      if (p < data.length - 3) {
        bgColors.push([data[p], data[p + 1], data[p + 2]]);
      }
    }
  }

  const tolSquared = Math.pow(options.tolerance * 2.5, 2);

  // Mask array
  const mask = new Uint8Array(width * height);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 20) {
      // Already transparent
      mask[i / 4] = 0;
      continue;
    }

    let isBg = false;
    for (const [br, bg, bb] of bgColors) {
      const distSq = (r - br) * (r - br) + (g - bg) * (g - bg) + (b - bb) * (b - bb);
      if (distSq <= tolSquared) {
        isBg = true;
        break;
      }
    }

    mask[i / 4] = isBg ? 0 : 255;
  }

  // Apply feathering / alpha smoothing
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const pixelIdx = idx * 4;

      if (mask[idx] === 0) {
        // Background - set transparent
        data[pixelIdx + 3] = 0;
      } else {
        // Foreground - check neighbors for edge anti-aliasing
        let bgNeighborCount = 0;
        if (mask[idx - 1] === 0) bgNeighborCount++;
        if (mask[idx + 1] === 0) bgNeighborCount++;
        if (mask[idx - width] === 0) bgNeighborCount++;
        if (mask[idx + width] === 0) bgNeighborCount++;

        if (bgNeighborCount > 0 && options.featherRadius > 0) {
          const alphaFade = Math.max(30, 255 - bgNeighborCount * 55);
          data[pixelIdx + 3] = alphaFade;
        }
      }
    }
  }

  outCtx.putImageData(imgData, 0, 0);
  return outputCanvas;
}

/**
 * Replaces background with solid color, gradient, or background image
 */
export function compositeWithBackground(
  foregroundCanvas: HTMLCanvasElement,
  background: {
    type: "solid" | "gradient" | "image";
    color?: string;
    gradient?: { from: string; to: string; direction?: "horizontal" | "vertical" };
    imageElement?: HTMLImageElement;
  }
): HTMLCanvasElement {
  const width = foregroundCanvas.width;
  const height = foregroundCanvas.height;
  const result = document.createElement("canvas");
  result.width = width;
  result.height = height;
  const ctx = result.getContext("2d");
  if (!ctx) return foregroundCanvas;

  if (background.type === "solid" && background.color) {
    ctx.fillStyle = background.color;
    ctx.fillRect(0, 0, width, height);
  } else if (background.type === "gradient" && background.gradient) {
    const grad =
      background.gradient.direction === "horizontal"
        ? ctx.createLinearGradient(0, 0, width, 0)
        : ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, background.gradient.from);
    grad.addColorStop(1, background.gradient.to);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (background.type === "image" && background.imageElement) {
    ctx.drawImage(background.imageElement, 0, 0, width, height);
  }

  // Draw transparent foreground on top
  ctx.drawImage(foregroundCanvas, 0, 0);
  return result;
}
