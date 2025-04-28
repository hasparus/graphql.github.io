"use client"

import { useState, useEffect } from "react"

import { TicketPeriod } from "./ticket-period"

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
        date={EARLY_BIRD_END_DATE}
        disabled={now > EARLY_BIRD_END_DATE}
      />
      <TicketPeriod
        name="Standard"
        price="$799"
        date={[new Date(2025, 6, 14), STANDARD_END_DATE]}
        disabled={now > STANDARD_END_DATE || now < EARLY_BIRD_END_DATE}
      />
      <TicketPeriod
        name="Late"
        price="$899"
        date={[new Date(2025, 8, 1), LATE_END_DATE]}
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
