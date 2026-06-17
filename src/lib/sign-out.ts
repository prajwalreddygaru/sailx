import { sameOriginPath } from "@/lib/site-url";

/** Sign out on the current origin and redirect (never uses NextAuth callback URLs). */
export async function signOutAndRedirect(path = "/") {
  if (typeof window === "undefined") return;

  const target = sameOriginPath(path);

  try {
    const csrfRes = await fetch("/api/auth/csrf", { credentials: "same-origin" });
    if (csrfRes.ok) {
      const { csrfToken } = (await csrfRes.json()) as { csrfToken?: string };
      if (csrfToken) {
        const controller = new AbortController();
        const timer = window.setTimeout(() => controller.abort(), 8000);

        await fetch("/api/auth/signout", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            csrfToken,
            json: "true",
          }),
          credentials: "same-origin",
          redirect: "manual",
          signal: controller.signal,
        });

        window.clearTimeout(timer);
      }
    }
  } catch {
    // Still redirect below so logout never hangs on a bad auth response.
  }

  window.location.assign(target);
}
