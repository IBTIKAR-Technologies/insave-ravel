import { View, Text, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Colors, CommonStyles } from 'src/styles';
import LinearGradient from 'react-native-linear-gradient';
import i18n from 'src/lib/languages/i18n';
import { wp } from 'src/lib/utilities';
import Icons from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsConnected } from 'react-native-offline';
import { checkForUserChange } from 'src/models/auth';
import { Navigation } from 'react-native-navigation';
import SplashScreen from 'react-native-splash-screen';
import Lottie from 'lottie-react-native';
import { TextInput } from 'react-native-paper';
import { SkeletonLoad } from './SkeletonLoad';

const Identifications = function ({ componentId }) {
  const { t } = useTranslation();
  const isConnected = useIsConnected();
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);

  const initialize = useCallback(async () => {
    let userData = await AsyncStorage.getItem('userData');
    userData = JSON.parse(userData);
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

  const handleIdentify = () => {
    setSearching(true);
  };

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={CommonStyles.root}>
      <View style={CommonStyles.container}>
        <View style={CommonStyles.lotieImage}>
          <Lottie source={require('../assets/lottie/list-search.json')} autoPlay />
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
            {t('ident_v_p')}
          </Text>
          <TextInput
            placeholder={t('matri_nni')}
            style={{ marginVertical: 20, height: 40 }}
            onChangeText={tex => {
              if (searching) setSearching(false);
              setSearch(tex);
            }}
          />
          {isConnected && !searching ? (
            <TouchableOpacity
              onPress={handleIdentify}
              disabled={
                parseInt(search, 10) % 97 !== 1 &&
                search.length !== 10 &&
                !/^([0-9]{4}|[0-9]{2}\s*[0-9]{2}|[0-9]{1}\s*[0-9]{1}\s*[0-9]{1}\s*[0-9]{1})\s*([A-Z]{2}|[A-Z]{1}\s*[A-Z]{1})\s*([1]\s*[0-4]|[0]\s*[0-9])$/g.test(
                  search,
                )
              }
              style={
                (parseInt(search, 10) % 97 === 1 && search.length === 10) ||
                /^([0-9]{4}|[0-9]{2}\s*[0-9]{2}|[0-9]{1}\s*[0-9]{1}\s*[0-9]{1}\s*[0-9]{1})\s*([A-Z]{2}|[A-Z]{1}\s*[A-Z]{1})\s*([1]\s*[0-4]|[0]\s*[0-9])$/g.test(
                  search,
                )
                  ? CommonStyles.button
                  : CommonStyles.buttonDis
              }>
              <Icons style={{ margin: 5 }} name="search" size={18} color="#000" />
              <Text style={styles.text}>{i18n.t('search')}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        {searching ? (
          <SkeletonLoad height={20} marginTop={30} width={wp(90) > 340 ? 340 : wp(80)} />
        ) : null}
      </View>
    </LinearGradient>
  );
};

const styles = {
  text: {
    fontSize: 18,
    color: '#000',
  },
};

export default Identifications;
