// /middleware.ts  (or /src/middleware.ts)
import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const url = new URL(req.url);
  const { pathname } = url;

  const isAuth = pathname.startsWith('/auth');
  const isDashboard = pathname.startsWith('/dashboard');
  const isApi = pathname.startsWith('/api');

  // Never block the auth page itself
  if (isAuth) return NextResponse.next();

  // Guard pages
  if (isDashboard && !userId) {
    return NextResponse.redirect(`${url.origin}/auth`);
  }

  // Guard APIs
  if (isApi && !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/auth', '/dashboard/:path*', '/api/:path*'],
};
