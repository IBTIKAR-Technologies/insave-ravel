import React, { useEffect, useState } from 'react';
import {
  Keyboard, StyleSheet, View, Text,
} from 'react-native';
import Logo from 'src/components/Logo';
import FormLogin from 'src/components/FormLogin';
import { Colors } from 'src/styles';
import LinearGradient from 'react-native-linear-gradient';
import Language from 'src/components/Language';
import SplashScreen from 'react-native-splash-screen';
import { Navigation } from 'react-native-navigation';
import UpdateStatus from 'src/lib/getUpdateStatus';

const Login = function ({ componentId }) {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true); // or some other action
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false); // or some other action
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    const listener = {
      componentDidAppear: () => {
        console.log('RNN', 'componentDidAppear');
        setTimeout(() => {
          console.log('splash');
          SplashScreen.hide();
        }, 200);
      },
    };
    const unsubscribe = Navigation.events().registerComponentListener(listener, componentId);
    return () => {
      unsubscribe.remove();
    };
  }, [componentId]);

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}
    >
      <UpdateStatus />
      <Logo />
      <FormLogin />
      {!isKeyboardVisible && <Language />}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default Login;
