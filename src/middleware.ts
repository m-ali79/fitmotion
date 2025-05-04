import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)",
]);

const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/workout(.*)",
  "/nutrition(.*)",
  "/weight(.*)",
  "/dashboard(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // Handle Signed Out Users
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // Handle Signed In Users
  if (userId) {
    const isOnboardingComplete = sessionClaims?.metadata?.onboardingComplete;

    // Redirect authenticated & onboarded users from root to dashboard
    if (isOnboardingComplete && req.nextUrl.pathname === "/") {
      const dashboardUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(dashboardUrl);
    }

    // Redirect users who haven't completed onboarding to the onboarding route,
    // unless they are already on it or on another public route.
    if (
      !isOnboardingComplete &&
      req.nextUrl.pathname !== "/onboarding" &&
      !isPublicRoute(req)
    ) {
      const onboardingUrl = new URL("/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
    }
  }

  // Allow requests to public routes or authenticated requests to proceed
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
