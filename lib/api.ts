import { NextResponse } from "next/server";

export const ok = (data: unknown = {}) => NextResponse.json({ ok: true, ...(typeof data === 'object' && data !== null ? data : {}) });

export const bad = (message = "Bad Request", code = "BAD_REQUEST", status = 400) =>
  new NextResponse(JSON.stringify({ ok: false, code, message }), { 
    status, 
    headers: { "Content-Type": "application/json" }
  });

export const rateLimited = (retryAfter = 60) =>
  new NextResponse(JSON.stringify({ ok: false, code: "RATE_LIMITED" }), { 
    status: 429, 
    headers: { "Retry-After": String(retryAfter) }
  });

export const unauthorized = (message = "Unauthorized") =>
  new NextResponse(JSON.stringify({ ok: false, code: "UNAUTHORIZED", message }), { 
    status: 401, 
    headers: { "Content-Type": "application/json" }
  });

export const forbidden = (message = "Forbidden") =>
  new NextResponse(JSON.stringify({ ok: false, code: "FORBIDDEN", message }), { 
    status: 403, 
    headers: { "Content-Type": "application/json" }
  });

export const notFound = (message = "Not Found") =>
  new NextResponse(JSON.stringify({ ok: false, code: "NOT_FOUND", message }), { 
    status: 404, 
    headers: { "Content-Type": "application/json" }
  });

export const serverError = (message = "Internal Server Error") =>
  new NextResponse(JSON.stringify({ ok: false, code: "SERVER_ERROR", message }), { 
    status: 500, 
    headers: { "Content-Type": "application/json" }
  });
