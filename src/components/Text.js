import React from 'react';
import { StyleSheet } from 'react-native';
import { Text as Text2 } from 'react-native-paper';

import { CommonStyles, Colors } from 'src/styles';
import { wp, hp } from 'src/lib/utilities';

const Text = ({ style, children, ...rest }) => (
  <Text2 style={[styles.text, style]} {...rest}>
    {children}
  </Text2>
);

const styles = StyleSheet.create({
  text: {
    color: Colors.black,
    ...CommonStyles.text,
  },
});

export default Text;
