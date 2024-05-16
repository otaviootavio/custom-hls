import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

let secretKey = 200; // Início da chave secreta

export function middleware(request: NextRequest) {
  const customHeader = request.headers.get("Password-Header");

  if (!customHeader) {
    return NextResponse.json(
      { error: "Missing password header" },
      { status: 403 }
    );
  }

  const keyFromHeader = parseInt(customHeader);
  console.log(`keyFromHeader: ${keyFromHeader}`);
  console.log(`secretKey: ${secretKey}`);
  if (isNaN(keyFromHeader) || keyFromHeader !== secretKey) {
    return NextResponse.json({ error: "Invalid secret key" }, { status: 403 });
  }
  secretKey += 7;

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
