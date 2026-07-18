import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

// The marketing pages stay public; anything under /dashboard requires a session.
export default clerkMiddleware(async (auth, req) => {
  if (isDashboardRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf)).*)",
    "/(api|trpc)(.*)",
  ],
};
