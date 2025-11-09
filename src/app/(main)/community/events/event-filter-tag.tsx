import { Tag } from "@/app/conf/_design-system/tag"
import { CheckboxIcon } from "@/app/conf/_design-system/pixelarticons/checkbox-icon"

export type EventKind = "meetup" | "conference" | "working-group"

const colors = {
  meetup: "hsl(var(--color-pri-base))",
  conference: "hsl(var(--color-sec-dark))",
  "working-group": "#6883FF",
}

export function EventFilterTag({
  kind,
  checked,
  onChange,
}: {
  kind: EventKind
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <input type="checkbox" onChange={onChange} checked={checked}>
      <Tag color={colors[kind]}>
        <CheckboxIcon checked={checked} />
        {kind.replace("-", " ")}
      </Tag>
    </input>
  )
}
