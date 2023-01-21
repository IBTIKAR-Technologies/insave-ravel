/* eslint-disable import/no-mutable-exports */
import Realm from 'realm';
import RNFS from 'react-native-fs';
import config from 'src/constants/config';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import { PermissionsAndroid, BackHandler, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { throttle } from 'lodash';
import codePush from 'react-native-code-push';
import SplashScreen from 'react-native-splash-screen';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import { t } from 'i18next';
import { logout } from 'src/models/auth';
import {
  personSchema, userSchema, user_personSchema, wilayaSchema, moughataaSchema, communeSchema,
} from './schemas';

const { realmPath, appConfig } = config;

export const app = new Realm.App(appConfig);

export let realms = [];

const versi = DeviceInfo.getSystemVersion();

const createSecondBackup = async () => {
  let needBackups = false;
  const realmsThatSync = [
    'menage',
    'concession',
    'user',
    'formulairelocalite',
    'enquete',
    'menagemembre',
    'localite',
  ];
  for (let i = 0; i < realmsThatSync.length; i++) {
    const backupObjects = global.realms[0]
      .objects(realmsThatSync[i])
      .filtered('updatedAt != null AND syncedAt = null');
    if (backupObjects.length > 0) {
      console.log('non, synced', backupObjects);
      needBackups = true;
    }
  }
  if (!needBackups) {
    return;
  }
  let userData = await AsyncStorage.getItem('userData');
  const oldRealmPath = realms[0].path;
  userData = JSON.parse(userData);
  if (versi > 10) {
    const secondBackupPath = `${RNFS.DocumentDirectoryPath}/ravel-backup${userData._id}`;
    const secondBackupExists = await RNFS.exists(secondBackupPath);
    if (secondBackupExists) {
      await RNFS.unlink(secondBackupPath);
    }
    await RNFS.copyFile(oldRealmPath, secondBackupPath);
    console.log('created second backup');
    Toast.show({
      type: 'success',
      text1: t('backup_created'),
      position: 'bottom',
      visibilityTime: 2000,
    });
  } else {
    const secondBackupPath = `${RNFS.ExternalStorageDirectoryPath}/.ravel-backup${userData._id}`;
    const secondBackupExists = await RNFS.exists(secondBackupPath);
    if (secondBackupExists) {
      await RNFS.unlink(secondBackupPath);
    }
    await RNFS.copyFile(oldRealmPath, secondBackupPath);
    console.log('created second backup');
    Toast.show({
      type: 'success',
      text1: t('backup_created'),
      position: 'bottom',
      visibilityTime: 2000,
    });
  }
};

const throttleConnectionError = throttle(createSecondBackup, 120000, { trailing: false });

const errorSync = communeId => async (session, error) => {
  console.log('errorsync', error);
  if (realms[0] !== undefined) {
    console.log('error.name', error.name);
    if (
      error.category === 'realm.util.network.resolve'
      || error.message === 'Network is unreachable'
    ) {
      console.log('error', error);
      throttleConnectionError();
    } else if (error.name === 'ClientReset') {
      const oldRealmPath = `${realms[0].path}`;

      console.log('oldRealmPath', oldRealmPath);
      realms[0].close();

      console.log(`Error ${error.message}, need to reset ${oldRealmPath}…`);
      const realmInfo = await RNFS.stat(oldRealmPath);
      console.log('realm path size', realmInfo.size);
      Realm.App.Sync.initiateClientReset(app, oldRealmPath);
      console.log(`Creating backup from ${oldRealmPath}…`);

      // Move backup file to a known location for a restore
      // (it's async, but we don't care much to wait at this point)
      RNFS.moveFile(oldRealmPath, `${oldRealmPath}~`).finally(() => {
        // realm = null;
        SplashScreen.show();
        codePush.restartApp();
      });
    } else {
      console.log(`Received realm error ${error.message}`);
    }
  }
};
const errorSync2 = async (session, error) => {
  if (realms[1] !== undefined) {
    if (error.name === 'ClientReset') {
      const oldRealmPath = `${realms[1].path}`;
      realms[1].close();
      Realm.App.Sync.initiateClientReset(app, oldRealmPath);
      RNFS.moveFile(oldRealmPath, `${oldRealmPath}~`).finally(() => {
        // realm = null;
        SplashScreen.show();
        codePush.restartApp();
      });
    } else {
      console.log(`Received realm error ${error.message}`);
    }
  }
};
async function restoreRealms(userData) {
  console.log('Restoring Realm');
  if (!realms[0]) {
    console.log('NO REALM');
    return;
  }

  let granted = false;

  const grantedRead = await PermissionsAndroid.check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
  const grantedWrite = await PermissionsAndroid.check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
  const grantedLocation = await PermissionsAndroid.check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  if (!grantedRead || !grantedWrite || !grantedLocation) {
    await requestMultiple([
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ]).then(result => {
      granted = result[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === 'granted'
        && result[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === 'granted'
        && result[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === 'granted';
      if (!granted) {
        BackHandler.exitApp();
      }
    });
  }

  const backupPath = `${realms[0].path}~`;
  let secondBackupPath;
  if (versi > 10) {
    secondBackupPath = `${RNFS.DocumentDirectoryPath}/ravel-backup${userData._id}`;
  } else {
    secondBackupPath = `${RNFS.ExternalStorageDirectoryPath}/.ravel-backup${userData._id}`;
  }

  console.log('secondBackupPath', secondBackupPath);
  const secondBackupExists = await RNFS.exists(secondBackupPath);
  let backupExists = await RNFS.exists(backupPath);

  console.log('backupExists', backupExists);
  console.log('secondBackupExists', secondBackupExists);
  // copy the backup file to the current realm
  const realmsToCopy = [
    'person',
  ];
  if (secondBackupExists && !backupExists) {
    // @ts-ignore
    await RNFS.copyFile(secondBackupPath, backupPath, { overWrite: true });
    backupExists = true;
  }
  if (backupExists) {
    console.log('aaaaa');
    const fileState = await RNFS.stat(backupPath);
    console.log('filezise', fileState.size);
    console.log('fileState', fileState);
    console.log('type', fileState.isFile());
    try {
      const backupRealm = await Realm.open({ path: backupPath, readOnly: true });
      // seting the schema to the menage schema
      setTimeout(async () => {
        for (let i = 0; i < realmsToCopy.length; i++) {
          const backupObjects = backupRealm
            .objects(realmsToCopy[i])
            .filtered('updatedAt != null AND syncedAt = null');
          if (backupObjects.length > 0) {
            console.log('copyRealm', realmsToCopy[i]);
            console.log('backupObjects', backupObjects.length);

            realms[0].beginTransaction();
            backupObjects.forEach(element => {
              console.log('beforegettinBC');
              const mng = realms[0].objectForPrimaryKey(realmsToCopy[i], element._id);
              if (!mng) {
                realms[0].create(realmsToCopy[i], element);
              } else {
                realms[0].create(realmsToCopy[i], element, 'modified');
              }
            });
            console.log('afttergettinBC');
            realms[0].commitTransaction();
          }
        }
        await RNFS.moveFile(backupPath, `${backupPath}xx`);
        await RNFS.moveFile(secondBackupPath, `${secondBackupPath}xx`);
      }, 5000);
    } catch (error) {
      console.log('error delete', error);
      await RNFS.moveFile(backupPath, `${backupPath}xx`);
      await RNFS.moveFile(secondBackupPath, `${secondBackupPath}xx`);
      console.log('moved backups');
    }
  }
}

async function openRealm(user, userDataX, setProgress) {
  const data = await AsyncStorage.getItem('userData');
  const userData = JSON.parse(data);
  console.log('appuser', user);
  console.log('user?.id', user?.id);
  console.log('communeId openRealm', userData);
  console.log('realm path', `${realmPath}/${userData._id}`);

  if (!userData._id) {
    logout();
    return;
  }

  const realmConfig = {
    schema: [personSchema],
    schemaVersion: 1,
    path: `${realmPath}/${userData._id}`,
    sync: {
      user,
      partitionValue: userData._id,
      newRealmFileBehavior: { type: 'openImmediately', timeOutBehavior: 'throwException' },
      existingRealmFileBehavior: { type: 'openImmediately', timeOutBehavior: 'openLocalRealm' },
      clientReset: {
        mode: "recoverUnsyncedChanges",
      },
      error: (_session, error) => {
        console.log(error.name, error.message);
        (error) => {
          console.log(error.name, error.message);
        };
      },

    },
  };
  const usersRealmConfig = {
    schema: [userSchema, user_personSchema, wilayaSchema, communeSchema, moughataaSchema],
    schemaVersion: 1,
    path: `${realmPath}/${userData._id}1`,
    sync: {
      user,
      partitionValue: 'all',
      newRealmFileBehavior: { type: 'openImmediately', timeOutBehavior: 'throwException' },
      existingRealmFileBehavior: { type: 'openImmediately', timeOutBehavior: 'openLocalRealm' },
      clientReset: {
        mode: "recoverUnsyncedChanges",
      },
      error: (_session, error) => {
        console.log(error.name, error.message);
        (error) => {
          console.log(error.name, error.message);
        };
      },
    },
  };

  const realm = await Realm.open(realmConfig);
  const realm2 = await Realm.open(usersRealmConfig);
  // @ts-ignore
  realms = [realm, realm2];

  global.realms = realms;

  NetInfo.fetch().then(state => {
    console.log('Connection type', state.type);
    console.log('Is connected?', state.isConnected);
    if (!state.isConnected) {
      if (setProgress) {
        setProgress(100);
      }
    }
  });

  const { syncSession } = realm;
  syncSession.addProgressNotification(
    'download',
    'forCurrentlyOutstandingWork',
    (transferred, transferable) => {
      console.log(`${transferred} bytes has been transferred`);
      console.log(
        `There are ${transferable} total transferable bytes, including the ones that have already been transferred`,
      );
      if (setProgress) {
        setProgress(parseInt((transferred / transferable) * 100, 10));
      }
    },
  );

  console.log('Opened realm DARI');

  console.log('realms', realms);
}

export default openRealm;
