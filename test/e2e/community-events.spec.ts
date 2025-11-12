import { test, expect } from "@playwright/test"

test("community events page map loads and Zurich meetup link works", async ({
  page,
}) => {
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
