import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colors } from 'src/styles';

const Subtitle = ({ title }) => {
  return (
    <View>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

export default Subtitle;

const styles = StyleSheet.create({
  text: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'monospace',
  },
});
