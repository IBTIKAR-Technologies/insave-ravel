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
import React, { useState, useEffect, useMemo } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from 'src/styles';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { Formik, getIn } from 'formik';
import { initialValues, validationSchema as formVal } from 'src/lib/ciblageUrbanFormVald';
import { hp, wp } from 'src/lib/utilities';
import { editMenageSup } from 'src/models/cartes';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { withNextInputAutoFocusForm } from 'react-native-formik';
import { Navigation } from 'react-native-navigation';
import { chunk } from 'lodash';
import Toast from 'react-native-toast-message';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import questionaireUraban from '../lib/schemas/questionaireUrban';
import ItemRenderer from './Formik/ItemRenderer';
import LoadingModalTransparent from './LoadingModalTransparent';

// @ts-ignore

const Form = withNextInputAutoFocusForm(View);

const EditMenageSuper = function ({ componentId, concession, oldmenage }) {
  const { t } = useTranslation();
  const { language } = i18next;
  const [index, setIndex] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [errorsIndex, setErrorsIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const submitTheForm = async menage => {
    console.log('menage', menage);
    console.log('🚀 ~ file: AddMenage.js ~ line 46 ~ submitTheForm ~ concession', concession);
    const add = await editMenageSup(menage, oldmenage);
    if (add) {
      Navigation.pop(componentId).then(() => {
        Toast.show({
          type: 'success',
          text1: t('menage_added'),
          position: 'bottom',
          visibilityTime: 2000,
        });
      });
    } else {
      Toast.show({
        type: 'error',
        text1: t('menage_add_failed'),
        position: 'bottom',
        visibilityTime: 2000,
      });
    }
  };
  const countries = useMemo(() => {
    console.log('contriesmemo');
    let contries = global.realms[1].objects('country');
    contries = JSON.parse(JSON.stringify(contries));
    return contries.map(c => ({
      label: language === 'fr' ? c.namefr : c.namear,
      value: String(c._id),
    }));
  }, [language]);
  const dataChunk = useMemo(() => {
    console.log('dataChunksmemo');
    const data = questionaireUraban(t, countries);
    return chunk(data, 7);
  }, [countries, t]);

  const confirmMenage = menage => {
    Alert.alert(
      t('confirm'),
      t('confirm_menage_message'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('confirm'), onPress: () => submitTheForm(menage) },
      ],
      { cancelable: false },
    );
  };

  const validationSchema = formVal(t);

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
  }, [componentId, t]);

  const newM = JSON.parse(JSON.stringify(oldmenage));

  const editInitialValues = {
    chefNameFr: newM.chefNameFr || '',
    chefNameAr: newM.chefNameAr || '',
    familyNameFr: newM.familyNameFr || '',
    familyNameAr: newM.familyNameAr || '',
    ChefEstEnrole: newM.ChefEstEnrole || '',
    NNIChef: newM.NNIChef || '',
    Raisons: newM.Raisons || '',
    NomMereChef: newM.NomMereChef || '',
    TelChef: newM.TelChef || '',
    NationaliteChef: String(newM.NationaliteChef),
    ChefRefugie: newM.ChefRefugie || '',
    NbrProGres: newM.NbrProGres || '',
    AgeChef: String(newM.AgeChef || '0'),
    SexeChef: newM.SexeChef || '',
    SituatMatrChef: newM.SituatMatrChef || '',
    NivEdChef: newM.NivEdChef || '',
    NbrMbrMen: String(newM.NbrMbrMen || '0'),
    childrenLess2: String(newM.childrenLess2 || '0'),
    children614NoEduc: String(newM.children614NoEduc || '0'),
    children614NoEducM: String(newM.children614NoEducM || '0'),
    children614NoEducF: String(newM.children614NoEducF || '0'),
    children614: String(newM.children614 || '0'),
    children614M: String(newM.children614M || '0'),
    children614F: String(newM.children614F || '0'),
    pregnantNum: String(newM.pregnantNum || '0'),
    nbrHandicap: String(newM.nbrHandicap || '0'),
    NbrMC: String(newM.NbrMC || '0'),
    withRevenue: String(newM.withRevenue || '0'),
    nonRegisteredNum: String(newM.nonRegisteredNum || '0'),
    StatOccLog: newM.StatOccLog || '',
    housingType: newM.housingType || '',
    NbrPieces: String(newM.NbrPieces || '0'),
    waterSource: newM.waterSource || '',
    lightSource: newM.lightSource || '',
    TypeLatr: newM.TypeLatr || '',
    PSRDD: newM.PSRDD || '',
    AutrePSR: newM.AutrePSR || '',
    doYouHaveOneOrMore: newM.doYouHaveOneOrMore || '',
    PSEC: newM.PSEC || '',
    PersonnelMaison: newM.PersonnelMaison || '',
    benefitsFromServices: newM.benefitsFromServices || '',
    AMSituatMen: newM.AMSituatMen || '',
    AASituatMen: newM.AASituatMen || '',
    Repondant: newM.Repondant || '',
    AutreTel: newM.AutreTel || '',
    camelin: String(newM.animals.camelin || '0'),
    vache: String(newM.animals.vache || '0'),
    mouton: String(newM.animals.mouton || '0'),
    chevre: String(newM.animals.chevre || '0'),
    farmLand: String(newM.farmLand || '0'),
    roofMaterial: newM.roofMaterial || '',
    wallMaterial: newM.wallMaterial || '',
    floorMaterial: newM.floorMaterial || '',
    habitTerre: newM.habitTerre || '',
    landSize: String(newM.landSize),
  };

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      <LoadingModalTransparent loading={!loaded} />
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
      <ScrollView
        contentContainerStyle={{ alignItems: 'center' }}
        style={styles.scrollView}
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled>
        <Formik
          initialValues={editInitialValues}
          onSubmit={confirmMenage}
          validationSchema={validationSchema}
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
            if (errorsIndex > realErrors.length) {
              setErrorsIndex(errorsIndex - 1);
            }
            return (
              <Form
                style={{
                  width: wp(90) > 400 ? 400 : wp(90),
                  height: '97%',
                  justifyContent: 'space-evenly',
                  minHeight: hp(80),
                }}>
                <View style={{ flex: 1 }}>
                  {dataChunk[index].map(item => (
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
              </Form>
            );
          }}
        </Formik>
      </ScrollView>
    </LinearGradient>
  );
};

export default EditMenageSuper;

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
  nButton: {
    padding: 10,
    flex: 1,
    justifyContent: 'center',
    borderTopColor: '#fff',
    borderTopWidth: 1,
  },
});
