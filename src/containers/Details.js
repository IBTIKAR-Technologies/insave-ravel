import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Text,
  List,
  Button,
  TextInput,
  IconButton,
  Portal,
  Dialog,
  Paragraph,
} from 'react-native-paper';
import { Colors } from 'src/styles';
import LinearGradient from 'react-native-linear-gradient';
import { wp, hp, getDistance } from 'src/lib/utilities';
import RNPickerSelect from 'react-native-picker-select';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import ButtonSubmit from 'src/components/ButtonSubmit';
import Toast from 'react-native-toast-message';
import { Navigation } from 'react-native-navigation';
import { addVente, setDelivered } from 'src/models/cartes';
import { ObjectId } from 'bson';

const { language } = i18next;

console.log('language', language);

const Details = function ({ holder, type, value, componentId, setSuccess }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({});
  const [paiementType, setPaiementType] = useState('');
  const [compte_bc_id, setCompte_id] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [paiementTypeList, setPaiementTypeList] = useState([]);
  const [noVersement, setNoVersement] = useState('');
  const [montantSaisi, setMontantSaisi] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [codeVente, setCodeVente] = useState('');

  const secondInput = useRef(null);
  console.log('holder', holder);

  console.log('holderrr', holder);
  console.log('params', params);

  /*  useEffect(() => {
    (async () => {
      const data = JSON.parse(await AsyncStorage.getItem('userData'));
      const params = global.realm.objects('params')[0];
      setParams(params);
      const centre = global.realm.objects('centres').filtered(`_id == oid(${data.centre._id})`)[0];
      console.log('centreeee', centre);
      const liste = [];
      if (centre.vente_bc) {
        liste.push({
          label: t('bc'),
          value: 'bc',
        });
      }
      if (centre.vente_especes) {
        liste.push({
          label: t('especes'),
          value: 'especes',
        });
      }
      setPaiementTypeList(liste);
      if (liste.length > 0) {
        setPaiementType(liste[0].value);
      }

      const accounts = global.realm
        .objects('comptes')
        .filtered(`zone_id == oid(${centre.zone_id.toString()}) AND type == 'bc'`);
      console.log('accounts', accounts);
      const arr = [];
      for (let i = 0; i < accounts.length; i++) {
        arr.push({
          label: `${accounts[i].proprio}/${accounts[i].reference}`,
          value: accounts[i]._id.toString(),
        });
      }
      setAccounts(arr);

      // get code vente
      const unisef = global.realm.objects('unisef');
      const codeVente = `${centre.num}${String(unisef.length + 1).padStart(5, '0')}`;
      setCodeVente(codeVente);
    })();
  }, []); */
  // console.log('props', props);

  const getTitles = {
    phone: t('phone_read'),
    nni: t('nni_read'),
  };

  const getTypes = {
    phone: t('phone_read_val'),
    nni: t('nni_read_val'),
  };

  const {
    fullName,
    nni,
    qte_ble,
    qte_rakel,
    ble_vendu,
    rakel_vendu,
    MbNom,
    MbPrenom,
    printedAt,
    deliveredAt,
    Wilaya,
    Moughataa,
    Commune,
    Localite,
    MbId,
  } = holder || {};

  const qte_ble_net = useMemo(() => (qte_ble || 0) - (ble_vendu || 0), [holder]);
  const qte_rakel_net = useMemo(() => (qte_rakel || 0) - (rakel_vendu || 0), [holder]);

  const montant_ble = useMemo(
    () => Math.ceil(qte_ble_net * (params?.prix_ble || 0)),
    [qte_ble_net, qte_rakel_net, params],
  );
  const montant_rakel = useMemo(
    () => Math.ceil(qte_rakel_net * params?.prix_rakel || 0),
    [qte_ble_net, qte_rakel_net, params],
  );
  const montant = useMemo(
    () => Math.ceil(montant_ble + montant_rakel),
    [montant_ble, montant_rakel, params],
  );

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      await setDelivered(holder);
    } catch (error) {
      console.log('error', error);
    }
    setLoading(false);
    Navigation.pop(componentId).then(() => {
      setSuccess(true);
    });
  }, [
    holder,
    compte_bc_id,
    paiementType,
    setLoading,
    setSuccess,
    montant,
    montant_ble,
    montant_rakel,
    codeVente,
  ]);

  useEffect(() => {
    let timeout;
    global.details = true;
    const listener = {
      componentDidAppear: () => {
        console.log('RNN', 'componentDidAppear');
        global.details = true;
      },
      componentDidDisappear: () => {
        console.log('RNN', 'componentDidDisappear');
        global.details = false;
        if (timeout) {
          clearTimeout(timeout);
        }
      },
    };
    // Register the listener to all events related to our component
    const unsubscribe = Navigation.events().registerComponentListener(listener, componentId);

    return () => {
      // Make sure to unregister the listener during cleanup
      global.details = false;
      unsubscribe.remove();
    };
  }, []);

  const handleDialog = useCallback(() => {
    setDialogVisible(!dialogVisible);
  }, [dialogVisible]);

  console.log('compte_bc_id', compte_bc_id);
  console.log('paiementType', paiementType);

  const focusSecondInput = useCallback(() => {
    secondInput?.current?.focus();
  }, [secondInput.current]);

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      {nni ? (
        <ScrollView keyboardShouldPersistTaps="always">
          <View style={styles.info}>
            <Text style={styles.header}>{getTitles[type]}</Text>
            <View style={styles.type}>
              <Text style={styles.typeHeader}>{getTypes[type]}</Text>
              <Text style={styles.typeBody}>{nni}</Text>
            </View>
            <View style={styles.type}>
              <Text style={styles.typeHeader}>{`${t('house_hold_id')} : `}</Text>
              <Text style={styles.typeBody}>{MbId}</Text>
            </View>
            <View style={styles.type}>
              <Text style={styles.typeHeader}>{`${t('name')} : `}</Text>
              <Text style={styles.typeBody}>{`${MbPrenom} ${MbNom}`}</Text>
            </View>
            <View style={styles.type}>
              <Text style={styles.typeHeader}>{`${t('localite')} : `}</Text>
              <Text style={styles.typeBody}>
                {Wilaya} {Commune} {Localite}
              </Text>
            </View>
          </View>
          {!printedAt ? (
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                color: 'red',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: 'green',
                padding: 10,
                marginTop: 100,
              }}>
              {t('no_card')}
            </Text>
          ) : !deliveredAt ? (
            <ButtonSubmit submit style={styles.button} onPress={handleDialog} />
          ) : (
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                color: 'red',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: 'green',
                padding: 10,
                marginTop: 100,
              }}>
              {t('card_already_delivered')}
            </Text>
          )}
        </ScrollView>
      ) : (
        <View style={styles.info}>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              color: 'red',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: 'green',
              padding: 10,
              marginTop: 100,
            }}>
            {t('no_menage')}
          </Text>
        </View>
      )}

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={handleDialog}>
          <Dialog.Title style={styles.dialogTitle}>{t('confirmation')}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{`${t('are_you_sure_of_card_delivry')}(${MbId})`}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions style={styles.actions2}>
            <Button onPress={handleDialog}>{t('cancel')}</Button>
            <Button color={Colors.error} onPress={handleSubmit}>
              {t('confirm')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </LinearGradient>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    width: wp(90),
    fontWeight: 'bold',
    backgroundColor: Colors.primaryGradientEnd,
  },
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: wp(3),
    marginVertical: wp(3),
  },
  code: {
    letterSpacing: 1,
  },
  red: {
    color: Colors.error,
  },
  actions2: {
    justifyContent: 'space-around',
  },
  dialogTitle: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  transfertDetails: {
    flexDirection: 'column',
  },
  transfertDetailsTitle: {
    color: Colors.secondary,
    fontWeight: 'bold',
  },
  typex: {
    backgroundColor: Colors.primaryGradientEnd,
  },
  centered: {
    justifyContent: 'center',
  },
  bold: {
    fontWeight: 'bold',
    borderColor: 'transparent',
  },
  bloo: {
    paddingVertical: wp(1),
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
  flexcol: {
    flexDirection: 'column',
  },
  qty: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(1),
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: hp(1),
  },
  info: {
    marginTop: hp(3),
    width: wp(95),
    paddingBottom: wp(2),
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 5,
  },
  header: {
    width: '100%',
    paddingVertical: wp(1),
    backgroundColor: Colors.primary,
    color: '#000',
    textAlign: 'center',
  },
  typeHeader: {
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: 'bold',
    marginRight: wp(1),
    textDecorationLine: 'underline',
  },
  typeHeader2: {
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: 'bold',
    marginRight: wp(1),
  },
  typeHeader2u: {
    textTransform: 'uppercase',
  },
  typeHeader2V: {
    minWidth: wp(20),
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  typeBody: {
    color: Colors.primary,
    textAlign: 'center',
  },
  typeBody1: {
    color: Colors.black,
    textAlign: 'center',
  },
  typeBodyError: {
    color: Colors.error,
    textAlign: 'center',
  },
  typeBody3: {
    textAlign: 'center',
    padding: wp(0.5),
    borderRadius: wp(0.5),
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  typeBodyNew: {
    color: Colors.success,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  type: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: wp(1),
    alignItems: 'center',
  },
  type2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: wp(1),
    alignItems: 'center',
    paddingVertical: wp(0.5),
    paddingHorizontal: wp(1),
    marginHorizontal: wp(1),
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: wp(0.5),
  },
  select: {
    backgroundColor: Colors.primaryGradientEnd,
  },
  selected: {
    backgroundColor: Colors.primaryLight,
    marginBottom: 3,
    marginHorizontal: 5,
  },
  unselected: {
    borderBottomColor: Colors.primaryLight,
    borderBottomWidth: 1,
    marginHorizontal: 5,
  },
  input: {
    paddingHorizontal: wp(1),
    width: '100%',
    backgroundColor: Colors.primaryGradientStart,
  },
});

export default Details;
