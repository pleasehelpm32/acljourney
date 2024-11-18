import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://medium.com/feed/@joshua.singarayer", {
      headers: {
        Accept: "application/xml, text/xml, */*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`
      );
    }

    const xmlText = await response.text();

    // Validate that we got XML
    if (!xmlText.includes("<?xml") && !xmlText.includes("<rss")) {
      throw new Error("Invalid XML response from Medium");
    }

    return new NextResponse(xmlText, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300", // Cache for 10 minutes
      },
    });
  } catch (error) {
    console.error("Error fetching Medium feed:", error);
    return new NextResponse(
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
