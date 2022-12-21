import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from 'src/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { compose } from 'recompose';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  handleTextInput,
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';
import Toast from 'react-native-toast-message';
import { TextInput } from 'react-native-paper';
import { ObjectId } from 'bson';
import i18next from 'i18next';

import { hp, wp } from 'src/lib/utilities';
import ButtonSubmit from 'src/components/ButtonSubmit';
import Select from 'src/components/Formik/Select';
import Errors from 'src/components/Formik/Errors';
import LinearGradient from 'react-native-linear-gradient';
import DatePicker from 'src/components/Formik/DatePicker';
import { Navigation } from 'react-native-navigation';

const { language } = i18next;

const Input = compose(handleTextInput, withNextInputAutoFocusInput)(TextInput);
const Form = withNextInputAutoFocusForm(View);

const StockMovsAdd = ({ componentId, setSuccess }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [centres, setCentres] = useState([]);
  const [data, setData] = useState({});
  const [stock, setStock] = useState({});

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        doneAt: Yup.date().required(t('date_error')),
        centre_in: Yup.string().required(t('centre_error')),
        qte_ble: Yup.number()
          .required(t('qte_ble_error'))
          .max(stock.stock_ble || 0, t('qte_ble_max_error')),
        qte_rakel: Yup.number()
          .required(t('qte_rakel_error'))
          .max(stock.stock_rakel || 0, t('qte_rakel_max_error')),
        car_number: Yup.string().required(t('car_number_error')).min(8, t('car_number_error')),
        chauffeur_contact: Yup.string()
          .required(t('chauffeur_contact_error'))
          .min(8, t('chauffeur_contact_error')),
      }),
    [stock],
  );

  const addStockMov = async values => {
    console.log('values', values);

    const centre = global.realm.objects('centres').filtered(`_id == oid(${data.centre._id})`)[0];

    const { centre_in, qte_ble, qte_rakel, car_number, chauffeur_contact, doneAt } = values;

    const date = new Date();

    setLoading(true);
    const stockmovId = new ObjectId();
    try {
      global.realm.write(() => {
        global.realm.create('stockmovs', {
          _id: stockmovId,
          _partition: 'all',
          type: 'm',
          car_number,
          centre_in: new ObjectId(centre_in),
          centre_out: new ObjectId(data.centre._id),
          chauffeur_contact,
          createdAt: doneAt,
          executed: false,
          preapprouved: false,
          qte_ble: Number(qte_ble),
          qte_rakel: Number(qte_rakel),
          updatedAt: date,
        });
        centre.stock_ble = centre.stock_ble - qte_ble;
        centre.stock_rakel = centre.stock_rakel - qte_rakel;
        centre.stock_ble_all = centre.stock_ble_all - qte_ble;
        centre.stock_rakel_all = centre.stock_rakel_all - qte_rakel;
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
      const centre = global.realm.objects('centres').filtered(`_id == oid(${data.centre._id})`)[0];
      const { stock_ble, stock_rakel } = centre;
      setStock({
        stock_ble,
        stock_rakel,
      });

      const centres = global.realm
        .objects('centres')
        .filtered(`wilaya_id == oid(${data.centre.wilaya_id}) AND _id != oid(${data.centre._id})`);
      console.log('centres', centres);
      const arr = [];
      for (let i = 0; i < centres.length; i++) {
        arr.push({
          label: centres[i][`name${language || 'fr'}`],
          value: centres[i]._id.toString(),
        });
      }
      setCentres(arr);
      setData(data);
    })();
  }, []);

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={styles.type2}>
          <Text>{`${t('stock_ble')} : ${stock.stock_ble || 0} kg`}</Text>
          <Text>{`${t('stock_rakel')} : ${stock.stock_rakel || 0} kg`}</Text>
        </View>
        <View style={styles.type}>
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <Formik
              initialValues={{ doneAt: new Date() }}
              onSubmit={addStockMov}
              validationSchema={validationSchema}>
              {({ handleSubmit, status, errors, touched, dirty }) => {
                console.log('errors', errors);
                return (
                  <Form style={styles.form}>
                    <DatePicker style={styles.input} name="doneAt" label={t('select_date')} />
                    <Select
                      style={styles.input}
                      name="centre_in"
                      items={centres}
                      label={t('select_centre')}
                    />
                    <Input
                      label={t('qte_ble')}
                      name="qte_ble"
                      style={styles.input}
                      keyboardType="number-pad"
                      autoCompleteType="off"
                    />
                    <Input
                      label={t('qte_rakel')}
                      name="qte_rakel"
                      style={styles.input}
                      keyboardType="number-pad"
                      autoCompleteType="off"
                    />
                    <Input label={t('car_number')} name="car_number" style={styles.input} />
                    <Input
                      label={t('chauffeur_contact')}
                      name="chauffeur_contact"
                      style={styles.input}
                      keyboardType="number-pad"
                      autoCompleteType="off"
                    />
                    {Object.keys(errors).length > 0 && <Errors errors={errors} />}
                    <View style={styles.lol}>
                      <ButtonSubmit
                        style={styles.button}
                        loading={loading}
                        disabled={Object.keys(errors).length > 0}
                        onPress={handleSubmit}
                      />
                    </View>
                  </Form>
                );
              }}
            </Formik>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
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
  form: { marginTop: hp(3) },
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
  type: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: wp(0.5),
    marginHorizontal: wp(1),
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

export default StockMovsAdd;
