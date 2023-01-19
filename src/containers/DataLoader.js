import React, { useEffect, useState } from 'react';
import Realm from 'realm';
import { Text, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { startAppScreens } from 'src/lib/navigation/stateScreens';
import openRealm, { app } from 'src/lib/realm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import SplashScreen from 'react-native-splash-screen';
import * as Progress from 'react-native-progress';
import config from 'src/constants/config';
import { Colors } from 'src/styles';
import LinearGradient from 'react-native-linear-gradient';

const { realmPath } = config;

const DataLoader = function () {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    (async () => {
      const userData = await AsyncStorage.getItem('userData');
      const user = JSON.parse(userData);
      console.log('CONNECTING TO REALM');
      await RNFS.mkdir(realmPath);
      try {
        await openRealm(app.currentUser, user, setProgress);
      } catch (error) {
        Alert.alert(t('error'), error.message);
      }
      Realm.App.Sync.reconnect(app);
      const { syncSession } = global.realms[0];
      const { syncSession: syncSession1 } = global.realms[1];
      syncSession.resume();
      syncSession1.resume();
      syncSession.uploadAllLocalChanges();
      syncSession1.uploadAllLocalChanges();

      RNFS.getFSInfo()
        .then((info) => {
          console.log('info', info);
          const mbs = info.freeSpace / 1024 / 1024;
          if (mbs < 500) {
            Alert.alert(t('error'), t('free_space'));
          }
        });
    })();
  }, [t]);

  useEffect(() => {
    if (progress === 100 || Number.isNaN(progress)) {
      startAppScreens();
    }
  }, [progress]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgress(100);
    }, 30000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  console.log('progress', progress);
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}
    >
      <Progress.Circle size={150} progress={(progress || 0) / 100} formatText={() => `${progress || 0}%`} color={Colors.primary} showsText animated />
      <Text style={{ marginTop: 10, fontSize: 20 }}>{t('loading_data')}</Text>
    </LinearGradient>
  );
};

export default DataLoader;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
