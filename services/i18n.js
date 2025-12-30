import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { I18nManager } from 'react-native';

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

  // ضبط الاتجاه (RTL) بناءً على اللغة
  const isRTL = savedLanguage === 'ar';
  
  // لو الاتجاه الحالي غلط، صلحه (هيحتاج ريستارت)
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
  }

  i18n.use(initReactI18next).init({
    resources,
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