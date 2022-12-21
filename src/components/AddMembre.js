import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  Alert,
  Keyboard,
  BackHandler,
} from 'react-native';
import { Colors } from 'src/styles';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import { Formik, getIn } from 'formik';
import { withNextInputAutoFocusForm } from 'react-native-formik';
import Ionicons from 'react-native-vector-icons/Ionicons';
import questionaire, {
  initialValues,
  validationSchema as theValSchema,
} from 'src/lib/schemas/membreSchema';
import Toast from 'react-native-toast-message';
import { Navigation } from 'react-native-navigation';
import { addMembre } from 'src/models/cartes';
import { wp } from 'src/lib/utilities';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import i18next from 'i18next';
import { chunk } from 'lodash';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ItemRenderer from './Formik/ItemRenderer';

const Form = withNextInputAutoFocusForm(View);

export default function AddMembre({ user, componentId, menage, chefSelected }) {
  const { t } = useTranslation();
  const { language } = i18next;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [errorsIndex, setErrorsIndex] = useState(0);
  const [index, setIndex] = useState(0);

  const quetions = questionaire(t, chefSelected);
  const dataChunk = chunk(quetions, 7);
  const validationSchema = theValSchema(t);

  const submitTheForm = async values => {
    const added = await addMembre(values, user, menage);
    if (added) {
      Navigation.pop(componentId).then(() =>
        Toast.show({
          type: 'success',
          text1: t('success'),
          text2: t('membre_added'),
          position: 'bottom',
          visibilityTime: 2000,
        }),
      );
    }
  };

  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        t('confirm'),
        t('confirm_return'),
        [
          { text: t('cancel'), style: 'cancel' },
          { text: t('confirm'), onPress: () => Navigation.pop(componentId) },
        ],
        { cancelable: false },
      );
      return true;
    });
    return () => {
      listener.remove();
    };
  }, [componentId, t]);

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

  const confirmMembre = values => {
    Alert.alert(
      t('confirm'),
      t('confirm_add_membre'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('confirm'), onPress: () => submitTheForm(values) },
      ],
      { cancelable: true },
    );
  };

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      <View style={{ flexDirection: 'row', width: '100%', marginTop: 0 }}>
        {[...Array(dataChunk.length).keys()].map(s => {
          return (
            <TouchableOpacity
              onPress={() => setIndex(s)}
              style={[styles.nButton, s !== index && { backgroundColor: Colors.primary }]}>
              <Text style={{ color: s !== index ? '#fff' : '#000', textAlign: 'center' }} key={s}>
                {s + 1}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Formik
        initialValues={initialValues}
        onSubmit={confirmMembre}
        validateOnMount={false}
        validationSchema={validationSchema}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => {
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
                  {dataChunk[index].map((item, i) => (
                    <ItemRenderer
                      item={item}
                      values={values}
                      key={`${item.name}_${item.order}`}
                      setFieldValue={setFieldValue}
                    />
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
}

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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    marginBottom: 15,
    marginTop: 20,
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  nButton: {
    padding: 10,
    flex: 1,
    justifyContent: 'center',
    borderTopColor: '#fff',
    borderTopWidth: 1,
  },
});
