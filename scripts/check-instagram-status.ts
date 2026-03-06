/**
 * Check Instagram automation state in Supabase
 * Run with: npx tsx scripts/check-instagram-status.ts
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("=== Instagram Automation Status ===\n");

  // 1. instagram_config
  console.log("--- Config ---");
  const { data: config, error: configErr } = await supabase
    .from("instagram_config")
    .select("*");

  if (configErr) {
    console.error("Error querying instagram_config:", configErr.message);
  } else if (!config || config.length === 0) {
    console.log("No rows in instagram_config.\n");
  } else {
    for (const row of config) {
      console.log(`  is_active:             ${row.is_active}`);
      console.log(`  auto_approve:          ${row.auto_approve}`);
      const expires = row.meta_token_expires_at;
      if (expires) {
        const expiresDate = new Date(expires);
        const now = new Date();
        const daysLeft = Math.round(
          (expiresDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        console.log(
          `  meta_token_expires_at: ${expires} (${daysLeft >= 0 ? daysLeft + " days left" : "EXPIRED " + Math.abs(daysLeft) + " days ago"})`
        );
      } else {
        console.log("  meta_token_expires_at: null");
      }
      // Print any other columns present
      const knownKeys = new Set([
        "is_active",
        "auto_approve",
        "meta_token_expires_at",
      ]);
      for (const [k, v] of Object.entries(row)) {
        if (!knownKeys.has(k)) {
          console.log(`  ${k}: ${JSON.stringify(v)}`);
        }
      }
    }
    console.log();
  }

  // 2. Last 10 activity log entries
  console.log("--- Activity Log (last 10) ---");
  const { data: logs, error: logsErr } = await supabase
    .from("instagram_activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (logsErr) {
    console.error("Error querying instagram_activity_log:", logsErr.message);
  } else if (!logs || logs.length === 0) {
    console.log("No activity log entries.\n");
  } else {
    for (const log of logs) {
      const time = log.created_at
        ? new Date(log.created_at).toLocaleString()
        : "?";
      const action = log.action || log.event || log.type || "unknown";
      const detail =
        log.details || log.message || log.description || "";
      console.log(`  [${time}] ${action}: ${typeof detail === "string" ? detail : JSON.stringify(detail)}`);
    }
    console.log();
  }

  // 3. Stuck posts (status != 'published')
  console.log("--- Stuck Posts (status != 'published') ---");
  const { data: stuck, error: stuckErr } = await supabase
    .from("instagram_posts")
    .select("*")
    .neq("status", "published")
    .order("created_at", { ascending: false });

  if (stuckErr) {
    console.error("Error querying stuck posts:", stuckErr.message);
  } else if (!stuck || stuck.length === 0) {
    console.log("No stuck posts. All clear.\n");
  } else {
    console.log(`  Found ${stuck.length} non-published post(s):`);
    for (const post of stuck) {
      const caption =
        typeof post.caption === "string"
          ? post.caption.substring(0, 80)
          : JSON.stringify(post.caption)?.substring(0, 80) ?? "";
      console.log(
        `  - [${post.status}] id=${post.id} created=${post.created_at}`
      );
      console.log(`    caption: ${caption}...`);
    }
    console.log();
  }

  // 4. Last 3 published posts
  console.log("--- Last 3 Published Posts ---");
  const { data: published, error: pubErr } = await supabase
    .from("instagram_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  if (pubErr) {
    console.error("Error querying published posts:", pubErr.message);
  } else if (!published || published.length === 0) {
    console.log("No published posts found.\n");
  } else {
    for (const post of published) {
      const caption =
        typeof post.caption === "string"
          ? post.caption.substring(0, 80)
          : JSON.stringify(post.caption)?.substring(0, 80) ?? "";
      console.log(
        `  - published_at=${post.published_at} id=${post.id}`
      );
      console.log(`    caption: ${caption}...`);
      if (post.instagram_id) {
        console.log(`    instagram_id: ${post.instagram_id}`);
      }
    }
    console.log();
  }

  console.log("=== Done ===");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
