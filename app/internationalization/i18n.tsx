// import ar_AR from '@/internationalization/locales/ar/ar_AR.json';
import de_DE from '@/internationalization/locales/de/de_DE.json';
import en_US from '@/internationalization/locales/en/en_US.json';
import es_ES from '@/internationalization/locales/es/es_ES.json';
import fr_FR from '@/internationalization/locales/fr/fr_FR.json';
import it_IT from '@/internationalization/locales/it/it_IT.json';
// import nl_NL from '@/internationalization/locales/nl/nl_NL.json';
import ru_RU from '@/internationalization/locales/ru/ru_RU.json';
import tr_TR from '@/internationalization/locales/tr/tr_TR.json';
// import uk_UA from '@/internationalization/locales/uk/uk_UA.json';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import XHR from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const isKioskDomain =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'kiosk.hejtoto.com' ||
    window.location.hostname === 'www.kiosk.hejtoto.com');

const resources = {
  Deutsch: {
    translation: de_DE,
  },
  English: {
    translation: en_US,
  },
  Français: {
    translation: fr_FR,
  },
  // Nederlands: {
  //   translation: nl_NL,
  // },
  Español: {
    translation: es_ES,
  },
  Italiano: {
    translation: it_IT,
  },
  // Polski: {
  //   translation: pl_PL,
  // },
  // Українська: {
  //   translation: uk_UA,
  // },
  Русский: {
    translation: ru_RU,
  },
  Türkçe: {
    translation: tr_TR,
  },
  // العربية: {
  //   translation: ar_AR,
  // },
  // 中文: {
  //   translation: zh_CN,
  // },
};

export const availableLanguages = Object.keys(resources);

export const standardSprache = 'Deutsch';

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
    fallbackLng: standardSprache,
    detection: options,
    supportedLngs: availableLanguages,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    debug: false,
  });

export default i18n;
