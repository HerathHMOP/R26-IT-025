import { readFile } from "node:fs/promises";
import path from "node:path";

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg"
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ assetPath: string[] }> }
) {
  const resolvedParams = await params;
  const rawParts = resolvedParams.assetPath || [];
  const safeParts = rawParts.filter((part) => part && part !== "." && part !== "..");
  if (safeParts.length === 0) {
    return new Response("Not found", { status: 404 });
  }

  const projectRoot = path.resolve(process.cwd(), "..");
  const sourcePath = path.resolve(projectRoot, "level-test", ...safeParts);
  const expectedBase = path.resolve(projectRoot, "level-test");

  if (!sourcePath.startsWith(expectedBase)) {
    return new Response("Invalid path", { status: 400 });
  }

  try {
    const bytes = await readFile(sourcePath);
    const extension = path.extname(sourcePath).toLowerCase();
    const contentType = MIME_TYPES[extension] || "application/octet-stream";

    return new Response(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
