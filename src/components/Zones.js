import { StyleSheet } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from 'src/styles';
import ZonesSupervisor from './ZonesSupervisor';
import ZonesController from './ZonesController';

const controllerRoleId = '62d5635aa5fac5ffb48ef7e4';
const supervisorRoleId = '62d5633aa5fac5ffb48ef7e3';

const Zones = ({ user, componentId }) => (
  <LinearGradient
    colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
    style={styles.root}
  >
    {user?.roleId === supervisorRoleId ? (
      <ZonesSupervisor user={user} componentId={componentId} />
    ) : user?.roleId === controllerRoleId ? (
      <ZonesController user={user} componentId={componentId} />
    ) : null}
  </LinearGradient>
);

export default Zones;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
