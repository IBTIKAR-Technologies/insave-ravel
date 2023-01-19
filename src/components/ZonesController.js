import {
  View, Text, ActivityIndicator, StyleSheet,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { fetchZones, fetchLocalites, fetchEnquetersForSupervisor } from 'src/models/cartes';
import { Navigation } from 'react-native-navigation';
import i18next, { t } from 'i18next';
import { wp } from 'src/lib/utilities';
import { Colors } from 'src/styles';
import screenNames from 'src/lib/navigation/screenNames';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { FlashList } from '@shopify/flash-list';
import ThrottledNavigateButton from './ThrottledNavigateButton';

const ZonesSupervisor = ({ user, componentId }) => {
  const [zones, setZones] = useState([]);
  const [enqueters, setEnqueters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commune, setCommune] = useState(null);
  const { language } = i18next;

  if (!user) {
    Navigation.pop(componentId);
  }
  const initialize = useCallback(async () => {
    let localites = await fetchLocalites();
    localites = localites.filtered(`communeId == oid(${user?.communeId})`);
    let zns = await fetchZones(user);
    zns = zns.filtered(`communeId == oid(${user?.communeId})`);
    const cmn = global.realms[0].objects('commune').filtered(`_id == oid(${user?.communeId})`)[0];
    setCommune(cmn);
    zns = JSON.parse(JSON.stringify(zns));
    let eqtrs = await fetchEnquetersForSupervisor(user);
    eqtrs = eqtrs.filtered(`controllerId == oid(${user?._id}) OR _id == oid(${user?._id})`);
    const newLocalites = JSON.parse(JSON.stringify(localites)).filter(
      l => !zns.find(z => String(z.localiteId) === String(l._id)),
    );
    zns = zns.filter(z => !z.enqueterId);
    setZones([...newLocalites, ...zns]);
    setEnqueters(JSON.parse(JSON.stringify(eqtrs)));
    setLoading(false);
  }, [user]);

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

  return (
    <View style={{ alignContent: 'flex-start', flex: 1 }}>
      <Text style={{ fontSize: 18, alignSelf: 'center' }}>
        {t('commune')}:{' '}
        {language === 'fr' ? commune && commune.namefr_rs : commune && commune.namear}
      </Text>
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} size={50} />
      ) : zones.length > 0 ? (
        <View style={styles.container2}>
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
                  tobBarTitleColor="#fff"
                  tobBarTitleText={t('edit_zone')}
                >
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
        <View>
          <Text>{t('no_zones')}</Text>
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
    flex: 1,
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
