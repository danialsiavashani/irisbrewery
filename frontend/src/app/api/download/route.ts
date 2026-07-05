import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ detail: "Missing url param." }, { status: 400 });
  }

  const res = await fetch(url);

  if (!res.ok) {
    return NextResponse.json({ detail: "Failed to fetch image." }, { status: 502 });
  }

  const blob = await res.blob();
  const buffer = await blob.arrayBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": 'attachment; filename="sketch.png"',
    },
  });
}