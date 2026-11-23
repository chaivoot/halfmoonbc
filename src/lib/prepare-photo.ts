// Browser-only: shrink a photo and burn the "Halfmoon" watermark into it before upload.

const MAX_EDGE = 1600;

async function headingFont(): Promise<string> {
  // next/font exposes Bai Jamjuree through a CSS variable on <html>.
  const family =
    getComputedStyle(document.documentElement).getPropertyValue("--font-bai-jamjuree").trim() || "sans-serif";
  try {
    await document.fonts.load(`700 100px ${family}`, "Halfmoon");
  } catch {
    // Fall back to whatever font is available; the watermark still gets drawn.
  }
  return family;
}

function drawWatermark(ctx: CanvasRenderingContext2D, width: number, height: number, family: string) {
  const size = Math.round(Math.min(width, height) * 0.16);
  ctx.save();
  ctx.font = `700 ${size}px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // Faint white with a soft shadow, so it shows on both dark and white fur.
  ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
  ctx.shadowBlur = size * 0.06;
  ctx.fillStyle = "rgba(255, 255, 255, 0.38)";
  ctx.fillText("Halfmoon", width / 2, height / 2);
  ctx.restore();
}

export async function preparePhoto(source: Blob): Promise<Blob> {
  const [bitmap, family] = await Promise.all([
    createImageBitmap(source, { imageOrientation: "from-image" }),
    headingFont(),
  ]);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  drawWatermark(ctx, canvas.width, canvas.height, family);
  const toBlob = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85));
  // Older Safari can't encode WebP and silently returns PNG instead.
  const webp = await toBlob("image/webp");
  if (webp?.type === "image/webp") return webp;
  const jpeg = await toBlob("image/jpeg");
  if (!jpeg) throw new Error("resize failed");
  return jpeg;
}

export const photoExt = (blob: Blob) => (blob.type === "image/webp" ? "webp" : "jpg");
