import { Redis } from "https://deno.land/x/upstash_redis@v1.20.6/mod.ts";

export default async (): Promise<bigint> => {
  const redis = new Redis({
    url: 'https://us1-above-grub-40723.upstash.io',
    token: 'AZ8TACQgOTI1ODlhYTUtMjhhOS00NzI2LWIyZWYtNDkwMGNhYTUzMTRmMTM0MTM3YWZmNmEyNGI3NmExYjVhZjU1YzM4YTkyZDk=',
  })
  const filEarned = await redis.get('fil-earned')
  if (typeof filEarned == "string") {
    updateCache(redis).catch(console.error)
    return BigInt(filEarned)
  } else {
    const filEarned = await updateCache(redis)
    return filEarned
  }
}

export const formatAttoFil = (num: bigint): string => {
  return (num / 10n ** 18n).toString()
}

const updateCache = async (redis: Redis): Promise<bigint> => {
  const filEarned = await getFromContract()
  await redis.set('fil-earned', `0x${filEarned.toString(16)}`)
  return filEarned
}

export const getFromContract = async (): Promise<bigint> => {
  const res = await fetch("https://api.node.glif.io/rpc/v0", {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_call",
      params: [
        {
          to: "0xaaef78eaf86dcf34f275288752e892424dda9341",
          data: "0x624c6be7"
        },
        "latest"
      ],
      id: 1
    })
  })
  const { result } = await res.json()
  const balanceHeld = BigInt(result)

  // TODO: Keep this value updated
  const alreadyPaid = 68657304665804877993n

  return balanceHeld + alreadyPaid
}
