// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "");

  let payload: any = null;
  if (token) {
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.error("Token invalid", err);
    }
  }

  const path = request.nextUrl.pathname;

  if (path.startsWith("/guru")) {
    if (!payload || payload.role !== "GURU") {
      return NextResponse.redirect(new URL("/guru/login", request.url));
    }
  }

  if (path.startsWith("/admin")) {
    if (!payload || payload.role !== "SUPERADMIN") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/guru/:path*", "/admin/:path*"],
};
