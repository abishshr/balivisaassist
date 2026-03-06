/**
 * Refresh Meta (Facebook/Instagram) long-lived access token
 *
 * Steps:
 * 1. Use short-lived User Access Token to get a Page Access Token
 * 2. Exchange Page Token for a long-lived token via Meta's OAuth endpoint
 * 3. Update instagram_config in Supabase with the new token + expiry
 * 4. Verify the token works by calling the IG Business Account API
 *
 * Run with: npx tsx scripts/refresh-meta-token.ts
 */

import { createClient } from "@supabase/supabase-js";

// --- Environment ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const META_APP_ID = process.env.META_APP_ID!;
const META_APP_SECRET = process.env.META_APP_SECRET!;
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID || "1019058627948610";

const SHORT_LIVED_USER_TOKEN =
  "EAAXJSDamUTgBQZBCaHrVfEs57kg7UYg5PQlwcfOnqA89IjJZAsKTquZA1ZAoAYSzIwHUYTZCahaHJOjfXrJhaXWBlEBhHbszeSUG5VM8aZAILcZAmUyUH54SnUm4EAGU6h7i9bfyA0K866nHXrudxZCqNQRc8P8Ok9D0tqPfXRpv68RjnV31WWlihXXixdIteVb37ZCfbJsrkxMuL7ZA5mDdxjTifxYhKhJZAfJNpDZB8KFZBjd0tguLVqTGCtEilbUvnioZAZByV7ZBvsXmoWgwMd1ldkJr4Bjyh5D2qRcyElJz90gZD";

// Validate env
for (const [name, val] of Object.entries({
  NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: SUPABASE_KEY,
  META_APP_ID,
  META_APP_SECRET,
})) {
  if (!val) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function graphGet(url: string): Promise<any> {
  const res = await fetch(url);
  const json = await res.json();
  if (json.error) {
    throw new Error(
      `Graph API error: ${json.error.message} (code ${json.error.code}, type ${json.error.type})`
    );
  }
  return json;
}

async function main() {
  console.log("=== Meta Token Refresh ===\n");

  // Step 1: Get Page Access Token from the short-lived User Token
  console.log("Step 1: Getting Page Access Token...");
  const pageTokenUrl = `https://graph.facebook.com/v21.0/${FACEBOOK_PAGE_ID}?fields=access_token&access_token=${SHORT_LIVED_USER_TOKEN}`;
  const pageData = await graphGet(pageTokenUrl);
  const pageAccessToken = pageData.access_token;

  if (!pageAccessToken) {
    throw new Error("No access_token returned for the page. Check that the User Token has pages_manage_posts / pages_read_engagement permissions.");
  }
  console.log(`  Page Access Token obtained (${pageAccessToken.substring(0, 20)}...)\n`);

  // Step 2: Exchange for a long-lived token
  console.log("Step 2: Exchanging for long-lived token...");
  const longLivedUrl =
    `https://graph.facebook.com/v21.0/oauth/access_token` +
    `?grant_type=fb_exchange_token` +
    `&client_id=${META_APP_ID}` +
    `&client_secret=${META_APP_SECRET}` +
    `&fb_exchange_token=${pageAccessToken}`;
  const longLivedData = await graphGet(longLivedUrl);
  const longLivedToken = longLivedData.access_token;
  const expiresIn = longLivedData.expires_in; // seconds, typically ~5184000 (60 days)

  if (!longLivedToken) {
    throw new Error("No long-lived access_token returned. Check META_APP_ID / META_APP_SECRET.");
  }

  const expiresAt = new Date(Date.now() + (expiresIn || 60 * 24 * 60 * 60) * 1000);
  console.log(`  Long-lived token obtained (${longLivedToken.substring(0, 20)}...)`);
  console.log(`  Expires in: ${expiresIn ? Math.round(expiresIn / 86400) + " days" : "~60 days (assumed)"}`);
  console.log(`  Expires at: ${expiresAt.toISOString()}\n`);

  // Step 3: Update Supabase instagram_config
  console.log("Step 3: Updating instagram_config in Supabase...");
  const { data: existing, error: fetchErr } = await supabase
    .from("instagram_config")
    .select("id")
    .limit(1)
    .single();

  if (fetchErr) {
    throw new Error(`Failed to fetch existing config: ${fetchErr.message}`);
  }

  const { error: updateErr } = await supabase
    .from("instagram_config")
    .update({
      meta_access_token: longLivedToken,
      meta_token_expires_at: expiresAt.toISOString(),
    })
    .eq("id", existing.id);

  if (updateErr) {
    throw new Error(`Failed to update instagram_config: ${updateErr.message}`);
  }
  console.log(`  Updated row id=${existing.id}`);
  console.log(`  meta_access_token set`);
  console.log(`  meta_token_expires_at = ${expiresAt.toISOString()}\n`);

  // Step 4: Verify the token works
  console.log("Step 4: Verifying token with a test API call...");

  // 4a. Debug token info
  const debugUrl = `https://graph.facebook.com/v21.0/debug_token?input_token=${longLivedToken}&access_token=${META_APP_ID}|${META_APP_SECRET}`;
  const debugData = await graphGet(debugUrl);
  console.log(`  Token debug info:`);
  console.log(`    App ID:    ${debugData.data?.app_id}`);
  console.log(`    Type:      ${debugData.data?.type}`);
  console.log(`    Valid:     ${debugData.data?.is_valid}`);
  console.log(`    Expires:   ${debugData.data?.expires_at ? new Date(debugData.data.expires_at * 1000).toISOString() : "never"}`);
  console.log(`    Scopes:    ${debugData.data?.scopes?.join(", ")}`);

  // 4b. Test IG Business Account query
  const igAccountId = "17841480451853078";
  const igUrl = `https://graph.facebook.com/v21.0/${igAccountId}?fields=id,username,followers_count,media_count&access_token=${longLivedToken}`;
  const igData = await graphGet(igUrl);
  console.log(`\n  Instagram Business Account:`);
  console.log(`    ID:        ${igData.id}`);
  console.log(`    Username:  ${igData.username}`);
  console.log(`    Followers: ${igData.followers_count}`);
  console.log(`    Posts:     ${igData.media_count}`);

  console.log("\n=== All done! Token refreshed successfully. ===");
}

main().catch((err) => {
  console.error("\nFATAL:", err.message || err);
  process.exit(1);
});
