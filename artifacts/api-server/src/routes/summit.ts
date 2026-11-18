import express, { Router, type IRouter, type RequestHandler } from "express";
import { fileURLToPath } from "node:url";
import { getAuth } from "@clerk/express";
import { GetSummitAccessResponse } from "@workspace/api-zod";

const router: IRouter = Router();
// build.mjs copies the original event files alongside the server bundle.
// This explicit static route serves only event assets, not account information.
const summitRoot = fileURLToPath(new URL("./private/summit/", import.meta.url));

const requireSummitSession: RequestHandler = (req, res, next) => {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  res.setHeader("Vary", "Cookie");
  res.setHeader("X-Content-Type-Options", "nosniff");
  const auth = getAuth(req);
  if (!auth.userId) {
    res.status(401).json({ error: "Sign in to access the summit." });
    return;
  }
  next();
};

router.get("/summit/access", requireSummitSession, (_req, res) => {
  res.json(GetSummitAccessResponse.parse({ authenticated: true }));
});

router.use(
  "/summit/content",
  (_req, res, next) => {
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Content-Security-Policy", "frame-ancestors 'self'");
    next();
  },
  express.static(summitRoot, {
    index: "index.html",
    dotfiles: "deny",
    fallthrough: false,
    etag: false,
    lastModified: false,
    cacheControl: false,
  }),
);

export default router;
