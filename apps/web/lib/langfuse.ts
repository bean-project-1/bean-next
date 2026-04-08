import { Langfuse } from "langfuse";

// =======================================================
// BEAN — Langfuse Client Singleton
// apps/web/lib/langfuse.ts
// =======================================================

const globalForLangfuse = globalThis as unknown as {
  langfuse: Langfuse | undefined;
};

export const langfuse =
  globalForLangfuse.langfuse ??
  new Langfuse({
    publicKey: process.env.LANGFUSE_PUBLIC_KEY,
    secretKey: process.env.LANGFUSE_SECRET_KEY,
    baseUrl: process.env.LANGFUSE_HOST || "https://cloud.langfuse.com",
    // In development, flush logs more frequently
    flushAt: process.env.NODE_ENV === "development" ? 1 : 15,
  });

if (process.env.NODE_ENV !== "production") {
  globalForLangfuse.langfuse = langfuse;
}

export default langfuse;
