import React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet, View, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';

import { CommonStyles, Colors } from 'src/styles';
import { wp, hp } from 'src/lib/utilities';

const ButtonSubmit = function (props) {
  const { t } = useTranslation();
  const { onPress, loading, submit, header, color, style, disabled } = props;

  const pressNow = () => {
    if (submit) {
      Keyboard.dismiss();
    }
    onPress();
  };

  return (
    <View style={styles.container}>
      <Button
        icon={header ? null : 'send'}
        mode="contained"
        onPress={pressNow}
        disabled={loading || disabled}
        style={[styles.button, style || {}]}
        labelStyle={[styles.label, color ? { color } : null]}
        contentStyle={styles.content}
        color={Colors.primary}
        loading={loading}
      >
        {submit ? (typeof submit === 'string' ? submit : t('deliver')) : t('save')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  button: {},
  label: {
    ...CommonStyles.text,
  },
  content: {
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
});

export default ButtonSubmit;
