import { createContext, useContext, useState } from 'react'

import en from '../locales/en'
import sq from '../locales/sq'
import it from '../locales/it'

const languages = { en, sq, it }

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en')

    const changeLanguage = (lang) => {
        setLanguage(lang)
    }

    // ✅ safe fallback (shumë e rëndësishme)
    const t = languages[language] || languages.en

    return (
        <LanguageContext.Provider value={{ t, language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => useContext(LanguageContext)