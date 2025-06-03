import { ScheduleSession } from "@/app/conf/2023/types"

export interface LongSessionCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  session: ScheduleSession
}

export function LongSessionCard({ session, className }: LongSessionCardProps) {
  return <div>LongSessionCard</div>
}
