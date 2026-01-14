import { createContext, useEffect, useState, type ReactNode } from "react";
import { getSettings, setSettings } from "../services/settingsHandler";

type LangContextType = {lang: string, texts: Record<string, string> | null, changeLang: (lang: string) => void}

type LangProviderProps = { children: ReactNode }

// "Turha" default TS:ää varten, sama yllä olevalle tyypille. Oikeat arvot ja funktio haetaan providerissä.
const LangContext = createContext<LangContextType>({
    lang: "fi",
    texts: null,
    changeLang: () => {}
})

export default function LangProvider(props: LangProviderProps) {
    const { children } = props

    const [lang, setLang] = useState<string>("fi")
    const [texts, setTexts] = useState<Record<string, string> | null>(null)

    const loadTexts = async(language: string) => {
        try {
            let module
            switch (language) {
                case "en":
                    module = await import("../i18n/en.json")
                    break
                case "sv":
                    module = await import("../i18n/sv.json")
                    break
                default:
                    module = await import("../i18n/fi.json")
            }
            setTexts(module.default as Record<string, string>)
        }
        catch (err) {
            console.error("Failed to load texts for language", language, err)
        }
    }

    const changeLang = async (newLang: string) => {
        if (newLang === lang) return

        setLang(newLang)
        const oldSettings = await getSettings()
        await setSettings({...oldSettings, lang: newLang})
        await loadTexts(newLang)
    }

    useEffect(() => {
        const initLang = async() => {
            const settings = await getSettings()
            const initialLang = settings.lang || "fi"
            setLang(initialLang)
            await loadTexts(initialLang)
        }
        initLang()
    }, [])

    return (
        <LangContext.Provider value={{ lang, texts, changeLang}}>
            {children}
        </LangContext.Provider>
    )
}