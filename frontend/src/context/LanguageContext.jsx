import { createContext, useContext, useState } from 'react'
import en from '../locales/en'
import sq from '../locales/sq'
import it from '../locales/it'

const languages = { en, sq, it }

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('sq')

    const t = languages[language]

    const changeLanguage = (lang) => {
        setLanguage(lang)
    }

    return (
        <LanguageContext.Provider value={{ t, language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => useContext(LanguageContext)