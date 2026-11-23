import { getAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { isBlobUrl, isUuid } from "@/lib/validate";

// Streams a stored photo from the same origin, so the admin page can redraw it
// on a canvas (with the watermark) without cross-origin restrictions.
export async function GET(request: Request, { params }: RouteContext<"/api/admin/photo-source/[id]">) {
  const admin = await getAdmin();
  if (!admin || admin.mustChangePassword) return new Response("Not signed in", { status: 401 });
  const { id } = await params;
  if (!isUuid(id)) return new Response("Not found", { status: 404 });
  const [photo] = await sql<{ storage_path: string }[]>`select storage_path from dog_photos where id = ${id}`;
  if (!photo) return new Response("Not found", { status: 404 });
  // Blob URLs are fetched as stored; photos from the old site live in public/.
  const src = isBlobUrl(photo.storage_path) ? photo.storage_path : null;
  if (!src) return Response.redirect(new URL(photo.storage_path, request.url), 302);
  const res = await fetch(src);
  if (!res.ok || !res.body) return new Response("Upstream error", { status: 502 });
  return new Response(res.body, {
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/octet-stream",
      "cache-control": "no-store",
    },
  });
}
