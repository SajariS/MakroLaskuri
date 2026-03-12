import { createContext } from "react"

type LangContextType = {lang: string, texts: Record<string, string> | null, changeLang: (lang: string) => void}

// "Turha" default TS:ää varten, sama yllä olevalle tyypille. Oikeat arvot ja funktio haetaan providerissä.
export const LangContext = createContext<LangContextType>({
    lang: "fi",
    texts: null,
    changeLang: () => {}
})