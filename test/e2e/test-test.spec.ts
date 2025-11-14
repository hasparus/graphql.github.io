import { test, expect } from "@playwright/test"

const currentTime = Date.now()

const url1 = "chrome://gpu/"
const url2 = "https://www.soft8soft.com/webglreport"
const url3 = "https://webglsamples.org/aquarium/aquarium.html"

function waitFor(delay: number) {
  return new Promise(resolve => setTimeout(resolve, delay))
}

test.beforeEach(async ({ browser }, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 160000)
})

test.describe("Testing 123", () => {
  test("2. webgl report", async ({ page }) => {
    await page.goto(url2)

    await waitFor(2000)
    await page.screenshot({
      path: "playwright-report/screenshot" + currentTime + "_2.png",
      fullPage: true,
    })
  })

  test("3. aquarium", async ({ page }) => {
    await page.goto(url3)

    await waitFor(5000)
    await page.screenshot({
      path: "playwright-report/screenshot" + currentTime + "_3.png",
      fullPage: true,
    })
  })
})
