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
import {
  schema,
  formValidationSchema as val,
  initialValues,
} from 'src/lib/schemas/localiteIdentifiaction';
import Toast from 'react-native-toast-message';
import { wp } from 'src/lib/utilities';
import { Colors } from 'src/styles';
import LinearGradient from 'react-native-linear-gradient';
import { submitLocaliteIndent } from 'src/models/cartes';
import { Navigation } from 'react-native-navigation';
import ErrorsComp from './ErrorsComp';
import ItemRenderer from './Formik/ItemRenderer';
import SubmitButton from './SubmitButton';

const Form = withNextInputAutoFocusForm(View);

const LocaliteIdentification = ({ localite, componentId, selectedLocalite }) => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const dataChunk = useMemo(() => {
    const data = schema(t);
    return chunk(data, 5);
  }, [t]);
  const formValidationSchema = useMemo(() => val(t), [t]);
  const submitTheForm = async form => {
    const added = await submitLocaliteIndent(form, localite);
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

  if (selectedLocalite) {
    initialValues.ID4 = selectedLocalite.type || '';
  }

  if (localite) {
    oldInitialValues = {
      localeName: localite.localeName || '',
      otherName: localite.otherName || '',
      ID4: localite.ID4 || '',
      ID5: localite.ID5 || '',
      ID7: localite.ID7 || '',
      ID8: String(localite.ID8 || '0'),
      ID9: String(localite.ID9 || '0'),
      ID10: String(localite.ID10 || '0'),
      ID11: String(localite.ID11 || '0'),
      LPA: localite.LPA || '',
      LPB: localite.LPB || '',
      activEconom: JSON.parse(JSON.stringify(localite.activEconom)) || [],
    };
  }
  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      <View style={{ flexDirection: 'row', width: '100%', marginTop: 0 }}>
        {[...Array(dataChunk.length).keys()].map(s => (
          <TouchableOpacity
            key={s}
            onPress={() => setIndex(s)}
            style={[styles.nButton, s !== index && { backgroundColor: Colors.primary }]}>
            <Text style={{ color: s !== index ? '#fff' : '#000', textAlign: 'center' }}>
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
                    <ItemRenderer item={item} values={values} key={`${item.name}_${String(i)}`} />
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
