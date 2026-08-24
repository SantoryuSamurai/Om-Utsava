/** @type {import('next').NextConfig} */
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === "true";

const nextConfig = {
  // GitHub Pages needs static files, while Vercel needs server routes for payments.
  ...(isGitHubPagesBuild ? { output: "export", trailingSlash: true } : {}),
  // GitHub Pages serves this project from /Om-Utsava/. Local development stays at /.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
};

module.exports = nextConfig;
