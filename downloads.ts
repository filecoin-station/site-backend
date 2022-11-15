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
  const downloads = body
    .map((release: any) => release.assets
      .filter((asset: any) => !asset.name.endsWith(".yml"))
      .filter((asset: any) => !asset.name.endsWith(".blockmap"))
      .map((asset: any) => asset.download_count as number)
      .reduce((a, b) => a + b, 0)
    )
    .reduce((a, b) => a + b, 0)

  ctx.response.body = { downloads }
});

app.listen({ port: 8000 });
