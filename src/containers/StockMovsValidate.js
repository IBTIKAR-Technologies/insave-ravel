import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from 'src/styles';

import { compose } from 'recompose';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  handleTextInput,
  withNextInputAutoFocusForm,
  withNextInputAutoFocusInput,
} from 'react-native-formik';
import Toast from 'react-native-toast-message';
import { Button, Dialog, Paragraph, Portal, TextInput } from 'react-native-paper';
import i18next from 'i18next';

import { hp, wp } from 'src/lib/utilities';
import ButtonSubmit from 'src/components/ButtonSubmit';
import Errors from 'src/components/Formik/Errors';
import LinearGradient from 'react-native-linear-gradient';
import DatePicker from 'src/components/Formik/DatePicker';
import { Navigation } from 'react-native-navigation';

const { language } = i18next;

const Input = compose(handleTextInput, withNextInputAutoFocusInput)(TextInput);
const Form = withNextInputAutoFocusForm(View);

const StockMovsAdd = ({ componentId, setSuccess, stockmov }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [centre, setCentre] = useState({});
  const [dialogVisible, setDialogVisible] = useState(false);
  const [qtesrecues, setQtesrecues] = useState({});

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        arrivedAt: Yup.date().required(t('date_error')),
        qte_ble: Yup.number().required(t('qte_ble_error')),
        qte_rakel: Yup.number().required(t('qte_rakel_error')),
      }),
    [],
  );

  const validateStockMov = async () => {
    setLoading(true);

    const centre = global.realm
      .objects('centres')
      .filtered(`_id == oid(${stockmov.centre_in.toString()})`)[0];

    const { qte_ble: qte_ble_recu, qte_rakel: qte_rakel_recu, arrivedAt } = qtesrecues;

    const ecart_ble = stockmov.qte_ble - qte_ble_recu;
    const ecart_rakel = stockmov.qte_rakel - qte_rakel_recu;

    const date = new Date();

    try {
      global.realm.write(() => {
        centre.stock_ble = centre.stock_ble + qte_ble_recu;
        centre.stock_rakel = centre.stock_rakel + qte_rakel_recu;
        centre.stock_ble_all = centre.stock_ble_all + qte_ble_recu;
        centre.stock_rakel_all = centre.stock_rakel_all + qte_rakel_recu;
        centre.updatedAt = date;
        centre.syncedAt = null;
        stockmov.ecart_ble = ecart_ble;
        stockmov.ecart_rakel = ecart_rakel;
        stockmov.executed = true;
        stockmov.updatedAt = date;
        stockmov.arrivedAt = arrivedAt;
        stockmov.syncedAt = null;
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

  const {
    _id,
    executed,
    qte_ble,
    qte_rakel,
    car_number,
    chauffeur_contact,
    createdAt,
    centre_out,
  } = stockmov;

  useEffect(() => {
    const centre = global.realm
      .objects('centres')
      .filtered(`_id == oid(${stockmov.centre_out.toString()})`)[0];
    setCentre(centre);
  }, [stockmov]);

  const handleDialog = useCallback(() => {
    setDialogVisible(!dialogVisible);
  }, [dialogVisible]);

  const handleConfirm = useCallback(
    values => {
      const { qte_ble: qte_ble_str, qte_rakel: qte_rakel_str, arrivedAt } = values;
      const qte_ble = Number(qte_ble_str);
      const qte_rakel = Number(qte_rakel_str);
      setQtesrecues({ qte_ble, qte_rakel, arrivedAt });
      setDialogVisible(true);
    },
    [dialogVisible],
  );

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={styles.wrap}>
          <View style={styles.type2}>
            <Text>{`${t('centre')}`}</Text>
            <Text>{`${centre[`name${language || 'fr'}`] || ''}`}</Text>
          </View>
          <View style={styles.type2}>
            <Text>{`${t('qte_ble')}`}</Text>
            <Text>{`${qte_ble || 0} kg`}</Text>
          </View>
          <View style={styles.type2}>
            <Text>{`${t('qte_rakel')}`}</Text>
            <Text>{`${qte_rakel || 0} kg`}</Text>
          </View>
          <View style={styles.type2}>
            <Text>{`${t('car_number')}`}</Text>
            <Text>{`${car_number || 0}`}</Text>
          </View>
          <View style={styles.type2}>
            <Text>{`${t('chauffeur_contact')}`}</Text>
            <Text>{`${chauffeur_contact || 0}`}</Text>
          </View>
        </View>
        <View style={styles.type}>
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <Formik
              initialValues={{ arrivedAt: new Date() }}
              onSubmit={handleConfirm}
              validationSchema={validationSchema}>
              {({ handleSubmit, status, errors, touched, dirty }) => {
                console.log('errors', errors);
                return (
                  <Form style={styles.form}>
                    <DatePicker
                      style={styles.input}
                      name="arrivedAt"
                      label={t('select_date_arrived')}
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
                    {Object.keys(errors).length > 0 && <Errors errors={errors} />}
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
        </View>
      </ScrollView>
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={handleDialog}>
          <Dialog.Title style={styles.dialogTitle}>{t('confirmation')}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{t('transfer_dialog_text')}</Paragraph>
            <View style={styles.transfertDetails}>
              <View style={styles.type3}>
                <Text style={styles.transfertDetailsTitle}>{`${t('qte_ble_recu')}`}</Text>
                <Text>{`${qtesrecues.qte_ble}/${qte_ble}`}</Text>
              </View>
              <View style={styles.type3}>
                <Text style={styles.transfertDetailsTitle}>{`${t('qte_rakel_recu')}`}</Text>
                <Text>{`${qtesrecues.qte_rakel}/${qte_rakel}`}</Text>
              </View>
            </View>
          </Dialog.Content>
          <Dialog.Actions style={styles.actions2}>
            <Button onPress={handleDialog}>{t('cancel')}</Button>
            <Button color={Colors.error} onPress={validateStockMov}>
              {t('confirm')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  actions2: {
    justifyContent: 'space-around',
  },
  container: {
    width: '100%',
  },
  wrap: {
    marginTop: hp(3),
  },
  button: {
    width: '100%',
    marginVertical: hp(3),
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
    marginTop: hp(1),
    alignItems: 'center',
    paddingVertical: wp(0.5),
    paddingHorizontal: wp(2),
    marginHorizontal: wp(1),
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: wp(0.5),
    width: wp(90),
  },
  type3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1),
    alignItems: 'center',
    paddingVertical: wp(0.5),
    paddingHorizontal: wp(2),
    marginHorizontal: wp(1),
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: wp(0.5),
    width: '100%',
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
  dialogTitle: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  transfertDetails: {
    flexDirection: 'column',
  },
});

export default StockMovsAdd;
