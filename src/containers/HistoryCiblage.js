import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from 'src/styles';
import HistoryCiblage from 'src/components/HistoryCiblage';
import { StyleSheet } from 'react-native';

export default function HistoryContainer(props) {
  const [loading, setLoading] = React.useState(true);
  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}
    >
      <HistoryCiblage setLoading={setLoading} loading={loading} {...props} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
