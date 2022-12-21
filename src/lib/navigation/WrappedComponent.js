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
const SyncComponent = ({ children }) => {
  const isConnected = useIsConnected();
  const nonSyncedInfras = storage.getString('nonSyncedInfras');
  useEffect(() => {
    if (isConnected && nonSyncedInfras) {
      console.log('isConnected', nonSyncedInfras);
    } else {
      console.log('noSync');
    }
  }, [isConnected, nonSyncedInfras]);

  return children;
};

export default function WrappedComponent(Component) {
  return function inject(props) {
    const EnhancedComponent = () => (
      <NetworkProvider>
        <PaperProvider theme={theme}>
          <SyncComponent>
            <Component {...props}>{props}</Component>
            <Toast />
          </SyncComponent>
        </PaperProvider>
      </NetworkProvider>
    );

    return <EnhancedComponent />;
  };
}
