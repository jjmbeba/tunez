const backendUrl = process.env.BACKEND_API_URL?.replace(/\/+$/, '')

function getTargetUrl(request: Request) {
  if (!backendUrl) {
    throw new Error('BACKEND_API_URL is required for the frontend API proxy.')
  }

  const incomingUrl = new URL(request.url)
  return new URL(`${incomingUrl.pathname}${incomingUrl.search}`, `${backendUrl}/`)
}

export default {
  async fetch(request: Request) {
    const targetUrl = getTargetUrl(request)
    const headers = new Headers(request.headers)

    headers.set('host', targetUrl.host)

    return await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.body,
      redirect: 'manual',
      duplex: 'half',
    } as RequestInit & { duplex: 'half' })
  },
}
