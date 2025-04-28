import { clsx } from "clsx"
import { TicketPeriods } from "./ticket-periods"

export function GetYourTicket({ className }: { className?: string }) {
  return (
    <section
      className={clsx(
        "dark relative overflow-hidden bg-pri-dark px-4 py-8 lg:py-16 xl:py-24",
        className,
      )}
    >
      <div className="gql-conf-container lg:px-12 xl:gap-x-24 xl:px-24">
        <header className="flex flex-wrap justify-between gap-6 md:items-end">
          <h2 className="whitespace-pre text-white typography-h2">
            Get your ticket
          </h2>
          <p className="text-neu-800 typography-body-md">
            The registration deadline is 23:59 Central European Time on the
            respective date.
          </p>
        </header>

        <div className="mt-6 grid gap-px backdrop-blur-[6px] md:mt-10 md:grid-cols-3">
          <TicketPeriods />
        </div>
      </div>
    </section>
  )
}
