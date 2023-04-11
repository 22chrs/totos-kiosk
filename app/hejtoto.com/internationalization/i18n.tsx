import de_DE from '@/internationalization/locales/de/de_DE.json';
import en_US from '@/internationalization/locales/en/en_US.json';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import XHR from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const resources = {
  English: {
    translation: en_US,
  },
  Deutsch: {
    translation: de_DE,
  },
};

export const availableLanguages = Object.keys(resources);

const options = {
  order: ['localStorage', 'navigator'],
  caches: ['localStorage'],
};

i18n
  .use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: undefined, // let detect the language on client side
    fallbackLng: 'English',
    detection: options,
    supportedLngs: ['Deutsch', 'English'],
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    debug: false,
  });

export default i18n;
