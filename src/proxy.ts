import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoginPage = req.nextUrl.pathname === "/admin/connexion";
  const isAuthed = Boolean(req.auth?.user);

  if (isLoginPage) {
    if (isAuthed) {
      return NextResponse.redirect(new URL("/admin", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (!isAuthed) {
    const loginUrl = new URL("/admin/connexion", req.nextUrl);
    loginUrl.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
