import { test, expect } from "@playwright/test"

const url2 = "https://www.soft8soft.com/webglreport"
const url3 = "https://webglsamples.org/aquarium/aquarium.html"

function waitFor(delay: number) {
  return new Promise(resolve => setTimeout(resolve, delay))
}

test.beforeEach(async ({ browser }, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 160000)
})

test.describe("Testing WebGL Support", () => {
  test("2. webgl report", async ({ page }) => {
    await page.goto(url2)

    await waitFor(2000)
    expect(page).toHaveScreenshot("webgl-report.png")
  })

  test("3. aquarium", async ({ page }) => {
    await page.goto(url3)

    await waitFor(5000)
    expect(page).toHaveScreenshot("aquarium.png")
  })
})
