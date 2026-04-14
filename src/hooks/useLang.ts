"use client"

import { useState, useEffect } from "react"

export type Lang = "pt" | "en"
const KEY = "solfarm_lang"

export function useLang(): { lang: Lang; setLang: (l: Lang) => void } {
  const [lang, setLangState] = useState<Lang>("pt")

  useEffect(() => {
    const stored = localStorage.getItem(KEY)
    if (stored === "en" || stored === "pt") setLangState(stored)
  }, [])

  function setLang(l: Lang) {
    localStorage.setItem(KEY, l)
    setLangState(l)
    // Notify other components on the same page
    window.dispatchEvent(new CustomEvent("solfarm_langchange", { detail: l }))
  }

  // Listen for changes triggered by other components on the same page
  useEffect(() => {
    function onLangChange(e: Event) {
      setLangState((e as CustomEvent).detail as Lang)
    }
    window.addEventListener("solfarm_langchange", onLangChange)
    return () => window.removeEventListener("solfarm_langchange", onLangChange)
  }, [])

  return { lang, setLang }
}
