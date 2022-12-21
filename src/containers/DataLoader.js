import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
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
      await openRealm(app.currentUser, user, setProgress);
      if (progress === 100) {
        startAppScreens();
      }
    })();
  }, [progress]);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}
    >
      <Progress.Circle size={150} progress={progress / 100} formatText={() => `${progress}%`} color={Colors.primary} showsText animated />
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
