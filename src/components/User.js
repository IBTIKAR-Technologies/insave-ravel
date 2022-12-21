import { View, Text, Image } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Colors } from 'src/styles';
import LinearGradient from 'react-native-linear-gradient';
import { wp, hp } from 'src/lib/utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { Navigation } from 'react-native-navigation';
import { useIsConnected } from 'react-native-offline';
import { checkForUserChange } from 'src/models/auth';
import Deconnexion from './Deconnexion';
import Language from './Language';

const enqueterRoleId = '62d562fda5fac5ffb48ef7e2';
const controllerRoleId = '62d5635aa5fac5ffb48ef7e4';

const User = function ({ componentId }) {
  const [user, setUser] = useState({});
  const [synced, setSynced] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);
  const { t } = useTranslation();
  const { language } = i18next;
  const isConnected = useIsConnected();

  const initialize = useCallback(async () => {
    const userData = await AsyncStorage.getItem('userData');
    const parsed = JSON.parse(userData);
    setUser(parsed);
    if (parsed.roleId === enqueterRoleId || parsed.roleId === controllerRoleId) {
      const zn = await AsyncStorage.getItem('selectedZone');
      if (zn) setSelectedZone(JSON.parse(zn));
    }
    if (isConnected && (parsed.roleId === enqueterRoleId || parsed.roleId === controllerRoleId)) {
      await checkForUserChange(parsed);
    }
  }, [isConnected]);

  useEffect(() => {
    initialize();
    const listener = {
      componentDidAppear: () => {
        console.log('RNN', 'componentDidAppear');
        initialize();
      },
    };
    const unsubscribe = Navigation.events().registerComponentListener(listener, componentId);
    return () => {
      unsubscribe.remove();
    };
  }, [initialize, componentId, isConnected]);
  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      <View style={styles.container}>
        <Image source={require('../assets/images/avatar.png')} style={styles.image} />
        <Text style={styles.bigText}>{user?.fullName}</Text>
        <View style={styles.secondContainer}>
          <View style={styles.userInfo}>
            <Text style={styles.details}>
              {t('user_name')}: {user?.username}
            </Text>
            {user.role && (
              <Text style={styles.details}>
                {t('role')}: {user.role[`title${language}`] || t('none')}
              </Text>
            )}
            {user.commune && (
              <Text style={styles.details}>
                {t('commune')}:{' '}
                {language === 'fr'
                  ? user.commune.namefr_rs || user.commune.namefr_ons
                  : user.commune.namear}
              </Text>
            )}
            {selectedZone && (
              <Text style={styles.details}>
                {t('zone')}:{' '}
                {language === 'fr'
                  ? (selectedZone && selectedZone.namefr) || t('none')
                  : selectedZone && (selectedZone.namear || selectedZone.namefr || t('none'))}
              </Text>
            )}
          </View>
          <View style={styles.buttons}>
            <Deconnexion synced={synced} />
            {/* <Exit /> */}
          </View>
        </View>
      </View>
      <Language />
    </LinearGradient>
  );
};

export default User;
const styles = {
  container: {
    flex: 1,
    marginTop: '15%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.primaryGradientEnd,
  },
  secondContainer: {
    width: wp(90) > 400 ? 400 : wp(90),
    height: hp(40),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  bigText: {
    fontSize: 30,
    color: Colors.black,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    width: '90%',
    textAlign: 'center',
  },
  avatar: {
    paddingLeft: '5%',
  },
  userInfo: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
    padding: 10,
    width: '80%',
  },
  details: {
    fontSize: 20,
    paddingBottom: 5,
  },
  buttons: {
    alignItems: 'center',
    width: wp(100),
  },
  image: {
    width: 200,
    height: 200,
  },
};