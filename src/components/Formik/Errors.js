import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Colors } from 'src/styles';
import { hp, wp } from 'src/lib/utilities';
import { useTranslation } from 'react-i18next';
import { ErrorMessage } from 'formik';

const Errors = ({ errors }) => {
  const { t } = useTranslation();
  return (
    <>
      {Object.keys(errors).map((key, index) => (
        <ErrorMessage name={key} key={key} component={Text} style={styles.error} />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  error: {
    width: '100%',
    color: 'rgba(204, 80, 71, 0.8)',
    textAlign: 'center',
  },
});

export default Errors;
