import { View, Text, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  fetchZones,
  fetchEnquetersForSupervisor,
  fetchCommunes,
  fetchLocalites,
} from 'src/models/cartes';
import { Navigation } from 'react-native-navigation';
import i18next, { t } from 'i18next';
import { hp, wp } from 'src/lib/utilities';
import { Colors } from 'src/styles';
import screenNames from 'src/lib/navigation/screenNames';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import RNPickerSelect from 'react-native-picker-select';
import { FlashList } from '@shopify/flash-list';
import ThrottledNavigateButton from './ThrottledNavigateButton';

const ZonesSupervisor = ({ user, componentId }) => {
  const [zones, setZones] = useState([]);
  const [enqueters, setEnqueters] = useState([]);
  const [filters, setFilters] = useState([]);
  const [value, setValue] = useState('all');
  const [loading, setLoading] = useState(true);
  const { language } = i18next;

  if (!user) {
    Navigation.pop(componentId);
  }

  const initialize = useCallback(async () => {
    const localites = await fetchLocalites();
    const cmns = await fetchCommunes();
    const newComns = JSON.parse(JSON.stringify(cmns));
    let zns = await fetchZones(user);
    zns = JSON.parse(JSON.stringify(zns));
    const eqtrs = await fetchEnquetersForSupervisor(user);
    const newLocalites = JSON.parse(JSON.stringify(localites)).filter(
      l => !zns.find(z => String(z.localiteId) === String(l._id)),
    );
    zns = zns.filter(z => !z.enqueterId);

    if (value === 'all') {
      setZones([...newLocalites, ...zns]);
    } else {
      setZones([
        ...newLocalites.filter(l => l.communeId === value),
        ...zns.filter(z => z.communeId === value),
      ]);
    }
    setEnqueters(JSON.parse(JSON.stringify(eqtrs)));
    setFilters([
      { label: t('all'), value: 'all' },
      ...newComns.map(c => ({
        label: language === 'fr' ? c.namefr_rs || c.namefr_ons : c.namear,
        value: c._id,
      })),
    ]);
    setLoading(false);
  }, [language, user, value]);

  useEffect(() => {
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
  }, [componentId, initialize]);

  const updateFilter = useCallback(
    commune => {
      if (commune !== value) {
        setLoading(true);
        setValue(commune);
        setTimeout(async () => {
          if (commune === 'all') {
            const lcts = global.realms[0].objects('localite').sorted('createdAt', true);
            const zns = global.realms[0].objects('zone').sorted('status', true);
            const newZns = JSON.parse(JSON.stringify(zns));
            setZones([
              ...JSON.parse(JSON.stringify(lcts)).filter(
                l => !newZns.find(z => z.localiteId === l._id),
              ),
              ...newZns,
            ]);
          } else {
            const lcts = global.realms[0]
              .objects('localite')
              .filtered(`communeId == oid(${commune})`)
              .sorted('createdAt', true);
            const zns = global.realms[0]
              .objects('zone')
              .filtered(`communeId == oid(${commune})`)
              .sorted('status', true);
            const newZns = JSON.parse(JSON.stringify(zns));
            const newLcts = JSON.parse(JSON.stringify(lcts)).filter(
              l => !newZns.find(z => String(z.localiteId) === String(l._id)),
            );
            console.log('newlocalites', newLcts);

            setZones([...newLcts, ...newZns]);
          }
          setLoading(false);
        }, 400);
      }
    },
    [setLoading, value],
  );
  return (
    <View style={{ alignContent: 'flex-start', flex: 1 }}>
      <Text style={{ fontSize: 18, alignSelf: 'center' }}>{t('commune')}: </Text>
      <View style={styles.container2}>
        <RNPickerSelect
          placeholder={{}}
          onValueChange={updateFilter}
          value={value}
          items={filters}
          style={pickerSelectStyles}
        />
      </View>
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} size={50} />
      ) : zones.length > 0 ? (
        <View style={{ alignContent: 'flex-start', flex: 1 }}>
          <FlashList
            contentContainerStyle={styles.listContent}
            data={zones}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item._id}
            estimatedItemSize={131}
            renderItem={({ item, index }) => {
              const enqueter = enqueters.find(enq => String(item.enqueterId) === String(enq._id));
              return (
                <ThrottledNavigateButton
                  styles={
                    item.status === 'closed' ? styles.itemContainerDisbled : styles.itemContainer
                  }
                  disabled={item.status === 'closed'}
                  componentId={componentId}
                  destination={screenNames.EditZone}
                  passProps={{
                    user,
                    zone: item,
                    enqueter,
                    t,
                    language,
                    enqueters,
                    setZones,
                  }}
                  tobBarBackgroundColor={Colors.primary}
                  tobBarTitleColor={'#fff'}
                  tobBarTitleText={t('edit_zone')}>
                  <View style={styles.flexRow}>
                    <Text>{`${t('zone_name')}:`}</Text>
                    <Text>{language === 'fr' ? item.namefr || item.namefr_rs : item.namear}</Text>
                  </View>
                  <View style={styles.flexRow}>
                    <Text>{`${t('enqueter')}:`}</Text>
                    <Text style={!enqueter && { color: Colors.error }}>
                      {enqueter ? enqueter.fullName : t('no_enqueter')}
                    </Text>
                  </View>
                  <View style={[styles.flexRow, { alignItems: 'flex-start' }]}>
                    <Text style={styles.closed}>{t('closed')}</Text>
                    {item.status === 'closed' ? (
                      <EvilIcons name="check" size={30} color="#00a8ff" />
                    ) : (
                      <EvilIcons name="close-o" size={30} color="#FF6666" />
                    )}
                  </View>
                </ThrottledNavigateButton>
              );
            }}
          />
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ color: '#900', textAlign: 'center' }}>{t('no_zones')}</Text>
        </View>
      )}
    </View>
  );
};

export default ZonesSupervisor;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: Colors.primary,
    color: '#000',
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginHorizontal: 20,
    marginTop: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  container: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.primaryGradientEnd,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    marginHorizontal: 20,
  },
  list: {
    width: wp(90) > 400 ? 400 : wp(90),
    marginBottom: 10,
  },
  itemContainer: {
    margin: 10,
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  itemContainerDisbled: {
    margin: 10,
    backgroundColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  listContainer: {
    flex: 1,
    alignItems: 'center',
    height: hp(80),
  },
  listContent: {
    paddingVertical: 10,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  container2: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    width: wp(90) > 400 ? 400 : wp(90),
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
