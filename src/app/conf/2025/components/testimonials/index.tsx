import { clsx } from "clsx"
import Image from "next-image-export-optimizer"

export interface TestimonialsProps extends React.HTMLAttributes<HTMLElement> {}

interface Testimonial {
  quote: string
  author: {
    name: string
    role: string
    avatar: string
  }
}

const testimonials: Testimonial[] = [
  {
    quote:
      "GraphQL has transformed how we build and scale our APIs at Netflix. By allowing our teams to fetch exactly the data they need, we've improved performance, reduced API complexity, and accelerated development cycles.",
    author: {
      name: "Saihajpreet Singh",
      role: "The Guild",
      avatar: "https://avatars.githubusercontent.com/u/44710980?v=4",
    },
  },
  {
    quote:
      "GraphQL has transformed how we build and scale our APIs at Netflix. By allowing our teams to fetch exactly the data they need, we've improved performance, reduced API complexity, and accelerated development cycles.",
    author: {
      name: "Saihajpreet Singh",
      role: "The Guild",
      avatar: "https://avatars.githubusercontent.com/u/44710980?v=4",
    },
  },
  {
    quote:
      "GraphQL has transformed how we build and scale our APIs at Netflix. By allowing our teams to fetch exactly the data they need, we've improved performance, reduced API complexity, and accelerated development cycles.",
    author: {
      name: "Saihajpreet Singh",
      role: "The Guild",
      avatar: "https://avatars.githubusercontent.com/u/44710980?v=4",
    },
  },
]

export function Testimonials({ className, ...rest }: TestimonialsProps) {
  return (
    <section
      className={clsx(
        "gql-conf-container py-8 max-md:px-4 md:pb-16 md:pt-24 md:[mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]",
        className,
      )}
      {...rest}
    >
      <h2 className="text-center text-neu-800 typography-h2">
        How was the previous edition?
      </h2>
      <div className="flex w-full snap-x snap-mandatory flex-row gap-10 overflow-x-auto px-4 py-6 lg:mt-16 lg:py-16">
        {testimonials.map((testimonial, i) => (
          <div
            key={i}
            className="flex shrink-0 snap-start flex-row-reverse items-center gap-6 max-md:flex-col md:px-10"
          >
            <div>
              <p className="max-w-[calc(100vw-16px)] typography-body-lg max-md:text-center md:max-w-[544px] xl:text-2xl">
                {testimonial.quote}
              </p>
              <AuthorNameAndRole
                author={testimonial.author}
                className="mt-4 max-md:hidden"
              />
            </div>
            <TestimonialAuthor author={testimonial.author} />
          </div>
        ))}
      </div>
    </section>
  )
}

function TestimonialAuthor({ author }: { author: Testimonial["author"] }) {
  return (
    <div className="relative flex shrink-0 flex-col items-center justify-center whitespace-pre md:px-6 lg:h-full lg:px-8">
      {/* todo: pink tint */}
      <Image
        src={author.avatar}
        alt={author.name}
        width={128}
        height={128}
        className="size-16 xl:size-32"
      />
      <AuthorNameAndRole author={author} className="contents md:hidden" />
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-pri-lighter to-transparent max-md:hidden" />
    </div>
  )
}

function AuthorNameAndRole({
  author,
  className,
}: {
  author: Testimonial["author"]
  className?: string
}) {
  return (
    <div className={className}>
      <div className="mt-3 typography-body-sm">{author.name}</div>
      <div className="text-neu-700 typography-body-xs">{author.role}</div>
    </div>
  )
}
