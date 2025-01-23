import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales, getCalendars } from 'expo-localization';
import en from '@/locales/en/translation.json';
import vn from '@/locales/vn/translation.json';

const resources = {
    en: {
        translation: en
    },
    vn: {
        translation: vn
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: getLocales()[0].languageCode as string,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    })
export default i18n;