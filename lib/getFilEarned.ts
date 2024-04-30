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
  const filEarned = await getFromContract()
  await kv.set(['fil-earned'], `0x${filEarned.toString(16)}`)
  return filEarned
}

export const getFromContract = async (): Promise<bigint> => {
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
  const { result } = await res.json()
  const balanceHeld = BigInt(result)

  // TODO: Keep this value updated
  const alreadyPaid = 68657304665804877993n // 11/22/2023
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

  return balanceHeld + alreadyPaid
}
