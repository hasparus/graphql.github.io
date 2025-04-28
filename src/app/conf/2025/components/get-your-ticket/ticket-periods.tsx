"use client"

import { useState } from "react"
import { useEffect } from "react"
import { TicketPeriod } from "./ticket-period"
import { useSyncExternalStore } from "react"

// The registration deadline is 23:59 Central European Time on the respective date.
// Ticket period end dates (using zero-indexed months)
const EARLY_BIRD_END_DATE = new Date(2025, 6, 13, 23, 59) // July 13th
const STANDARD_END_DATE = new Date(2025, 7, 31, 23, 59) // August 31st
const LATE_END_DATE = new Date(2025, 8, 10, 23, 59) // September 10th

export function TicketPeriods() {
  const now = useCurrentDate()

  return (
    <>
      <TicketPeriod
        name="Early Bird"
        price="$599"
        date="Through 13 July"
        disabled={now > EARLY_BIRD_END_DATE}
      />
      <TicketPeriod
        name="Standard"
        price="$799"
        date="14 July - 31 August"
        disabled={now > STANDARD_END_DATE || now < EARLY_BIRD_END_DATE}
      />
      <TicketPeriod
        name="Late"
        price="$899"
        date="1 September - 10 September"
        disabled={now > LATE_END_DATE || now < STANDARD_END_DATE}
      />
    </>
  )
}

const DEFAULT_DATE = new Date(2025, 8, 12)

function useCurrentDate() {
  const [date, setDate] = useState<Date>(DEFAULT_DATE)

  useEffect(() => {
    setDate(new Date())
  }, [])

  return date
}
