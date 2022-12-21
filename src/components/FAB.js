import React from 'react';
import { FAB } from 'react-native-paper';
import { StyleSheet, View, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';

import { CommonStyles, Colors } from 'src/styles';
import { wp, hp } from 'src/lib/utilities';

const ButtonSubmit = props => {
  const { t } = useTranslation();
  const { onPress, disabled, icon } = props;

  const pressNow = () => {
    Keyboard.dismiss();
    onPress();
  };

  return (
    <FAB
      icon={icon}
      onPress={pressNow}
      disabled={disabled}
      style={[styles.fab, disabled ? styles.disabled : null]}
    />
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    color: '#000',
    right: 0,
    bottom: 0,
  },
  disabled: {
    backgroundColor: Colors.grey,
    color: Colors.black,
  },
});

export default ButtonSubmit;
