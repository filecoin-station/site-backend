import { Application, Context } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import getRepositoryDownloadCount from "./lib/getRepositoryDownloadCount.ts";

const app = new Application();
app.use(oakCors());
app.use(async (ctx: Context) => {
  ctx.response.body = {
    downloads: await getRepositoryDownloadCount(
      "filecoin-station/filecoin-station",
      "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"
    )
  }
});
app.listen({ port: 8000 });
