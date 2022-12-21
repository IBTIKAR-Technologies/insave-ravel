import { StyleSheet, Text, View, Modal, ActivityIndicator } from 'react-native';
import React from 'react';
import i18n from 'src/lib/languages/i18n';
import { Colors } from 'src/styles';

const LoadingModal = ({ color, size, loading, text }) => (
  <Modal animationType="none" visible={loading} style={{ zIndex: 1100 }} onRequestClose={() => {}}>
    <View style={styles.modalBackground}>
      <View style={styles.activityIndicatorWrapper}>
        <ActivityIndicator animating={loading} color={color} size={size} />
        <Text style={styles.asking}>{i18n.t(text)}</Text>
      </View>
    </View>
  </Modal>
);

export default LoadingModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: `${Colors.primary}ff`,
    zIndex: 1000,
  },
  activityIndicatorWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  asking: {},
});
