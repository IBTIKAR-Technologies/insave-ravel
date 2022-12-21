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
import { addMenage } from 'src/models/cartes';
import { withNextInputAutoFocusForm } from 'react-native-formik';
import { Navigation } from 'react-native-navigation';
import { chunk } from 'lodash';
import Toast from 'react-native-toast-message';
import ErrorsComp from './ErrorsComp';
import questionaireUraban from '../lib/schemas/questionaireUrban';
import ItemRenderer from './Formik/ItemRenderer';
import WorningModal from './WarningModal';
import SubmitButton from './SubmitButton';

// @ts-ignore
const Form = withNextInputAutoFocusForm(View);

const AddFamily = function ({ user, componentId, concession, edit, oldmenage }) {
  const { t } = useTranslation();
  const { language } = i18next;
  const [index, setIndex] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [toBeAlerted, setToBeAlerted] = useState({});
  const [menageData, setMenageData] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const addTodb = async menage => {
    const add = await addMenage(menage, user, concession, edit, oldmenage);
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
  const submitTheForm = menage => {
    const alerts = {};
    if (parseInt(menage.NbrPieces, 10) > 5) {
      alerts.NbrPieces = true;
    }
    if (parseInt(menage.NbrMbrMen, 10) > 50) {
      alerts.NbrMbrMen = true;
    }
    if (Object.keys(alerts).length === 0) {
      addTodb(menage);
    } else {
      setMenageData(menage);
      setToBeAlerted(alerts);
      setModalOpen(true);
    }
  };
  const countries = useMemo(() => {
    let contries = global.realms[1].objects('country');
    contries = JSON.parse(JSON.stringify(contries));
    return contries.map(c => ({
      label: language === 'fr' ? c.namefr : c.namear,
      value: String(c._id),
    }));
  }, [language]);

  const dataChunk = useMemo(() => {
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

  const validationSchema = useMemo(() => formVal(t), [t]);

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

  const editInitialValues = edit
    ? {
        chefNameFr: oldmenage.chefNameFr || '',
        chefNameAr: oldmenage.chefNameAr || '',
        familyNameFr: oldmenage.familyNameFr || '',
        familyNameAr: oldmenage.familyNameAr || '',
        ChefEstEnrole: oldmenage.ChefEstEnrole || '',
        NNIChef: oldmenage.NNIChef || '',
        Raisons: oldmenage.Raisons || '',
        NomMereChef: oldmenage.NomMereChef || '',
        TelChef: oldmenage.TelChef || '',
        NationaliteChef: String(oldmenage.NationaliteChef),
        ChefRefugie: oldmenage.ChefRefugie || '',
        NbrProGres: oldmenage.NbrProGres || '',
        AgeChef: String(oldmenage.AgeChef || '0'),
        SexeChef: oldmenage.SexeChef || '',
        SituatMatrChef: oldmenage.SituatMatrChef || '',
        NivEdChef: oldmenage.NivEdChef || '',
        NbrMbrMen: String(oldmenage.NbrMbrMen || '0'),
        childrenLess2: String(oldmenage.childrenLess2 || '0'),
        children614NoEduc: String(oldmenage.children614NoEduc || '0'),
        pregnantNum: String(oldmenage.pregnantNum || '0'),
        nbrHandicap: String(oldmenage.nbrHandicap || '0'),
        NbrMC: String(oldmenage.NbrMC || '0'),
        withRevenue: String(oldmenage.withRevenue || '0'),
        nonRegisteredNum: String(oldmenage.nonRegisteredNum || '0'),
        StatOccLog: oldmenage.StatOccLog || '',
        housingType: oldmenage.housingType || '',
        NbrPieces: String(oldmenage.NbrPieces || '0'),
        waterSource: oldmenage.waterSource || '',
        lightSource: oldmenage.lightSource || '',
        TypeLatr: oldmenage.TypeLatr || '',
        PSRDD: oldmenage.PSRDD || '',
        AutrePSR: oldmenage.AutrePSR || '',
        doYouHaveOneOrMore: oldmenage.doYouHaveOneOrMore || '',
        PSEC: oldmenage.PSEC || '',
        PersonnelMaison: oldmenage.PersonnelMaison || '',
        benefitsFromServices: oldmenage.benefitsFromServices || '',
        AMSituatMen: oldmenage.AMSituatMen || '',
        AASituatMen: oldmenage.AASituatMen || '',
        Repondant: oldmenage.Repondant || '',
        AutreTel: oldmenage.AutreTel || '',
        camelin: String(oldmenage.animals.camelin || '0'),
        vache: String(oldmenage.animals.vache || '0'),
        mouton: String(oldmenage.animals.mouton || '0'),
        chevre: String(oldmenage.animals.chevre || '0'),
        farmLand: String(oldmenage.farmLand || '0'),
        roofMaterial: oldmenage.roofMaterial || '',
        wallMaterial: oldmenage.wallMaterial || '',
        floorMaterial: oldmenage.floorMaterial || '',
        habitTerre: oldmenage.habitTerre || '',
        landSize: parseInt(oldmenage.landSize || 0, 10),
      }
    : {};

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      {(toBeAlerted.NbrMbrMen || toBeAlerted.NbrPieces) && modalOpen ? (
        <WorningModal
          callBack={() => addTodb(menageData)}
          open={modalOpen}
          setOpen={setModalOpen}
          warnings={toBeAlerted}
          menage={menageData}
        />
      ) : null}
      <View style={{ flexDirection: 'row', width: '100%', marginTop: 0 }}>
        {[...Array(dataChunk.length).keys()].map(s => (
          <TouchableOpacity
            onPress={() => setIndex(s)}
            style={[styles.nButton, s !== index && { backgroundColor: Colors.primary }]}>
            <Text style={{ color: s !== index ? '#fff' : '#000', textAlign: 'center' }} key={s}>
              {s + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView
        contentContainerStyle={{ alignItems: 'center' }}
        style={styles.scrollView}
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled>
        <Formik
          initialValues={edit ? editInitialValues : initialValues}
          onSubmit={confirmMenage}
          validationSchema={validationSchema}
          validateOnMount={false}>
          {({ handleSubmit, values, errors, touched }) => {
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
              return null;
            });
            return (
              <Form
                style={{
                  height: '97%',
                  justifyContent: 'space-evenly',
                  minHeight: hp(80),
                }}>
                <View style={{ flex: 1, width: wp(90) > 400 ? 400 : wp(90), alignSelf: 'center' }}>
                  {dataChunk[index].map(item => {
                    console.log(`${item.name}_${item.order}`);
                    return (
                      <ItemRenderer
                        item={item}
                        values={values}
                        key={`${item.name}_${item.order}`}
                      />
                    );
                  })}
                </View>
                {realErrors.length > 0 && (
                  <ErrorsComp dataChunk={dataChunk} errors={realErrors} setIndex={setIndex} />
                )}
                {!isKeyboardVisible && <SubmitButton handleSubmit={handleSubmit} t={t} />}
              </Form>
            );
          }}
        </Formik>
      </ScrollView>
    </LinearGradient>
  );
};

export default AddFamily;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
