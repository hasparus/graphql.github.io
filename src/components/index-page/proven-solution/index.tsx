import { ImageLoaded } from "@/app/conf/2025/components/image-loaded"
import { Button } from "@/app/conf/_design-system/button"
import { SectionLabel } from "@/app/conf/_design-system/section-label"
import CheckIcon from "@/app/conf/_design-system/pixelarticons/check.svg?svgr"

import blurBean from "./blur-bean.webp"

export function ProvenSolution() {
  return (
    <section className="gql-container relative overflow-hidden bg-pri-dark text-white dark:bg-pri-darker xl:py-20">
      <Stripes />
      <div className="gql-section relative">
        <SectionLabel className="mb-6 !text-sec-light">
          Business perspective
        </SectionLabel>
        <h2 className="typography-h2 mb-6 lg:mb-16">
          A proven solution for startups and enterprises
        </h2>
        <div className="mb-12 grid gap-y-6 lg:grid-cols-3 lg:[&>*:not(:first-child)]:border-l-0">
          <ProvenSolutionCard
            title={
              <>
                The best user
                <br className="max-lg:hidden" />
                experience
              </>
            }
            description="Deliver high-performing user experiences at scale. The world’s leading apps use GraphQL to create faster, more responsive digital experiences."
            bullets={[
              "Faster data retrieval and load times",
              "Improved bandwith efficiency",
            ]}
          />
          <ProvenSolutionCard
            title={
              <>
                Stability &<br className="max-lg:hidden" />
                Security
              </>
            }
            description="Protect your APIs while maintaining full visibility into data consumption. GraphQL allows you to monitor, secure, and optimize API usage while ensuring compliance."
            bullets={[
              "Stronger access control",
              "Improved business intelligence & cost analysis",
            ]}
          />
          <ProvenSolutionCard
            title="Efficient distributed development"
            description="Let your teams ship faster with GraphQL’s flexible, decoupled architecture. GraphQL allows frontend and backend teams to work independently and efficiently."
            bullets={[
              "More rapid iterations",
              "Improved cross-team collaboration",
            ]}
          />
        </div>
        <Button className="mx-auto mt-8 w-fit lg:mt-16" href="/learn">
          Learn more
        </Button>
      </div>
    </section>
  )
}

function ProvenSolutionCard({
  title,
  description,
  bullets,
}: {
  title: React.ReactNode
  description: React.ReactNode
  bullets: string[]
}) {
  return (
    <div className="flex flex-col border border-pri-light bg-pri-lighter/20 backdrop-blur-md dark:bg-pri-base/20">
      <h3 className="typography-h3 border-b border-pri-light p-6">{title}</h3>
      <p className="typography-body-lg p-6">{description}</p>
      <ul className="typography-body-md mt-auto flex flex-col gap-2 p-6 pt-0">
        {bullets.map(bullet => (
          <li key={bullet} className="flex items-center gap-2">
            <CheckIcon className="size-4 shrink-0 text-sec-base" aria-hidden />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const maskEven =
  "repeating-linear-gradient(to right, transparent, transparent 12px, black 12px, black 24px)"
const maskOdd =
  "repeating-linear-gradient(to right, black, black 12px, transparent 12px, transparent 24px)"

function Stripes() {
  return (
    <ImageLoaded
      role="presentation"
      image={blurBean}
      className="pointer-events-none absolute inset-x-0 bottom-[-385px] top-[-203px] translate-y-12 opacity-0 transition duration-[400ms] ease-linear [mask-position:70%_60%] [mask-size:cover] data-[loaded=true]:translate-y-0 data-[loaded=true]:opacity-100 max-3xl:[mask-size:220%] max-md:[mask-size:800%]"
      style={{
        maskImage: `url(${blurBean.src})`,
        WebkitMaskImage: `url(${blurBean.src})`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    >
      {/* TODO: StripesDecoration with proper colors for dark mode. */}
      {/* light-1: background: linear-gradient(180deg, rgba(255, 204, 239, 0.20) 0%, var(--Primary-Base, #E10098) 100%);
       */}
      {/* light-2: background: linear-gradient(180deg, var(--Primary-Light, #FF99DF) 0%, var(--Primary-Lighter, #FFCCEF) 100%); */}
      {/* dark-1: background: linear-gradient(180deg, var(--Primary-Base, #E10098) 0%, var(--Primary-Darker, #660046) 100%);
// dark 2: background: linear-gradient(180deg, var(--Primary-Darker, #660046) 0%, var(--Primary-Base, #E10098) 100%);
 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, hsl(var(--color-pri-light)) 0%, hsl(var(--color-pri-lighter)) 100%)",
          maskImage: maskEven,
          WebkitMaskImage: maskEven,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg,hsl(319deg 100% 90% / 0.2) 0%, hsl(var(--color-pri-base)) 100%)",
          maskImage: maskOdd,
          WebkitMaskImage: maskOdd,
        }}
      />
    </ImageLoaded>
  )
}
