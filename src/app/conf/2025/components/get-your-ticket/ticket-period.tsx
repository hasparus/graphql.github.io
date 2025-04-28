import { Button } from "@/app/conf/_design-system/button"
import { clsx } from "clsx"

export interface TicketPeriodProps {
  price: string
  date: string
  disabled?: boolean
  name: string
}

export function TicketPeriod({
  price,
  date,
  disabled,
  name,
}: TicketPeriodProps) {
  return (
    <article
      className={clsx(
        "flex flex-col backdrop-blur-md [container-type:inline-size]",
        !disabled
          ? "border border-pink-200 bg-pri-dark/[0.24]"
          : "border-r border-pink-200/50 bg-white/[0.12] last:border-r-0",
      )}
    >
      <header className="p-6">
        <h3 className="text-white typography-h3">{name}</h3>
      </header>
      <div className="flex flex-col gap-6 p-6 pt-0">
        <div className="flex items-end justify-between gap-2">
          <span className="text-white typography-h2">{price}</span>
          <span className="text-white typography-body-md">{date}</span>
        </div>
        <Button variant="primary" disabled={disabled} className="w-full">
          Get a ticket
        </Button>
      </div>
    </article>
  )
}
