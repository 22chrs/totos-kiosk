import de_DE from '@/internationalization/locales/de/de_DE.json';
import en_US from '@/internationalization/locales/en/en_US.json';
import es_ES from '@/internationalization/locales/es/es_ES.json';
import fr_FR from '@/internationalization/locales/fr/fr_FR.json';
import it_IT from '@/internationalization/locales/it/it_IT.json';
import nl_NL from '@/internationalization/locales/nl/nl_NL.json';
import pl_PL from '@/internationalization/locales/pl/pl_PL.json';
import ru_RU from '@/internationalization/locales/ru/ru_RU.json';
import uk_UA from '@/internationalization/locales/uk/uk_UA.json';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import XHR from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const useWebsocket =
  process.env.NEXT_PUBLIC_WEBSOCKET_SERVICE_ENV === 'useWebsocket';

const resources = {
  Deutsch: {
    translation: de_DE,
  },
  English: {
    translation: en_US,
  },

  ...(useWebsocket
    ? {
        Français: {
          translation: fr_FR,
        },
        Русский: {
          translation: ru_RU,
        },
        Español: {
          translation: es_ES,
        },
        Italiano: {
          translation: it_IT,
        },
        Nederlands: {
          translation: nl_NL,
        },
        Polski: {
          translation: pl_PL,
        },
        Українська: {
          translation: uk_UA,
        },
      }
    : {}),
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
    fallbackLng: 'Deutsch',
    detection: options,
    supportedLngs: availableLanguages,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    debug: false,
  });

export default i18n;
