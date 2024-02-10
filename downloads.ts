import { Application, Context } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import getRepositoryDownloadCount from "./lib/getRepositoryDownloadCount.ts";
import { assert } from "https://deno.land/std@0.162.0/testing/asserts.ts";

assert(Deno.env.get("GITHUB_TOKEN"), "$GITHUB_TOKEN required");

const app = new Application();
app.use(oakCors());
app.use(async (ctx: Context) => {
  ctx.response.body = {
    downloads: await getRepositoryDownloadCount(
      "filecoin-station/filecoin-station",
      Deno.env.get("GITHUB_TOKEN")
    )
  }
});
app.listen({ port: 8000 });
