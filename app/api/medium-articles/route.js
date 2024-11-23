import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://medium.com/feed/@joshua.singarayer", {
      headers: {
        Accept: "application/xml, application/rss+xml, text/xml",
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }

    const data = await response.text();

    // Basic XML validation
    if (!data.includes("<rss") && !data.includes("<feed")) {
      throw new Error("Invalid feed format");
    }

    return new Response(data, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    });
  } catch (error) {
    console.error("Feed fetch error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch Medium articles",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
