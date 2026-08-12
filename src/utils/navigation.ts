export type NavTab = {
  id: string
  label: string
}

const TAB_ALIASES: Record<string, string> = {
  review: 'assets',
}

export const getActiveTabId = (pathname: string, tabs: NavTab[]): string => {
  const fallbackTabId = tabs[0]?.id ?? ''
  const [, appPath, tabId] = pathname.split('/')

  if (appPath !== 'app') {
    return fallbackTabId
  }

  const resolvedId = TAB_ALIASES[tabId] ?? tabId
  return tabs.some((tab) => tab.id === resolvedId) ? resolvedId : fallbackTabId
}
