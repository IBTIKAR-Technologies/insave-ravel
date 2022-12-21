import { Formik, getIn } from 'formik';
import { chunk } from 'lodash';
import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from 'react-native';
import { withNextInputAutoFocusForm } from 'react-native-formik';
import { schema, formValidationSchema as val, initialValues } from 'src/lib/schemas/localSages';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';
import { wp } from 'src/lib/utilities';
import { Colors } from 'src/styles';
import i18next from 'i18next';
import LinearGradient from 'react-native-linear-gradient';
import { Navigation } from 'react-native-navigation';
import { submitLocaliteSage } from 'src/models/cartes';
import ItemRenderer from './Formik/ItemRenderer';

const Form = withNextInputAutoFocusForm(View);

const AddSage = ({ localite, componentId, zone }) => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [errorsIndex, setErrorsIndex] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const { language } = i18next;

  const dataChunk = useMemo(() => {
    const data = schema(t);
    return chunk(data, 10);
  }, [t]);

  const formValidationSchema = useMemo(() => val(t), [t]);
  const submitTheForm = async form => {
    const added = await submitLocaliteSage(form, localite, selectedZone);
    if (added) {
      Navigation.pop(componentId).then(() =>
        Toast.show({
          type: 'success',
          text1: t('formulaire_added'),
          position: 'bottom',
          visibilityTime: 2000,
        }),
      );
    } else {
      Toast.show({
        type: 'error',
        text1: t('formulaire_not_added'),
        position: 'bottom',
        visibilityTime: 2000,
      });
    }
  };

  const confirmLocalite = questionaire => {
    Alert.alert(
      t('confirm'),
      t('confirm_formulair_localite'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('confirm'), onPress: () => submitTheForm(questionaire) },
      ],
      { cancelable: false },
    );
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

  useEffect(() => {
    if (zone) {
      const zn = global.realms[0].objects('zone').filtered(`_id == oid(${zone})`)[0];
      setSelectedZone(zn);
    }
  }, [zone]);

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      <ScrollView
        contentContainerStyle={{ alignItems: 'center' }}
        style={styles.scrollView}
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled>
        <Formik
          initialValues={initialValues}
          onSubmit={confirmLocalite}
          validationSchema={formValidationSchema}
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
                }}>
                <View style={{ flex: 1 }}>
                  {dataChunk[index].map((item, i) => (
                    <ItemRenderer item={item} values={values} key={`${item.name}_${i}`} />
                  ))}
                </View>
                {!isKeyboardVisible && (
                  <View style={{ flexDirection: 'column' }}>
                    {realErrors.length > 0 && (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          alignSelf: 'center',
                          width: wp(90) > 400 ? 400 : wp(80),
                          marginTop: 15,
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
                      <Ionicons style={{ margin: 5 }} name="save" size={18} color={'#000'} />
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
                  </View>
                )}
              </Form>
            );
          }}
        </Formik>
      </ScrollView>
    </LinearGradient>
  );
};

export default AddSage;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
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
    elevation: 3,
    width: 200,
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
  },
  scrollView: {
    flex: 1,
    paddingVertical: 10,
    width: '100%',
    marginBottom: 10,
  },
});
