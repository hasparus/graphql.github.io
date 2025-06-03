import { ScheduleSession } from "@/app/conf/2023/types"
import clsx from "clsx"

export interface LongSessionCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  session: ScheduleSession
  year: `20${number}`
}

export function LongSessionCard({
  session,
  className,
  year,
  ...rest
}: LongSessionCardProps) {
  return (
    <div className={clsx(className)} {...rest}>
      LongSessionCard {year}
    </div>
  )
}
