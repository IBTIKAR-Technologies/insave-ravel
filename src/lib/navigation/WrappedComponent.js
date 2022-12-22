import React, { useEffect } from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Colors } from 'src/styles';
import { NetworkProvider, useIsConnected } from 'react-native-offline';
import Toast from 'react-native-toast-message';
import { storage } from '../../../index';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    accent: Colors.secondary,
  },
};

export default function WrappedComponent(Component) {
  return function inject(props) {
    const EnhancedComponent = () => (
      <NetworkProvider>
        <PaperProvider theme={theme}>
          <Component {...props}>{props}</Component>
          <Toast />
        </PaperProvider>
      </NetworkProvider>
    );

    return <EnhancedComponent />;
  };
}
