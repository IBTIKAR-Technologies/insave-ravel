import { Navigation } from 'react-native-navigation';
import { Colors } from 'src/styles';
import { I18nManager } from 'react-native';

const setDefaultOptions = () =>
  Navigation.setDefaultOptions({
    layout: {
      componentBackgroundColor: '#fff',
      orientation: ['portrait'],
      direction: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
    bottomTabs: {
      titleDisplayMode: 'alwaysShow',
    },
    bottomTab: {
      selectedIconColor: '#000',
      selectedTextColor: '#000',
      iconColor: Colors.grey,
      textColor: Colors.grey,
    },
    statusBar: {
      backgroundColor: Colors.primary,
      style: 'dark',
    },
    animations: {
      setRoot: {
        waitForRender: true,
      },
      push: {
        waitForRender: false,
      },
      pop: {
        waitForRender: false,
      },
    },
    topBar: {
      backButton: {
        color: '#000',
      },
    },
  });

export default setDefaultOptions;
