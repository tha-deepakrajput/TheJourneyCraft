import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { jwtVerify } from "jose";

/**
 * Unified authentication utility that supports both:
 * 1. Bearer token Authorization header (for mobile/external clients) — checked FIRST
 * 2. Traditional NextAuth session cookies (for web clients) — fallback
 */
export async function getAuthSession(req?: Request) {
  // 1. Check Bearer token FIRST (mobile clients)
  // This must run before getServerSession to avoid NextAuth interfering with the request
  if (req) {
    const authHeader = req.headers.get("Authorization");
    
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        const secret = new TextEncoder().encode(
          process.env.NEXTAUTH_SECRET || "fallback_secret_for_dev"
        );
        
        const { payload } = await jwtVerify(token, secret, {
          algorithms: ["HS256"],
        });
        
        console.log("[Auth Util] JWT verified successfully for:", payload.email);

        // Return a session-like object compatible with NextAuth
        return {
          user: {
            id: payload.id as string,
            name: payload.name as string,
            email: payload.email as string,
            role: payload.role as string,
          },
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
      } catch (error: any) {
        console.error("[Auth Util] JWT verification failed:", error.message);
        return null; // Token is invalid — don't fall through to cookie auth
      }
    }
  }

  // 2. Fall back to NextAuth session cookies (web clients)
  try {
    const session = await getServerSession(authOptions);
    if (session) {
      console.log("[Auth Util] Session found via cookies");
      return session;
    }
  } catch (err) {
    console.error("[Auth Util] getServerSession error:", err);
  }

  console.log("[Auth Util] No valid session or token found");
  return null;
}
