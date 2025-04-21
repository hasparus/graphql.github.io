import { Roboto_Flex } from "next/font/google"

export const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
})

const oldFontsStyles = /* css */ `
html {
  --font-sans: ${robotoFlex.style.fontFamily};
}`

export const OldFontsStyleTag = () => {
  return <style dangerouslySetInnerHTML={{ __html: oldFontsStyles }} />
}
