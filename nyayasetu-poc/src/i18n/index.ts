import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import bnTranslations from './bn.json';
import enTranslations from './en.json';

i18n.use(initReactI18next).init({
  resources: {
    bn: {
      translation: bnTranslations,
    },
    en: {
      translation: enTranslations,
    },
  },
  lng: 'bn', // Bangla as default
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
