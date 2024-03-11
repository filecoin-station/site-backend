import { assert } from "https://deno.land/std@0.162.0/testing/asserts.ts";

export default async (): Promise<number> => {
  assert(Deno.env.get("INFLUX_TOKEN"), "$INFLUX_TOKEN required")
  const kv = await Deno.openKv()
  const { value: jobsCompleted } = await kv.get(['jobs-completed'])
  if (jobsCompleted !== null) {
    // updateCache(kv).catch(console.error)
    return Number(jobsCompleted)
  } else {
    const jobsCompleted = await updateCache(kv)
    return jobsCompleted
  }
}

const updateCache = async (kv: Deno.Kv): Promise<number> => {
  const jobsCompleted = await getFromInflux()
  await kv.set(['jobs-completed'], jobsCompleted)
  return jobsCompleted
}

export const getFromInflux = async (): Promise<number> => {
  const res = await fetch("https://eu-central-1-1.aws.cloud2.influxdata.com/api/v2/query", {
    method: "POST",
    headers: {
      "Accept": "application/csv",
      "Content-Type": "application/vnd.flux",
      "Authorization": `Token ${Deno.env.get("INFLUX_TOKEN")}`,
    },
    body: `
      from(bucket: "station")
        |> range(start: 0)
        |> filter(fn: (r) => r["_measurement"] == "jobs-completed")
        |> filter(fn: (r) => r["_field"] == "value")
        |> group()
        |> sum()
    `,
  })
  const body = await res.text()
  assert(res.ok, `Bad InfluxDB response: ${res.status} ${res.statusText}`)
  return Number(body.split('\n')[1].split(',')[5])
}
