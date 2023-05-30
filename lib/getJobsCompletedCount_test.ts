import { assert } from "https://deno.land/std@0.162.0/testing/asserts.ts";
import getJobsCompletedCount, { getFromInflux } from "./getJobsCompletedCount.ts";

// This test is expected to leak an async op, from updating the cache after
// sending the response.
Deno.test({
  name: "getJobsCompletedCount",
  sanitizeOps: false,
  sanitizeResources: false,
  async fn () {
    const jobsCompleted = await getJobsCompletedCount()
    assert(jobsCompleted > 1_000_000)
  }
})

Deno.test("getFromInflux", async () => {
  const jobsCompleted = await getFromInflux()
  assert(jobsCompleted > 1_000_000)
})

