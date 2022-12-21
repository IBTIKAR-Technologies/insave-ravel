import { Navigation } from 'react-native-navigation';
import { Common } from 'src/styles';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import screenNames from './screenNames';
import i18n from '../languages/i18n';

export const startAppScreens = async () => {
  const [traffic, list, ident, user] = await Promise.all([
    FontAwesome5.getImageSource('traffic-light', 25),
    FontAwesome5.getImageSource('list-alt', 25),
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
              id: 'infrasc',
              children: [
                {
                  component: {
                    name: screenNames.Home,
                    options: {
                      ...Common.header('infrasc'),
                    },
                  },
                },
              ],
              options: {
                bottomTab: {
                  icon: traffic,
                  selectedIconColor: '#a4a832',
                  selectedTextColor: '#a4a832',
                  text: i18n.t('infrasc'),
                },
              },
            },
          },
          {
            stack: {
              id: 'red_list',
              children: [
                {
                  component: {
                    name: screenNames.ListRouge,
                    options: {
                      ...Common.header('red_list'),
                    },
                  },
                },
              ],
              options: {
                bottomTab: {
                  icon: list,
                  selectedTextColor: '#700',
                  selectedIconColor: '#700',
                  text: i18n.t('red_list'),
                },
              },
            },
          },
          {
            stack: {
              id: 'ident',
              children: [
                {
                  component: {
                    name: screenNames.Identifications,
                    options: {
                      ...Common.header('ident'),
                    },
                  },
                },
              ],
              options: {
                bottomTab: {
                  icon: ident,
                  selectedTextColor: '#438742',
                  selectedIconColor: '#438742',
                  text: i18n.t('ident'),
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
