import { View, Text, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from 'src/styles';
import { wp } from 'src/lib/utilities';
import { FlashList } from '@shopify/flash-list';
import { SkeletonLoad } from './SkeletonLoad';

const ListAllConcessions = ({ language, zones, t, concessions, menages }) => {
  const Renderer = React.useCallback(
    ({ item, index }) => {
      const concessionsZone = zones.find(z => String(z._id) === String(item.zoneId)) || {};
      const concessionMenageCount = menages.filtered(`concessionId == oid(${item._id})`);

      return (
        <View style={styles.itemContainer}>
          <View style={styles.flexRow}>
            <Text>{t('menages_count')}: </Text>
            <Text style={styles.textBold}>{item.NbrMenages}</Text>
          </View>
          <View style={styles.flexRow}>
            <Text>{t('menages_added')}: </Text>
            <Text style={styles.textBold}>{concessionMenageCount.length}</Text>
          </View>
          <View style={styles.flexRow}>
            <Text>{t('absent')}: </Text>
            <Text style={styles.textBold}>{item.NbrAbsents}</Text>
          </View>
          <View style={styles.flexRow}>
            <Text>{t('refus')}: </Text>
            <Text style={styles.textBold}>{item.NbrRefus}</Text>
          </View>
          <View style={styles.flexRow}>
            <Text>{t('zone')}: </Text>
            <Text style={styles.textBold}>
              {language === 'fr' ? concessionsZone.namefr : concessionsZone.namear}
            </Text>
          </View>
          <View style={styles.flexRow}>
            <Text>{t('address')}: </Text>
            <Text style={[styles.textBold, { width: '85%' }]}>{item?.Adresse}</Text>
          </View>
        </View>
      );
    },
    [language, menages, t, zones],
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return loading ? (
    <SkeletonLoad width={wp(90) > 400 ? 400 : wp(90)} height={120} />
  ) : (
    <View style={styles.list}>
      <FlashList
        contentContainerStyle={styles.listContent}
        data={concessions}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item._id}
        renderItem={Renderer}
        estimatedItemSize={181}
      />
    </View>
  );
};

export default ListAllConcessions;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.primaryGradientEnd,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: Colors.primary,
    color: '#000',
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  list: {
    width: '100%',
    margin: 10,
    height: '88%',
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  itemContainer: {
    margin: 10,
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 10,
    elevation: 10,
    width: wp(90) > 400 ? 400 : wp(90),
    alignSelf: 'center',
  },
  closeButton: {
    position: 'relative',
    top: 0,
    right: 0,
    backgroundColor: '#eee',
    alignSelf: 'flex-end',
    borderRadius: 5,
    marginRight: -15,
  },
  zoneFinished: {
    alignSelf: 'flex-end',
    marginTop: -6,
    marginRight: -10,
  },
  textBold: {
    fontWeight: 'bold',
  },
  listContent: {
    paddingVertical: 10,
  },
});
