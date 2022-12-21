/* eslint-disable import/prefer-default-export */
import Realm from 'realm';
import i18n from 'src/lib/languages/i18n';
import { app } from 'src/lib/realm';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { startDataLoaderScreens } from 'src/lib/navigation/stateScreens';
import CodePush from 'react-native-code-push';
import { Alert } from 'react-native';
import { isEqual, difference } from 'lodash';
import SplashScreen from 'react-native-splash-screen';
import startScreens from 'src/lib/navigation/startScreens';
import { startAuthScreens, startAppScreens } from '../lib/navigation/stateScreens';

function getObjectDiff(obj1, obj2) {
  const diff = Object.keys(obj1).reduce((result, key) => {
    if (!obj2.hasOwnProperty(key)) {
      result.push(key);
    } else if (isEqual(obj1[key], obj2[key])) {
      const resultKeyIndex = result.indexOf(key);
      result.splice(resultKeyIndex, 1);
    }
    return result;
  }, Object.keys(obj2));

  return diff;
}

export const login = async data => {
  console.log('LOGGIN IN');
  const { phone, password } = data;
  const username = phone.toLowerCase().trim();
  if (app.currentUser) app.currentUser.logOut();
  const credentials = Realm.Credentials.function({ username, password });
  let userData;
  const body = JSON.stringify({
    collection: 'users',
    database: 'ciblage',
    dataSource: 'taazour',
    pipeline: [
      {
        $match: {
          username,
        },
      },
      {
        $lookup: {
          from: 'wilayas',
          localField: 'wilayaId',
          foreignField: '_id',
          as: 'wilaya',
        },
      },
      {
        $lookup: {
          from: 'moughataas',
          localField: 'moughataaId',
          foreignField: '_id',
          as: 'moughataa',
        },
      },
      {
        $lookup: {
          from: 'communes',
          localField: 'communeId',
          foreignField: '_id',
          as: 'commune',
        },
      },
      {
        $lookup: {
          from: 'localites',
          localField: 'localiteId',
          foreignField: '_id',
          as: 'localite',
        },
      },
      {
        $lookup: {
          from: 'zones',
          localField: 'zoneId',
          foreignField: '_id',
          as: 'zone',
        },
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'roleId',
          foreignField: '_id',
          as: 'role',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'controllerId',
          foreignField: '_id',
          as: 'controller',
        },
      },
      {
        $unwind: {
          path: '$wilaya',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$moughataa',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$commune',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$localite',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$zone',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$role',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$controller',
          preserveNullAndEmptyArrays: true,
        },
      },
    ],
  });

  try {
    const response = await fetch(
      'https://data.mongodb-api.com/app/data-cmshj/endpoint/data/beta/action/aggregate',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'api-key': 'Z1mK2dmkPYWTKe9tlTYAhtHvul905kqMFk01GStuwZ4u9U0vms0uf8YGg58FOITH',
        },
        body,
      },
    );
    let json;
    if (response.ok) {
      json = await response.json();
    } else {
      console.log('error', await response.text());
      throw new Error(i18n.t('login_error'));
    }
    console.log('json', json);
    [userData] = json.documents;
    /* if (!userData || !userData.centre) {
      console.log('YESSSS');
      throw new Error(i18n.t('user_not_pointv'));
    } */
    console.log('NOOOOOOOOOOOOOOOO');
    let user;
    try {
      user = await app.logIn(credentials);
    } catch (error) {
      console.log('error login', error);
      if (error.message === 'Network request failed') {
        throw new Error(i18n.t('login_error_internet'));
      }
      throw new Error(i18n.t('login_error'));
    }
    if (user) {
      AsyncStorage.setItem('userData', JSON.stringify({ ...userData }));
      Toast.show({
        type: 'success',
        text1: i18n.t('login_success'),
        position: 'bottom',
      });
      startDataLoaderScreens();
      return true;
    }
    throw new Error(i18n.t('login_error'));
  } catch (error) {
    console.error('error mongo', error);
    if (error.message === 'Network request failed') {
      throw new Error(i18n.t('login_error_internet'));
    }
    throw new Error(i18n.t('login_error'));
  }
};

export const logout = async () => {
  if (app.currentUser) app.currentUser.logOut();
  const keys = ['selectedLocaliteEnq', 'selectedZone', 'userData'];
  AsyncStorage.multiRemove(keys).then(() => {
    SplashScreen.show();
    setTimeout(() => {
      startAuthScreens();
    }, 200);
  });
};

export const checkForUserChange = async userData => {
  const body = JSON.stringify({
    collection: 'users',
    database: 'ciblage',
    dataSource: 'taazour',
    pipeline: [
      {
        $match: {
          username: userData.username,
        },
      },
      {
        $lookup: {
          from: 'wilayas',
          localField: 'wilayaId',
          foreignField: '_id',
          as: 'wilaya',
        },
      },
      {
        $lookup: {
          from: 'moughataas',
          localField: 'moughataaId',
          foreignField: '_id',
          as: 'moughataa',
        },
      },
      {
        $lookup: {
          from: 'communes',
          localField: 'communeId',
          foreignField: '_id',
          as: 'commune',
        },
      },
      {
        $lookup: {
          from: 'localites',
          localField: 'localiteId',
          foreignField: '_id',
          as: 'localite',
        },
      },
      {
        $lookup: {
          from: 'zones',
          localField: 'zoneId',
          foreignField: '_id',
          as: 'zone',
        },
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'roleId',
          foreignField: '_id',
          as: 'role',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'controllerId',
          foreignField: '_id',
          as: 'controller',
        },
      },
      {
        $unwind: {
          path: '$wilaya',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$moughataa',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$commune',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$localite',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$zone',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$role',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$controller',
          preserveNullAndEmptyArrays: true,
        },
      },
    ],
  });
  try {
    const response = await fetch(
      'https://data.mongodb-api.com/app/data-cmshj/endpoint/data/beta/action/aggregate',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'api-key': 'Z1mK2dmkPYWTKe9tlTYAhtHvul905kqMFk01GStuwZ4u9U0vms0uf8YGg58FOITH',
        },
        body,
      },
    );
    let json;
    if (response.ok) {
      json = await response.json();
    } else {
      console.log('error', await response.text());
      throw new Error(i18n.t('error'));
    }
    const [user] = json.documents;
    let diff = getObjectDiff(userData, user);
    console.log(diff);
    const unconsideredValues = ['updatedAt', 'lastLoggedIn', 'syncedAt'];
    diff = diff.filter(v => !unconsideredValues.includes(v));
    console.log('deff', diff);
    if (diff.length > 0) {
      user.lastLoggedIn = userData.lastLoggedIn;
      AsyncStorage.setItem('userData', JSON.stringify({ ...user }));
      const keys = ['selectedLocaliteEnq', 'selectedZone'];
      AsyncStorage.multiRemove(keys);
      Alert.alert(
        i18n.t('attention'),
        i18n.t('user_change_message'),
        [
          {
            text: i18n.t('admit'),
            onPress: () => {
              SplashScreen.show();
              startScreens();
            },
          },
        ],
        { cancelable: false },
      );
    }
  } catch (error) {
    console.error('error mongo', error);
    if (error.message === 'Network request failed') {
      throw new Error(i18n.t('login_error_internet'));
    }
    throw new Error(i18n.t('error'));
  }
};

export const getListRouge = async () => {
  const body = JSON.stringify({
    collection: 'listrouge',
    database: 'ravel',
    dataSource: 'taazour',
    filter: {},
  });

  try {
    const response = await fetch(
      'https://data.mongodb-api.com/app/data-cmshj/endpoint/data/beta/action/find',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'api-key': 'Z1mK2dmkPYWTKe9tlTYAhtHvul905kqMFk01GStuwZ4u9U0vms0uf8YGg58FOITH',
        },
        body,
      },
    );
    let json;
    if (response.ok) {
      json = await response.json();
    } else {
      console.log('error', await response.text());
      throw new Error(i18n.t('error'));
    }
    const data = json.documents;
    console.log('data', data);
    return data;
  } catch (error) {
    console.error('error mongo', error);
    if (error.message === 'Network request failed') {
      throw new Error(i18n.t('login_error_internet'));
    }
    throw new Error(i18n.t('error'));
  }
};

export const getListRougeInfTypes = async storageInfras => {
  console.log('storageInfras', storageInfras);
  const nInfras = (storageInfras || []).map(i => ({ $oid: i._id }));
  console.log('nInfras', nInfras);
  const body = JSON.stringify({
    collection: 'infractiontypes',
    database: 'ravel',
    dataSource: 'taazour',
    filter: {
      _id: { $nin: nInfras },
    },
  });

  try {
    const response = await fetch(
      'https://data.mongodb-api.com/app/data-cmshj/endpoint/data/beta/action/find',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'api-key': 'Z1mK2dmkPYWTKe9tlTYAhtHvul905kqMFk01GStuwZ4u9U0vms0uf8YGg58FOITH',
        },
        body,
      },
    );
    let json;
    if (response.ok) {
      json = await response.json();
    } else {
      console.log('error', await response.text());
      throw new Error(i18n.t('error'));
    }
    const data = json.documents;
    console.log('data2', data);
    return data;
  } catch (error) {
    console.error('error mongo', error);
    if (error.message === 'Network request failed') {
      throw new Error(i18n.t('login_error_internet'));
    }
    throw new Error(i18n.t('error'));
  }
};
