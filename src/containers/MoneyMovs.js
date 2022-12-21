import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, FlatList, Keyboard } from 'react-native';
import { Text, List, TextInput, Button, FAB } from 'react-native-paper';
import { Colors } from 'src/styles';
import LinearGradient from 'react-native-linear-gradient';
import { wp, hp, getDate, navigate } from 'src/lib/utilities';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import Icon from 'src/components/Icon';
import debounce from 'lodash/debounce';
import { useIsConnected } from 'react-native-offline';
import { fetchList } from 'src/models/cartes';
import { Navigation } from 'react-native-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Deconnexion from 'src/components/Deconnexion';
import Exit from 'src/components/Exit';
import screenNames from 'src/lib/navigation/screenNames';
import Toast from 'react-native-toast-message';
import { useDebouncedCallback } from 'use-debounce';

const { language } = i18next;

const ITEM_HEIGHT = 70;

const paginate = (array, page_number) => {
  const page_size = 30;
  const real_page_number = page_number - 1; // because pages logically start with 1, but technically with 0
  let newData = array.slice(real_page_number * page_size, (real_page_number + 1) * page_size);
  newData = newData.map(moneymov => {
    const compte = global.realm
      .objects('comptes')
      .filtered(`_id == oid(${moneymov.compte_dest_id.toString()})`)[0];
    return { moneymov, compte };
  });
  return newData;
};

const MoneyMovs = function ({ componentId }) {
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
  const [solde, setSolde] = useState(0);
  const [isAddDisabled, setIsAddDisabled] = useState(true);

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
    const compte = global.realm
      .objects('comptes')
      .filtered(`centre_id == oid(${data.centre._id})`)[0];
    setSolde(compte.solde || 0);
    const all = global.realm.objects('moneymovs').filtered(`type == 'dc'`);
    const allWaiting = global.realm
      .objects('moneymovs')
      .filtered(`type == 'dc' AND executed == false`);
    console.log('all moneymovs', all);
    console.log('allWaiting', allWaiting.length);
    if (allWaiting.length === 0) {
      setIsAddDisabled(false);
    } else {
      setIsAddDisabled(true);
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

  const handleAddMoneyMov = useDebouncedCallback(
    () => {
      navigate(componentId, screenNames.MoneyMovsAdd, t('moneymovs_add_title'), { setSuccess });
    },
    3000,
    {
      leading: true,
      trailing: false,
    },
  );

  console.log('isAddDisabled', isAddDisabled);

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      <View style={styles.info}>
        <Text style={styles.header}>{t('moneymovs_title')}</Text>
        <View style={styles.type}>
          <Text>{`${t('solde')} : ${solde} MRU`}</Text>
          <Text>{`${t('mvts')} : ${everything}`}</Text>
        </View>
      </View>
      <View style={[styles.info, styles.flatBlock]}>
        <FlatList
          style={styles.flatlist}
          contentContainerStyle={styles.flatlistContainer}
          data={scrollData}
          keyExtractor={item => item.moneymov._id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={EmptyListMessage}
          getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          renderItem={({ item, index }) => {
            const { _id, executed, montant, createdAt } = item.moneymov;
            const { reference, proprio } = item.compte;
            return (
              <List.Item
                key={_id}
                title={`${montant} MRU`}
                description={`${reference} | ${proprio} | ${getDate(new Date(createdAt), false)}`}
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
        style={[styles.fab, isAddDisabled ? styles.fabDisabled : {}]}
        icon="plus"
        color={'#000'}
        onPress={handleAddMoneyMov}
        disabled={isAddDisabled}
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
    paddingHorizontal: wp(1),
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
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

export default MoneyMovs;
