import { test, expect } from "@playwright/test"

test("map loads and Zurich meetup link works", async ({ page }) => {
  await page.goto("/community/events")

  // Wait for the map canvas to be visible
  const mapCanvas = page.locator("canvas").first()
  await expect(mapCanvas).toBeVisible({ timeout: 10000 })

  // Wait for map to finish loading by checking if it has proper dimensions
  await expect
    .poll(async () => {
      const box = await mapCanvas.boundingBox()
      return box && box.width > 100 && box.height > 100
    })
    .toBe(true)

  // Take a screenshot of the map and verify it matches snapshot
  const mapContainer = page.locator("canvas").first()
  await expect(mapContainer).toHaveScreenshot("meetups-map.png", {
    timeout: 10000,
  })

  // Find the "Past events & meetups" section
  const pastEventsSection = page.locator("text=Past events & meetups")
  await pastEventsSection.scrollIntoViewIfNeeded()

  // Find the scrollview container with past events and meetups

  // Find the Zurich meetup card in the scrollable list (not the map popup)
  const link = page.getByText(/Zurich/i).first()
  await link.scrollIntoViewIfNeeded()
  await link.click()

  // Click the link and verify it opens to the correct URL
  const pagePromise = page.context().waitForEvent("page")
  await link.click()
  const newPage = await pagePromise

  await newPage.waitForLoadState("domcontentloaded", { timeout: 10000 })
  expect(newPage.url()).toContain("meetup.com/graphql-zurich")
})

test("map tooltip appears on marker hover", async ({ page }) => {
  await page.goto("/community/events")
  const mapCanvas = page.locator("canvas").first()
  await expect(mapCanvas).toBeVisible({ timeout: 10000 })
  await expect
    .poll(async () => {
      const box = await mapCanvas.boundingBox()
      return Boolean(box && box.width > 100 && box.height > 100)
    })
    .toBe(true)
  const tooltip = page.getByRole("tooltip")
  await expect(tooltip).toHaveCount(0)
  await mapCanvas.hover()
  const { clientX, clientY } = await page.evaluate(() => {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement | null
    if (!canvas) throw new Error("Canvas not found")
    const targetLat = 51.51
    const targetLon = -0.12
    const aspectRatio = 1.65
    const cellSize = 8
    const mercatorLimit = 85.05112878
    const minDisplayedLatitude = -60
    const baseLatitudeOffset = 4
    const baseLongitudeOffset = 0.1
    const clamp01 = (value: number) => {
      if (value <= 0) return 0
      if (value >= 1) return 1
      return value
    }
    const normalizeLongitude = (value: number) => {
      let lon = value
      while (lon <= -180) lon += 360
      while (lon > 180) lon -= 360
      return lon
    }
    const latToRawV = (lat: number) => {
      const clampedLat = Math.max(-mercatorLimit, Math.min(mercatorLimit, lat))
      const rad = (clampedLat * Math.PI) / 180
      return (
        0.5 - Math.log(Math.tan(Math.PI * 0.25 + rad * 0.5)) / (2 * Math.PI)
      )
    }
    const maxProjectedV = latToRawV(mercatorLimit)
    const minProjectedV = latToRawV(minDisplayedLatitude)
    const lonLatToUV = (lon: number, lat: number) => {
      const adjustedLon = normalizeLongitude(lon + baseLongitudeOffset)
      const u = (adjustedLon + 180) / 360
      const adjustedLat = Math.max(
        minDisplayedLatitude,
        Math.min(mercatorLimit, lat + baseLatitudeOffset),
      )
      const rawV = latToRawV(adjustedLat)
      const normalizedV = clamp01(
        (rawV - maxProjectedV) / (minProjectedV - maxProjectedV),
      )
      return [u, normalizedV] as const
    }
    const { width, height } = canvas
    const pixelRatio = window.devicePixelRatio || 1
    const worldHeight = Math.min(width / aspectRatio, height)
    const worldWidth = worldHeight * aspectRatio
    const panX = width * 0.5 - worldWidth * 0.5
    const panY = height * 0.5 - worldHeight * 0.5
    const [u, v] = lonLatToUV(targetLon, targetLat)
    const markerY = 1 - v
    const screenX = panX + u * worldWidth
    const screenY = panY + markerY * worldHeight
    const deviceCell = cellSize * pixelRatio
    const cellX = Math.floor(screenX / deviceCell)
    const cellY = Math.floor(screenY / deviceCell)
    const centerX = (cellX + 0.5) * deviceCell
    const centerY = (cellY + 0.5) * deviceCell
    const rect = canvas.getBoundingClientRect()
    const clientX = rect.left + centerX / pixelRatio
    const clientY = rect.bottom - centerY / pixelRatio
    return { clientX, clientY }
  })
  await page.mouse.move(clientX, clientY)
  await expect(tooltip).toHaveText("London GraphQL", { timeout: 5000 })
  await expect(tooltip).toBeVisible()
})
