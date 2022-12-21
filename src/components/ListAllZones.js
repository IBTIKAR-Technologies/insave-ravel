import { View, Text, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from 'src/styles';
import { wp } from 'src/lib/utilities';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { FlashList } from '@shopify/flash-list';
import { SkeletonLoad } from './SkeletonLoad';

const ListAllZones = ({ language, zones, t, concessions, menages, enqueters, localites }) => {
  const [loading, setLoading] = useState(true);
  const [newZones, setNewZones] = useState([]);
  const Renderer = React.useCallback(
    ({ item, index }) => {
      return (
        <View style={styles.itemContainer}>
          <View style={styles.flexRow}>
            <Text>{t('name')}: </Text>
            <Text style={styles.textBold}>{language === 'fr' ? item.namefr : item.namear}</Text>
          </View>
          <View style={styles.flexRow}>
            <Text>{t('localite')}: </Text>
            <Text style={styles.textBold}>
              {language === 'fr'
                ? item.zoneLocalite.namefr_rs || item.zoneLocalite.namefr_ons || t('no_localite')
                : item.zoneLocalite.namear || t('no_localite')}
            </Text>
          </View>
          <View style={styles.flexRow}>
            <Text>{t('enqueter')}: </Text>
            <Text style={styles.textBold}>{item.zoneEnqueter.fullName || t('no_enqueter')}</Text>
          </View>
          <View style={styles.flexRow}>
            <Text>{t('menages_added')}: </Text>
            <Text style={styles.textBold}>{item.totalMenages}</Text>
          </View>
          <View style={styles.flexRow}>
            <Text>{t('concessions_added')}: </Text>
            <Text style={styles.textBold}>{item.totalConcessions}</Text>
          </View>
          <View style={styles.flexRow}>
            <Text>{t('closed')}: </Text>
            {item.status === 'closed' ? (
              <EvilIcons name="check" size={30} color="#00a8ff" />
            ) : (
              <EvilIcons name="close-o" size={30} color="#FF6666" />
            )}
          </View>
        </View>
      );
    },
    [language, t],
  );

  useEffect(() => {
    setTimeout(() => {
      let nzs = JSON.parse(JSON.stringify(zones));
      nzs = nzs.map(z => ({
        ...z,
        totalConcessions: concessions.filtered(`zoneId == oid(${z._id})`).length,
        totalMenages: menages.filtered(`zoneId == oid(${z._id})`).length,
        zoneLocalite: localites.find(l => String(l._id) === String(z.localiteId)) || {},
        zoneEnqueter: enqueters.find(e => String(e._id) === String(z.enqueterId)) || {},
      }));
      setNewZones(nzs);
      setLoading(false);
    }, 100);
  }, [concessions, enqueters, localites, menages, zones]);

  return loading ? (
    <SkeletonLoad width={wp(90) > 400 ? 400 : wp(90)} height={120} />
  ) : (
    <View style={styles.list}>
      <FlashList
        contentContainerStyle={styles.listContent}
        data={newZones}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => String(item._id)}
        renderItem={Renderer}
        estimatedItemSize={195}
      />
    </View>
  );
};

export default ListAllZones;

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
    elevation: 3,
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
