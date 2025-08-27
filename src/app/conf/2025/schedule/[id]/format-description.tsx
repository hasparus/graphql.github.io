const URL_REGEX = /https?:\/\/[^\s]+/g
const LINK_REGEX = /<a\s+([^>]*href\s*=\s*[^>]*)>/gi

export function formatDescription(text: string): string {
  // we coerce all existing anchor tags to have target="_blank" rel="noopener noreferrer" and typography-link class
  const result = text.replace(LINK_REGEX, (_, attributes) => {
    let attrs = attributes

    if (!attrs.includes("target=")) {
      attrs += ' target="_blank"'
    }

    if (!attrs.includes("rel=")) {
      attrs += ' rel="noopener noreferrer"'
    }

    if (!attrs.includes("class=")) {
      attrs += ' class="typography-link"'
    } else if (!attrs.includes("typography-link")) {
      attrs = attrs.replace(
        /class\s*=\s*["']([^"']*)/gi,
        'class="$1 typography-link',
      )
    }

    return `<a ${attrs}>`
  })

  // then we format plain URLs that are not already inside an anchor tag
  return result.replace(URL_REGEX, (url, offset) => {
    const beforeUrl = result.slice(0, offset)
    const afterUrl = result.slice(offset + url.length)

    const lastOpenTag = beforeUrl.lastIndexOf("<")
    const lastCloseTag = beforeUrl.lastIndexOf(">")
    const nextCloseTag = afterUrl.indexOf(">")

    if (lastOpenTag > lastCloseTag && nextCloseTag !== -1) {
      return url
    }

    const displayUrl = url.replace(/^https?:\/\//, "")
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="typography-link">${displayUrl}</a>`
  })
}
