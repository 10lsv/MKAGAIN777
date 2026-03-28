import { NextResponse } from "next/server";

const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
const POSTHOG_PERSONAL_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;
const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID;

async function hogql(query: string) {
  const res = await fetch(`${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT_ID}/query/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${POSTHOG_PERSONAL_API_KEY}`,
    },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PostHog API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.results as unknown[][];
}

export async function GET() {
  if (!POSTHOG_PERSONAL_API_KEY || !POSTHOG_PROJECT_ID) {
    return NextResponse.json({
      topBeats: [],
      topLicenses: [],
      visitsToday: 0,
      visitsWeek: 0,
    });
  }

  try {
    const [topBeats, topLicenses, visitsToday, visitsWeek] = await Promise.all([
      // Top beats played
      hogql(`
        SELECT properties.beat_name AS beat_name, count() AS plays
        FROM events
        WHERE event = 'beat_play' AND timestamp > now() - interval 30 day
        GROUP BY beat_name
        ORDER BY plays DESC
        LIMIT 10
      `),
      // Top licenses clicked
      hogql(`
        SELECT properties.license AS license, count() AS clicks
        FROM events
        WHERE event = 'license_click' AND timestamp > now() - interval 30 day
        GROUP BY license
        ORDER BY clicks DESC
        LIMIT 10
      `),
      // Visits today
      hogql(`
        SELECT count() AS visits
        FROM events
        WHERE event = '$pageview' AND timestamp > toStartOfDay(now())
      `),
      // Visits this week
      hogql(`
        SELECT count() AS visits
        FROM events
        WHERE event = '$pageview' AND timestamp > toStartOfWeek(now())
      `),
    ]);

    return NextResponse.json({
      topBeats: topBeats.map(([name, count]) => ({ name, count })),
      topLicenses: topLicenses.map(([license, count]) => ({ license, count })),
      visitsToday: visitsToday[0]?.[0] ?? 0,
      visitsWeek: visitsWeek[0]?.[0] ?? 0,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur analytics" },
      { status: 500 }
    );
  }
}
