import { Redis } from "https://deno.land/x/upstash_redis@v1.20.6/mod.ts";

export default async (): Promise<number> => {
  const redis = new Redis({
    url: 'https://us1-above-grub-40723.upstash.io',
    token: 'AZ8TACQgOTI1ODlhYTUtMjhhOS00NzI2LWIyZWYtNDkwMGNhYTUzMTRmMTM0MTM3YWZmNmEyNGI3NmExYjVhZjU1YzM4YTkyZDk=',
  })
  const jobsCompleted = await redis.get('jobs-completed')
  if (jobsCompleted !== null) {
    updateCache(redis).catch(console.error)
    return Number(jobsCompleted)
  } else {
    const jobsCompleted = await updateCache(redis)
    return jobsCompleted
  }
}

const updateCache = async (redis: Redis): Promise<number> => {
  const jobsCompleted = await getFromInflux()
  await redis.set('jobs-completed', jobsCompleted)
  return jobsCompleted
}

export const getFromInflux = async (): Promise<number> => {
  const res = await fetch("https://eu-central-1-1.aws.cloud2.influxdata.com/api/v2/query", {
    method: "POST",
    headers: {
      "Accept": "application/csv",
      "Content-Type": "application/vnd.flux",
      "Authorization": `Token 3EzowtsxsDC69eiun1Sffu_KsB-eBMxbYFBR4b_JXnQYEVxW7iPyhL653aZA_A_LMSkUTjz6VnPZu4GkvrI3aQ==`,
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
  return Number(body.split('\n')[1].split(',')[5])
}
