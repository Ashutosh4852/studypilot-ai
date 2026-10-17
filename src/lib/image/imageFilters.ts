/**
 * Client-side HTML5 Canvas pixel manipulation algorithms and filters
 */

export interface AdjustmentValues {
  brightness: number; // -100 to 100, default 0
  contrast: number;   // -100 to 100, default 0
  saturation: number; // -100 to 100, default 0
  sharpness: number;  // 0 to 100, default 0
  blur: number;       // 0 to 20, default 0
  hue: number;        // -180 to 180, default 0
  exposure: number;   // -100 to 100, default 0
}

export type PresetFilterName =
  | "none"
  | "grayscale"
  | "sepia"
  | "vintage"
  | "cyberpunk"
  | "noir"
  | "warm"
  | "cool"
  | "invert"
  | "high-contrast";

/**
 * Applies adjustments and filter presets to a canvas context
 */
export function applyImageAdjustments(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  adjustments: AdjustmentValues,
  preset: PresetFilterName
) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Pre-calculate adjustment factors
  const b = adjustments.brightness * 1.5; // -150..150
  const c = Math.max(-1, adjustments.contrast / 100);
  const cFactor = (259 * (c * 255 + 255)) / (255 * (259 - c * 255));
  const s = (adjustments.saturation + 100) / 100; // 0..2
  const exp = Math.pow(2, adjustments.exposure / 50); // exposure multiplier

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let bCol = data[i + 2];

    // Exposure
    if (adjustments.exposure !== 0) {
      r *= exp;
      g *= exp;
      bCol *= exp;
    }

    // Brightness
    if (adjustments.brightness !== 0) {
      r += b;
      g += b;
      bCol += b;
    }

    // Contrast
    if (adjustments.contrast !== 0) {
      r = cFactor * (r - 128) + 128;
      g = cFactor * (g - 128) + 128;
      bCol = cFactor * (bCol - 128) + 128;
    }

    // Saturation
    if (adjustments.saturation !== 0) {
      const gray = 0.2989 * r + 0.587 * g + 0.114 * bCol;
      r = gray + (r - gray) * s;
      g = gray + (g - gray) * s;
      bCol = gray + (bCol - gray) * s;
    }

    // Apply Filter Preset
    switch (preset) {
      case "grayscale": {
        const avg = 0.299 * r + 0.587 * g + 0.114 * bCol;
        r = g = bCol = avg;
        break;
      }
      case "sepia": {
        const sr = r * 0.393 + g * 0.769 + bCol * 0.189;
        const sg = r * 0.349 + g * 0.686 + bCol * 0.168;
        const sb = r * 0.272 + g * 0.534 + bCol * 0.131;
        r = sr;
        g = sg;
        bCol = sb;
        break;
      }
      case "vintage": {
        r = r * 1.1 + 10;
        g = g * 0.95;
        bCol = bCol * 0.8;
        break;
      }
      case "cyberpunk": {
        r = Math.min(255, r * 1.25);
        g = g * 0.7;
        bCol = Math.min(255, bCol * 1.4);
        break;
      }
      case "noir": {
        const avg = 0.299 * r + 0.587 * g + 0.114 * bCol;
        const boosted = avg > 120 ? avg * 1.2 : avg * 0.7;
        r = g = bCol = boosted;
        break;
      }
      case "warm": {
        r = Math.min(255, r * 1.12);
        bCol = bCol * 0.88;
        break;
      }
      case "cool": {
        bCol = Math.min(255, bCol * 1.15);
        r = r * 0.9;
        break;
      }
      case "invert": {
        r = 255 - r;
        g = 255 - g;
        bCol = 255 - bCol;
        break;
      }
      case "high-contrast": {
        r = r > 128 ? Math.min(255, r * 1.2) : Math.max(0, r * 0.8);
        g = g > 128 ? Math.min(255, g * 1.2) : Math.max(0, g * 0.8);
        bCol = bCol > 128 ? Math.min(255, bCol * 1.2) : Math.max(0, bCol * 0.8);
        break;
      }
      default:
        break;
    }

    // Clamp values 0..255
    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, bCol));
  }

  ctx.putImageData(imgData, 0, 0);

  // Sharpness via convolution kernel if > 0
  if (adjustments.sharpness > 0) {
    applySharpness(ctx, width, height, adjustments.sharpness);
  }

  // Gaussian Blur filter if > 0
  if (adjustments.blur > 0) {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");
    if (tempCtx) {
      tempCtx.drawImage(ctx.canvas, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.filter = `blur(${adjustments.blur}px)`;
      ctx.drawImage(tempCanvas, 0, 0);
      ctx.filter = "none";
    }
  }
}

/**
 * 3x3 Sharpening convolution kernel
 */
function applySharpness(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  sharpness: number
) {
  const factor = sharpness / 100;
  const original = ctx.getImageData(0, 0, width, height);
  const src = original.data;
  const output = ctx.createImageData(width, height);
  const dst = output.data;

  // Kernel: [0, -factor, 0, -factor, 1 + 4*factor, -factor, 0, -factor, 0]
  const centerWeight = 1 + 4 * factor;
  const edgeWeight = -factor;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      for (let c = 0; c < 3; c++) {
        const top = ((y - 1) * width + x) * 4 + c;
        const bottom = ((y + 1) * width + x) * 4 + c;
        const left = (y * width + (x - 1)) * 4 + c;
        const right = (y * width + (x + 1)) * 4 + c;
        const center = idx + c;

        const val =
          src[center] * centerWeight +
          (src[top] + src[bottom] + src[left] + src[right]) * edgeWeight;

        dst[center] = Math.max(0, Math.min(255, val));
      }
      dst[idx + 3] = src[idx + 3]; // Preserve alpha
    }
  }

  ctx.putImageData(output, 0, 0);
}

/**
 * Pixelate or blur a specific sensitive rectangular region
 */
export function applyPrivacyBlur(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  mode: "pixelate" | "blur" = "pixelate",
  intensity = 12
) {
  if (width <= 0 || height <= 0) return;

  if (mode === "pixelate") {
    const size = Math.max(4, intensity);
    const subData = ctx.getImageData(x, y, width, height);
    const data = subData.data;
    const w = subData.width;
    const h = subData.height;

    for (let py = 0; py < h; py += size) {
      for (let px = 0; px < w; px += size) {
        let r = 0, g = 0, b = 0, count = 0;
        // Sample block
        for (let dy = 0; dy < size && py + dy < h; dy++) {
          for (let dx = 0; dx < size && px + dx < w; dx++) {
            const idx = ((py + dy) * w + (px + dx)) * 4;
            r += data[idx];
            g += data[idx + 1];
            b += data[idx + 2];
            count++;
          }
        }
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        // Fill block
        for (let dy = 0; dy < size && py + dy < h; dy++) {
          for (let dx = 0; dx < size && px + dx < w; dx++) {
            const idx = ((py + dy) * w + (px + dx)) * 4;
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
          }
        }
      }
    }
    ctx.putImageData(subData, x, y);
  } else {
    // Canvas blur
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tCtx = tempCanvas.getContext("2d");
    if (tCtx) {
      tCtx.drawImage(ctx.canvas, x, y, width, height, 0, 0, width, height);
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, width, height);
      ctx.clip();
      ctx.filter = `blur(${intensity}px)`;
      ctx.drawImage(tempCanvas, x, y);
      ctx.restore();
      ctx.filter = "none";
    }
  }
}
