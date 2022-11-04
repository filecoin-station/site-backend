export default async (repo: String, token?: String): Promise<number> => {
  const res = await fetch(`https://api.github.com/repos/${repo}/releases`, {
    headers: {
      ...token ? { "Authorization": `token ${token}` } : {}
    },
  })
  const body = await res.json()
  return body
    .map((release: any) => release.assets
      .map((asset: any) => asset.download_count)
      .reduce((a: number, b: number) => a + b, 0)
    )
    .reduce((a: number, b: number) => a + b, 0)
}
