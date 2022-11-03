import { Application, Context } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const app = new Application();

app.use(oakCors());

app.use(async (ctx: Context) => {
  const res = await fetch("https://api.github.com/repos/filecoin-station/filecoin-station/releases", {
    headers: {
      "Authorization": "Token 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",
    },
  })
  const body = await res.json()
  ctx.response.body = {
    downloads: Number(body.map((release: any) => release.assets.map((asset: any) => asset.download_count).reduce((a: number, b: number) => a + b, 0)).reduce((a: number, b: number) => a + b, 0))
  }
});

app.listen({ port: 8000 });
