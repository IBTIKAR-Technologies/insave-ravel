import { StyleSheet, StatusBar, Platform } from 'react-native';
import i18n from 'src/lib/languages/i18n';
import config from 'src/constants/config';
import { wp, hp } from 'src/lib/utilities';

const { version } = config;

export const Colors = {
  primary: '#CCD6A6',
  primaryDark: '#F5EBE0',
  primaryLight: '#DAE2B6',
  primaryGradientStart: '#ffffff',
  primaryGradientEnd: '#3A8891',
  secondary: '#3A8891',
  grey: '#acacac',
  gray: '#5f5f5f',
  darkGray: '#4d4d4d',
  lightGray: '#9b9b9b',
  white: '#ffffff',
  blue: '#3b82f6',
  bluish: '#F1F1F7',
  black: '#000000',
  green: '#6DD0A3',
  yellow: '#E6DD3B',
  yellowLight: '#E6DD3B',
  warning: '#E6DD3B',
  success: '#28895D',
  error: '#C64756',
  lightBlue: '#42e0f5',
};

export const CommonStyles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    with: '100%',
    height: '100%',
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 5,
    marginBottom: 10,
    width: wp(90) > 300 ? 300 : wp(80),
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
  },
  buttonDis: {
    backgroundColor: Colors.gray,
    padding: 5,
    marginBottom: 10,
    width: wp(90) > 300 ? 300 : wp(80),
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
  },
  lotieImage: {
    height: hp(20),
    width: hp(20),
    alignSelf: 'center',
    marginBottom: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.select({ ios: 0, android: StatusBar.currentHeight }),
  },
  title: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    backgroundColor: 'transparent',
    fontSize: 20,
  },
  text: {
    fontSize: 15,
  },
  error: {
    fontSize: 12,
  },
});

export const Common = {
  header: title => ({
    topBar: {
      title: {
        text: i18n.t(title),
        fontSize: 18,
      },
      background: {
        color: Colors.primary,
      },
      backButton: {
        fontSize: 18,
      },
      rightButtons: [
        {
          text: version,
          fontSize: 12,
        },
      ],
    },
  }),
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 5,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 15,
    color: 'white',
  },
});
