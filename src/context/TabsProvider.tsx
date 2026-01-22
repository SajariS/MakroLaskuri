import { useState, type ReactNode } from "react";
import { TabsContext } from "./TabsContext";

//Lisää tabejä uusien sivujen mukaan, järjestyksellä ei väliä
type TabId = 'dayPlanner' | 'testi'

type TabsProviderProps = { children: ReactNode}

export default function TabsProvider({ children }: TabsProviderProps) {

    const [tab, setTab] = useState<TabId>("dayPlanner")

    return(
        <TabsContext.Provider value={{ tab, setTab }}>
            {children}
        </TabsContext.Provider>
    )
}