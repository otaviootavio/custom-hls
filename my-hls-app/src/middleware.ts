import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const customHeader = request.headers.get("Custom-Header");

  if (customHeader !== "secretWord") {
    return NextResponse.json(
      { error: "Missing secretWord header" },
      { status: 400 }
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
