import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Alert,
  BackHandler,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from 'src/styles';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { Formik, getIn } from 'formik';
import { hp, wp } from 'src/lib/utilities';
import { addEnquete } from 'src/models/cartes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { withNextInputAutoFocusForm } from 'react-native-formik';
import { chunk } from 'lodash';
import { Navigation } from 'react-native-navigation';
import Toast from 'react-native-toast-message';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ObjectId } from 'bson';
import screenNames from 'src/lib/navigation/screenNames';
import { questionaire, validationSchema, initialValues } from '../lib/schemas/enquete';
import ItemRenderer from './Formik/ItemRenderer';
import ErrorsComp from './ErrorsComp';
import LoadingModalTransparent from './LoadingModalTransparent';

// @ts-ignore

const Form = withNextInputAutoFocusForm(View);

const AddEnquete = function ({ user, componentId, menage, menagesComponentId }) {
  initialValues.TelChef = menage.TelChef || '';
  initialValues.NNIChef = String(menage.NNIChef || '');
  initialValues.NbrMbrMen = String(menage.NbrMbrMen);
  const { t } = useTranslation();
  const { language } = i18next;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [errorsIndex, setErrorsIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [theEnquete, setTheEnquete] = useState({});
  const [beginAt] = useState(new Date());

  const submitTheForm = async enquete => {
    const enqueteId = new ObjectId();
    const add = await addEnquete(menage, enquete, beginAt, enqueteId, t, theEnquete);
    if (add === 'err') {
      return;
    }
    if (add) {
      Navigation.push(componentId, {
        component: {
          name: screenNames.MenageMembres,
          options: {
            topBar: {
              title: {
                text: t('menage_membres'),
                color: '#000',
              },
              background: {
                color: Colors.primary,
              },
              backButton: {
                visible: false,
              },
              rightButtons: [
                {
                  component: {
                    name: 'EnqueteTimer',
                    passProps: {
                      user,
                      menage,
                    },
                  },
                },
              ],
            },
            animations: {
              pop: {
                content: {
                  x: {
                    from: 0,
                    to: wp(95),
                    duration: 200,
                    startDelay: 0,
                  },
                },
              },
              push: {
                content: {
                  x: {
                    from: wp(95),
                    to: 0,
                    duration: 200,
                    startDelay: 0,
                  },
                },
              },
            },
          },
          passProps: {
            user,
            enqueteId,
            menage,
            menagesComponentId,
            enquete,
          },
        },
      });
    } else {
      Toast.show({
        type: 'error',
        text1: t('enquete_add_failed'),
        position: 'bottom',
        visibilityTime: 2000,
      });
    }
  };

  const data = questionaire(t);
  const dataChunk = chunk(data, 7);
  const schemaVal = validationSchema(t);

  const confirmMenage = menage => {
    Alert.alert(
      t('confirm'),
      t('confirm_enquete_message'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('confirm'), onPress: () => submitTheForm(menage) },
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
    setTimeout(() => {
      setLoaded(true);
    }, 500);
  }, []);

  let intValues = initialValues;

  const enquete = global.realms[0].objects(`enquete`).filtered(`menageId == oid(${menage._id})`)[0];
  if (enquete) {
    console.log('enquete', enquete);
    console.log('enquete.waloNoPropMoud', enquete.waloNoPropMoud);
    console.log('enquete.diriLandNoProp', enquete.diriLandNoProp);
    console.log('enquete.irigueLandNoProp', enquete.irigueLandNoProp);
    console.log('enquete', enquete);
    if (!theEnquete._id) {
      setTheEnquete(enquete);
    }
    intValues = {
      TelChef: enquete.TelChef || '',
      NNIChef: enquete.NNIChef || '',
      NbrMbrMen: String(enquete.NbrMbrMen),
      hasHandicaps: enquete.hasHandicaps || '',
      handicapType: enquete.handicapType || '',
      hasCronicIllness: enquete.hasCronicIllness || '',
      infRenal: String(enquete.infRenal || '0'),
      debetes: String(enquete.debetes || '0'),
      cardiaque: String(enquete.cardiaque || '0'),
      otherIllness: String(enquete.otherIllness || '0'),
      asurrance: enquete.asurrance,
      statePrograms: enquete.statePrograms || '',
      wichProgram: JSON.parse(JSON.stringify(enquete.wichProgram)) || [],
      otherHouse: enquete.otherHouse || '',
      farmingLand: enquete.farmingLand || '',
      waloLand: enquete.waloLand || '',
      waloMoud: String(enquete.waloMoud) || '0',
      diriLand: enquete.diriLand || '',
      diriMoud: String(enquete.diriMoud) || '0',
      freeFarmLand: enquete.freeFarmLand || '',
      waloLandNoProp: enquete.waloLandNoProp || '',
      waloNoPropMoud: String(enquete.waloNoPropMoud) || '0',
      diriLandNoProp: enquete.diriLandNoProp || '',
      diriNoPropMoud: String(enquete.diriNoPropMoud) || '0',
      irigueLandNoProp: enquete.irigueLandNoProp || '',
      irigueNoPropMoud: String(enquete.irigueNoPropMoud) || '0',
      chiken: String(enquete.chiken || '0'),
      donkey: String(enquete.donkey || '0'),
      horse: String(enquete.horse || '0'),
      familyHasAny: JSON.parse(JSON.stringify(enquete.familyHasAny)) || [],
      foodSource: JSON.parse(JSON.stringify(enquete.foodSource)) || [],
      mealCount: enquete.mealCount || '',
      lesFavrable: enquete.lesFavrable || '',
      lendForFood: enquete.lendForFood || '',
      reduceFood: enquete.reduceFood || '',
      reduceFoodAdult: enquete.reduceFoodAdult || '',
      reduceMealCount: enquete.reduceMealCount || '',
      sellDomestique: enquete.sellDomestique || '',
      sellAnim: enquete.sellAnim || '',
      spendSaving: enquete.spendSaving || '',
      lendMoneyFood: enquete.lendMoneyFood || '',
      sellProductif: enquete.sellProductif || '',
      reduceExpences: enquete.reduceExpences || '',
      childenOutSchool: enquete.childenOutSchool || '',
      sellLand: enquete.sellLand || '',
      mandier: enquete.mandier || '',
      sellProductifFemale: enquete.sellProductifFemale || '',
    };
  }

  console.log('intVAlues', intValues);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
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
    return () => backHandler.remove();
  }, [componentId, menagesComponentId, t, user]);

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      <LoadingModalTransparent loading={!loaded} />
      <View style={{ flexDirection: 'row', width: '100%', marginTop: 0 }}>
        {[...Array(dataChunk.length).keys()].map(s => {
          return (
            <TouchableOpacity
              key={s}
              onPress={() => setIndex(s)}
              style={[styles.nButton, s !== index && { backgroundColor: Colors.primary }]}>
              <Text style={{ color: s !== index ? '#fff' : '#000', textAlign: 'center' }}>
                {s + 1}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <ScrollView
        contentContainerStyle={{ alignItems: 'center' }}
        style={styles.scrollView}
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled>
        <Formik
          onSubmit={confirmMenage}
          validateOnMount={false}
          initialValues={intValues}
          validationSchema={schemaVal}>
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
                  height: '97%',
                  justifyContent: 'space-evenly',
                  minHeight: hp(80),
                }}>
                <View style={{ flex: 1, width: wp(90) > 400 ? 400 : wp(90), alignSelf: 'center' }}>
                  {dataChunk[index].map((item, index) => (
                    <ItemRenderer
                      item={item}
                      values={values}
                      key={`${item.name}_${item.order}_${index.toString()}`}
                      setFieldValue={setFieldValue}
                    />
                  ))}
                </View>
                {realErrors.length > 0 && (
                  <ErrorsComp dataChunk={dataChunk} errors={realErrors} setIndex={setIndex} />
                )}
                {!isKeyboardVisible && (
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
                )}
              </Form>
            );
          }}
        </Formik>
      </ScrollView>
    </LinearGradient>
  );
};

export default AddEnquete;

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
    width: wp(90) > 400 ? 400 : wp(90),
    alignSelf: 'center',
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
  nButton: {
    padding: 10,
    flex: 1,
    justifyContent: 'center',
    borderTopColor: '#fff',
    borderTopWidth: 1,
  },
});
