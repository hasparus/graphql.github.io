import { ReactNode } from "react";

export function EventsScrollview({ children }: { children: ReactNode }) {
  return (
    <div className="xs:nextra-scrollbar relative -mx-6 flex gap-2 overflow-auto p-6 scrollview-fade-x-16 scrollview-fade sm:-mx-1 sm:px-1 lg:gap-4">
      {children}
    </div>
  )
}
