import { Navigation } from 'react-native-navigation';
import { Common } from 'src/styles';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import screenNames from './screenNames';
import i18n from '../languages/i18n';

export const startAppScreens = async () => {
  const [traffic, history, ident, user] = await Promise.all([
    FontAwesome5.getImageSource('home', 25),
    FontAwesome5.getImageSource('history', 25),
    Entypo.getImageSource('magnifying-glass', 25),
    Octicons.getImageSource('person', 25),
    AsyncStorage.getItem('userData'),
  ]);
  Navigation.setRoot({
    root: {
      bottomTabs: {
        id: 'logged',
        children: [
          {
            stack: {
              id: 'home',
              children: [
                {
                  component: {
                    name: screenNames.Home,
                    options: {
                      ...Common.header('home'),
                    },
                  },
                },
              ],
              options: {
                bottomTab: {
                  icon: traffic,
                  selectedIconColor: '#a4a832',
                  selectedTextColor: '#a4a832',
                  text: i18n.t('home'),
                },
              },
            },
          },
          {
            stack: {
              id: 'history',
              children: [
                {
                  component: {
                    name: screenNames.HistoryCiblage,
                    options: {
                      ...Common.header('history'),
                    },
                  },
                },
              ],
              options: {
                bottomTab: {
                  icon: history,
                  selectedIconColor: '#a4a832',
                  selectedTextColor: '#a4a832',
                  text: i18n.t('history'),
                },
              },
            },
          },

          {
            stack: {
              id: 'user',
              children: [
                {
                  component: {
                    name: screenNames.User,
                    options: {
                      ...Common.header('user'),
                    },
                  },
                },
              ],
              options: {
                bottomTab: {
                  icon: user,
                  selectedTextColor: '#5cb7bd',
                  selectedIconColor: '#5cb7bd',
                  text: i18n.t('user'),
                },
              },
            },
          },
        ],
      },
    },
  });
};

export const startAuthScreens = () =>
  Navigation.setRoot({
    root: {
      stack: {
        id: 'loggedout',
        children: [
          {
            component: {
              name: screenNames.Login,
              options: {
                ...Common.header('login'),
              },
            },
          },
        ],
      },
    },
  });

export const startDataLoaderScreens = () =>
  Navigation.setRoot({
    root: {
      stack: {
        id: 'loggedout',
        children: [
          {
            component: {
              name: screenNames.DataLoader,
              options: {
                ...Common.header('loading_data'),
              },
            },
          },
        ],
      },
    },
  });
