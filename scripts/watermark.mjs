// Burns the faint "Halfmoon" watermark into puppy photos (everything except
// parents) that don't have it yet. Runs after migrations and before `next build`,
// so every deploy catches photos the browser couldn't watermark itself.
// Parent photos are left as they are.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";
import postgres from "postgres";
import sharp from "sharp";

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.POSTGRES_URL_NON_POOLING ?? process.env.DATABASE_URL;
if (!url || !process.env.BLOB_READ_WRITE_TOKEN) {
  console.log("watermark: skipped (database or Blob token not configured)");
  process.exit(0);
}

// "Halfmoon" in Bai Jamjuree Bold as an outline, at font size 100, so no font
// has to be installed on the build machine. Same look as src/lib/prepare-photo.ts.
const TEXT_PATH = "M0 70.4L0 0.4L13.8 0.4L13.8 29.3L46.4 29.3L46.4 0.4L60.2 0.4L60.2 70.4L46.4 70.4L46.4 41.3L13.8 41.3L13.8 70.4L0 70.4ZM88 71.2Q80.2 71.2 75.4 67.3Q70.6 63.4 70.6 57.0L70.6 57.0L70.6 53.3Q70.6 47 75.6 43.2Q80.6 39.3 88.8 39.3L88.8 39.3L94.9 39.3Q97.5 39.3 100.5 40Q103.5 40.7 106 41.9L106 41.9L106 36.7Q106 34.2 104.4 32.7Q102.7 31.1 100 31.1L100 31.1L91.4 31.1Q88.6 31.1 86.9 32.4Q85.2 33.7 85.2 35.9L85.2 35.9L72 35.9Q72 28.6 77.4 24.2Q82.7 19.7 91.4 19.7L91.4 19.7L100 19.7Q108.8 19.7 114.2 24.4Q119.6 29 119.6 36.7L119.6 36.7L119.6 70.4L107 70.4L107 64.4Q104.6 67.5 101.1 69.4Q97.6 71.2 94.2 71.2L94.2 71.2L88 71.2ZM89.8 60.8L95.2 60.8Q98.9 60.8 101.8 58.9Q104.7 57.0 106 53.8L106 53.8L106 52.1Q104.4 50.9 101.6 50.2Q98.7 49.5 95.5 49.5L95.5 49.5L89.2 49.5Q86.8 49.5 85.3 50.7Q83.8 51.9 83.8 53.9L83.8 53.9L83.8 56.5Q83.8 58.4 85.5 59.6Q87.1 60.8 89.8 60.8L89.8 60.8ZM147.8 70.4Q138.9 70.4 134.8 66.7Q130.6 62.9 130.6 55.0L130.6 55.0L130.6 0.4L144.2 0.4L144.2 54.2Q144.2 56.6 145.3 57.7Q146.4 58.8 148.8 58.8L148.8 58.8L154.2 58.8L154.2 70.4L147.8 70.4ZM164.8 70.4L164.8 32.1L156.2 32.1L156.2 20.5L164.8 20.5L164.8 17.2Q164.8 9.1 170.0 4.5Q175.1 0 184.3 0L184.3 0L191.5 0L191.5 11.6L184.5 11.6Q181.3 11.6 179.9 13Q178.4 14.4 178.4 17.4L178.4 17.4L178.4 20.5L190.4 20.5L190.4 32.1L178.4 32.1L178.4 70.4L164.8 70.4ZM255.1 19.7Q262.7 19.7 267.3 24.7Q271.9 29.6 271.9 37.6L271.9 37.6L271.9 70.4L258.3 70.4L258.3 37.6Q258.3 34.8 257 33.2Q255.7 31.5 253.6 31.5L253.6 31.5L249.3 31.5Q246.5 31.5 244.4 33.6Q242.3 35.6 241.8 39L241.8 39L241.8 70.4L228.2 70.4L228.2 37.7Q228.2 34.9 226.9 33.2Q225.6 31.5 223.5 31.5L223.5 31.5L219.6 31.5Q216.7 31.5 214.5 34.1Q212.3 36.7 211.7 40.9L211.7 40.9L211.7 70.4L198.1 70.4L198.1 20.5L210.7 20.5L210.7 26.3Q212.5 23.3 215.4 21.5Q218.2 19.7 221.1 19.7L221.1 19.7L226.7 19.7Q230.3 19.7 233.3 21.6Q236.2 23.5 237.9 26.9L237.9 26.9Q240.1 23.5 243.2 21.6Q246.2 19.7 249.6 19.7L249.6 19.7L255.1 19.7ZM302.2 71.2Q295.9 71.2 291.1 68.8Q286.2 66.3 283.6 61.8Q280.9 57.3 280.9 51.4L280.9 51.4L280.9 39.7Q280.9 33.8 283.6 29.3Q286.3 24.7 291.2 22.2Q296 19.7 302.3 19.7L302.3 19.7L311.3 19.7Q317.6 19.7 322.5 22.2Q327.3 24.7 330 29.3Q332.7 33.8 332.7 39.7L332.7 39.7L332.7 51.4Q332.7 57.3 330 61.8Q327.3 66.3 322.5 68.8Q317.6 71.2 311.2 71.2L311.2 71.2L302.2 71.2ZM302.4 59.5L311 59.5Q314.7 59.5 316.9 57.0Q319.1 54.4 319.1 50.3L319.1 50.3L319.1 40.6Q319.1 36.5 316.9 34.0Q314.7 31.4 311.1 31.4L311.1 31.4L302.5 31.4Q298.9 31.4 296.7 34.0Q294.5 36.5 294.5 40.6L294.5 40.6L294.5 50.3Q294.5 54.4 296.7 57.0Q298.9 59.5 302.4 59.5L302.4 59.5ZM361.6 71.2Q355.3 71.2 350.4 68.8Q345.6 66.3 342.9 61.8Q340.3 57.3 340.3 51.4L340.3 51.4L340.3 39.7Q340.3 33.8 343 29.3Q345.7 24.7 350.6 22.2Q355.4 19.7 361.7 19.7L361.7 19.7L370.7 19.7Q377 19.7 381.9 22.2Q386.7 24.7 389.4 29.3Q392.1 33.8 392.1 39.7L392.1 39.7L392.1 51.4Q392.1 57.3 389.4 61.8Q386.7 66.3 381.9 68.8Q377 71.2 370.6 71.2L370.6 71.2L361.6 71.2ZM361.8 59.5L370.4 59.5Q374.1 59.5 376.3 57.0Q378.5 54.4 378.5 50.3L378.5 50.3L378.5 40.6Q378.5 36.5 376.3 34.0Q374.1 31.4 370.5 31.4L370.5 31.4L361.9 31.4Q358.3 31.4 356.1 34.0Q353.9 36.5 353.9 40.6L353.9 40.6L353.9 50.3Q353.9 54.4 356.1 57.0Q358.3 59.5 361.8 59.5L361.8 59.5ZM401.7 70.4L401.7 20.5L414.3 20.5L414.3 26.5Q416.5 23.4 420 21.6Q423.5 19.7 427 19.7L427 19.7L433 19.7Q441 19.7 445.8 24.7Q450.7 29.7 450.7 37.9L450.7 37.9L450.7 70.4L437.1 70.4L437.1 38.4Q437.1 35.3 435.4 33.4Q433.8 31.5 431.2 31.5L431.2 31.5L425.2 31.5Q421.7 31.5 418.9 34.1Q416.2 36.6 415.3 40.7L415.3 40.7L415.3 70.4L401.7 70.4Z";
const TEXT_W = 450.7;
const TEXT_H = 71.2;
const isBlob = (p) => /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\//i.test(p);

function overlay(width, height) {
  const size = Math.min(width, height) * 0.16; // font size, as in the browser version
  const scale = size / 100;
  const x = (width - TEXT_W * scale) / 2;
  const y = (height - TEXT_H * scale) / 2;
  const t = `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${scale.toFixed(4)})`;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs><filter id="s" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="${(size * 0.03).toFixed(1)}"/></filter></defs>
    <path d="${TEXT_PATH}" transform="${t}" fill="#000" fill-opacity="0.25" filter="url(#s)"/>
    <path d="${TEXT_PATH}" transform="${t}" fill="#fff" fill-opacity="0.38"/>
  </svg>`);
}

async function load(storagePath) {
  if (isBlob(storagePath)) {
    const res = await fetch(storagePath);
    if (!res.ok) throw new Error(`fetch ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  }
  // Photos imported from the old site live in public/.
  return readFile(path.join(process.cwd(), "public", storagePath));
}

const sql = postgres(url, { max: 1, onnotice: () => {} });
let done = 0;
let failed = 0;
try {
  await sql`select pg_advisory_lock(727002)`;
  const photos = await sql`
    select p.id, p.dog_id, p.storage_path from dog_photos p join dogs d on d.id = p.dog_id
    where not p.watermarked and d.category <> 'parent'
    order by p.created_at
  `;
  for (const photo of photos) {
    try {
      const input = sharp(await load(photo.storage_path)).rotate();
      const { width, height, format } = await input.clone().metadata();
      const webp = format === "webp";
      const out = await input
        .composite([{ input: overlay(width, height) }])
        [webp ? "webp" : "jpeg"]({ quality: 85 })
        .toBuffer();
      const blob = await put(`dogs/${photo.dog_id}/photo.${webp ? "webp" : "jpg"}`, out, {
        access: "public",
        addRandomSuffix: true,
        contentType: webp ? "image/webp" : "image/jpeg",
      });
      const [row] = await sql`
        update dog_photos set storage_path = ${blob.url}, watermarked = true
        where id = ${photo.id} and not watermarked and storage_path = ${photo.storage_path}
        returning id
      `;
      if (!row) {
        await del(blob.url); // changed meanwhile; leave it for the next run
        continue;
      }
      if (isBlob(photo.storage_path)) await del(photo.storage_path).catch(() => {});
      done++;
    } catch (e) {
      failed++;
      console.warn(`watermark: photo ${photo.id} failed: ${e.message}`);
    }
  }
  console.log(`watermark: ${done} photo(s) watermarked${failed ? `, ${failed} failed (retried next deploy)` : ""}`);
} catch (e) {
  // Never block a deploy over watermarks; the next deploy tries again.
  console.warn(`watermark: skipped this run: ${e.message}`);
} finally {
  await sql.end();
}
