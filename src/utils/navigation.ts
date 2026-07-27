export type NavTab = {
  id: string
  label: string
}

export const getActiveTabId = (pathname: string, tabs: NavTab[]): string => {
  const fallbackTabId = tabs[0]?.id ?? ''
  const [, appPath, tabId] = pathname.split('/')

  if (appPath !== 'app') {
    return fallbackTabId
  }

  return tabs.some((tab) => tab.id === tabId) ? tabId : fallbackTabId
}
