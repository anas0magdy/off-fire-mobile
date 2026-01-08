import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

// استيراد ملفات الترجمة
import ar from '../locales/ar.json';
import en from '../locales/en.json';

const resources = {
  ar: { translation: ar },
  en: { translation: en },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem('language');

  if (!savedLanguage) {
    // لو مفيش لغة محفوظة، شوف لغة الموبايل
    const deviceLanguage = Localization.getLocales()[0].languageCode;
    savedLanguage = deviceLanguage === 'ar' ? 'ar' : 'en';
  }

  i18n.use(initReactI18next).init({
    resources,
    compatibilityJSON: 'v3',
    lng: savedLanguage,
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    }
  });
};

initI18n();

export default i18n;