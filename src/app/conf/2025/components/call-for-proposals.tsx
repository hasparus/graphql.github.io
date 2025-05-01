"use client"
import clsx from "clsx"

import { useState, useEffect, ReactNode } from "react"
import Link from "next/link"
import { Button } from "../../_design-system/button"
import ArrowDownIcon from "../pixelarticons/arrow-down.svg?svgr"

function TabHeading({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h2 className={clsx("mb-4 text-2xl font-semibold", className)}>
      {children}
    </h2>
  )
}

function DatesTab() {
  return (
    <dl className="divide-y divide-neu-300 border border-neu-300">
      <DefinitionListItem term="CFP Opens" definition="Tuesday, 4 February" />
      <DefinitionListItem
        term="CFP Close"
        definition="Sunday, 11 May at 23:59 CEST (UTC+2)"
      />
      <DefinitionListItem
        term="CFP Notifications"
        definition="Monday, 9 June"
      />
      <DefinitionListItem
        term="Schedule Announced"
        definition="Wednesday, 11 June"
      />
      <DefinitionListItem
        term="Slides due date"
        definition="Friday, 5 September"
      />
      <DefinitionListItem
        term="Event Dates"
        definition="Monday, 8 September - Wednesday, 10 September, 2024"
      />
    </dl>
  )
}

function DefinitionListItem({
  className,
  term,
  definition,
}: {
  className?: string
  term: string
  definition: string
}) {
  return (
    <div className={clsx(className, "flex border-neu-200 typography-body-md")}>
      <dt className="flex w-[184.5px] shrink-0 items-center whitespace-pre border-r border-neu-300 bg-white/[0.79] p-4">
        {term}
      </dt>
      <dd className="flex flex-1 items-center bg-white/[0.48] p-4 backdrop-blur-[3px]">
        {definition}
      </dd>
    </div>
  )
}
function TopicsTab() {
  return (
    <div>
      <TabHeading className="mt-6">Suggested Topics</TabHeading>
      <ul className="list-disc space-y-2 pl-6">
        <li>GraphQL Working Group</li>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            GraphQL Specification (including incremental delivery, nullability)
          </li>
          <li>GraphQL-over-HTTP specification</li>
          <li>Federation specification</li>
          <li>
            Reference software (GraphQL.js, graphql-http, GraphiQL and LSP)
          </li>
        </ul>
        <li>GraphQL in Production</li>
        <ul className="list-disc space-y-2 pl-6">
          <li>Case studies</li>
          <li>Federation and Distributed Systems</li>
          <li>
            Schema evolution (including backwards compatibility and versioning)
          </li>
          <li>Security</li>
          <li>Scaling</li>
          <li>Observability, telemetry and tracing</li>
        </ul>
        <li>Developer Experience</li>
        <ul className="list-disc space-y-2 pl-6">
          <li>Frontend</li>
          <li>Backend</li>
          <li>Patterns and community trends</li>
          <li>Testing</li>
          <li>Documentation</li>
        </ul>
      </ul>
    </div>
  )
}

function NotesTab() {
  return (
    <div>
      <TabHeading className="mt-6">Important Notes</TabHeading>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          All speakers are required to adhere to our{" "}
          <Link
            className="underline hover:text-primary"
            href="/conf/2025/resources/#code-of-conduct"
          >
            Code of Conduct
          </Link>
          . We also highly recommend that speakers take our online{" "}
          <a
            className="underline hover:text-primary"
            target="_blank"
            href="https://training.linuxfoundation.org/linux-courses/open-source-compliance-courses/inclusive-speaker-orientation"
          >
            Inclusive Speaker Orientation Course
          </a>
          .
        </li>
        <li>
          Panel submissions must include the names of all participants in the
          initial submission to be considered. In an effort to promote speaker
          diversity, The Linux Foundation does not accept submissions with
          all-male panels, and speakers must not all be from the same company.
        </li>
        <li>
          Complimentary Passes For Speakers – One complimentary pass for the
          event will be provided for each accepted speaker.
        </li>
        <li>
          Avoid sales pitches and discussing unlicensed or potentially
          closed-source technologies when preparing your proposal; these talks
          are almost always rejected due to the fact that they take away from
          the integrity of our events, and are rarely well-received by
          conference attendees.
        </li>
        <li>
          All accepted speakers are required to submit their slides prior to the
          event.
        </li>
      </ul>
      <TabHeading className="mt-6">
        Preparing to Submit Your Proposal
      </TabHeading>
      <p className="mb-4">
        While it is not our intention to provide you with strict instructions on
        how to prepare your proposal, we hope you will take a moment to review
        the following guidelines that we have put together to help you prepare
        the best submission possible. To get started, here are three things that
        you should consider before submitting your proposal:
      </p>
      <ul className="mb-4 list-disc space-y-2 pl-6">
        <li>What are you hoping to get from your presentation?</li>
        <li>What do you expect the audience to gain from your presentation?</li>
        <li>How will your presentation help better the ecosystem?</li>
      </ul>
      <p>
        There are plenty of ways to give a presentation about projects and
        technologies without focusing on company-specific efforts. Remember the
        things to consider that we mentioned above when writing your proposal
        and think of ways to make it interesting for attendees while still
        letting you share your experiences, educate the community about an
        issue, or generate interest in a project.
      </p>
      <TabHeading className="mt-6">How to Give a Great Talk</TabHeading>
      <p>
        We want to make sure submitters receive resources to help put together a
        great submission and if accepted, give the best presentation possible.
        To help with this, we recommend viewing seasoned speaker Dawn Foster's
        in-depth talk:{" "}
        <a href="https://youtu.be/2I5fYBLCfUA" target="_blank">
          Getting Over Your Imposter Syndrome to Become a Conference Speaker –
          Dawn Foster, VMware
        </a>
        .
      </p>
      <TabHeading className="mt-6">
        Have More Questions? First Time Submitting? Don't Feel Intimidated
      </TabHeading>
      <p>
        Linux Foundation events are an excellent way to get to know the
        community and share your ideas and the work that you are doing and we
        strongly encourage first-time speakers to submit talks for our events.
        In the instance that you aren't sure about your abstract,{" "}
        <a href="mailto:cfp@linuxfoundation.org">reach out to us</a> and we will
        be more than happy to work with you on your proposal.
      </p>
    </div>
  )
}

function TypesTab() {
  return (
    <div>
      <TabHeading className="mt-6">Submission Types</TabHeading>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          Session Presentation: Typically 30 minutes in length, 1-2 speakers
          presenting on a topic
        </li>
        <li>
          Panel Discussion: Typically 30 minutes in length, 3-4 speakers
          presenting on a topic
        </li>
        <li>Birds of a Feather: Typically 45 minutes to 1 hour in length</li>
        <li>Lightning Talk: Typically 5-10 minutes in length</li>
        <li>Workshop: Typically 1-2 hours in length</li>
      </ul>
    </div>
  )
}

function ProcessTab() {
  return (
    <div>
      <TabHeading className="mt-6">The Talk Selection Process</TabHeading>
      <p className="mb-4">
        The GraphQL Foundation strives to select conference talks based on fair
        criteria in a transparent manner. There are three groups involved in the
        selection process, each with their own focus to help create an engaging
        and balanced conference schedule:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>The Technical Steering Committee (TSC)</li>
        <li>The new Subject Matter Experts initiative (SMEs)</li>
        <li>The Program Committee</li>
      </ul>
      <TabHeading className="mt-6">The Technical Steering Committee</TabHeading>
      <p className="mb-4">
        The TSC are a group of 11 individuals who are elected to serve a two
        year term to provide technical oversight of all GraphQL development
        efforts. When evaluating conference talks they{" "}
        <strong>focus on quality</strong> and use the following criteria:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Relevance</li>
        <li>Originality</li>
        <li>Soundness</li>
        <li>Quality of Presentation</li>
        <li>Importance</li>
      </ul>
      <TabHeading className="mt-6">Subject Matter Experts</TabHeading>
      <p className="mb-4">
        The SME initiative is new for 2025. This will be a panel of volunteers
        drawn from industry experts, working group members, security and
        observability experts, and maintainers and contributors to open source
        GraphQL projects. When evaluating the talks, they will{" "}
        <strong>focus on how exciting and engaging the talks are</strong> and
        use the following criteria:
      </p>
      <ul className="list-disc space-y-2 pl-6">
        <li>Subject Content</li>
        <li>Originality</li>
        <li>Audience Engagement</li>
      </ul>
      <TabHeading className="mt-6">The Program Committee</TabHeading>
      <p>
        The Program Committee is made up of representatives from the GraphQL
        Foundation board and interested members of the GraphQL community who
        have had experience organizing conferences. They shape the schedule from
        the highest-rated talks, ensuring balance across industries and
        affiliations, and also including a range of speaker experience and
        demographics, to ensure a varied and well-rounded representation of the
        GraphQL ecosystem.
      </p>
      <TabHeading className="mt-6">
        Have More Questions? First Time Submitting? Don't Feel Intimidated
      </TabHeading>
      <p>
        Linux Foundation events are an excellent way to get to know the
        community and share your ideas and the work that you are doing and we
        strongly encourage first-time speakers to submit talks for our events.
        In the instance that you aren't sure about your abstract, reach out to
        us and we will be more than happy to work with you on your proposal.
      </p>
    </div>
  )
}

const tabs = {
  dates: <DatesTab />,
  topics: <TopicsTab />,
  types: <TypesTab />,
  notes: <NotesTab />,
  process: <ProcessTab />,
}

type Tab = keyof typeof tabs

const tabsInOrder: Tab[] = ["dates", "topics", "types", "notes", "process"]

export function CallForProposals() {
  const [buttonText, setButtonText] = useState("Submit a Proposal")
  const [isDisabled, setIsDisabled] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("dates")

  useEffect(() => {
    const checkDate = () => {
      const currentDate = new Date()
      const closingDate = new Date("2025-05-12T00:00:00Z")
      if (currentDate >= closingDate) {
        setButtonText("CFP Closed")
        setIsDisabled(true)
      }
    }

    checkDate()
    const timer = setInterval(checkDate, 60000) // Check every minute

    return () => clearInterval(timer)
  }, [])

  return (
    <section id="speakers" className="gql-conf-section gql-conf-container">
      <div className="flex p-4 *:basis-1/2 max-md:flex-col">
        <div className="border-sec-dark bg-sec-light dark:border-sec-lighter md:border-r md:p-8 lg:p-16">
          <h1 className="typography-h2">Call for Proposals</h1>
          <p className="mt-6 md:mt-10">
            Putting on an amazing conference depends on great content, which is
            where you come in! Join other GraphQL leaders and community members
            as a presenter by submitting to our Call for Proposals (CFP) and
            sharing your experience across a wide range of topics. Please click
            through all of the tabs below before submitting a proposal.
          </p>
          <p className="mt-6">
            For any questions regarding the CFP process, please email{" "}
            <a
              href="mailto:cfp@linuxfoundation.org"
              className="text-neu-800 underline hover:no-underline"
            >
              cfp@linuxfoundation.org
            </a>
            .
          </p>
          <p className="mt-6 typography-body-sm md:mt-10">
            Please be aware that the Linux Foundation uses Sessionize for CFP
            submissions. Sessionize is a cloud-based event content management
            software designed to be intuitive and user-friendly. If you need
            guidance, please review{" "}
            <a
              target="_blank"
              href="https://sessionize.com/playbook/submit-your-session-for-an-event"
              className="text-neu-800 underline hover:no-underline"
            >
              how to submit your session
            </a>{" "}
            for an event to see step-by-step instructions and helpful
            screenshots.
          </p>
          <Button
            disabled={isDisabled}
            variant="primary"
            href="https://sessionize.com/graphqlconf-2025?utm_medium=website&utm_campaign=speaker_section"
            className={clsx(
              "mt-6 md:mt-10",
              isDisabled && "cursor-not-allowed",
            )}
          >
            {buttonText}
          </Button>
        </div>
        <article className="flex h-auto flex-col bg-[#C6F267]">
          <div
            role="tablist"
            className="flex divide-sec-dark border-b border-sec-dark *:flex-1 md:divide-x"
          >
            {tabsInOrder.map((tab, i) => (
              <button
                key={tab}
                tabIndex={i === 0 ? 0 : -1}
                role="tab"
                aria-selected={activeTab === tab}
                className="gql-focus-visible flex items-center justify-between px-3 py-4 typography-body-lg hover:bg-sec-light focus:outline-none aria-selected:bg-sec-light"
                onFocus={() => setActiveTab(tab)}
                onKeyDown={arrowsMoveSideways}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <ArrowDownIcon className="ml-2 size-6 text-sec-darker opacity-0 [[aria-selected=true]>&]:opacity-100" />
              </button>
            ))}
          </div>
          <div className="flex flex-1 items-center justify-center md:p-8 lg:p-16">
            {tabs[activeTab]}
          </div>
        </article>
      </div>
    </section>
  )
}

function arrowsMoveSideways(event: React.KeyboardEvent<HTMLButtonElement>) {
  if (event.key === "ArrowLeft") {
    const previousElement = event.currentTarget.previousElementSibling
    if (previousElement) {
      ;(previousElement as HTMLElement).focus()
    }
  } else if (event.key === "ArrowRight") {
    const nextElement = event.currentTarget.nextElementSibling
    if (nextElement) {
      ;(nextElement as HTMLElement).focus()
    }
  }
}
