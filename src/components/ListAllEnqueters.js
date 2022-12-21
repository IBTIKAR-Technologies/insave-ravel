import { View, Text, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from 'src/styles';
import { wp } from 'src/lib/utilities';
import { FlashList } from '@shopify/flash-list';
import { SkeletonLoad } from './SkeletonLoad';

const ListAllEnqueters = ({ language, zones, t, concessions, menages, enqueters, controlers }) => {
  const Renderer = React.useCallback(
    ({ item, index }) => {
      const enqueterConcessions = concessions.filtered(`enqueterId == oid(${item._id})`);
      const enqueterMenages = menages.filtered(`enqueterId == oid(${item._id})`);
      const enqueterDaily = enqueterMenages.filtered(
        `createdAt >= $0`,
        new Date(new Date().setHours(0, 0, 0, 0)),
      );
      const enqueterControler = item.controllerId
        ? controlers.filtered(`_id == oid(${item.controllerId})`)
        : [{}];
      return (
        <View style={styles.itemContainer}>
          <View style={styles.flexRow}>
            <Text>{t('name')}: </Text>
            <Text style={styles.textBold}>{item.fullName}</Text>
          </View>
          <View style={styles.flexRow}>
            <Text>{t('menages_added')}: </Text>
            <Text style={styles.textBold}>{enqueterMenages.length}</Text>
          </View>
          <View style={styles.flexRow}>
            <Text>{t('menages_added_td')}: </Text>
            <Text style={styles.textBold}>{enqueterDaily.length}</Text>
          </View>
          <View style={styles.flexRow}>
            <Text>{t('concessions_added')}: </Text>
            <Text style={styles.textBold}>{enqueterConcessions.length}</Text>
          </View>
          <View style={styles.flexRow}>
            <Text>{t('controler')}: </Text>
            <Text style={styles.textBold}>
              {(enqueterControler[0] && enqueterControler[0].fullName) || t('no_controler')}
            </Text>
          </View>
        </View>
      );
    },
    [concessions, controlers, menages, t],
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
        data={enqueters}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item._id}
        renderItem={Renderer}
        estimatedItemSize={166}
      />
    </View>
  );
};

export default ListAllEnqueters;

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
