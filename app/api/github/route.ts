import { NextResponse } from "next/server";

export const revalidate = 1800;

export async function GET() {
  try {
    const headers: HeadersInit = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const response = await fetch("https://api.github.com/users/sanjarbek404", { headers, next: { revalidate } });
    if (!response.ok) throw new Error("GitHub request failed");
    const data = await response.json() as { public_repos?: number; followers?: number; public_gists?: number; html_url?: string };
    return NextResponse.json({ repos: data.public_repos || 0, followers: data.followers || 0, gists: data.public_gists || 0, url: data.html_url || "https://github.com/sanjarbek404" });
  } catch {
    return NextResponse.json({ repos: 0, followers: 0, gists: 0, url: "https://github.com/sanjarbek404", unavailable: true }, { status: 200 });
  }
}
