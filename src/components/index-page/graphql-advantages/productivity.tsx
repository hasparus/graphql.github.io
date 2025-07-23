const VIDEOS_DIR =
  "https://github.com/graphql/graphql.github.io/raw/refs/heads/source/public/img"

export function ProductivityFigure() {
  return (
    <div className="flex w-full items-center bg-gradient-to-b from-pri-lighter/[.05] to-pri-lighter/20 px-[14px] py-[30px] dark:from-sec-darker/[.01] dark:to-pri-light/5">
      <div className="overflow-hidden rounded-lg shadow-[0px_0px_20px_0px_rgba(153,0,105,0.20)] dark:shadow-[0px_0px_20px_0px_hsl(218deg,60.3%,17.5%,.2)] dark:saturate-[.75]">
        <video
          disablePictureInPicture
          autoPlay
          muted
          loop
          playsInline
          className="hidden dark:block"
        >
          <source src={`${VIDEOS_DIR}/graphiql-dark.mp4`} type="video/mp4" />
        </video>
        <video
          disablePictureInPicture
          autoPlay
          muted
          loop
          playsInline
          className="block dark:hidden"
        >
          <source src={`${VIDEOS_DIR}/graphiql-light.mp4`} type="video/mp4" />
        </video>
      </div>
    </div>
  )
}
