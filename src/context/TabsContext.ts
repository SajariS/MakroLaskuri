import { createContext, useContext } from "react";

//Lisää tabejä uusien sivujen mukaan, järjestyksellä ei väliä
type TabId = 'dayPlanner' | 'testi'

type TabsContextType = {
    tab: TabId
    setTab: (tab: TabId) => void
}

export const TabsContext = createContext<TabsContextType | null>(null)

export const useTabs = () => {
    const context = useContext(TabsContext)
    if (!context) throw new Error("useTabs must be used inside TabsProvider!")
    return context
}