import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, FlatList, Keyboard } from 'react-native';
import { Text, List, TextInput, Button, FAB } from 'react-native-paper';
import { Colors } from 'src/styles';
import LinearGradient from 'react-native-linear-gradient';
import { wp, hp, getDate, navigate } from 'src/lib/utilities';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { Navigation } from 'react-native-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import screenNames from 'src/lib/navigation/screenNames';
import Toast from 'react-native-toast-message';
import { useDebouncedCallback } from 'use-debounce';

const { language } = i18next;

const ITEM_HEIGHT = 70;

const paginate = (array, page_number) => {
  const page_size = 30;
  const real_page_number = page_number - 1; // because pages logically start with 1, but technically with 0
  let newData = array.slice(real_page_number * page_size, (real_page_number + 1) * page_size);
  newData = newData.map(stockmov => {
    const centre_in = global.realm
      .objects('centres')
      .filtered(`_id == oid(${stockmov.centre_in.toString()})`)[0];
    const centre_out = stockmov.centre_out
      ? global.realm.objects('centres').filtered(`_id == oid(${stockmov.centre_out.toString()})`)[0]
      : null;
    return { stockmov, centre_in, centre_out };
  });
  return newData;
};

const StockMovs = function ({ componentId }) {
  const { t } = useTranslation();
  // console.log('props', props);
  const [synced, setSynced] = useState(false);
  const [liste, setListe] = useState([]);
  const [success, setSuccess] = useState('');
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [everything, setEverything] = useState(0);
  const [scrollData, setScrollData] = useState([]);
  const [page, setPage] = useState(1);
  const [stock, setStock] = useState({});
  const [isAddDisabled, setIsAddDisabled] = useState(true);
  const [centre_id, setCentre_id] = useState('');

  console.log('history liste', liste.length);

  useEffect(() => {
    if (success) {
      console.log('SHOWING SUCCESS');
      Toast.show({
        type: 'success',
        text1: t('send_succesful'),
        position: 'bottom',
      });
      setSuccess('');
    }
  }, [success]);

  const handleLoadMore = useCallback(() => {
    setPage(page + 1);
    setScrollData([...scrollData, ...paginate(liste, page + 1)]);
  }, [liste, page, scrollData]);

  const EmptyListMessage = useCallback(
    () => (
      <View style={styles.root}>
        <Text>{search ? t('no_results') : t('no_history2')}</Text>
      </View>
    ),
    [search, t],
  );

  const initialize = useCallback(async () => {
    const data = JSON.parse(await AsyncStorage.getItem('userData'));
    setCentre_id(data.centre._id);
    const centre = global.realm.objects('centres').filtered(`_id == oid(${data.centre._id})`)[0];
    const { stock_ble, stock_rakel } = centre;
    setStock({
      stock_ble,
      stock_rakel,
    });
    const all = global.realm
      .objects('stockmovs')
      .filtered(`centre_out == oid(${data.centre._id}) OR centre_in == oid(${data.centre._id})`);
    const allWaiting = global.realm
      .objects('stockmovs')
      .filtered(`centre_out == oid(${data.centre._id}) AND executed == false`);
    console.log('all stockmovs', all);
    if (allWaiting.length === 0) {
      setIsAddDisabled(false);
    }
    const recordsX = all.sorted('createdAt', true);
    setEverything(all.length);
    setListe(recordsX);
    setRecords(recordsX);
    setScrollData(paginate(recordsX, 1));
  }, []);

  useEffect(() => {
    initialize();
    const listener = {
      componentDidAppear: () => {
        console.log('RNN', 'componentDidAppear');
        initialize();
        global.allowPhone = false;
      },
    };
    const unsubscribe = Navigation.events().registerComponentListener(listener, componentId);
    return () => {
      unsubscribe.remove();
    };
  }, [initialize, componentId]);

  const handleAddStockmov = useDebouncedCallback(
    () => {
      navigate(componentId, screenNames.StockMovsAdd, t('stockmovs_add_title'), { setSuccess });
    },
    3000,
    {
      leading: true,
      trailing: false,
    },
  );

  const handleValidate = useDebouncedCallback(
    stockmov => {
      navigate(componentId, screenNames.StockMovsValidate, t('stockmovs_validate_title'), {
        setSuccess,
        stockmov,
      });
    },
    3000,
    {
      leading: true,
      trailing: false,
    },
  );

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      <View style={styles.info}>
        <Text style={styles.header}>{t('stockmovs_title')}</Text>
        <View style={styles.type}>
          <Text>{`${t('stock_ble')} : ${stock.stock_ble || 0} kg`}</Text>
          <Text>{`${t('stock_rakel')} : ${stock.stock_rakel || 0} kg`}</Text>
        </View>
        <View style={styles.type}>
          <Text>{`${t('mvts')} : ${everything}`}</Text>
        </View>
      </View>
      <View style={[styles.info, styles.flatBlock]}>
        <FlatList
          style={styles.flatlist}
          contentContainerStyle={styles.flatlistContainer}
          data={scrollData}
          keyExtractor={item => item.stockmov._id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={EmptyListMessage}
          getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          renderItem={({ item, index }) => {
            const { centre_in, centre_out, stockmov } = item;
            const {
              _id,
              executed,
              qte_ble,
              qte_rakel,
              ecart_ble,
              ecart_rakel,
              car_number,
              chauffeur_contact,
              createdAt,
            } = stockmov;
            if (centre_in._id.toString() === centre_id && !executed) {
              return (
                <List.Item
                  key={_id}
                  title={`${
                    centre_out
                      ? centre_out[`name${language || 'fr'}`].replace(/Centre de |مركز /, '')
                      : t('inventaire')
                  } => ${centre_in[`name${language || 'fr'}`].replace(/Centre de |مركز /, '')}`}
                  description={`${qte_ble}|${qte_rakel} | ${getDate(new Date(createdAt), false)}`}
                  right={() => (
                    <View style={styles.right}>
                      <Button
                        onPress={() => handleValidate(stockmov)}
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                        color={Colors.blue}
                        compact
                        mode="contained">
                        {t('validate')}
                      </Button>
                    </View>
                  )}
                />
              );
            }
            return (
              <List.Item
                key={_id}
                title={`${
                  centre_out
                    ? centre_out[`name${language || 'fr'}`].replace(/Centre de |مركز /, '')
                    : t('inventaire')
                } => ${centre_in[`name${language || 'fr'}`].replace(/Centre de |مركز /, '')}`}
                description={`${qte_ble}|${qte_rakel} => ${
                  executed ? `${qte_ble - ecart_ble}|${qte_rakel - ecart_rakel}` : `0|0`
                } \n${getDate(new Date(createdAt), false)}`}
                right={() => (
                  <View style={styles.right}>
                    <Text style={[styles.text, executed ? {} : styles.textWarning]}>
                      {executed ? t('completed') : t('waiting')}
                    </Text>
                  </View>
                )}
              />
            );
          }}
        />
      </View>
      <FAB
        style={styles.fab}
        icon="plus"
        color={'#000'}
        onPress={handleAddStockmov}
        disabled={false}
      />
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
  },
  fabDisabled: {
    backgroundColor: Colors.gray,
  },
  flatlist: {
    width: wp(90),
  },
  text: {
    fontSize: wp(3),
    color: '#000',
    backgroundColor: Colors.success,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  textWarning: {
    backgroundColor: Colors.warning,
  },
  actions2: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: wp(100),
    marginTop: wp(2),
  },
  right: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatBlock: {
    flex: 1,
    paddingBottom: 0,
  },
  flatlistContainer: {
    paddingBottom: hp(1),
  },
  button: {
    paddingHorizontal: wp(2),
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 12,
    borderRadius: 10,
    zIndex: 999999,
  },
  buttonLabel: {
    fontSize: 10,
  },
  contentStyle: {
    fontSize: wp(3),
  },
  input: {
    paddingHorizontal: wp(1),
    width: wp(50),
    height: 50,
    marginRight: wp(2),
    backgroundColor: '#000',
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
  success: {
    width: '100%',
    paddingVertical: wp(1),
    backgroundColor: Colors.success,
    color: '#000',
    textAlign: 'center',
  },
  danger: {
    width: '100%',
    paddingVertical: wp(1),
    backgroundColor: Colors.error,
    color: '#000',
    textAlign: 'center',
  },
  warning: {
    width: '100%',
    paddingVertical: wp(1),
    backgroundColor: Colors.warning,
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
  typeBody: {
    color: Colors.primary,
    textAlign: 'center',
  },
  type: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: wp(1),
    alignItems: 'center',
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
});

export default StockMovs;
