import { create } from 'zustand'
import { mockNavTabs } from '../mocks/data'

type NavTab = {
  id: string
  label: string
}

type NavigationStore = {
  tabs: NavTab[]
}

export const useNavigationStore = create<NavigationStore>(() => ({
  tabs: mockNavTabs,
}))
