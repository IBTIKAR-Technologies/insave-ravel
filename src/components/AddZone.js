import { Formik, getIn } from 'formik';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { withNextInputAutoFocusForm } from 'react-native-formik';
import LinearGradient from 'react-native-linear-gradient';
import { Navigation } from 'react-native-navigation';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { zoneSchema, validationSchema } from 'src/lib/schemas/zoneSchema';
import { wp } from 'src/lib/utilities';
import { addZone } from 'src/models/cartes';
import { Colors } from 'src/styles';
import i18next from 'i18next';
import Toast from 'react-native-toast-message';
import mapper from './Formik/Mapper';

const Form = withNextInputAutoFocusForm(View);

const AddZone = ({ componentId, user, t, localite, edit, oldzone }) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [errorsIndex, setErrorsIndex] = useState(0);
  const schema = zoneSchema(t);
  const { language } = i18next;
  const initialValues = edit
    ? {
        namefr: oldzone.namefr,
        namear: oldzone.namear,
      }
    : {
        namefr: localite.namefr_rs + ' /',
        namear: localite.namear + ' /',
      };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true); // or some other action
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false); // or some other action
    });
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const confirmLocalite = val => {
    if (val.namefr === initialValues.namefr + ' /' || val.namear === initialValues.namear) return;
    Alert.alert(
      t('confirm'),
      t('confirm_add_zone'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('confirm'),
          onPress: async () => {
            const added = await addZone(val, user, localite, edit, oldzone);
            if (added) {
              Navigation.pop(componentId).then(() =>
                Toast.show({
                  type: 'success',
                  text1: t('success'),
                  text2: t('zone_added'),
                  position: 'bottom',
                  visibilityTime: 2000,
                }),
              );
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      <Formik
        initialValues={initialValues}
        validateOnMount={false}
        validationSchema={validationSchema(t)}
        onSubmit={confirmLocalite}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => {
          const realErrors = [];
          Object.keys(errors).map(name => {
            let error = getIn(errors, name);
            const touch = getIn(touched, name);
            if (touch && error) {
              if (typeof error === 'object') {
                error = error && error[0] ? Object.values(error[0]).join(', ') : 'Erreur';
              }
              realErrors.push(error);
            }
          });
          return (
            <Form
              style={{
                width: wp(90) > 400 ? 400 : wp(90),
                height: '97%',
                justifyContent: 'space-evenly',
              }}>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1 }}>
                  {schema.map((item, i) => {
                    const Comp = mapper[item.type];
                    return Comp ? (
                      item.type === 'fieldArray' || item.type === 'fieldArray2' ? (
                        <Comp key={`${item.name}_${item.order}`} {...item} values={values} />
                      ) : (
                        <Comp key={`${item.name}_${item.order}`} {...item} />
                      )
                    ) : null;
                  })}
                </View>
                {!isKeyboardVisible && (
                  <>
                    {realErrors.length > 0 && (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          alignSelf: 'center',
                          width: '100%',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            if (errorsIndex > 0) {
                              setErrorsIndex(errorsIndex - 1);
                            }
                          }}>
                          <FontAwesome5
                            style={{ margin: 3 }}
                            name={language === 'ar' ? 'arrow-right' : 'arrow-left'}
                            size={20}
                            color={Colors.black}
                          />
                        </TouchableOpacity>
                        <View style={styles.error}>
                          <Text style={styles.errorText}>{`${t('erreurn')}: ${
                            errorsIndex + 1
                          }`}</Text>
                          <Text style={styles.errorText}>{realErrors[errorsIndex]}</Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            if (errorsIndex < realErrors.length - 1) {
                              setErrorsIndex(errorsIndex + 1);
                            }
                          }}>
                          <FontAwesome5
                            style={{ margin: 3 }}
                            name={language === 'ar' ? 'arrow-left' : 'arrow-right'}
                            size={20}
                            color={Colors.black}
                          />
                        </TouchableOpacity>
                      </View>
                    )}

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                      <Ionicons style={{ margin: 5 }} name="save" size={18} color="#fff" />
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: 'bold',
                          color: '#000',
                          textAlign: 'center',
                        }}>
                        {t('submit')}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </ScrollView>
            </Form>
          );
        }}
      </Formik>
    </LinearGradient>
  );
};

export default AddZone;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  divButton: {
    marginTop: 50,
    paddingVertical: 5,
    backgroundColor: Colors.blue,
    borderRadius: 20,
    width: 200,
    alignSelf: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 3,
    marginTop: 10,
    padding: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: 30,
    flex: 1,
    justifySelf: 'flex-end',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    padding: 7,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  error: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    borderColor: 'red',
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 5,
    width: '80%',
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 10,
  },
});
