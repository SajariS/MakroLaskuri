import { useEffect, useState, type ReactNode } from "react";
import { createDefaultSettings, getSettings, setSettings } from "../services/settingsHandler";
import { LangContext } from "./LangContext";

type LangProviderProps = { children: ReactNode }

export default function LangProvider({ children }: LangProviderProps) {

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
            console.log(settings)
            if (!settings) {
                const defaultSettings = createDefaultSettings()
                await setSettings(defaultSettings)
                setLang(defaultSettings.lang)
                await loadTexts(defaultSettings.lang)
            }
            else {
                setLang(settings.lang)
                await loadTexts(settings.lang)
            }
        }
        initLang()
    }, [])

    return (
        <LangContext.Provider value={{ lang, texts, changeLang}}>
            {children}
        </LangContext.Provider>
    )
}