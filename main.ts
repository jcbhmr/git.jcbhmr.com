#!/usr/bin/env -S deno serve
const pattern = new URLPattern({ pathname: "/:repo.git" });
export default {
  fetch(request) {
    const match = pattern.exec(request.url);
    if (match == null) {
      return new Response(null, { status: 404 });
    }
    const repo = match.pathname.groups;
    return Response.redirect(`https://github.com/jcbhmr/${repo}.git`);
  },
} satisfies Deno.ServeDefaultExport;
