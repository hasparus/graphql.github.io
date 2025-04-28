import { Button } from "@/app/conf/_design-system/button"
import { clsx } from "clsx"
import { GET_TICKETS_LINK } from "../../links"

export interface TicketPeriodProps {
  price: string
  date: Date | [Date, Date]
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
        "@container/card flex flex-col border border-pri-lighter bg-pri-light/[0.24] backdrop-blur-md transition [&+&]:border-l-0",
        disabled && "opacity-50",
      )}
    >
      <header className="border-b border-pri-lighter p-6">
        <h3 className="text-white typography-h3">{name}</h3>
      </header>
      <div className="flex h-full flex-col justify-end gap-6 p-6">
        <div className="flex items-end justify-between gap-2">
          <span className="@[356px]:typography-h2 text-white typography-h3">
            {price}
          </span>
          {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
          <span className="ticket-period--date text-right text-white typography-body-md">
            {Array.isArray(date) ? (
              <>
                <Time date={date[0]} />
                {" - "}
                <Time date={date[1]} />
              </>
            ) : (
              <Time date={date} />
            )}
          </span>
        </div>
        <Button
          variant="primary"
          disabled={disabled}
          className="light w-full"
          href={GET_TICKETS_LINK}
        >
          Get a ticket
        </Button>
      </div>
    </article>
  )
}

function Time({ date }: { date: Date }) {
  return (
    <time
      dateTime={date.toISOString()}
      dangerouslySetInnerHTML={{
        __html: date
          .toLocaleDateString("en-GB", {
            month: "long",
            day: "numeric",
          })
          .replace(" ", "&nbsp"),
      }}
    />
  )
}
