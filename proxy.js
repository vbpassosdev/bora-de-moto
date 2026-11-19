import { isIP } from "node:net";
import { NextResponse } from "next/server";

export function proxy(request) {
  if (process.env.VERCEL === "1" && request.method === "GET") {
    const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim();
    if (ip && isIP(ip)) {
      console.info(JSON.stringify({
        evento: "acesso_pagina",
        ip,
        pagina: request.nextUrl.pathname,
        data: new Date().toISOString(),
      }));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [{
    source: "/:pagina(diario|planejar)?",
    missing: [
      { type: "header", key: "next-router-prefetch" },
      { type: "header", key: "purpose", value: "prefetch" },
      { type: "header", key: "sec-purpose", value: ".*prefetch.*" },
    ],
  }],
};
