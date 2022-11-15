import { assert } from "https://deno.land/std@0.162.0/testing/asserts.ts";
import getJobsCompletedCount from "./getJobsCompletedCount.ts";

Deno.test("getRepositoryDownloadCount", async () => {
  const jobsCompleted = await getJobsCompletedCount()
  assert(jobsCompleted > 1_000_000)
})

