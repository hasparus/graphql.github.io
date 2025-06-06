/**
 * Sched's API has a rate limit of 30 requests per minute.
 */

let last429Timestamp: number | null = null
const RATE_LIMIT_MS = 60_000

type RequestURL = string
type RequestPending = Promise<unknown>
type RequestSuccess = "ok"
type RequestError = Error

const requestsRetried = new Map<
  RequestURL,
  RequestPending | RequestSuccess | RequestError
>()

export async function fetchData<T>(url: string): Promise<T> {
  try {
    if (last429Timestamp && Date.now() - last429Timestamp < RATE_LIMIT_MS) {
      const wait = RATE_LIMIT_MS - (Date.now() - last429Timestamp)
      await new Promise(resolve => setTimeout(resolve, wait))
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "GraphQL Conf / GraphQL Foundation",
      },
      cache: "force-cache",
    })

    // Take note that this is feasible only because
    // we're currently only using this API at build time.
    if (response.status === 429) {
      last429Timestamp = Date.now()

      const later = Promise.withResolvers<T>()
      requestsRetried.set(url, later.promise)
      const queueSize = requestsRetried.size

      console.warn(
        `Rate limit exceeded, retrying in 60 seconds: ${url} (queue size: ${queueSize})`,
      )

      const size = Object.entries(requestsRetried).filter(
        ([_, status]) => status instanceof Promise,
      ).length

      console.warn(`${size} requests retrying...`)
      setTimeout(
        () =>
          later.resolve(
            fetchData<T>(url).then(data => {
              requestsRetried.set(url, "ok")
              last429Timestamp = null
              return data
            }),
          ),
        60_000,
      )

      return later.promise
    }

    const data = await response.json()
    return data
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e))
    requestsRetried.set(url, error)

    throw new Error(
      `Error fetching data from ${url}: ${(error as Error).message || (error as Error).toString()}`,
    )
  }
}
