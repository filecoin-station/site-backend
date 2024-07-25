import { assert } from "https://deno.land/std@0.162.0/testing/asserts.ts";
import getJobsCompletedCount, { getFromApi } from "./getJobsCompletedCount.ts";

// This test is expected to leak an async op, from updating the cache after
// sending the response.
Deno.test({
  name: "getJobsCompletedCount",
  sanitizeOps: false,
  sanitizeResources: false,
  ignore: true, // InfluxDB query currently fails
  async fn () {
    const jobsCompleted = await getJobsCompletedCount()
    assert(jobsCompleted > 1_000_000, `jobsCompleted: ${jobsCompleted}`)
  }
})

// For some reason this test also gets async op warnings. Maybe this is still
// residue from the previous one.
Deno.test({
  name: "getFromApi",
  sanitizeOps: false,
  sanitizeResources: false,
  async fn () {
    const jobsCompleted = await getFromApi()
    assert(jobsCompleted > 1_000_000)
    assert(jobsCompleted < Number.MAX_SAFE_INTEGER)
  }
})

