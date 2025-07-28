import { SectionLabel } from "@/app/conf/_design-system/section-label"
import { ComponentTree } from "./component-tree"

export function DataColocation() {
  return (
    <section className="gql-container gql-section flex flex-wrap xl:p-24">
      <div>
        <header>
          <SectionLabel>Data Colocation</SectionLabel>
          <h2 className="typography-h2 mt-6">Data Colocation</h2>
          <p className="typography-body-md mt-6">
            GraphQL fragments let you reuse common field selections across
            queries, making your code more maintainable and consistent.
          </p>
        </header>
        <ComponentTree
          className="mt-6 lg:mt-12 xl:mt-16"
          names={[
            "Server",
            "<FriendList>",
            "<FriendListItem>",
            "<FriendInfo/>",
          ]}
        />
      </div>
    </section>
  )
}
