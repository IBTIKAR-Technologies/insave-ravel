import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from 'src/styles';
import FinalSelection from 'src/components/FinalSelection';
import { StyleSheet } from 'react-native';

export default function FinalSelectionContainer(props) {
  const [loading, setLoading] = React.useState(true);
  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}
    >
      <FinalSelection setLoading={setLoading} loading={loading} {...props} />
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
