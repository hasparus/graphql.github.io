// @ts-check

import fs from "fs/promises"

const [dark, light] = await Promise.all([
  fs
    .readFile(new URL("./github-dark.json", import.meta.url), "utf-8")
    .then(JSON.parse),
  fs
    .readFile(new URL("./min-light.json", import.meta.url), "utf-8")
    .then(JSON.parse),
])

export const syntaxHighlightingThemes = { light, dark }
