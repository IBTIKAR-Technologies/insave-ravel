import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Colors } from 'src/styles';

const TilteField = ({ title }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{title}</Text>
  </View>
);

export default TilteField;

const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.primary,
    borderBottomWidth: 2,
    marginTop: 20,
  },
  text: {
    fontSize: 22,
    textAlign: 'center',
    padding: 2,
    fontFamily: 'serif',
  },
});
