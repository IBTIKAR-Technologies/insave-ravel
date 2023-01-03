import React, { useState, useMemo, useEffect } from 'react';
import {
  Text, StyleSheet, View, Image, Alert, Keyboard,
} from 'react-native';
import { Colors, CommonStyles } from 'src/styles';
import { Formik, getIn } from 'formik';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import schema, { formValidationSchema as val, initialValues } from 'src/lib/schemas/userSchema';
import { wp } from 'src/lib/utilities';
import { withNextInputAutoFocusForm } from 'react-native-formik';
import { ObjectId } from 'bson';
import Toast from 'react-native-toast-message';
import { ScrollView } from 'react-native-gesture-handler';
import Sample from './Blink';
import SubmitButton from './SubmitButton';
import ErrorsComp from './ErrorsComp';
import ItemRenderer from './Formik/ItemRenderer';

const Form = withNextInputAutoFocusForm(View);

const AddUser = function ({ componentId, user }) {
  const { t } = useTranslation();
  const [card, setCard] = useState({});
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const formValidationSchema = useMemo(() => val(t), [t]);

  const thedata = useMemo(() => {
    const data = schema(t, user?.role, user?.categorie);
    return data;
  }, [t, user]);

  const savePerson = info => {
    setCard(info);
  };

  const actualInitialValues = useMemo(() => {
    const data = { ...initialValues };
    if (user?.categorie) {
      data.categorie = user.categorie;
    }
    if (user?.communeId) {
      data.communeId = user.communeId;
      data.moughataaId = user.moughataaId;
      data.wilayaId = user.wilayaId;
    }
    return data;
  }, [user]);

  console.log('user', user);
  console.log('card', card);

  const submitTheForm = async form => {
    const personExists = global.realms[0].objects('person').filtered(`NNI == "${card.NNI}"`);
    let uExists;
    if (personExists.length > 0) {
      uExists = global.realms[1].objects('user').filtered(`personId == oid(${personExists[0]._id.toString()})`);
    }
    if (uExists && uExists.length > 0) {
      Alert.alert(t('error'), t('user_exists'));
      return;
    }
    let added = true;
    const perId = new ObjectId();
    try {
      global.realms[0].write(() => {
        global.realms[0].create('person', {
          _id: perId,
          _partition: user._id,
          createdAt: new Date(),
          updatedAt: new Date(),
          syncedAt: null,
          createdById: new ObjectId(user._id),
          userId: user._id,
          ...card,
        });
      });
    } catch (er) {
      added = false;
      console.log('error1', er);
    }
    try {
      if (form.communeId) {
        form.communeId = new ObjectId(form.communeId);
        form.moughataaId = new ObjectId(form.moughataaId);
        form.wilayaId = new ObjectId(form.wilayaId);
      }
      global.realms[1].write(() => {
        global.realms[1].create('user', {
          ...form,
          username: form.username.toLowerCase(),
          _id: new ObjectId(),
          _partition: 'all',
          personId: perId,
          createdAt: new Date(),
          updatedAt: new Date(),
          syncedAt: null,
          createdById: new ObjectId(user._id),
          active: true,
          fullName: `${card.firstName} ${card.lastName}`,
          nni: card.NNI,
          person: card,
          role: user.role === 'admin' ? 'actniv1' : user.role === 'actniv1' ? 'actniv2' : 'actniv3',
        });
      });
    } catch (er) {
      added = false;
      console.log('error2', er);
    }
    if (added) {
      Toast.show({
        type: 'success',
        text1: t('success'),
        text2: t('user_added'),
      });
      setCard({});
    } else {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('user_not_added'),
      });
    }
  };

  const confrimAddUser = user => {
    Alert.alert(
      t('confirm'),
      t('confirm_user'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('confirm'), onPress: () => submitTheForm(user) },
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

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={CommonStyles.root}
    >
      <ScrollView
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled
      >
        {!card.firstName && (
          <Sample savePerson={savePerson} t={t} text={t('scan_card')} confirmText={t('continue')} />
        )}
        {card.firstName && (
          <>
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                elevation: 10,
                alignSelf: 'center',
                padding: 10,
                marginVertical: 20,
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.imageContainer}>
                  <Image
                    resizeMode="contain"
                    source={{
                      uri: card.image,
                    }}
                    style={styles.imageResult}
                  />
                </View>
                <View>
                  <Text>
                    {t('name')}: {card.firstName} {card.lastName}
                  </Text>
                  <Text>{`${t('sex')}: ${t(card.sex)}`}</Text>
                  <Text>{`${t('born_at')}: ${card.birthDate}`}</Text>
                  <Text>{`${t('nni')}: ${card.NNI}`}</Text>
                </View>
              </View>
            </View>
            <Formik
              initialValues={actualInitialValues}
              onSubmit={confrimAddUser}
              validationSchema={formValidationSchema}
              validateOnMount={false}
            >
              {({
                handleChange, handleBlur, handleSubmit, values, errors, touched,
              }) => {
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
                  <>
                    <Form
                      style={{
                        justifyContent: 'space-evenly',
                        minHeight: '50%',
                      }}
                    >
                      <View
                        style={{ flex: 1, width: wp(90) > 400 ? 400 : wp(90), alignSelf: 'center' }}
                      >
                        {thedata.map((item, i) => (
                          <ItemRenderer
                            item={item}
                            values={values}
                            key={`${item.name}_${String(i)}`}
                          />
                        ))}
                      </View>
                      {realErrors.length > 0 && (
                        <ErrorsComp dataChunk={[[]]} errors={realErrors} setIndex={() => { }} />
                      )}
                    </Form>
                    <SubmitButton handleSubmit={handleSubmit} t={t} />
                  </>
                );
              }}
            </Formik>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default AddUser;

// react native styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    paddingVertical: 10,
    width: '100%',
    marginBottom: 10,
  },
  label: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 50,
  },
  buttonContainer: {
    margin: 20,
  },
  results: {
    fontSize: 16,
    textAlign: 'left',
    margin: 10,
  },
  imageResult: {
    height: 100,
    width: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
