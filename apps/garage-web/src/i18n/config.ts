import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locale/en/default.json';
import es from './locale/es/default.json';
import { DateTime } from 'luxon';

i18next.use(initReactI18next).init({
  fallbackLng: 'en',
  debug: true,
  resources: {
    en: {
      translation: en,
    },
    es: {
      translation: es,
    },
  },
  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  },
  // if you see an error like: "Argument of type 'DefaultTFuncReturn' is not assignable to parameter of type xyz"
  // set returnNull to false (and also in the i18next.d.ts options)
  // returnNull: false,
});

i18next.services.formatter?.add(
  'DATE_HUGE',
  (
    value: Date | undefined,
    lng: string | undefined,
    options: Date | undefined
  ) => {
    return DateTime.fromJSDate(<Date>value)
      .setLocale(<string>lng)
      .toLocaleString(DateTime.DATE_SHORT);
  }
);
