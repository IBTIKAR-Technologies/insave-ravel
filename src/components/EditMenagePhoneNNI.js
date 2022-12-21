import { View, Text, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { withNextInputAutoFocusForm } from 'react-native-formik';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Formik, getIn } from 'formik';
import { hp, wp } from 'src/lib/utilities';
import { Colors } from 'src/styles';
import i18next from 'i18next';
import { ObjectId } from 'bson';
import { Navigation } from 'react-native-navigation';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import ItemRenderer from './Formik/ItemRenderer';
import LinearGradient from 'react-native-linear-gradient';

const Form = withNextInputAutoFocusForm(View);

const EditMenagePhoneNNI = ({ menage, componentId }) => {
  const { t } = useTranslation();
  const { language } = i18next;
  const [errorsIndex, setErrorsIndex] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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

  const schema = [
    {
      title: t('nni_number'),
      type: 'num',
      name: 'NNIChef',
      placeholder: t('nni_number'),
      order: 5.1,
    },
    {
      title: t('tel_chef'),
      type: 'num',
      name: 'TelChef',
      placeholder: t('tel_chef'),
      order: 7,
    },
  ];
  const initialValues = {
    NNIChef: menage.NNIChef || '',
    TelChef: menage.TelChef || '',
  };

  const valSchema = yup.object({
    NNIChef: yup
      .string()
      .required(`1. ${t('chef_nni')}`)
      .test(
        'is_nni',
        `1. ${t('must_be_nni')}`,
        nni => !Number.isNaN(nni) && nni % 97 === 1 && nni.length === 10,
      ),
    TelChef: yup
      .string()
      .required(`5. ${t('chef_tel')}`)
      .test(
        'is_phone',
        `5. ${t('must_be_phone')}`,
        val => !Number.isNaN(val) && /^(4|3|2)([0-9]{7})$/.test(val),
      ),
  });

  const confirmMenage = val => {
    const date = new Date();
    try {
      global.realms[0].write(() => {
        global.realms[0].create(
          'menage',
          {
            _id: new ObjectId(menage._id),
            NNIChef: val.NNIChef,
            TelChef: val.TelChef,
            syncedAt: null,
            updatedAt: date,
          },
          'modified',
        );
      });
      Navigation.pop(componentId);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      <Formik
        initialValues={initialValues}
        onSubmit={confirmMenage}
        validationSchema={valSchema}
        validateOnMount={false}>
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
                minHeight: hp(80),
              }}>
              <View style={{ flex: 1 }}>
                <Text style={{ textAlign: 'center', marginTop: 50 }}>
                  {language === 'fr'
                    ? menage.chefNameFr + ' ' + menage.familyNameFr
                    : menage.chefNameAr + ' ' + menage.familyNameAr}
                </Text>
                {schema.map(item => (
                  <ItemRenderer item={item} values={values} key={`${item.name}_${item.order}`} />
                ))}
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
                        <FontAwesome5Icon
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
                        <FontAwesome5Icon
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
            </Form>
          );
        }}
      </Formik>
    </LinearGradient>
  );
};

export default EditMenagePhoneNNI;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
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
    borderRadius: 50,
    flex: 1,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    padding: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    marginBottom: 15,
    marginTop: 15,
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
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    paddingVertical: 10,
    width: '100%',
    marginBottom: 10,
  },
});
