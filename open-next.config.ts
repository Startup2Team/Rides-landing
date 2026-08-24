import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No incrementalCache override yet — the R2-backed cache needs the bucket and
// the WORKER_SELF_REFERENCE service binding provisioned first (see the notes
// in wrangler.jsonc). Until then OpenNext uses its in-memory default.
export default defineCloudflareConfig({});
