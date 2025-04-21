import localFont from "next/font/local"

export const hostGrotesk = localFont({
  src: [
    { path: "./HostGrotesk-VariableFont_wght.woff2" },
    { path: "./HostGrotesk-Italic-VariableFont_wght.woff2", style: "italic" },
  ],
  weight: "300 800",
})

const newFontsStyles = /* css */ `
html {
  --font-sans: ${hostGrotesk.style.fontFamily};
}`

export const NewFontsStyleTag = () => {
  return <style dangerouslySetInnerHTML={{ __html: newFontsStyles }} />
}
