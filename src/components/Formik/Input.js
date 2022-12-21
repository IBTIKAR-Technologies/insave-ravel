import React from 'react';
import { compose } from 'recompose';
import { handleTextInput, withNextInputAutoFocusInput } from 'react-native-formik';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import i18n from 'src/lib/languages/i18n';
import { Colors } from 'src/styles';

const Input = compose(handleTextInput, withNextInputAutoFocusInput)(TextInput);

const TextInputForm = props => (
  <View>
    <Text style={styles.questTitle}>{`${props.order}) ${i18n.t(props.title)}`}</Text>
    <Input style={styles.textInput} {...props} placeholder={i18n.t(props.placeholder)} />
  </View>
);

const styles = StyleSheet.create({
  questTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
  },
  textInput: {
    backgroundColor: '#000',
    height: 50,
    paddingHorizontal: 10,
    fontSize: 18,
  },
  errorMessage: {
    color: 'red',
    fontSize: 12,
  },
});

export default TextInputForm;
