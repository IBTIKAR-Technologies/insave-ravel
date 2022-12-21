import { Colors, CommonStyles } from 'src/styles';

export default {
  navbarProps: {
    navigationBarStyle: { backgroundColor: '#000' },
    titleStyle: {
      color: Colors.black,
      alignSelf: 'center',
      fontSize: CommonStyles.title,
    },
  },

  tabProps: {
    swipeEnabled: true,
    activeBackgroundColor: 'rgba(255,255,255,0.1)',
    inactiveBackgroundColor: Colors.primaryLight,
    tabBarStyle: { backgroundColor: Colors.yellow },
  },

  icons: {
    style: { color: '#000', height: 30, width: 30 },
  },
};
