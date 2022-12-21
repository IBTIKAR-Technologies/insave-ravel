/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import Text from 'src/components/Text';

import validationError from 'src/lib/validation-error';
import { meta as Meta, input as Input } from '@data-driven-forms/common/prop-types-templates';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import {
  wp, getKeyboardFromType, dissmissKeyboard, hp,
} from 'src/lib/utilities';
import { Colors, CommonStyles } from 'src/styles';
import { useTranslation } from 'react-i18next';

const TextField = (props) => {
  const { t } = useTranslation();
  const {
    input,
    isDisabled,
    placeholder,
    helperText,
    description,
    validateOnMount,
    meta,
    ...rest
  } = useFieldApi(props);

  const {
    value, name, onBlur, onChange, onFocus, type,
  } = input;

  if (name === 'MenCINChef') {
    console.log('name', name);
    console.log('value', value);
    console.log('value', typeof (value));
  }

  const invalid = validationError(meta, validateOnMount);

  const errorText = invalid || ((meta.touched || validateOnMount) && meta.warning) || helperText || description;

  return (
    <View style={styles.root}>
      <View style={styles.label}>
        <Text style={[styles.labelText, invalid ? styles.labelTextError : {}]}>
          {t(name)}
        </Text>
      </View>
      <TextInput
        error={!!invalid}
        disabled={isDisabled}
        placeholder={placeholder}
        keyboardType={getKeyboardFromType(type)}
        defaultValue={typeof value === 'number' ? String(value) : value || undefined}
        onEndEditing={onChange}
        secureTextEntry={type === 'password'}
        onSubmitEditing={dissmissKeyboard}
        autoCorrect={false}
        returnKeyType="next"
        underlineColorAndroid="transparent"
        {...rest}
      />
      <HelperText type={invalid ? 'error' : 'info'} visible={Boolean(errorText)}>
        {errorText}
      </HelperText>
    </View>
  );
};

TextField.propTypes = {
  input: Input,
  meta: Meta,
  isReadOnly: PropTypes.bool,
  isDisabled: PropTypes.bool,
  placeholder: PropTypes.node,
  label: PropTypes.node,
  helperText: PropTypes.node,
  validateOnMount: PropTypes.bool,
  description: PropTypes.node,
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
  },
  label: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: hp(1),
  },
  labelText: {
    color: Colors.primary,
    fontWeight: 'bold',
    ...CommonStyles.text,
    flex: 1,
  },
  labelTextError: {
    color: Colors.error,
  },
});

export default TextField;
