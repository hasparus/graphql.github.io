import localFont from "next/font/local"

export const hostGrotesk = localFont({
  src: [
    { path: "./HostGrotesk-VariableFont_wght.woff2" },
    { path: "./HostGrotesk-Italic-VariableFont_wght.woff2", style: "italic" },
  ],
  weight: "300 800",
})

export const commitMono = localFont({
  src: "./CommitMono-VariableFont.woff2",
  weight: "200 700",
  declarations: [
    {
      prop: "font-feature-settings",
      value: "'ss01' on, 'ss02' on, 'ss04' on, 'ss05' on, 'cv08' on",
    },
  ],
})

const newFontsStyles = /* css */ `
html {
  --font-sans: ${hostGrotesk.style.fontFamily};
  --font-mono: ${commitMono.style.fontFamily};
}`

export const NewFontsStyleTag = () => {
  return <style dangerouslySetInnerHTML={{ __html: newFontsStyles }} />
}
