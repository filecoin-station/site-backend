export default async (): Promise<number> => {
  const kv = await Deno.openKv()
  const { value: jobsCompleted } = await kv.get(['jobs-completed'])
  if (jobsCompleted !== null) {
    updateCache(kv).catch(console.error)
    return Number(jobsCompleted)
  } else {
    const jobsCompleted = await updateCache(kv)
    return jobsCompleted
  }
}

const updateCache = async (kv: Deno.Kv): Promise<number> => {
  const jobsCompleted = await getFromApi()
  await kv.set(['jobs-completed'], jobsCompleted)
  return jobsCompleted
}

const OFFSET = 155_153_052_475
const OFFSET_DATE = '2024-07-09'

export const getFromApi = async (): Promise<number> => {
  console.log('getFromApi() ...')
  const res = await fetch(`https://stats.filspark.com/measurements/daily?from=${OFFSET_DATE}`)
  const days = await res.json()
  console.log('getFromAPI() ✔️')
  return days.reduce(
    (acc: number, day: any) => acc + Number(day.total_measurement_count),
    OFFSET
  )
}
