'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const I18next = ({ children }) => {
  const [language, setLanguage] = useState('us');
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const storedLanguage = JSON.parse(localStorage.getItem('nextsite.locale') || '"us"');
    setLanguage(storedLanguage);

    const loadTranslations = async () => {
      try {
        const res = await fetch(`/locales/${storedLanguage || language}/common.json`);
        if (!res.ok) throw new Error(`Error loading translations for language: ${storedLanguage || language}`);
        const data = await res.json();
        setTranslations(data);
      } catch (error) {
        console.error(`Error loading translations for language: ${storedLanguage || language}`, error);
      }
    };

    loadTranslations();
  }, [language]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('nextsite.locale', JSON.stringify(newLanguage));
  };

  const t = (key) => {
    return key.split('.').reduce((obj, i) => obj?.[i], translations) || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
