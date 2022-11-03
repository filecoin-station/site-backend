import { serve } from "https://deno.land/std@0.161.0/http/server.ts";

serve(async (req: Request) => {
  const res = await fetch("https://eu-central-1-1.aws.cloud2.influxdata.com/api/v2/query", {
    method: "POST",
    headers: {
      "Accept": "application/csv",
      "Content-Type": "application/vnd.flux",
      "Authorization": "Token 3EzowtsxsDC69eiun1Sffu_KsB-eBMxbYFBR4b_JXnQYEVxW7iPyhL653aZA_A_LMSkUTjz6VnPZu4GkvrI3aQ==",
    },
    body: `
      from(bucket: "station")
        |> range(start: 0)
        |> filter(fn: (r) => r["_measurement"] == "jobs-completed")
        |> filter(fn: (r) => r["_field"] == "value")
        |> sum()
    `,
  })
  const body = await res.text()
  return Response.json({
    jobsCompleted: Number(body.split('\n')[1].split(',')[5])
  })
});