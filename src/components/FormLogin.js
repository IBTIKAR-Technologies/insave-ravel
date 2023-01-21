import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet, KeyboardAvoidingView, View, Text,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { compose } from 'recompose';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  handleTextInput,
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';
import Toast from 'react-native-toast-message';
import { TextInput, List, Button } from 'react-native-paper';
import { ObjectId } from 'bson';

import { hp, wp } from 'src/lib/utilities';
import { login } from 'src/models/auth';
import { Colors } from 'src/styles';
import { ScrollView } from 'react-native-gesture-handler';
import ButtonSubmit from './ButtonSubmit';
import Errors from './Formik/Errors';
import Sample from './Blink';

const UserIcon = () => <View style={{ justifyContent: "center", alignItems: "center" }}><Icon name="user" size={20} /></View>;

const Input = compose(handleTextInput, withNextInputAutoFocusInput)(TextInput);
const Form = withNextInputAutoFocusForm(View);

const FormLogin = function () {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);

  const validationSchema = Yup.object().shape({
    phone: Yup.string().required(t('phone_error')).min(3, t('phone_error')),
    password: Yup.string().required(t('password_error')).min(2, t('password_error')),
  });

  const fetchAccounts = useCallback(
    async values => {
      console.log('values', values);
      setLoading(true);
      const body = JSON.stringify({
        collection: 'users',
        database: 'ravelinsave',
        dataSource: 'taazour',
        pipeline: [
          {
            $match: {
              username: values.NNI,
            },
          },
          {
            $lookup: {
              from: 'communes',
              localField: 'communeId',
              foreignField: '_id',
              as: 'commune',
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'createdById',
              foreignField: '_id',
              as: 'createdBy',
            },
          },
          {
            $unwind: {
              path: '$commune',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $unwind: {
              path: '$createdBy',
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
      });
      try {
        const response = await fetch(
          'https://data.mongodb-api.com/app/data-cmshj/endpoint/data/v1/action/aggregate',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'api-key': 'Z1mK2dmkPYWTKe9tlTYAhtHvul905kqMFk01GStuwZ4u9U0vms0uf8YGg58FOITH',
            },
            body,
          },
        );
        let json;
        if (response.ok) {
          json = await response.json();
        } else {
          console.log('error', await response.json());
          setLoading(false);
          setAccounts([]);
          throw new Error(`${t('login_error')} | ${values.NNI}`);
        }
        const accounts = json.documents;
        console.log('accounts', accounts);
        if (accounts.length > 1) {
          setAccounts(accounts);
        } else if (accounts.length === 1) {
          goLogin(accounts[0]);
        } else {
          setLoading(false);
          setAccounts([]);
          throw new Error(`${t('login_error')} | ${values.NNI}`);
        }
      } catch (error) {
        console.log('errorrr', error);
        Toast.show({
          type: 'error',
          text1: error.message,
          position: 'bottom',
        });
        setAccounts([]);
        setLoading(false);
      }
    },
    [t],
  );

  const goLogin = async account => {
    console.log('account', account);
    try {
      await login(account);
    } catch (error) {
      console.log('errorrr', error);
      Toast.show({
        type: 'error',
        text1: error.message,
        position: 'bottom',
      });
    }
    setAccounts([]);
    setLoading(false);
  };

  useEffect(() => {
    if (__DEV__) {
      fetchAccounts({ NNI: "9503661622" });
    }
  }, [fetchAccounts]);

  console.log('accounts', accounts.length);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      {
        accounts.length > 0 ? (
          <ScrollView contentContainerStyle={styles.list}>
            <List.Section style={{
              width: "100%", justifyContent: "center",
            }}
            >
              <List.Subheader>{t("select_account")}</List.Subheader>
              {
                accounts.map((account, index) => (
                  <List.Item
                    title={`${account.role} | ${account.categorie || ""} | ${account?.commune?.namefrs_rs || ""}`}
                    description={`${t("created_by")} : ${account?.createdBy?.fullName || ""}`}
                    left={UserIcon}
                    onPress={() => goLogin(account)}
                    style={{
                      alignSelf: "center", width: "100%", justifyContent: "center", alignItems: "center", paddingHorizontal: 20,
                    }}
                  />
                ))
              }
              <Button mode="contained" color={Colors.error} onPress={() => { setAccounts([]); setLoading(false); }} style={styles.button}>{t("cancel")}</Button>
            </List.Section>
          </ScrollView>
        ) : loading ? <Text>Connexion en cours...</Text> : <Sample text={t('auth_card')} t={t} savePerson={fetchAccounts} />
      }
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  button: {
    borderRadius: 50,
    width: '100%',

  },
  list: {
    width: '100%',
    justifyContent: "flex-start",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    borderRadius: 50,
    paddingLeft: 5,
    marginTop: 5,
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
});

export default FormLogin;
