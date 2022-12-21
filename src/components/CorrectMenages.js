import { View, Text, FlatList, StyleSheet } from 'react-native';
import React, { useCallback, useState, useEffect } from 'react';
import { Colors } from 'src/styles';
import { wp } from 'src/lib/utilities';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import screenNames from 'src/lib/navigation/screenNames';
import Icons from 'react-native-vector-icons/Foundation';
import { Navigation } from 'react-native-navigation';
import i18next from 'i18next';
import { SkeletonLoad } from './SkeletonLoad';
import ThrottledNavigateButton from './ThrottledNavigateButton';

const CorrectMenages = ({ user, componentId }) => {
  const [menagesToCorrect, setMenagesToCorrect] = useState([]);
  const [concessions, setConcessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { language } = i18next;

  const getData = useCallback(async () => {
    const mng = global.realms[0]
      .objects('menage')
      .filtered(`reCible == true && enqueterId == oid(${user._id})`);
    console.log('menages', mng.length);
    setMenagesToCorrect(mng);
    const cnss = global.realms[0]
      .objects('concession')
      .filtered(`operationId == oid(${user.operationId})`);
    setConcessions(cnss);
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
          <Text style={{ margin: 10 }}>{`${t('menages_to_survey')}: ${
            menagesToCorrect.length
          }`}</Text>
          <FlatList
            data={menagesToCorrect.slice(0, 10)}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={d => d._id}
            renderItem={({ item }) => {
              const menageConcession = concessions.find(c => {
                return String(c._id) === String(item.concessionId);
              });

              return (
                <View style={styles.concession}>
                  <View style={{ flex: 4 }}>
                    <View style={styles.flexRow}>
                      <Text style={styles.smallText}>{t('chef_name')}: </Text>
                      <Text style={styles.textBold}>
                        {language === 'fr' ? item.chefNameFr : item.chefNameAr}
                      </Text>
                    </View>
                    <View style={styles.flexRow}>
                      <Text style={styles.smallText}>{t('family_name')}: </Text>
                      <Text style={styles.textBold}>
                        {language === 'fr' ? item.familyNameFr : item.familyNameAr}
                      </Text>
                    </View>
                    <View style={styles.flexRow}>
                      <Text style={styles.smallText}>{t('tel_chef')}: </Text>
                      <Text style={styles.textBold}>{item.TelChef || t('no_phone')}</Text>
                    </View>
                    <View style={styles.flexRow}>
                      <Text style={styles.smallText}>{t('address')}: </Text>
                      <Text style={styles.textBold}>{menageConcession?.Adresse}</Text>
                    </View>
                    <View style={styles.flexRow}>
                      <Text style={styles.smallText}>{t('concession_num')}: </Text>
                      <Text style={styles.textBold}>{menageConcession?.Numero}</Text>
                    </View>
                  </View>
                  <View style={styles.flexRow}>
                    <ThrottledNavigateButton
                      componentId={componentId}
                      destination={screenNames.CorrectMenage}
                      tobBarTitleText={`${t('mcorrect')}(${
                        language === 'ar' ? item.familyNameAr : item.familyNameFr
                      })`}
                      tobBarTitleColor={'#000'}
                      tobBarBackgroundColor={Colors.primary}
                      noBackButton
                      passProps={{
                        user,
                        menage: item,
                        menagesComponentId: componentId,
                        concession: menageConcession,
                      }}
                      disabled={item.surveyed}
                      styles={item.surveyed ? styles.bSurveyDisable : styles.bSurvey}>
                      <Icons
                        style={{ margin: 5 }}
                        name="clipboard-pencil"
                        size={12}
                        color={'#000'}
                      />
                      <Text style={{}}>{t('mcorrect')}</Text>
                    </ThrottledNavigateButton>
                  </View>
                </View>
              );
            }}
          />
        </>
      )}
    </LinearGradient>
  );
};

export default CorrectMenages;

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
