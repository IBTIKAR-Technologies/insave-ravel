import i18n from 'src/lib/languages/i18n';
import openRealm, { app } from 'src/lib/realm';
import codePush from 'react-native-code-push';
import i18next from 'i18next';
import { requestPermissions } from 'src/lib/utilities';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { PERMISSIONS } from 'react-native-permissions';
import config from 'src/constants/config';
import registerScreens from './registerScreens';
import { startAuthScreens, startAppScreens, startDataLoaderScreens } from './stateScreens';

const { realmPath } = config;

const perms = [
  PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
  PERMISSIONS.ACCESS_FINE_LOCATION,
];

const startScreens = () => {
  AsyncStorage.getItem('@i18next-async-storage/user-language').then(lng => {
    i18n.init(lng).finally(() => {
      const { language } = i18next;
      if (language === 'ar' && !I18nManager.isRTL) {
        I18nManager.forceRTL(true);
        I18nManager.allowRTL(true);
        codePush.restartApp();
      }
      const isLoggedIn = app.currentUser && app.currentUser.isLoggedIn;
      registerScreens();
      if (isLoggedIn) {
        (async () => {
          await requestPermissions(() => { }, perms);
          await RNFS.mkdir(realmPath);
          startDataLoaderScreens();
        })();
      } else {
        startAuthScreens();
      }
    });
  });
};

export default startScreens;
