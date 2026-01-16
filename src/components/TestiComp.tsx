import { useContext } from "react"
import { LangContext } from "../context/LangContext"


export default function TestiComp() {
    const { texts, lang, changeLang } = useContext(LangContext)
    const t = (key: string) => texts?.[key] ?? key
  
    if (!texts) return <p>Loading...</p>
  
    return (
      <>
        <h1>{t("testi")}</h1>
        <button onClick={() => console.log(texts, lang, changeLang)}>Log</button>
        <button onClick={() => changeLang("en")}>Vaihda kieli</button>
      </>
    )
  }