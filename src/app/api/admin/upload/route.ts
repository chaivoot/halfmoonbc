import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { isUuid } from "@/lib/validate";

// Issues short-lived tokens so the browser can upload photos straight to Vercel Blob.
// Recording the photo in the database happens afterwards in addPhotosAction.
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const admin = await getAdmin();
        if (!admin || admin.mustChangePassword) throw new Error("Not signed in");
        if (!isUuid(clientPayload) || !pathname.startsWith(`dogs/${clientPayload}/`)) {
          throw new Error("Invalid upload path");
        }
        return {
          allowedContentTypes: ["image/webp", "image/jpeg", "image/png"],
          maximumSizeInBytes: 8 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
