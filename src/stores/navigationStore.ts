import { create } from 'zustand'
import { navTabs } from '../constants/navigation'
import type { NavTab } from '../utils/navigation'

type NavigationStore = {
  tabs: NavTab[]
}

export const useNavigationStore = create<NavigationStore>(() => ({
  tabs: navTabs,
}))
