import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from 'src/styles';
import { wp, hp } from 'src/lib/utilities';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import LinearGradient from 'react-native-linear-gradient';
import * as Progress from 'react-native-progress';
import { FlashList } from '@shopify/flash-list';
import LoadingModalTransparent from './LoadingModalTransparent';

const enqueterRoleId = '62d562fda5fac5ffb48ef7e2';
const controllerRoleId = '62d5635aa5fac5ffb48ef7e4';
const supervisorRoleId = '62d5633aa5fac5ffb48ef7e3';

const HistoryEnquete = function ({ user, selectedLocalite, selectedZone }) {
  const { t } = useTranslation();
  const [menages, setMnages] = useState([]);
  const [menagesValidated, setMnagesValidated] = useState([]);
  const [localites, setLocalites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = i18next;

  useEffect(() => {
    setTimeout(() => {
      (async () => {
        let mngs = [];
        let mngsv = [];
        let conces = [];
        if (user.roleId === enqueterRoleId || user.roleId === controllerRoleId) {
          if (selectedLocalite && selectedLocalite.type === 'Urbain') {
            mngs = global.realms[0]
              .objects('menage')
              .filtered(`zoneId == oid(${selectedZone._id}) && Eligible == true`);
            mngsv = mngs.filtered(`validated == true`);
            conces = global.realms[0]
              .objects('concession')
              .filtered(`zoneId == oid(${selectedZone._id})`);
          }
          if (selectedLocalite && selectedLocalite.type === 'Rural') {
            mngs = global.realms[0]
              .objects('menage')
              .filtered(`localiteId == oid(${selectedLocalite._id}) && Eligible == true`);
            mngsv = mngs.filtered(`validated == true`);
            conces = global.realms[0]
              .objects('concession')
              .filtered(`localiteId == oid(${selectedLocalite._id})`);
          }
          setLoading(false);
        }
        if (user.roleId === supervisorRoleId) {
          const lcts = global.realms[0].objects('localite');
          mngs = global.realms[0].objects('menage');
          setLocalites(
            lcts.map(l => {
              const lmenages = mngs.filtered(
                `localiteId == oid(${l._id}) && Eligible == true`,
              ).length;
              const lvalidated = mngs.filtered(
                `localiteId == oid(${l._id}) && Eligible == true && validated == true`,
              ).length;
              const progress = lvalidated / lmenages;
              return {
                localite: l,
                menages: lmenages,
                validated: lvalidated,
                progress,
              };
            }),
          );
          setLoading(false);
        }
        setMnages(mngs);
        setMnagesValidated(
          mngsv.map(me => {
            const concession = conces.filtered(`_id == oid(${me.concessionId})`)[0];
            return {
              concession,
              menage: me,
            };
          }),
        );
      })();
    }, 1);
  }, [selectedLocalite, selectedZone, user]);

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      <LoadingModalTransparent loading={loading} />
      {user?.roleId === supervisorRoleId ? (
        <View
          style={{
            width: wp(100),
            flex: 5,
          }}>
          <FlashList
            data={localites}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => String(item.localite._id)}
            estimatedItemSize={121}
            renderItem={({ item }) => {
              console.log(item.progress);
              if (item.menages === 0) return null;
              return (
                <View key={item.localite._id} style={styles.itemContainer2}>
                  <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                      {language === 'ar' ? item.localite.namear : item.localite.namefr_rs}
                    </Text>
                    <Text>{`${t('eligibles')}${item.menages}`}</Text>
                    <Text>{`${t('enqueted')}${item.validated}`}</Text>
                    <Text>{`${t('m_rest')}${item.menages - item.validated}`}</Text>
                  </View>
                  <View>
                    <Progress.Circle
                      size={100}
                      progress={item.progress}
                      formatText={() => `${parseInt(item.progress * 100, 10)}%`}
                      color={
                        item.progress > 0.9
                          ? Colors.primary
                          : item.progress < 0.5
                          ? Colors.error
                          : Colors.yellow
                      }
                      showsText
                      animated
                    />
                  </View>
                </View>
              );
            }}
          />
        </View>
      ) : (user?.roleId === enqueterRoleId || user?.roleId === controllerRoleId) &&
        menages.length > 0 ? (
        <View
          style={{
            width: '100%',
            flex: 5,
          }}>
          <View style={styles.itemContainer2}>
            <View>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                {selectedLocalite && selectedLocalite.type === 'Urbain'
                  ? language === 'fr'
                    ? selectedZone.namefr
                    : selectedZone.namear
                  : language === 'fr'
                  ? selectedLocalite.namefr_rs
                  : selectedLocalite.namear}
              </Text>
              <Text>{`${t('eligibles')}${menages.length}`}</Text>
              <Text>{`${t('enqueted')}${menagesValidated.length}`}</Text>
              <Text>{`${t('m_rest')}${menages.length - menagesValidated.length}`}</Text>
            </View>
            <View>
              <Progress.Circle
                size={100}
                progress={menagesValidated.length / menages.length}
                formatText={() =>
                  `${parseInt((menagesValidated.length / menages.length) * 100, 10)}%`
                }
                showsText
                animated
              />
            </View>
          </View>
          <FlashList
            data={menagesValidated}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.menage._id}
            estimatedItemSize={129}
            renderItem={({ item, index }) => (
              <View style={styles.itemContainer}>
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
                  <Text style={styles.smallText}>{t('nni_chef')}: </Text>
                  <Text style={styles.textBold}>{item.menage.NNIChef || t('no_nni')}</Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.smallText}>{t('address')}: </Text>
                  <Text style={styles.textBold}>{item.concession?.Adresse}</Text>
                </View>
              </View>
            )}
          />
        </View>
      ) : (
        <Text
          style={{
            backgroundColor: '#000',
            width: wp(90) > 400 ? 400 : wp(90),
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            flex: 1,
            textAlign: 'center',
            paddingVertical: hp(20),
            color: Colors.error,
          }}>
          {t('no_menages_found')}
        </Text>
      )}
    </LinearGradient>
  );
};

export default HistoryEnquete;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    backgroundColor: Colors.primaryGradientEnd,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    marginHorizontal: 20,
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: Colors.primary,
    color: '#000',
    paddingHorizontal: 20,
    paddingVertical: 3,
    marginHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: wp(90) > 400 ? 400 : wp(90),
    marginTop: 10,
  },
  list: {
    backgroundColor: '#000',
    width: wp(90) > 400 ? 400 : wp(90),
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 10,
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
  itemContainer2: {
    margin: 10,
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    width: wp(90),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(2),
    paddingVertical: hp(2),
    backgroundColor: Colors.primaryGradientEnd,
    borderRadius: wp(5),
    margin: hp(1.5),
    marginHorizontal: wp(2),
    flexWrap: 'wrap',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  listItem: {
    backgroundColor: Colors.primaryGradientEnd,
    width: wp(40),
    paddingVertical: hp(0.5),
  },
  smallText: {
    fontSize: wp(3),
  },
  normalText: {
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  closeZoneButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    width: wp(100) < 400 ? 160 : 230,
    marginTop: 20,
    borderRadius: 50,
    elevation: 3,
    alignItems: 'center',
    marginBottom: 20,
  },
  closeZoneButtonDisbled: {
    backgroundColor: Colors.primary,
    padding: 10,
    width: wp(100) < 400 ? 160 : 230,
    marginTop: 20,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 20,
  },
  smallRedText: {
    fontSize: 10,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: -20,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  modalWraper: {
    display: 'flex',
    backgroundColor: '#000',
    width: wp(100) < 400 ? wp(80) : 400,
    padding: 20,
    paddingTop: 5,
    borderRadius: 10,
  },
  input: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    marginTop: 10,
    width: wp(100) < 400 ? wp(70) : 300,
    fontSize: 20,
    textAlign: 'center',
  },
});
