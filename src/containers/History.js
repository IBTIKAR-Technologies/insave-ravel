import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Text, List } from 'react-native-paper';
import { Colors } from 'src/styles';
import LinearGradient from 'react-native-linear-gradient';
import { wp, hp, getDate } from 'src/lib/utilities';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { Navigation } from 'react-native-navigation';
import Deconnexion from 'src/components/Deconnexion';
import Exit from 'src/components/Exit';

const { language } = i18next;

function add(accumulator, a) {
  return accumulator + a;
}

const rightComp = createdAt =>
  function () {
    return (
      <View style={styles.right}>
        <Text style={styles.text}>{getDate(new Date(createdAt))}</Text>
      </View>
    );
  };

const ITEM_HEIGHT = 70;

const paginate = (array, page_number) => {
  const page_size = 30;
  const real_page_number = page_number - 1; // because pages logically start with 1, but technically with 0
  const newData = array.slice(real_page_number * page_size, (real_page_number + 1) * page_size);
  return newData;
};

const History = function (props) {
  const { t } = useTranslation();
  // console.log('props', props);
  const [synced, setSynced] = useState(false);
  const [liste, setListe] = useState([]);
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [everything, setEverything] = useState(0);
  const [scrollData, setScrollData] = useState([]);
  const [page, setPage] = useState(1);

  console.log('global.realm', global.realm);

  console.log('history liste', liste.length);

  const handleLoadMore = useCallback(() => {
    setPage(page + 1);
    setScrollData([...scrollData, ...paginate(liste, page + 1)]);
  }, [liste, page, scrollData]);

  const EmptyListMessage = useCallback(
    () => (
      <View style={styles.root}>
        <Text>{search ? t('no_results') : t('no_history')}</Text>
      </View>
    ),
    [search, t],
  );

  const initialize = useCallback(() => {
    const all = global.realm.objects('person');

    console.log('all', all.length);
    setEverything(all.length);
    (async () => {
      const recordsX = all;
      const notSynced = recordsX.filtered('syncedAt == null');
      if (notSynced.length === 0) {
        setSynced(true);
      } else {
        setSynced(false);
      }
      console.log('recordsx', recordsX.length);
      setListe(recordsX);
      setRecords(recordsX);
      setScrollData(paginate(recordsX, 1));
    })();
  }, []);

  useEffect(() => {
    console.log('history liste', liste);
    initialize();
    const listener = {
      componentDidAppear: () => {
        console.log('RNN', 'componentDidAppear');
        initialize();
        global.allowPhone = false;
      },
    };
    const unsubscribe = Navigation.events().registerComponentListener(listener, props.componentId);
    return () => {
      unsubscribe.remove();
    };
  }, [initialize, liste, props.componentId]);

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      <View style={styles.actions2}>
        <Deconnexion />
        <Exit />
      </View>
      <View style={styles.info}>
        <Text style={styles.header}>{t('history_title')}</Text>
        {/*         <View style={styles.type}>
          <TextInput label={t('search')} value={search} onChangeText={handleInputChange} name="search" autoCompleteType="off" style={styles.input} />
          <Button
            icon="delete"
            mode="contained"
            onPress={reset}
            disabled={!search}
            style={styles.button}
            contentStyle={styles.content}
            color={Colors.primary}
          >
            {t('clear')}
          </Button>
        </View> */}
        <View style={styles.type}>
          <Text>{`${t('total')} : ${liste.length} / ${everything}`}</Text>
        </View>
      </View>
      <View style={[styles.info, styles.flatBlock]}>
        <FlatList
          style={styles.flatlist}
          contentContainerStyle={styles.flatlistContainer}
          data={scrollData}
          keyExtractor={item => item._id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={EmptyListMessage}
          getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          renderItem={({ item, index }) => {
            const { _id, MbId, Localite, MbNom, deliveredAt } = item;
            const comp = rightComp(deliveredAt);
            return (
              <List.Item
                key={_id}
                title={MbId}
                description={`${MbNom} | ${Localite}`}
                right={comp}
              />
            );
          }}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  root: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: { fontSize: wp(3) },
  flatlist: {
    width: wp(90),
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
    justifyContent: 'center',
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

export default History;
