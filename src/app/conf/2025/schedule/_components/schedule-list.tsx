"use client"

import { format, parseISO, compareAsc } from "date-fns"
import { ReactElement, useEffect, useState } from "react"

import { getEventTitle } from "@/app/conf/2023/utils"
import { SchedSpeaker } from "@/app/conf/2023/types"

import { Filters } from "./filters"
import {
  type ScheduleSession,
  CategoryName,
  ConcurrentSessions,
  ScheduleSessionsByDay,
} from "./session-list"
import { PinIcon } from "../../pixelarticons/pin-icon"
import { Tag } from "@/app/conf/_design-system/tag"

function isString(x: any) {
  return Object.prototype.toString.call(x) === "[object String]"
}

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
  year: "2025" | "2024"
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
      {showFilter && (
        <Filters
          categories={filterCategories}
          filterState={filtersState}
          onFilterChange={(category, option, checked) => {
            setFiltersState(prev => ({
              ...prev,
              [category]: checked
                ? [...prev[category as CategoryName], option]
                : prev[category as CategoryName].filter(
                    option => option !== option,
                  ),
            }))
          }}
          onReset={() => {
            setFiltersState({
              Audience: [],
              "Talk category": [],
              "Event type": [],
            })
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
                className="bg-neu-200 pt-px typography-body-sm dark:bg-neu-50"
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
                      <div className="mb-px mr-px flex flex-col max-lg:ml-px lg:flex-row">
                        <div className="relative border-neu-50 bg-neu-50 dark:bg-neu-0 max-lg:-mx-px max-lg:border-x lg:mr-px">
                          <span className="mt-3 inline-block w-20 whitespace-nowrap pb-0.5 pl-4 typography-body-sm lg:mr-6 lg:w-28 lg:pb-4 lg:pl-0">
                            {format(parseISO(sessionDate), "hh:mmaaaa 'PDT'")}
                          </span>
                        </div>
                        <div className="relative flex w-full flex-col items-end lg:flex-row lg:items-start lg:gap-px">
                          {sessions.map(session => (
                            <ScheduleSession
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

function ScheduleSession({
  session,
  showEventType,
  year,
  eventsColors,
}: {
  session: ScheduleSession
  showEventType: boolean | undefined
  year: "2025" | "2024"
  eventsColors: Record<string, string>
}) {
  const eventType = session.event_type.endsWith("s")
    ? session.event_type.slice(0, -1)
    : session.event_type

  const speakers = session.speakers
  const formattedSpeakers = isString(speakers || [])
    ? (speakers as string)?.split(",")
    : (speakers as SchedSpeaker[])?.map(e => e.name)

  const eventTitle = getEventTitle(
    // @ts-expect-error fixme
    session,
    formattedSpeakers,
  )

  const eventColor = eventsColors[session.event_type]

  return session.event_type === "Breaks" ? (
    <div className="flex size-full items-center bg-neu-0 px-4 py-2 font-normal">
      {showEventType ? eventType + " / " : ""}
      {eventTitle}
    </div>
  ) : (
    <a
      id={`session-${session.id}`}
      data-tooltip-id="my-tooltip"
      href={`/conf/${year}/schedule/${session.id}?name=${session.name}`}
      className="group relative size-full bg-neu-0 p-4 font-normal no-underline focus-visible:z-[1] max-lg:mt-px"
    >
      <span className="flex h-full flex-col justify-start">
        {eventColor && (
          <Tag className="mb-3" color={eventColor}>
            {eventType}
          </Tag>
        )}
        <span className="flex h-full flex-col justify-between gap-y-2">
          {showEventType ? eventType + " / " : ""}
          <span className="typography-body-md group-hover:underline">
            {eventTitle}
          </span>
          <span className="flex flex-col">
            {(speakers?.length || 0) > 0 && (
              <span className="typography-body-sm">
                {formattedSpeakers.join(", ")}
              </span>
            )}
            <span className="mt-2 flex items-center gap-0.5 typography-body-xs">
              <PinIcon className="size-4 text-pri-base" />
              {session.venue}
            </span>
          </span>
        </span>
      </span>
    </a>
  )
}
