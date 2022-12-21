import 'react-native-get-random-values';
import { Navigation } from 'react-native-navigation';
import startScreens from 'src/lib/navigation/startScreens';
import setDefaultOptions from 'src/lib/navigation/navigationOptions';

import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

Navigation.events().registerAppLaunchedListener(() => {
  setDefaultOptions();
  startScreens();
});
