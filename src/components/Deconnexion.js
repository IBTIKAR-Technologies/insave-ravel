import React, { useCallback, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from 'src/styles';
import { wp } from 'src/lib/utilities';
import { logout } from 'src/models/auth';
import { Dialog, Paragraph, Portal } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsConnected } from 'react-native-offline';
import DeviceInfo from 'react-native-device-info';
import RNFS from 'react-native-fs';

const Deconnexion = function ({ synced }) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const { t } = useTranslation();
  const isConnected = useIsConnected();

  const versi = DeviceInfo.getSystemVersion();
  const gologout = async () => {
    let userData = await AsyncStorage.getItem('userData');
    userData = JSON.parse(userData);
    let secondBackupPath;
    if (parseInt(versi, 10) > 10) {
      secondBackupPath = `${RNFS.DocumentDirectoryPath}/ravel-backup${userData._id}`;
    } else {
      secondBackupPath = `${RNFS.ExternalStorageDirectoryPath}/.ravel-backup${userData._id}`;
    }
    const secondBackupExists = await RNFS.exists(secondBackupPath);
    if (secondBackupExists) {
      await RNFS.unlink(secondBackupPath);
    }
    logout();
  };
  const handleDialog = useCallback(() => {
    setDialogVisible(!dialogVisible);
  }, [dialogVisible]);
  return (
    <>
      <TouchableOpacity
        style={isConnected ? styles.button : styles.buttonDisabled}
        onPress={handleDialog}
        disabled={!isConnected}>
        <MaterialIcons name="logout" size={20} style={{ paddingHorizontal: 2 }} color="white" />
        <Text style={styles.normalText}>{t('logout')}</Text>
      </TouchableOpacity>
      <Portal>
        <Dialog style={styles.dialog} visible={dialogVisible} onDismiss={handleDialog}>
          <Dialog.Title style={styles.dialogTitle}>{t('confirmation')}</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={{ textAlign: 'center', color: 'red' }}>
              {t('confirmation2')}
            </Paragraph>
            <Ionicons
              name="warning"
              size={wp(22)}
              style={{ textAlign: 'center' }}
              color={Colors.yellowLight}
            />
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogButtons}>
            <TouchableOpacity onPress={handleDialog} style={styles.cancelButton}>
              <Text style={{ fontSize: 18, color: '#000' }}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              color={Colors.error}
              onPress={gologout}
              style={isConnected && synced ? styles.confirmButton : styles.confirmButtonDisabled}
              disabled={!isConnected || !synced}>
              <Text style={styles.normalText}>{t('confirm')}</Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.blue,
  },
  button: {
    flexDirection: 'row',
    borderRadius: 50,
    padding: 5,
    paddingHorizontal: 30,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  buttonDisabled: {
    width: wp(90) > 300 ? 300 : wp(80),
    flexDirection: 'row',
    borderRadius: 50,
    padding: 7,
    backgroundColor: Colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  actions2: {
    justifyContent: 'space-around',
  },
  dialogTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  transfertDetails: {
    flexDirection: 'column',
  },
  transfertDetailsTitle: {
    color: Colors.secondary,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: Colors.error,
    padding: 5,
    paddingHorizontal: 20,
    borderRadius: 50,
    elevation: 3,
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.gray,
    padding: 5,
    paddingHorizontal: 20,
    borderRadius: 50,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: Colors.primary,
    padding: 5,
    paddingHorizontal: 20,
    borderRadius: 50,
    elevation: 3,
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 30,
    elevation: 3,
  },
  normalText: {
    color: '#fff',
    fontSize: 18,
  },
  dialog: {
    borderRadius: 10,
    backgroundColor: '#fff',
    width: '90%' > 400 ? 400 : '90%',
    alignSelf: 'center',
  },
});

export default Deconnexion;
