import { clsx } from "clsx"

import { Eyebrow } from "@/_design-system/eyebrow"

export function CommonQuestionsSection(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  return (
    <section
      {...props}
      className={clsx("gql-section gql-container", props.className)}
    >
      <Eyebrow>FAQ</Eyebrow>
    </section>
  )
}
