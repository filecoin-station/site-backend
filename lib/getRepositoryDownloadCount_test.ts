import { assert } from "https://deno.land/std@0.162.0/testing/asserts.ts";
import getRepositoryDownloadCount from "./getRepositoryDownloadCount.ts";

Deno.test("getRepositoryDownloadCount", async () => {
  const downloads = await getRepositoryDownloadCount(
    "filecoin-station/filecoin-station"
  )
  assert(downloads > 500)
})
