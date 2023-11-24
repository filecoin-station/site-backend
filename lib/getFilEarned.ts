export default async (): Promise<bigint> => {
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
