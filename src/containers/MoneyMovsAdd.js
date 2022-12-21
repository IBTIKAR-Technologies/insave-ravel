import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from 'src/styles';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { compose } from 'recompose';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  handleTextInput,
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';
import Toast from 'react-native-toast-message';
import { TextInput } from 'react-native-paper';
import { ObjectId } from 'bson';

import { hp, wp } from 'src/lib/utilities';
import ButtonSubmit from 'src/components/ButtonSubmit';
import Select from 'src/components/Formik/Select';
import Errors from 'src/components/Formik/Errors';
import LinearGradient from 'react-native-linear-gradient';
import DatePicker from 'src/components/Formik/DatePicker';
import { Navigation } from 'react-native-navigation';

const Input = compose(handleTextInput, withNextInputAutoFocusInput)(TextInput);
const Form = withNextInputAutoFocusForm(View);

const FormAddMoneyMov = ({ componentId, setSuccess }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [data, setData] = useState({});
  const [solde, setSolde] = useState(0);

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        doneAt: Yup.date().required(t('date_error')),
        compte_dest_id: Yup.string().required(t('account_error')),
        montant: Yup.number().required(t('montant_error')).max(solde, t('montant_max_error')),
        reference: Yup.string().required(t('reference_error')).min(3, t('reference_error')),
      }),
    [solde],
  );

  const addMoneyMov = async values => {
    console.log('values', values);

    const { compte_dest_id, montant, reference, doneAt } = values;

    const date = new Date();

    setLoading(true);
    const centreCompte = global.realm
      .objects('comptes')
      .filtered(`centre_id == oid(${data.centre._id})`)[0];
    const moneymovId = new ObjectId();
    try {
      global.realm.write(() => {
        global.realm.create('moneymovs', {
          _id: moneymovId,
          _partition: data.centre._id,
          compte_emet_id: centreCompte._id,
          compte_dest_id: new ObjectId(compte_dest_id),
          type: 'dc',
          montant: Number(montant),
          reference,
          executed: false,
          createdAt: doneAt,
          updatedAt: date,
        });
      });
      Navigation.pop(componentId).then(() => {
        setSuccess(true);
      });
    } catch (error) {
      console.log('error', error);
      Toast.show({
        type: 'error',
        text1: error.message,
        position: 'bottom',
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      const data = JSON.parse(await AsyncStorage.getItem('userData'));
      const compte = global.realm
        .objects('comptes')
        .filtered(`centre_id == oid(${data.centre._id})`)[0];
      setSolde(compte.solde || 0);

      const accounts = global.realm
        .objects('comptes')
        .filtered(`zone_id == oid(${data.centre.zone_id}) AND type == 'bc'`);
      console.log('accounts', accounts);
      const arr = [];
      for (let i = 0; i < accounts.length; i++) {
        arr.push({
          label: `${accounts[i].proprio}/${accounts[i].reference}`,
          value: accounts[i]._id.toString(),
        });
      }
      setAccounts(arr);
      setData(data);
    })();
  }, []);

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      <View style={styles.type2}>
        <Text style={styles.transfertDetailsTitle}>{`${t('solde')} :`}</Text>
        <Text style={[styles.qtyn, styles.qtynn, styles.code]}>{`${solde} MRU`}</Text>
      </View>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Formik
          initialValues={{ doneAt: new Date() }}
          onSubmit={addMoneyMov}
          validationSchema={validationSchema}>
          {({ handleSubmit, status, errors, touched, dirty }) => {
            console.log('errors', errors);
            return (
              <Form style={styles.form}>
                <DatePicker style={styles.input} name="doneAt" label={t('select_date')} />
                <Select
                  style={styles.input}
                  name="compte_dest_id"
                  items={accounts}
                  label={t('select_account')}
                />
                <Input
                  label={t('montant')}
                  name="montant"
                  style={styles.input}
                  keyboardType="number-pad"
                  autoCompleteType="off"
                />
                <Input
                  label={t('reference')}
                  name="reference"
                  style={styles.input}
                  keyboardType="number-pad"
                  autoCompleteType="off"
                />
                {Object.keys(errors).length > 0 && <Errors errors={errors} />}
                <View style={styles.lol}></View>
                <ButtonSubmit
                  style={styles.button}
                  loading={loading}
                  disabled={Object.keys(errors).length > 0}
                  onPress={handleSubmit}
                />
              </Form>
            );
          }}
        </Formik>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  container: {
    width: '100%',
  },
  button: {
    width: '100%',
    marginTop: hp(3),
  },
  input: {
    backgroundColor: '#000',
    height: hp(8),
    marginVertical: hp(0.5),
    borderRadius: 5,
  },
  form: { marginHorizontal: wp(5), marginTop: hp(3) },
  type2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(3),
    alignItems: 'center',
    paddingVertical: wp(0.5),
    paddingHorizontal: wp(2),
    marginHorizontal: wp(1),
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: wp(0.5),
    width: wp(90),
  },
  transfertDetailsTitle: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  qtyn: {
    paddingHorizontal: wp(1.5),
    paddingVertical: wp(0.7),
    borderColor: Colors.primaryLight,
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: wp(0.5),
    fontWeight: 'bold',
  },
  qtynn: {
    backgroundColor: Colors.primaryLight,
    color: '#000',
  },
  code: {
    letterSpacing: 1,
  },
});

export default FormAddMoneyMov;
