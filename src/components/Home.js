import React, { useCallback, useEffect, useState } from 'react';
import { Colors, CommonStyles } from 'src/styles';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import { ObjectId } from 'bson';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsConnected } from 'react-native-offline';
import { Navigation } from 'react-native-navigation';
import SplashScreen from 'react-native-splash-screen';
import Sample from './Blink';

const Ciblage = function ({ componentId }) {
  const { t } = useTranslation();
  const isConnected = useIsConnected();
  const [user, setUser] = useState({});
  const initialize = useCallback(async () => {
    let userData = await AsyncStorage.getItem('userData');
    userData = JSON.parse(userData);
    setUser(userData);
  }, []);

  useEffect(() => {
    const listener = {
      componentDidAppear: () => {
        console.log('RNN', 'componentDidAppear');
        initialize();
        SplashScreen.hide();
      },
    };
    const unsubscribe = Navigation.events().registerComponentListener(listener, componentId);
    return () => {
      unsubscribe.remove();
    };
  }, [componentId, initialize, isConnected]);

  const savePerson = person => {
    const exists = global.realms[0].objects('person').filtered(`NNI == "${person.NNI}"`);
    if (exists.length > 0 || person.NNI === user.nni) {
      Alert.alert(t('error'), t('person_exists'));
      return;
    }
    global.realms[0].write(() => {
      global.realms[0].create('person', {
        ...person,
        _partition: user._id,
        _id: new ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date(),
        syncedAt: null,
        createdById: new ObjectId(user._id),
      });
    });
  };

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={CommonStyles.root}>
      <Sample text={t('scan_card')} t={t} savePerson={savePerson} />
    </LinearGradient>
  );
};

export default Ciblage;
