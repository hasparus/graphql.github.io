import { findBestMatch } from "string-similarity"
import { videos } from "../../_videos"
import { ScheduleSession } from "@/app/conf/2023/types"

export interface SessionVideoProps {
  eventTitle: string
  event: ScheduleSession
}

export function SessionVideo({ eventTitle, event }: SessionVideoProps) {
  const result = findBestMatch(
    `${eventTitle} ${event.speakers!.map(e => e.name).join(" ")}`,
    videos.map(e => e.title),
  )

  if (result.ratings[result.bestMatchIndex].rating < 0.17) {
    return null
  }

  const recordingTitle = result.bestMatch

  const videoId = videos.find(e => e.title === recordingTitle.target)?.id

  if (!videoId) {
    throw new Error(`Video "${recordingTitle.target}" not found`)
  }

  return (
    <iframe
      className="mx-auto mt-6 aspect-video w-full"
      src={`https://youtube.com/embed/${videoId}`}
      title={recordingTitle.target}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  )
}
