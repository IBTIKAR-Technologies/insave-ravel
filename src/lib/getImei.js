import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getImei = async () => {
  if (Platform.Version >= 29) {
    let phone = '';
    try {
      phone = await DeviceInfo.getPhoneNumber();
    } catch (error) {
      console.log('error', error);
    }
    console.log('phone', phone);
    AsyncStorage.setItem('imei', phone);
  }
};

export default getImei;
