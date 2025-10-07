#!/usr/bin/env -S deno serve
import redirectsJSON from "./redirects.json" with { type: "json" };

const redirects = Object.assign({ __proto__: null! }, redirectsJSON) as Record<
  string,
  string
>;

export default {
  fetch(request) {
    const url = new URL(request.url);
    const destURL = redirects[url.pathname];
    if (destURL != null) {
      return Response.redirect(destURL, 307);
    } else {
      return new Response(null, { status: 404 });
    }
  },
} satisfies Deno.ServeDefaultExport;
