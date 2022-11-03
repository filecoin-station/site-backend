import { serve } from "https://deno.land/std@0.161.0/http/server.ts";

serve(async (req: Request) => {
  const res = await fetch("https://api.github.com/repos/filecoin-station/filecoin-station/releases", {
    headers: {
      "Authorization": "Token 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",
    },
  })
  const body = await res.json()
  return Response.json({
    downloads: Number(body.map((release: any) => release.assets.map((asset: any) => asset.download_count).reduce((a: number, b: number) => a + b, 0)).reduce((a: number, b: number) => a + b, 0))
  })
});