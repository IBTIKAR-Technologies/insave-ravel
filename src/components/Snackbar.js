import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Colors } from 'src/styles';
import { wp, hp } from 'src/lib/utilities';

const MySnackBar = (props) => {
  const { t } = useTranslation();
  const { visible, dismiss, type } = props;
  return (
    <Snackbar
      visible={!!visible}
      onDismiss={dismiss}
      style={styles[type]}
      wrapperStyle={styles.wrapper}
      action={{
        label: t('hide'),
        onPress: dismiss,
      }}
    >
      {visible}
    </Snackbar>
  );
};

const styles = StyleSheet.create({
  error: {
    backgroundColor: Colors.error,
  },
  success: {
    backgroundColor: Colors.success,
  },
  wrapper: {
    marginHorizontal: wp(20),
    width: wp(60),
    zIndex: 99999999,
  },
});

export default MySnackBar;
