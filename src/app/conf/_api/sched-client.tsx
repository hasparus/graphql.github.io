/**
 * Sched's API has a rate limit of 30 requests per minute.
 */

let rateLimitResetAt: number | null = null

type RequestURL = string
type RequestPending = Promise<unknown>
type RequestSuccess = "ok"
type RequestError = Error

const requestsRetried = new Map<
  RequestURL,
  RequestPending | RequestSuccess | RequestError
>()

export async function fetchSchedData<T>(url: string): Promise<T> {
  try {
    if (rateLimitResetAt && Date.now() < rateLimitResetAt) {
      const wait = rateLimitResetAt - Date.now()
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
      let wait = 60_000
      const xRateLimitResetAt = response.headers.get("x-rate-limit-reset-at")
      if (xRateLimitResetAt) {
        rateLimitResetAt = Number(xRateLimitResetAt) * 1000
        console.warn(
          `Rate limit reset at ${new Date(rateLimitResetAt).toISOString()}`,
        )
        wait = rateLimitResetAt - Date.now()
      }

      const later = Promise.withResolvers<T>()
      requestsRetried.set(url, later.promise)
      const queueSize = requestsRetried.size

      console.warn(
        `Rate limit exceeded, retrying in ${Math.round(wait / 1000)}s: ${url} (queue size: ${queueSize})`,
      )

      const size = Object.entries(requestsRetried).filter(
        ([_, status]) => status instanceof Promise,
      ).length

      console.warn(`${size} requests retrying...`)

      setTimeout(
        () =>
          later.resolve(
            fetchSchedData<T>(url).then(data => {
              rateLimitResetAt = null
              requestsRetried.set(url, "ok")
              return data
            }),
          ),
        wait,
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

// todo: functions for `getSpeakers`, `getSchedule`
