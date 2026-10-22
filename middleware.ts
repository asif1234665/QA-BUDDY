import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const publicPaths = ["/", "/login", "/signup"];
  const token = req.cookies.get("token");
  const isPublic = publicPaths.includes(pathname);

  if (!token && !isPublic && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!token && !isPublic && pathname.startsWith("/projects")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/projects/:path*"],
};
