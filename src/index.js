import React, { useEffect, useState } from 'react';
import { requestPermissions } from 'src/lib/utilities';
import { PERMISSIONS } from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import config from 'src/constants/config';
import openRealm, { app } from 'src/lib/realm';
// import throttle from 'lodash/throttle';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import SplashScreen from 'react-native-splash-screen';

const { realmPath } = config;

const perms = [
  PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
  PERMISSIONS.ANDROID.READ_PHONE_STATE,
  PERMISSIONS.ANDROID.READ_CALL_LOG,
  PERMISSIONS.ANDROID.READ_PHONE_NUMBERS,
];

const App = function (props) {
  const { t } = useTranslation();
  const { children } = props;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    requestPermissions(() => {}, perms);
    if (app.currentUser && app.currentUser.isLoggedIn) {
      (async () => {
        const userData = await AsyncStorage.getItem('userData');
        const user = JSON.parse(userData);
        console.log('user', user);
        console.log('CONNECTING TO REALM');
        const arr = realmPath.split('/');
        arr.pop();
        await RNFS.mkdir(arr.join('/'));
        await openRealm(app.currentUser, user, setProgress);
      })();
    }
  }, []);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return <View style={{ flex: 1 }}>{children}</View>;
};

export default App;
