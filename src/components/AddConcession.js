import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, View, ScrollView, Alert, Keyboard } from 'react-native';
import { Colors } from 'src/styles';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import { Formik, getIn } from 'formik';
import { withNextInputAutoFocusForm } from 'react-native-formik';
import Toast from 'react-native-toast-message';
import Geolocation from 'react-native-geolocation-service';
import { Navigation } from 'react-native-navigation';
import { addConcession, updateConcession } from 'src/models/cartes';
import { wp } from 'src/lib/utilities';
import ErrorsComp from './ErrorsComp';
import quetionaire, {
  initialValues,
  validationSchema as theValSchema,
} from '../lib/schemas/questionaireConcession';
import ItemRenderer from './Formik/ItemRenderer';
import SubmitButton from './SubmitButton';

const Form = withNextInputAutoFocusForm(View);

export default function AddConcession({ user, componentId, edit, menagesAdded, concession }) {
  const { t } = useTranslation();
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [errorsIndex, setErrorsIndex] = useState(0);

  const quetions = useMemo(() => quetionaire(t), [t]);
  const validationSchema = useMemo(() => theValSchema(t, menagesAdded), [t, menagesAdded]);

  useEffect(() => {
    if (edit) return;
    Geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation({ latitude, longitude });
      },
      error => {
        console.log('error', error);
        Navigation.pop(componentId).then(() => {
          Toast.show({
            type: 'error',
            text1: t('location'),
            text2: t('error_location'),
            position: 'bottom',
            visibilityTime: 2000,
          });
        });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 },
    );
  }, [componentId, edit, t]);

  const submitTheForm = async values => {
    if (edit) {
      await updateConcession(values, concession);
      Navigation.pop(componentId).then(() =>
        Toast.show({
          type: 'success',
          text1: t('concession_modified'),
          position: 'bottom',
          visibilityTime: 2000,
        }),
      );
    } else {
      await addConcession(values, user, location);
      Navigation.pop(componentId).then(() =>
        Toast.show({
          type: 'success',
          text1: t('success'),
          text2: t('concession_added'),
          position: 'bottom',
          visibilityTime: 2000,
        }),
      );
    }
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

  const confirmConcession = values => {
    if (edit) {
      Alert.alert(
        t('confirm'),
        t('confirm_concession_modification_message'),
        [
          { text: t('cancel'), style: 'cancel' },
          { text: t('confirm'), onPress: () => submitTheForm(values) },
        ],
        { cancelable: false },
      );
    } else {
      Alert.alert(
        t('confirm'),
        t('confirm_concession_message'),
        [
          { text: t('cancel'), style: 'cancel' },
          { text: t('confirm'), onPress: () => submitTheForm(values) },
        ],
        { cancelable: false },
      );
    }
  };

  let editIntialValues = {};

  if (edit) {
    editIntialValues = {
      Adresse: concession.Adresse,
      NbrMenages: `${concession.NbrMenages}`,
      NbrAbsents: `${concession.NbrAbsents}`,
      NbrDoublons: `${concession.NbrDoublons}`,
      NbrRefus: `${concession.NbrRefus}`,
      maintype: concession.maintype || '',
      soustype: concession.soustype || '',
    };
  }

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      <Formik
        initialValues={edit ? editIntialValues : initialValues}
        onSubmit={confirmConcession}
        validationSchema={validationSchema}>
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
          if (realErrors.length > 0 && errorsIndex > realErrors.length - 1) {
            setErrorsIndex(0);
          }
          return (
            <Form
              style={{
                height: '97%',
                justifyContent: 'space-evenly',
              }}>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, width: wp(90) > 400 ? 400 : wp(90), alignSelf: 'center' }}>
                  {quetions.map((item, i) => (
                    <ItemRenderer
                      key={i + item.name}
                      item={item}
                      errors={errors}
                      touched={touched}
                      values={values}
                    />
                  ))}
                </View>
                {realErrors.length > 0 && (
                  <ErrorsComp dataChunk={[[]]} errors={realErrors} setIndex={() => null} />
                )}
                {!isKeyboardVisible && (
                  <SubmitButton
                    disabled={!edit && !location.latitude}
                    handleSubmit={handleSubmit}
                    t={t}
                  />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 10,
  },
});
