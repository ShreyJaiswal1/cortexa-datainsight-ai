import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  // These are your public routes. All other routes will be protected.
  publicRoutes: ['/', '/sign-in', '/sign-up'],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
