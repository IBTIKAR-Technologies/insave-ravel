import { Navigation } from 'react-native-navigation';
import { Common } from 'src/styles';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import screenNames from './screenNames';
import i18n from '../languages/i18n';
import { nextlevels } from '../utilities';

export const startAppScreens = async () => {
  const [traffic, history, user, userData, addusergroup] = await Promise.all([
    FontAwesome5.getImageSource('home', 25),
    FontAwesome5.getImageSource('history', 25),
    Octicons.getImageSource('person', 25),
    AsyncStorage.getItem('userData'),
    AntDesign.getImageSource('addusergroup', 25),
  ]);
  const userD = JSON.parse(userData);
  console.log('userData', userData);
  if (userD.role === 'admin') {
    console.log('user?.role', userD.role);
    Navigation.setRoot({
      root: {
        bottomTabs: {
          id: 'logged',
          children: [
            {
              stack: {
                id: 'users',
                children: [
                  {
                    component: {
                      name: screenNames.Users,
                      options: {
                        ...Common.header(`${i18n.t('users')} ${nextlevels[userD.role]}`),
                      },
                    },
                  },
                ],
                options: {
                  bottomTab: {
                    icon: addusergroup,
                    selectedIconColor: '#a4a832',
                    selectedTextColor: '#a4a832',
                    text: i18n.t('users'),
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
                        ...Common.header(i18n.t('user')),
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
  } else if (userD.role === 'actniv3') {
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
                        ...Common.header(i18n.t('home')),
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
                        ...Common.header(i18n.t('history')),
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
                        ...Common.header(i18n.t('user')),
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
  } else {
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
                        ...Common.header(i18n.t('home')),
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
                        ...Common.header(i18n.t('history')),
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
                id: 'users',
                children: [
                  {
                    component: {
                      name: screenNames.Users,
                      options: {
                        ...Common.header(`${i18n.t('users')} ${nextlevels[userD.role]}`),
                      },
                    },
                  },
                ],
                options: {
                  bottomTab: {
                    icon: addusergroup,
                    selectedIconColor: '#a4a832',
                    selectedTextColor: '#a4a832',
                    text: i18n.t('users'),
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
                        ...Common.header(i18n.t('user')),
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
  }
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
                ...Common.header(i18n.t('login')),
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
                ...Common.header(i18n.t('loading_data')),
              },
            },
          },
        ],
      },
    },
  });
