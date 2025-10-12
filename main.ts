#!/usr/bin/env -S deno serve
const pattern = new URLPattern({ pathname: "/:repo.git" });
export default {
  fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return Response.redirect("https://github.com/jcbhmr?tab=repositories", 307);
    }
    const match = pattern.exec(url);
    if (match == null) {
      return new Response(null, { status: 404 });
    }
    const repo = match.pathname.groups.repo!;
    return Response.redirect(`https://github.com/jcbhmr/${repo}.git`, 307);
  },
} satisfies Deno.ServeDefaultExport;
