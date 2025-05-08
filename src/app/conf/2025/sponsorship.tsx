import { InfoGrid } from "../_components/info-grid"
import { Button } from "../_design-system/button"

export function Sponsor() {
  return (
    <section id="sponsors" className="gql-conf-section">
      <InfoGrid
        title="Become a Sponsor"
        subtitle="Connect with the global GraphQL community and showcase your brand to industry leaders and decision-makers."
        listItems={[
          {
            title: "Brand Visibility",
            description:
              "Showcase your brand to thousands of GraphQL enthusiasts and decision-makers.",
          },

          {
            title: "Lead Generation",
            description:
              "Connect with potential customers and partners in the GraphQL ecosystem.",
          },
          {
            title: "Thought Leadership",
            description:
              "Position your company as a leader in the GraphQL space.",
          },
          {
            title: "Talent Acquisition",
            description:
              "Meet and recruit top GraphQL developers and engineers.",
          },
          {
            title: "Product Feedback",
            description: "Gather valuable feedback from the GraphQL community.",
          },
          {
            title: "Community Impact",
            description: "Support and shape the future of GraphQL technology.",
          },
        ]}
      />

      <div className="mt-4 flex justify-center xl:mt-8">
        <Button
          href="https://events.linuxfoundation.org/sponsor-GraphQLConf-25?utm_source=graphql_conf_2025&utm_medium=website&utm_campaign=sponsor_section"
          target="_blank"
          rel="noreferrer"
        >
          Download Prospectus
        </Button>
      </div>
    </section>
  )
}
