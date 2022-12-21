import React, { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { compose } from 'recompose';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  handleTextInput,
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';
import Toast from 'react-native-toast-message';
import { TextInput } from 'react-native-paper';

import { hp, wp } from 'src/lib/utilities';
import { login } from 'src/models/auth';
import ButtonSubmit from './ButtonSubmit';
import Errors from './Formik/Errors';
import { Colors } from 'src/styles';

const Input = compose(handleTextInput, withNextInputAutoFocusInput)(TextInput);
const Form = withNextInputAutoFocusForm(View);

const FormLogin = function () {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    phone: Yup.string().required(t('phone_error')).min(3, t('phone_error')),
    password: Yup.string().required(t('password_error')).min(2, t('password_error')),
  });

  const goLogin = async values => {
    console.log('values', values);
    setLoading(true);
    try {
      await login(values);
    } catch (error) {
      console.log('errorrr', error);
      Toast.show({
        type: 'error',
        text1: error.message,
        position: 'bottom',
      });
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Formik
        initialValues={{ phone: '', password: '', account: '' }}
        onSubmit={goLogin}
        validationSchema={validationSchema}>
        {({ handleSubmit, status, errors, touched, dirty }) => {
          console.log('dirty', dirty);
          console.log('status', status);
          console.log('errors', errors);
          console.log('touched', touched);
          console.log('errors', errors);
          return (
            <Form
              style={{
                marginHorizontal: wp(5),
                width: wp(90) > 400 ? 400 : wp(90),
                alignSelf: 'center',
              }}>
              {Object.keys(errors).length > 0 && <Errors errors={errors} />}

              <View style={styles.inputContainer}>
                <Icon name="id-badge" size={20} style={{ padding: 5 }} />
                <Input
                  placeholder={t('phone')}
                  name="phone"
                  style={styles.input}
                  underlineColor="transparent"
                  underlineColorAndroid="transparent"
                />
              </View>
              <View style={styles.inputContainer}>
                <Icon name="lock" size={20} style={{ padding: 5 }} />
                <Input
                  placeholder={t('password')}
                  name="password"
                  type="password"
                  keyboardType="number-pad"
                  style={styles.input}
                  underlineColor="transparent"
                  underlineColorAndroid="transparent"
                />
              </View>

              <ButtonSubmit
                style={styles.button}
                loading={loading}
                disabled={Object.keys(errors).length > 0 || !dirty}
                onPress={handleSubmit}
              />
            </Form>
          );
        }}
      </Formik>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    width: '100%',
    marginTop: 20,
    borderColor: '#444444',
    borderRadius: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    borderRadius: 50,
    paddingLeft: 5,
    marginTop: 5,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: 'none',
    flex: 1,
    height: 40,
    padding: 0,
    fontSize: 20,
  },
});

export default FormLogin;
