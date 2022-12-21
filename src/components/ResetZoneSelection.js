import { View, TouchableNativeFeedback, Alert } from 'react-native';
import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Navigation } from 'react-native-navigation';

const ResetSelectedZone = ({ compoeTo }) => {
  const [rippleOverflow, setRippleOverflow] = useState(false);
  const { t } = useTranslation();

  const confirmReset = async () => {
    const zn = await AsyncStorage.getItem('selectedZone');
    if (!zn) {
      return;
    }
    Alert.alert(
      t('confirm'),
      t('confirm_reset_select'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('confirm'),
          onPress: () => {
            AsyncStorage.removeItem('selectedZone');
            Navigation.popTo(compoeTo);
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View
      style={{
        alignItems: 'center',
        borderRadius: 50,
        overflow: 'hidden',
      }}>
      <TouchableNativeFeedback
        onPress={() => {
          setRippleOverflow(!rippleOverflow);
          confirmReset();
        }}
        background={TouchableNativeFeedback.Ripple('rgba(00000007)', rippleOverflow)}>
        <View style={{ flex: 1, padding: 5 }}>
          <MaterialCommunityIcons name="backup-restore" size={25} color="#000" />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

export default ResetSelectedZone;
