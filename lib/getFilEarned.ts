import { assert } from "https://deno.land/std@0.162.0/testing/asserts.ts";

export default async (): Promise<bigint> => {
  assert(Deno.env.get("GLIF_TOKEN"), "$GLIF_TOKEN required")
  const kv = await Deno.openKv()
  const { value: filEarned } = await kv.get(['fil-earned'])
  if (typeof filEarned == "string") {
    updateCache(kv).catch(console.error)
    return BigInt(filEarned)
  } else {
    const filEarned = await updateCache(kv)
    return filEarned
  }
}

export const formatAttoFil = (num: bigint): string => {
  return (num / 10n ** 18n).toString()
}

const updateCache = async (kv: Deno.Kv): Promise<bigint> => {
  const filEarned = await getFilEarned()
  await kv.set(['fil-earned'], `0x${filEarned.toString(16)}`)
  return filEarned
}

const historicTransfers = 68657304665804877993n // 11/22/2023
  + 388040000000000000000n // 12/07/2023
  + 759409999999999934464n // 01/05/2024
  + 46382279410000003072n  // 01/11/2024
  + 686460000000000000000n // 02/01/2024
  + 916710000000000065536n // 03/01/2024
  + 645590000000000065536n // 03/25/2024
  + 285779999999999967232n // 04/04/2024
  + 73080000000000000000n // 04/08/2024
  + 217180000000000000000n // 04/15/2024
  + 167640000000000000000n // 04/22/2024
  + 239900000000000000000n // 04/30/2024
  + 154710000000000000000n // 05/06/2024
  + 173690000000000000000n // 05/13/2024
  + 208760000000000000000n // 05/21/2024
  + 120970000000000000000n // 05/27/2024
  + 124380000000000000000n // 06/03/2024
  + 188030530100000000000n // 06/11/2024

type StatsResponse = {
  day: string;
  amount: string;
}[]

export const getTransfersFromStats = async (): Promise<bigint> => {
  const res = await fetch(
    'https://stats.filspark.com/transfers/daily' +
      `?from=2024-06-12&to=${new Date().toISOString().split('T')[0]}`
  )
  const stats = await res.json() as StatsResponse
  return stats.reduce((total, stat) => total + BigInt(stat.amount), 0n)
}

export const getContractBalanceHeld = async (): Promise<bigint> => {
  const res = await fetch("https://api.node.glif.io/rpc/v0", {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Deno.env.get("GLIF_TOKEN")}`
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_call",
      params: [
        {
          to: "0x8460766Edc62B525fc1FA4D628FC79229dC73031",
          data: "0x624c6be7"
        },
        "latest"
      ],
      id: 1
    })
  })
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`)
  const { result } = await res.json()
  return BigInt(result)
}

export const getFilEarned = async (): Promise<bigint> => {
  const [balanceHeld, transfersFromStats] = await Promise.all([
    getContractBalanceHeld(),
    getTransfersFromStats()
  ])
  return historicTransfers + transfersFromStats + balanceHeld
}
