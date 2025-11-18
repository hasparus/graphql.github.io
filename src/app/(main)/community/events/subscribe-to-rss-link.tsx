import rssImage from "./rss.png"

export function SubscribeToRssLink() {
  return (
    <a href="/community/events/feed.xml" className="flex items-center">
      <span>Subscribe to Events RSS</span>
      <img
        src={rssImage.src}
        alt="RSS Feed"
        className="ml-2"
        width={24}
        height={24}
      />
    </a>
  )
}
