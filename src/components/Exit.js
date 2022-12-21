import React from 'react';
import { StyleSheet, BackHandler, TouchableOpacity, Text, Alert } from 'react-native';
import { Colors } from 'src/styles';
import { useTranslation } from 'react-i18next';
import { wp, hp } from 'src/lib/utilities';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Exit = function () {
  const { t } = useTranslation();
  const confirmExit = () => {
    Alert.alert(
      t('confirm'),
      t('confirm_close'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('confirm'),
          onPress: () => {
            BackHandler.exitApp();
            return true;
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <TouchableOpacity style={styles.button} onPress={confirmExit}>
      <MaterialIcons name="power-settings-new" style={{ padding: 5 }} size={20} color="white" />
      <Text style={styles.normalText}>{t('close_app')}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    width: wp(90) > 300 ? 300 : wp(80),
    flexDirection: 'row',
    borderRadius: 50,
    padding: 7,
    backgroundColor: Colors.yellowLight,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  normalText: {
    color: '#000',
    fontSize: 18,
  },
});

export default Exit;
