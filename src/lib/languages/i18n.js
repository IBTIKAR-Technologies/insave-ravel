import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from 'src/lib/languages/ar/ar.js';
import fr from 'src/lib/languages/fr/fr.js';
import * as RNLocalize from 'react-native-localize';
import { I18nManager } from 'react-native';
import codePush from 'react-native-code-push';
import formatDate from 'date-fns/format';
import formatDistance from 'date-fns/formatDistance';
import formatRelative from 'date-fns/formatRelative';
import isDate from 'date-fns/isDate';
import frD from 'date-fns/locale/fr';
import arD from 'date-fns/locale/ar-DZ';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';

const locales = { fr: frD, ar: arD };

const defaultLanguage = { languageTag: 'fr', isRTL: false };

const resources = {
  ar: {
    translation: ar,
  },
  fr: {
    translation: fr,
  },
};

const { languageTag, isRTL } =
  RNLocalize.findBestAvailableLanguage(Object.keys(resources)) || defaultLanguage;

const i18n = {
  init: lng =>
    new Promise((resolve, reject) => {
      i18next.use(initReactI18next).init(
        {
          compatibilityJSON: 'v3',
          resources,
          // debug: true,
          nsSeparator: false,
          lng: lng || languageTag,
          keySeparator: false,
          interpolation: {
            escapeValue: false,
            format: (value, format, lng) => {
              if (isDate(value)) {
                const locale = locales[lng];
                if (format === 'short') {
                  return formatDate(value, 'P', { locale });
                }
                if (format === 'long') {
                  return formatDate(value, 'PPPP', { locale });
                }
                if (format === 'relative') {
                  return formatRelative(value, new Date(), { locale });
                }
                if (format === 'ago') {
                  return formatDistance(value, new Date(), {
                    locale,
                    addSuffix: true,
                  });
                }
                return formatDate(value, format, { locale });
              }
            },
          },
        },
        error => {
          if (error) {
            return reject(error);
          }
          return resolve(true);
        },
      );
    }),
  isRTL,
  t: i18next.t.bind(i18next),
  language: i18next.language,
  setLanguage: (language, isRTL) => {
    i18next.changeLanguage(language).then(() => {
      AsyncStorage.setItem('@i18next-async-storage/user-language', language).then(() => {
        if (isRTL !== I18nManager.isRTL) {
          I18nManager.forceRTL(isRTL);
          I18nManager.allowRTL(isRTL);
          setTimeout(() => {
            codePush.restartApp();
          }, 200);
        }
      });
    });
  },
};

export default i18n;
