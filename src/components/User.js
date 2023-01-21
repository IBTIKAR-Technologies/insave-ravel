import {
  View, Text, Image, ScrollView, Alert,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Colors } from 'src/styles';
import LinearGradient from 'react-native-linear-gradient';
import { wp, hp, isTimePast } from 'src/lib/utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { Navigation } from 'react-native-navigation';
import UpdateStatus from 'src/lib/getUpdateStatus';
import RNFS from 'react-native-fs';

import { compose } from 'recompose';
import { Formik } from 'formik';
import { ObjectId } from 'bson';
import * as Yup from 'yup';
import {
  handleTextInput,
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';
import Toast from 'react-native-toast-message';
import { TextInput } from 'react-native-paper';
import Language from './Language';
import Deconnexion from './Deconnexion';
import Errors from './Formik/Errors';
import Icon from './Icon';
import ButtonSubmit from './ButtonSubmit';

const Input = compose(handleTextInput, withNextInputAutoFocusInput)(TextInput);
const Form = withNextInputAutoFocusForm(View);

const User = function ({ componentId }) {
  const [user, setUser] = useState({});
  const [synced, setSynced] = useState(true);
  const [loading, setLoading] = useState(false);
  const [canAttach, setCanAttach] = useState(false);
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    codeInitiative: Yup.string().required(t('required')).min(1, t('required')),
  });

  const initialize = useCallback(async () => {
    const userData = await AsyncStorage.getItem('userData');
    const parsed = JSON.parse(userData);
    const user = global.realms[1].objects('user').filtered(`_id == oid(${parsed._id})`)[0];
    const canAttach = await isTimePast(parsed.wilayaId);
    setCanAttach(!canAttach);
    setUser(user || userData);
  }, []);

  useEffect(() => {
    initialize();
    const listener = {
      componentDidAppear: () => {
        console.log('RNN', 'componentDidAppear');
        initialize();
      },
    };
    const unsubscribe = Navigation.events().registerComponentListener(listener, componentId);
    return () => {
      unsubscribe.remove();
    };
  }, [initialize, componentId]);

  console.log('user', user);

  const updateInitiativeId = async values => {
    const userData = await AsyncStorage.getItem('userData');
    const parsed = JSON.parse(userData);
    console.log('values', values);
    setLoading(true);
    try {
      const initiative = global.realms[1].objects('user').filtered(`codeInitiative == "${values.codeInitiative}"`)[0];
      const user = global.realms[1].objects('user').filtered(`_id == oid(${parsed._id.toString()})`)[0];
      console.log('initiative', initiative);
      if (!initiative) {
        Alert.alert(t('error'), t('initiative_not_found'));
      } else if (!user) {
        Alert.alert(t('error'), t('user_not_found'));
      } else {
        global.realms[1].write(() => {
          user.initiativeId = initiative._id;
          user.initiativeCode = initiative.codeInitiative;
          user.initiativeName = initiative.nameInitiative;
        });
        Toast.show({
          type: 'success',
          text1: t('initiative_updated'),
          position: 'bottom',
        });
        initialize();
      }
    } catch (error) {
      console.log('errorrr', error);
      Toast.show({
        type: 'error',
        text1: error.message,
        position: 'bottom',
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    RNFS.getFSInfo()
      .then((info) => {
        console.log('info', info);
        const mbs = info.freeSpace / 1024 / 1024;
        if (mbs < 500) {
          Alert.alert(t('error'), t('free_space'));
        }
      });
  }, [t]);

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}
    >
      <UpdateStatus />
      {
        user?.role ? (
          <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ uri: user?.person?.image }} style={styles.image} />
            <Text style={styles.bigText}>{user?.fullName}</Text>
            <View style={styles.secondContainer}>
              <View style={styles.userInfo}>
                <Text style={styles.details}>
                  <Text style={styles.strong}>{t('nni')}</Text>: {user?.nni}
                </Text>
                {user?.role && (
                  <Text style={styles.details}>
                    <Text style={styles.strong}>{t('role')}:</Text> {t(user?.role)}
                  </Text>
                )}
                {user?.categorie && (
                  <Text style={styles.details}>
                    <Text style={styles.strong}>{t('categorie')}:</Text> {t(user?.categorie)}
                  </Text>
                )}
                {user?.communeId && (
                  <Text style={styles.details}>
                    <Text style={styles.strong}>{t('emplacement')}:</Text> {user?.communeId?.toString() === "5ed197a1b8afff0d969a2f64" ? t("nktt") : global.realms[1].objectForPrimaryKey("commune", typeof (user?.communeId) === "string" ? new ObjectId(user?.communeId) : user?.communeId)?.namefr_rs}
                  </Text>
                )}
                {user?.codeInitiative && (
                  <Text style={styles.details}>
                    <Text style={styles.strong}>{t('code_initiative')}:</Text> {t(user?.codeInitiative)}
                  </Text>
                )}
                {user?.createdById && (
                  <Text style={styles.details}>
                    <Text style={styles.strong}>{t('created_by')}:</Text> {global.realms[1].objects('user').filtered(`_id == oid(${user?.createdById.toString()})`)[0]?.fullName}
                  </Text>
                )}
              </View>
              {user?.role === "actniv3" && user?.categorie === "parti" && canAttach && (
                <View style={[styles.userInfo, { justifyContent: "center", alignItems: "center" }]}>
                  <Text style={styles.strong}>{t('unite_attach')}:</Text>
                  {
                    user?.initiativeId ? <Text style={styles.detail}>{`${t("already_initiative")} : ${user?.initiativeCode}`}</Text> : (
                      <Formik
                        initialValues={{ codeInitiative: '' }}
                        onSubmit={updateInitiativeId}
                        validationSchema={validationSchema}
                      >
                        {({
                          handleSubmit, status, errors, touched, dirty,
                        }) => {
                          console.log('dirty', dirty);
                          console.log('status', status);
                          console.log('errors', errors);
                          console.log('touched', touched);
                          console.log('errors', errors);
                          return (
                            <Form
                              style={{
                                marginHorizontal: wp(5),
                                width: wp(90) > 400 ? 400 : wp(90),
                                alignSelf: 'center',
                              }}
                            >
                              {Object.keys(errors).length > 0 && <Errors errors={errors} />}

                              <View style={styles.inputContainer}>
                                <Icon name="lock" size={20} style={{ padding: 5 }} />
                                <Input
                                  placeholder={t('code_initiative')}
                                  name="codeInitiative"
                                  keyboardType="number-pad"
                                  style={styles.input}
                                  underlineColor="transparent"
                                  underlineColorAndroid="transparent"
                                />
                              </View>
                              <ButtonSubmit
                                style={styles.button}
                                loading={loading}
                                disabled={Object.keys(errors).length > 0 || !dirty}
                                onPress={handleSubmit}
                              />
                            </Form>
                          );
                        }}
                      </Formik>
                    )
                  }
                </View>
              )}
              <View style={styles.buttons}>
                <Deconnexion synced={synced} />
                {/* <Exit /> */}
              </View>
            </View>

          </ScrollView>
        ) : <Text style={{ alignSelf: "center" }}>{t("loading")}</Text>
      }
      <Language />
    </LinearGradient>
  );
};

export default User;
const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
  },
  secondContainer: {
    width: "100%",
    alignItems: 'center',
  },
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  inputContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    borderRadius: 50,
    paddingLeft: 5,
    marginVertical: 10,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: 'none',
    flex: 1,
    height: 40,
    padding: 0,
    fontSize: 20,
  },
  strong: {
    fontWeight: 'bold',
  },
  bigText: {
    fontSize: 30,
    color: Colors.black,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    width: '90%',
    textAlign: 'center',
  },
  avatar: {
    paddingLeft: '5%',
  },
  userInfo: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
    padding: 10,
    width: '90%',
  },
  details: {
    fontSize: 15,
    paddingBottom: 5,
  },
  buttons: {
    marginTop: 20,
    alignItems: 'center',
    width: wp(100),
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
    backgroundColor: '#ccc',
  },
};
