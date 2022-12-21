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
import { schema, formValidationSchema as val, initialValues } from 'src/lib/schemas/localiteInfras';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';
import { wp } from 'src/lib/utilities';
import { Colors } from 'src/styles';
import i18next from 'i18next';
import LinearGradient from 'react-native-linear-gradient';
import { Navigation } from 'react-native-navigation';
import { submitLocaliteInfras } from 'src/models/cartes';
import ErrorsComp from './ErrorsComp';
import ItemRenderer from './Formik/ItemRenderer';
import SubmitButton from './SubmitButton';

const Form = withNextInputAutoFocusForm(View);

const LocaliteIdentification = ({ localite, componentId }) => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [errorsIndex, setErrorsIndex] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const { language } = i18next;

  const dataChunk = useMemo(() => {
    const data = schema(t);
    return chunk(data, 10);
  }, [t]);
  const formValidationSchema = useMemo(() => val(t), [t]);
  const submitTheForm = async form => {
    const added = await submitLocaliteInfras(form, localite);
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

  let oldInitialValues;

  if (localite) {
    oldInitialValues = {
      IV1E1: String(localite.IV1E1 || '0'),
      IV1E2: String(localite.IV1E2 || '0'),
      IV1E3: String(localite.IV1E3 || '0'),
      IV1E4: String(localite.IV1E4 || '0'),
      IV1E5: localite.IV1E5 || '',
      IV1E6: String(localite.IV1E6 || '0'),
      IV1E7: localite.IV1E7 || '',
      IV1E8: String(localite.IV1E8 || '0'),
      IV1E9: localite.IV1E9 || '',
      IV1E10: String(localite.IV1E10 || '0'),
      IV1E11: localite.IV1E11 || '',
      IV1E12: String(localite.IV1E12 || '0'),
      IV1E13: localite.IV1E13 || '',
      IV1E14: String(localite.IV1E14 || '0'),
      IV2S1: String(localite.IV2S1 || '0'),
      IV2S2: localite.IV2S2 || '',
      IV2S3: String(localite.IV2S3 || '0'),
      IV2S4: localite.IV2S4 || '',
      IV2S5: String(localite.IV2S5 || '0'),
      IV2S6: localite.IV2S6 || '',
      IV2S7: String(localite.IV2S7 || '0'),
      IV2S8: localite.IV2S8 || '',
      IV2S9: String(localite.IV2S9 || '0'),
      IV2S10: localite.IV2S10 || '',
      IV2S11: String(localite.IV2S11 || '0'),
      IV2S12: localite.IV2S12 || '',
      IV2S13: String(localite.IV2S13 || '0'),
      IV2S14: localite.IV2S14 || '',
      puits: String(localite.puits || '0'),
      sondage: String(localite.sondage || '0'),
      brone: String(localite.brone || '0'),
      AEP: String(localite.AEP || '0'),
      SNDE: localite.SNDE || '',
      electricLine: localite.electricLine || '',
      solar: String(localite.solar || '0'),
      mosqNum: String(localite.mosqNum || '0'),
      younHouseNum: String(localite.younHouseNum || '0'),
      CFPFNum: String(localite.CFPFNum || '0'),
      stadNum: String(localite.stadNum || '0'),
      store: String(localite.store || '0'),
      hebdo: String(localite.hebdo || '0'),
      betail: String(localite.betail || '0'),
      bettoir: String(localite.bettoir || '0'),
      parcVaccination: String(localite.parcVaccination || '0'),
      veterin: String(localite.veterin || '0'),
      station: String(localite.station || '0'),
      hotel: String(localite.hotel || '0'),
    };
  }

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
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
          initialValues={localite ? oldInitialValues : initialValues}
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
                  height: '97%',
                  justifyContent: 'space-evenly',
                }}>
                <View style={{ flex: 1, width: wp(90) > 400 ? 400 : wp(90), alignSelf: 'center' }}>
                  {dataChunk[index].map((item, i) => (
                    <ItemRenderer item={item} values={values} key={`${item.name}_${i}`} />
                  ))}
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

export default LocaliteIdentification;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 10,
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
  nButton: {
    padding: 10,
    flex: 1,
    justifyContent: 'center',
    borderTopColor: '#fff',
    borderTopWidth: 1,
  },
});
