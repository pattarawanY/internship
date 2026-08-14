import { NextRequest, NextResponse } from "next/server";

import { apiUrl } from "@/lib/api";

type RouteContext = {
  params: Promise<{ storageKey: string[] }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { storageKey: parts } = await context.params;
  const storageKey = parts.map(decodeURIComponent).join("/");

  const response = await fetch(
    apiUrl(`/media/by-key?storageKey=${encodeURIComponent(storageKey)}`),
    { cache: "no-store" },
  );

  if (!response.ok) {
    return NextResponse.json({ message: "Image not found" }, { status: 404 });
  }

  const media = (await response.json()) as { s3Url?: string };
  if (!media.s3Url) {
    return NextResponse.json({ message: "Image not found" }, { status: 404 });
  }

  return NextResponse.redirect(media.s3Url);
}
