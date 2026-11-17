import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  AppLanguage,
  UI_TRANSLATIONS,
  tData as translateDataField,
} from '../i18n/translations';

export const LANGUAGE_STORAGE_KEY = 'keystone_lang';

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
  t: typeof UI_TRANSLATIONS.en;
  tData: <T extends Record<string, any>>(
    item: T | null | undefined,
    field: string
  ) => string;
  isEn: boolean;
  isEs: boolean;
  locale: 'en-US' | 'es-US';
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Default language is 'en' (en-US) for any new visitor, persisted under 'keystone_lang'
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === 'es' || stored === 'en') {
        return stored;
      }
    } catch {
      // Ignore storage access errors
    }
    return 'en';
  });

  // Update <html lang="en-US" | "es-US"> dynamically and persist in localStorage
  useEffect(() => {
    document.documentElement.lang = language === 'en' ? 'en-US' : 'es-US';
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Ignore storage write errors
    }
  }, [language]);

  const setLanguage = useCallback((lang: AppLanguage) => {
    setLanguageState(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === 'en' ? 'es' : 'en'));
  }, []);

  const tData = useCallback(
    <T extends Record<string, any>>(
      item: T | null | undefined,
      field: string
    ) => translateDataField(item, field, language),
    [language]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t: UI_TRANSLATIONS[language],
      tData,
      isEn: language === 'en',
      isEs: language === 'es',
      locale: language === 'en' ? 'en-US' : 'es-US',
    }),
    [language, setLanguage, toggleLanguage, tData]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useTranslation(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return ctx;
}
