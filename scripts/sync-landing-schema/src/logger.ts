function formatMessage(message: string, context?: string): string {
  const timestamp = new Date().toLocaleTimeString()
  const prefix = context ? `${timestamp} | ${context} |` : `${timestamp} |`
  return `${prefix} ${message}`
}

export function log(message: string, context?: string): void {
  console.log(formatMessage(message, context))
}

export function warn(message: string, context?: string): void {
  console.warn(formatMessage(message, context))
}

export function error(message: string, context?: string): void {
  console.error(formatMessage(message, context))
}
