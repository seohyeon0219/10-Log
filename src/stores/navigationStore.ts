import { create } from 'zustand'
import { navTabs } from '../constants/navigation'

type NavTab = {
  id: string
  label: string
}

type NavigationStore = {
  tabs: NavTab[]
}

export const useNavigationStore = create<NavigationStore>(() => ({
  tabs: navTabs,
}))
