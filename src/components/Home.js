import { View, Text } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Colors, CommonStyles } from 'src/styles';
import LinearGradient from 'react-native-linear-gradient';
import i18n from 'src/lib/languages/i18n';
import { ObjectId } from 'bson';
import { wp } from 'src/lib/utilities';
import screenNames from 'src/lib/navigation/screenNames';
import Icons from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsConnected } from 'react-native-offline';
import { checkForUserChange } from 'src/models/auth';
import { Navigation } from 'react-native-navigation';
import SplashScreen from 'react-native-splash-screen';
import Lottie from 'lottie-react-native';
import ThrottledNavigateButton from './ThrottledNavigateButton';
import Sample from './Blink';

const Ciblage = function ({ componentId }) {
  const { t } = useTranslation();
  const isConnected = useIsConnected();
  const [user, setUser] = useState({});
  const initialize = useCallback(async () => {
    let userData = await AsyncStorage.getItem('userData');
    userData = JSON.parse(userData);
    setUser(userData);
    if (isConnected) {
      await checkForUserChange(userData);
    }
  }, [isConnected]);

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
      <Sample t={t} savePerson={savePerson} />
    </LinearGradient>
  );

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={CommonStyles.root}>
      <View style={CommonStyles.container}>
        <View style={CommonStyles.lotieImage}>
          <Lottie source={require('../assets/lottie/two-way-traffic.json')} autoPlay />
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 20,
            elevation: 10,
            width: wp(90) > 340 ? 340 : wp(80),
          }}>
          <Text style={{ textAlign: 'center', fontSize: 18, marginBottom: 20 }}>
            {t('to_add_text')}
          </Text>
          <ThrottledNavigateButton
            componentId={componentId}
            destination={screenNames.AddInfraction}
            styles={styles.button}
            tobBarBackgroundColor={Colors.primary}
            tobBarTitleColor="#000"
            tobBarTitleText={t('add')}
            noBackButton={false}
            disabled={false}>
            <Icons style={{ margin: 5 }} name="plus-circle" size={18} color="#000" />
            <Text style={styles.text}>{i18n.t('add')}</Text>
          </ThrottledNavigateButton>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = {
  button: {
    backgroundColor: Colors.primary,
    padding: 5,
    marginBottom: 10,
    width: wp(90) > 300 ? 300 : wp(80),
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
  },
  text: {
    fontSize: 18,
    color: '#000',
  },
  buttonDiabled: {
    backgroundColor: Colors.gray,
    padding: 15,
    marginBottom: 10,
    width: wp(90) > 300 ? 300 : wp(80),
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
  },

  whiteText: {
    fontWeight: 'bold',
  },
};

export default Ciblage;
