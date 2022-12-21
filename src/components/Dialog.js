import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  Button, Paragraph, Dialog, Portal,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Colors, CommonStyles } from 'src/styles';
import { wp, hp } from 'src/lib/utilities';

const DialogComponent = (props) => {
  const { t } = useTranslation();
  const { visible, close, onPress } = props;
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={close}>
        <Dialog.Title style={styles.title}>{t('confirmation')}</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.text}>{t('confirmation_body')}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={close} labelStyle={styles.text}>
            {t('cancel')}
          </Button>
          <Button onPress={onPress} labelStyle={styles.text}>
            {t('ok')}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  title: {
    ...CommonStyles.text,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  text: {
    ...CommonStyles.text,
  },
});

export default DialogComponent;
