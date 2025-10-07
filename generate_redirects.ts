#!/usr/bin/env -S deno --allow-write=./redirects.json --allow-net=api.github.com:443 --allow-env=GH_TOKEN,GITHUB_TOKEN
import { Octokit } from "octokit";
import process from "node:process";
import { writeFile } from "node:fs/promises";

function throw_(error: unknown): never {
  throw error;
}

const octokit = new Octokit({
  auth: process.env.GH_TOKEN || process.env.GITHUB_TOKEN ||
    throw_(
      new Error("GH_TOKEN or GITHUB_TOKEN environment variable must be set"),
    ),
});

const redirects: Record<string, string> = { __proto__: null! };
redirects["/"] = "https://github.com/jcbhmr?tab=repositories";
const repos = await octokit.paginate(
  octokit.rest.repos.listForAuthenticatedUser,
  {
    affiliation: "owner",
  },
);
console.log(
  "%cFetched%c %d repos for the authenticated user",
  "font-weight: bold; color: blue",
  "",
  repos.length,
);
for (
  const repo of repos
) {
  redirects[`/${repo.name}`] = repo.html_url;
  redirects[`/${repo.name}.git`] = repo.clone_url;
}

await writeFile("./redirects.json", JSON.stringify(redirects, null, 2) + "\n");
console.log(
  "%cWrote%c ./redirects.json",
  "font-weight: bold; color: green",
  "",
);
