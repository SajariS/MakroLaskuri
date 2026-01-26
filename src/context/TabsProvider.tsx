import { useState, type ReactNode } from "react";
import { TabsContext, type TabId } from "./TabsContext";

const TABS_KEY = 'tabs'

type TabsProviderProps = { children: ReactNode}

export default function TabsProvider({ children }: TabsProviderProps) {

    const [tab, setTab] = useState<TabId>(() => {
        return (localStorage.getItem(TABS_KEY) as TabId) ?? 'DayPlanner'
    })

    return(
        <TabsContext.Provider value={{ tab, setTab }}>
            {children}
        </TabsContext.Provider>
    )
}