import { View, Text, FlatList, StyleSheet } from 'react-native';
import React, { useCallback, useState, useEffect } from 'react';
import { Colors } from 'src/styles';
import { wp } from 'src/lib/utilities';
import LinearGradient from 'react-native-linear-gradient';
import FontIncons from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';
import screenNames from 'src/lib/navigation/screenNames';
import { Navigation } from 'react-native-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from 'i18next';
import { SkeletonLoad } from './SkeletonLoad';
import ThrottledNavigateButton from './ThrottledNavigateButton';

const MenagesSelected = ({ user, componentId }) => {
  const [menages, setMenages] = useState([]);
  const [concessions, setConcessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();
  const { language } = i18next;

  const getData = useCallback(async () => {
    let selectedLoc = await AsyncStorage.getItem('selectedLocaliteEnq');
    selectedLoc = JSON.parse(selectedLoc);
    let mngs;
    let cnss;
    if (selectedLoc.type === 'Urbain') {
      let zn = await AsyncStorage.getItem('selectedZonEnq');
      zn = JSON.parse(zn);
      console.log(zn);
      mngs = global.realms[0]
        .objects('menage')
        .filtered(`zoneId == oid(${zn._id}) && Eligible == true && validated != true`)
        .sorted('concessionId', false);
      cnss = global.realms[0].objects('concession').filtered(`zoneId == oid(${zn._id})`);
    } else {
      mngs = global.realms[0]
        .objects('menage')
        .filtered(
          `operationId == oid(${user.operationId}) && localiteId == oid(${selectedLoc._id}) && Eligible == true && validated != true`,
        )
        .sorted('concessionId', false);
      cnss = global.realms[0]
        .objects('concession')
        .filtered(
          `operationId == oid(${user.operationId}) && localiteId == oid(${selectedLoc._id})`,
        );
    }
    setMenages(
      mngs.map(men => {
        const concession = global.realms[0]
          .objects('concession')
          .filtered(`_id == oid(${men.concessionId})`)[0];
        return {
          concession,
          menage: men,
        };
      }),
    );
    setLoading(false);
  }, [user]);

  useEffect(() => {
    const listener = {
      componentDidAppear: () => {
        console.log('RNN', 'componentDidAppear');
        getData();
      },
    };
    const unsubscribe = Navigation.events().registerComponentListener(listener, componentId);
    return () => {
      unsubscribe.remove();
    };
  }, [getData, componentId]);

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      {loading ? (
        <SkeletonLoad width={wp(90) > 400 ? 400 : wp(90)} height={120} />
      ) : (
        <>
          <Text style={{ margin: 10 }}>{`${t('menages_to_survey')}: ${menages.length}`}</Text>
          <FlatList
            data={menages}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={d => d.menage._id}
            renderItem={({ item }) => (
              <View style={styles.concession}>
                <View style={{ flex: 4 }}>
                  <View style={styles.flexRow}>
                    <Text style={styles.smallText}>{t('chef_name')}: </Text>
                    <Text style={styles.textBold}>
                      {language === 'fr' ? item.menage.chefNameFr : item.menage.chefNameAr}
                    </Text>
                  </View>
                  <View style={styles.flexRow}>
                    <Text style={styles.smallText}>{t('family_name')}: </Text>
                    <Text style={styles.textBold}>
                      {language === 'fr' ? item.menage.familyNameFr : item.menage.familyNameAr}
                    </Text>
                  </View>
                  <View style={styles.flexRow}>
                    <Text style={styles.smallText}>{t('tel_chef')}: </Text>
                    <Text style={styles.textBold}>{item.menage.TelChef || t('no_phone')}</Text>
                  </View>
                  <View style={styles.flexRow}>
                    <Text style={styles.smallText}>{t('address')}: </Text>
                    <Text style={styles.textBold}>{item.concession?.Adresse}</Text>
                  </View>
                  <View style={styles.flexRow}>
                    <Text style={styles.smallText}>{t('concession_num')}: </Text>
                    <Text style={styles.textBold}>{item.concession?.Numero}</Text>
                  </View>
                </View>
                <View style={styles.flexRow}>
                  <ThrottledNavigateButton
                    componentId={componentId}
                    destination={screenNames.AddEnquete}
                    tobBarTitleText={`${t('add_enquete')}(${
                      language === 'ar' ? item.menage.familyNameAr : item.menage.familyNameFr
                    })`}
                    tobBarTitleColor={'#000'}
                    tobBarBackgroundColor={Colors.primary}
                    noBackButton
                    passProps={{
                      user,
                      menage: item.menage,
                      menagesComponentId: componentId,
                    }}
                    disabled={item.menage.surveyed}
                    styles={item.menage.surveyed ? styles.bSurveyDisable : styles.bSurvey}>
                    <FontIncons
                      style={{ margin: 5 }}
                      name="clipboard-check"
                      size={10}
                      color={'#000'}
                    />
                    <Text style={{}}>{t('survey_v')}</Text>
                  </ThrottledNavigateButton>
                </View>
              </View>
            )}
          />
        </>
      )}
    </LinearGradient>
  );
};

export default MenagesSelected;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  concession: {
    marginHorizontal: wp(2),
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 8,
    marginVertical: 10,
    elevation: 10,
  },
  list: {
    flex: 1,
    width: wp(90) > 400 ? 400 : wp(90),
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  textWraper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  concessionText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  concessionTitle: {
    fontSize: 14,
    alignSelf: 'flex-start',
  },
  bSurvey: {
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    marginTop: 10,
    flexDirection: 'row',
    elevation: 5,
    flex: 1,
    justifyContent: 'center',
  },
  membresB: {
    marginTop: 10,
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    elevation: 5,
  },
  membresBDisable: {
    marginTop: 10,
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: '#888',
    flexDirection: 'row',
  },
  mMembres: {},
  bSurveyDisable: {
    marginTop: 10,
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: '#888',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  position: {
    width: 20,
    position: 'absolute',
    top: 5,
    left: 5,
  },
  smallText: {
    fontSize: 15,
  },
  normalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
