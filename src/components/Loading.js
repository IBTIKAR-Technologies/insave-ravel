import React from 'react';
import PropTypes from 'prop-types';
import { Colors } from 'src/styles';
import { StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

const Loading = (props) => {
  const { children } = props;
  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}
    >
      {children && children}
      <ActivityIndicator animating size="large" color={Colors.primary} />
    </LinearGradient>
  );
};

Loading.propTypes = {
  children: PropTypes.shape({}),
};

Loading.defaultProps = {
  children: null,
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
