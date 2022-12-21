import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from 'src/styles';
import { wp } from 'src/lib/utilities';
import { FlashList } from '@shopify/flash-list';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native-paper';
import screenNames from 'src/lib/navigation/screenNames';
import { Navigation } from 'react-native-navigation';
import { SkeletonLoad } from './SkeletonLoad';

const ItemRenderer = ({ item, handleOpenForm }) => {
  const { language } = i18next;
  const { t } = useTranslation();
  const menageConcession = global.realms[0]
    .objects('concession')
    .filtered(`_id == oid(${item.concessionId})`)[0];
  const menageZone = global.realms[0].objects('zone').filtered(`_id == oid(${item.zoneId})`)[0];

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleOpenForm(item, menageConcession)}>
      <View style={styles.flexRow}>
        <Text>{t('family_name')}: </Text>
        <Text style={styles.textBold}>
          {language === 'fr' ? item.familyNameFr : item.familyNameAr}
        </Text>
      </View>
      <View style={styles.flexRow}>
        <Text>{t('tel_chef')}: </Text>
        <Text style={styles.textBold}>{item.TelChef || t('no_phone')}</Text>
      </View>
      <View style={styles.flexRow}>
        <Text>{t('nni_chef')}: </Text>
        <Text style={styles.textBold}>{item.NNIChef || t('no_nni')}</Text>
      </View>
      <View style={styles.flexRow}>
        <Text>{t('zone')}: </Text>
        <Text style={styles.textBold}>
          {language === 'fr' ? menageZone.namefr : menageZone.namear}
        </Text>
      </View>
      <View style={styles.flexRow}>
        <Text>{t('address')}: </Text>
        <Text style={styles.textBold}>{menageConcession?.Adresse}</Text>
      </View>
      <View style={styles.flexRow}>
        <Text>{t('Score')}: </Text>
        <Text style={styles.textBold}>{item?.Score}</Text>
      </View>
    </TouchableOpacity>
  );
};

const ListAllMenages = ({ menages, componentId }) => {
  const [newMenages, setNewMenages] = useState(menages);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      setNewMenages(menages);
    }, 1);
  }, [menages]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleOpenForm = (menage, concession) => {
    Navigation.push(componentId, {
      component: {
        name: screenNames.EditMenageSuper,
        options: {
          topBar: {
            title: {
              text: t('add_menage'),
            },
            background: {
              color: Colors.primary,
            },
          },
          animations: {
            pop: {
              content: {
                x: {
                  from: 0,
                  to: wp(95),
                  duration: 200,
                  startDelay: 0,
                },
              },
            },
            push: {
              content: {
                x: {
                  from: wp(95),
                  to: 0,
                  duration: 200,
                  startDelay: 0,
                },
              },
            },
          },
        },
        passProps: {
          concession,
          edit: true,
          oldmenage: menage,
        },
      },
    });
  };

  const handleSearch = text => {
    setSearch(text);
    if (text === '') {
      setNewMenages(menages);
      return;
    }
    console.log('stex', text);
    const pattern = new RegExp(`^${text}`);
    setNewMenages(
      newMenages.filter(item => pattern.test(item.NNIChef) || pattern.test(item.TelChef)),
    );
  };

  return loading ? (
    <SkeletonLoad width={wp(90) > 400 ? 400 : wp(90)} height={120} />
  ) : (
    <View style={styles.list}>
      <TextInput
        mode="outlined"
        label={t('search_phon_nni')}
        value={search}
        onChangeText={txt => handleSearch(txt)}
        style={{
          height: 45,
          marginBottom: 20,
          width: wp(90) > 400 ? 400 : wp(90),
          alignSelf: 'center',
        }}
      />
      <FlashList
        contentContainerStyle={styles.listContent}
        data={newMenages}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item._id}
        renderItem={item => <ItemRenderer {...item} handleOpenForm={handleOpenForm} />}
        estimatedItemSize={189}
        ListEmptyComponent={<SkeletonLoad height={189} width={wp(90) > 400 ? 400 : wp(90)} />}
      />
    </View>
  );
};

export default ListAllMenages;

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
