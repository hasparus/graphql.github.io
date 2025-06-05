"use client"

import { format, parseISO, compareAsc } from "date-fns"
import { ReactElement, useEffect, useState } from "react"

import { Filters, ResetFiltersButton } from "./filters"
import {
  type ScheduleSession,
  CategoryName,
  ConcurrentSessions,
  ScheduleSessionsByDay,
} from "./session-list"
import { ScheduleSessionCard } from "./schedule-session-card"

function getSessionsByDay(
  scheduleData: ScheduleSession[],
  initialFilter:
    | ((sessions: ScheduleSession[]) => ScheduleSession[])
    | undefined,
  filters: Record<CategoryName, string[]>,
) {
  const data = initialFilter ? initialFilter(scheduleData) : scheduleData
  const filteredSortedSchedule = (data || []).sort((a, b) =>
    compareAsc(new Date(a.event_start), new Date(b.event_start)),
  )

  const concurrentSessions: ConcurrentSessions = {}
  filteredSortedSchedule.forEach(session => {
    const audienceFilter = filters.Audience
    const talkCategoryFilter = filters["Talk category"]
    const eventTypeFilter = filters["Event type"]

    let include = true
    if (audienceFilter.length > 0) {
      include = include && audienceFilter.includes((session as any).company)
    }
    if (talkCategoryFilter.length > 0) {
      include = include && talkCategoryFilter.includes(session.event_type)
    }
    if (eventTypeFilter.length > 0) {
      include = include && eventTypeFilter.includes(session.audience)
    }

    if (!include) {
      return
    }

    if (!concurrentSessions[session.event_start]) {
      concurrentSessions[session.event_start] = []
    }
    concurrentSessions[session.event_start].push(session)
  })

  const sessionsByDay: ScheduleSessionsByDay = {}
  Object.entries(concurrentSessions).forEach(([date, sessions]) => {
    const day = date.split(" ")[0]
    if (!sessionsByDay[day]) {
      sessionsByDay[day] = {}
    }
    sessionsByDay[day] = {
      ...sessionsByDay[day],
      [date]: sessions.sort((a, b) =>
        (a?.venue ?? "").localeCompare(b?.venue ?? ""),
      ),
    }
  })

  return sessionsByDay
}

interface Props {
  showEventType?: boolean
  showFilter?: boolean
  scheduleData: ScheduleSession[]
  filterSchedule?: (sessions: ScheduleSession[]) => ScheduleSession[]
  year: `202${number}`
  eventsColors: Record<string, string>
  filterCategories: {
    name: CategoryName
    options: string[]
  }[]
}

export function ScheduleList({
  showEventType,
  showFilter = true,
  filterSchedule,
  scheduleData,
  year,
  eventsColors,
  filterCategories,
}: Props): ReactElement {
  const [filtersState, setFiltersState] = useState<
    Record<CategoryName, string[]>
  >({
    Audience: [],
    "Talk category": [],
    "Event type": [],
  })
  const [sessionsState, setSessionState] = useState<ScheduleSessionsByDay>(
    () => {
      return getSessionsByDay(scheduleData, filterSchedule, filtersState)
    },
  )

  useEffect(() => {
    setSessionState(
      getSessionsByDay(scheduleData, filterSchedule, filtersState),
    )
  }, [filtersState, scheduleData])

  return (
    <>
      <div className="flex justify-between gap-1 max-lg:flex-col">
        <BookmarkOnSched year={year} />
        <ResetFiltersButton
          filters={filtersState}
          onReset={() =>
            setFiltersState({
              Audience: [],
              "Talk category": [],
              "Event type": [],
            })
          }
        />
      </div>
      {showFilter && (
        <Filters
          categories={filterCategories}
          filterState={filtersState}
          onFilterChange={(category, newSelectedOptions) => {
            setFiltersState(prev => ({
              ...prev,
              [category]: newSelectedOptions,
            }))
          }}
        />
      )}
      {Object.entries(sessionsState).length === 0 ? (
        <div className="typography-body-sm">
          <h3 className="mb-5">No sessions found</h3>
        </div>
      ) : (
        <>
          <div className="mb-4 flex space-x-4">
            {/* Skip registeration prior day for graphql conf 2024 */}
            {Object.keys(sessionsState)
              .slice(year === "2024" ? 1 : 0)
              .map((date, index) => (
                <a
                  href={`#day-${(year === "2024" ? 1 : 0) + index + 1}`}
                  key={date}
                  className={"typography-link"}
                >
                  Day {index + 1}
                </a>
              ))}
          </div>
          {Object.entries(sessionsState).map(
            ([date, concurrentSessionsGroup], index) => (
              <div
                key={date}
                className="typography-body-sm bg-neu-200 pt-px dark:bg-neu-50"
              >
                <h3
                  className="bg-neu-50 py-4 dark:bg-neu-0 lg:mb-px"
                  id={`day-${index + 1}`}
                >
                  {format(parseISO(date), "EEEE, MMMM d")}
                </h3>
                {Object.entries(concurrentSessionsGroup).map(
                  ([sessionDate, sessions]) => (
                    <div key={`concurrent sessions on ${sessionDate}`}>
                      <div className="mr-px flex flex-col max-lg:ml-px lg:mb-px lg:flex-row">
                        <div className="relative border-neu-50 bg-neu-50 dark:bg-neu-0 max-lg:-mx-px max-lg:mt-px max-lg:border-x lg:mr-px">
                          <span className="typography-body-sm mt-3 inline-block w-20 whitespace-nowrap pb-0.5 pl-4 lg:mr-6 lg:w-28 lg:pb-4 lg:pl-0">
                            {format(parseISO(sessionDate), "hh:mmaaaa 'PDT'")}
                          </span>
                        </div>
                        <div className="relative flex w-full flex-col items-end gap-px lg:flex-row lg:items-start">
                          {sessions.map(session => (
                            <ScheduleSessionCard
                              key={session.id}
                              session={session}
                              showEventType={showEventType}
                              year={year}
                              eventsColors={eventsColors}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ),
          )}
        </>
      )}
    </>
  )
}

function BookmarkOnSched({ year }: { year: `202${number}` }) {
  return (
    <a
      href={`https://graphqlconf${year}.sched.com`}
      target="_blank"
      rel="noreferrer"
      className="typography-link mb-8 block w-fit decoration-neu-400"
    >
      Bookmark sessions & plan your days on Sched
      <svg
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="m-1 mb-2 inline-block size-4"
      >
        <path
          d="M21 11V3h-8v2h4v2h-2v2h-2v2h-2v2H9v2h2v-2h2v-2h2V9h2V7h2v4h2zM11 5H3v16h16v-8h-2v6H5V7h6V5z"
          fill="currentColor"
        />
      </svg>
    </a>
  )
}
