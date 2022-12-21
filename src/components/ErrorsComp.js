import i18next from 'i18next';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { wp } from 'src/lib/utilities';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from 'src/styles';

export default function ErrorsComp({ errors, setIndex, dataChunk }) {
  const [errorsIndex, setErrorsIndex] = useState(0);
  const { t } = useTranslation();
  const { language } = i18next;

  const handleGoToError = err => {
    for (let i = 0; i < dataChunk.length; i++) {
      for (let j = 0; j < dataChunk[i].length; j++) {
        if (
          (parseFloat(err.slice(0, 4)) ||
            parseFloat(err.slice(0, 3)) ||
            parseFloat(err.slice(0, 2)) ||
            parseFloat(err.slice(0, 2))) === parseFloat(dataChunk[i][j].order, 10)
        ) {
          setIndex(i);
          return;
        }
      }
    }
  };

  useEffect(() => {
    if (errorsIndex > errors.length) {
      setErrorsIndex(errorsIndex - 1);
    }
  }, [errorsIndex, errors]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: wp(100),
        marginTop: 40,
        marginBottom: 20,
        justifyContent: 'center',
      }}>
      <TouchableOpacity
        onPress={() => {
          if (errorsIndex > 0) {
            setErrorsIndex(errorsIndex - 1);
          }
        }}>
        <MaterialIcons
          name={language === 'ar' ? 'arrow-forward-ios' : 'arrow-back-ios'}
          size={30}
          color={Colors.black}
          style={{ paddingVertical: 15 }}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.error} onPress={() => handleGoToError(errors[errorsIndex])}>
        <Text style={styles.errorText}>{`${t('erreurn')}: ${errorsIndex + 1}`}</Text>
        <Text style={styles.errorText}>{errors[errorsIndex]}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (errorsIndex < errors.length - 1) {
            setErrorsIndex(errorsIndex + 1);
          }
        }}>
        <MaterialIcons
          name={language === 'ar' ? 'arrow-back-ios' : 'arrow-forward-ios'}
          size={30}
          color={Colors.black}
          style={{ paddingVertical: 15 }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    paddingVertical: 10,
    width: wp(90) > 400 ? 400 : wp(90),
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    textAlign: 'center',
  },
});
