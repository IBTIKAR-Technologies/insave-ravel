import { StyleSheet, View, Modal, Text } from 'react-native';
import React from 'react';
import Lottie from 'lottie-react-native';
import { wp } from 'src/lib/utilities';

const LoadingModalTransparent = ({ loading, message }) => {
  return (
    <Modal
      animationType="none"
      transparent
      visible={loading}
      style={{ zIndex: 1100 }}
      onRequestClose={() => {}}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <View style={styles.animationWrapper}>
            <Lottie source={require('../assets/lottie/loadingAnimation.json')} autoPlay loop />
          </View>
          <Text style={{}}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default LoadingModalTransparent;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: `#4447`,
    zIndex: 1000,
  },
  activityIndicatorWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  asking: {},
  animationWrapper: {
    height: wp(90) > 300 ? 300 : wp(75),
    width: wp(90) > 300 ? 300 : wp(75),
    alignSelf: 'center',
  },
});
