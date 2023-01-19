import {
  View, Text, StyleSheet, Alert, TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wp, hp } from 'src/lib/utilities';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from 'src/styles';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';
import screenNames from 'src/lib/navigation/screenNames';
import { getQuetionaiLocalite, getParams, fetchLocalites } from 'src/models/cartes';
import Geolocation from 'react-native-geolocation-service';
import { distanceToGeoPolygon, getDistance } from 'src/lib/locationTools';
import i18n from 'src/lib/languages/i18n';
import Lottie from 'lottie-react-native';
import Toast from 'react-native-toast-message';
import RNPickerSelect from 'react-native-picker-select';
import i18next from 'i18next';
import LoadingModalTransparent from './LoadingModalTransparent';
import ThrottledNavigateButton from './ThrottledNavigateButton';

const enqueterRoleId = '62d562fda5fac5ffb48ef7e2';
const controllerRoleId = '62d5635aa5fac5ffb48ef7e4';
const supervisorRoleId = '62d5633aa5fac5ffb48ef7e3';

const Ciblage = function ({ componentId }) {
  const [user, setUser] = useState({});
  const [ciblageEnded, setCiblageEnded] = useState(false);
  const [questionaireLocalite, setQuestionaireLocalite] = useState({});
  const { t } = useTranslation();
  const { language } = i18next;
  const [loading, setLoading] = useState(false);
  const [canCible, setCanCible] = useState(true);
  const [selectZone, setSelectZone] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [zones, setZones] = useState([]);
  const [value, setValue] = useState('');
  const [allZonesClosed, setAllZonesClosed] = useState(false);
  const [allLocalites, setAllLocalites] = useState([]);
  const [selectedLocalite, setSelectedLocalite] = useState(null);

  const initialize = useCallback(async () => {
    const userData = await AsyncStorage.getItem('userData');
    const theSelectedZ = await AsyncStorage.getItem('selectedZone');
    const parsed = JSON.parse(userData);
    setUser(parsed);

    if (parsed.roleId === supervisorRoleId) {
      const localites = await fetchLocalites();
      setAllLocalites(['', ...JSON.parse(JSON.stringify(localites))]);
    }
    if (
      (parsed.roleId === enqueterRoleId || parsed.roleId === controllerRoleId)
      && !parsed.zonesIds
    ) {
      return;
    }
    if ((parsed.roleId === enqueterRoleId || parsed.roleId === controllerRoleId) && !theSelectedZ) {
      setSelectZone(true);
      console.log('hhh');
      const zns = global.realms[0]
        .objects('zone')
        .filtered(`enqueterId == oid(${parsed._id}) && communeId == oid(${parsed.communeId})`)
        .filtered(`status == $0`, 'open');
      if (zns.length > 0) {
        setZones(zns);
        setSelectZone(true);
      }
      if (zns.length === 0) {
        const czns = global.realms[0]
          .objects('zone')
          .filtered(`enqueterId == oid(${parsed._id}) && communeId == oid(${parsed.communeId})`)
          .filtered(`status == $0`, 'closed');
        setZones(czns);
        setAllZonesClosed(true);
        return;
      }
    }
    if ((parsed.roleId === enqueterRoleId || parsed.roleId === controllerRoleId) && theSelectedZ) {
      const parsz = JSON.parse(theSelectedZ);
      const lct = global.realms[0].objects('localite').filtered(`_id == oid(${parsz.localiteId})`);
      setSelectedLocalite(lct[0]);
      const znsids = parsed.zonesIds.map(z => `_id = oid(${z})`).join(' OR ');
      const zone = global.realms[0].objects('zone').filtered(`_id == oid(${parsz._id})`);
      if (zone[0].status === 'open') {
        console.log('jjj');
        setSelectedZone(parsz);
        setSelectZone(false);
        setAllZonesClosed(false);
        return;
      }
      const zns = global.realms[0]
        .objects('zone')
        .filtered(`enqueterId == oid(${parsed._id})`)
        .filtered(`status == $0`, 'open');
      if (zns.length > 0) {
        setZones(zns);
        setSelectZone(true);
        setSelectedZone(zns[0]);
      }
      if (zns.length < 1) {
        const czns = global.realms[0]
          .objects('zone')
          .filtered(`enqueterId == oid(${parsed._id})`)
          .filtered(`status == $0`, 'closed');
        setZones(czns);
        setSelectZone(true);
        setSelectedZone(czns[0]);
        setAllZonesClosed(true);
      }
    }
    /* if (parsed.roleId === enqueterRoleId) {
      setLoading(true);
      quetionaiLocalite = await getQuetionaiLocalite(parsed);
      setCiblageEnded(parsed.zone.status === 'closed');
      if (quetionaiLocalite.length === 0) {
        setMakeLocaliteForm(true);
      }
      if (quetionaiLocalite.length > 0) {
        setQuestionaireLocalite(quetionaiLocalite[0]);
      }
      if (parsed?.zone?.type === 'libre') {
        console.log('eeee');
        setCanCible(true);
        setUser(parsed);
        setLoading(false);
      } else if (parsed?.zone?.type === 'point' && parsed?.zone?.status === 'open') {
        console.log('ffff');
        // navigator.geolocation;
        Geolocation.getCurrentPosition(
          ({ coords }) => {
            console.log(coords);

            const { latitude, longitude } = coords;
            const zonePoint = JSON.parse(parsed.zone.geometryString);
            const distance = getDistance([latitude, longitude], zonePoint);
            if (distance < params[0].maxDistencePoint) {
              setCanCible(true);
              setUser(parsed);
              setLoading(false);
            } else {
              setCanCible(false);
              setUser(parsed);
              setLoading(false);
            }
          },
          error => {
            console.log(error);
            setLoading(false);
            setCanCible(false);
            Toast.show({
              type: 'error',
              text1: t('location'),
              text2: t('error_location'),
              position: 'bottom',
              visibilityTime: 2000,
            });
          },
          { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 },
        );
      } else if (parsed?.zone?.type === 'polygon' && parsed?.zone?.status === 'open') {
        Geolocation.getCurrentPosition(
          ({ coords }) => {
            console.log('hhhh');
            const { latitude, longitude } = coords;
            console.log(coords);
            const zonePolygone = JSON.parse(parsed.zone.geometryString);
            const distance = distanceToGeoPolygon(
              [longitude, latitude],
              zonePolygone.coordinates[0],
            );
            console.log('distance: ', distance);
            if (distance < params[0].maxDistencePolygon) {
              setCanCible(true);
              setUser(parsed);
              setLoading(false);
            } else {
              setCanCible(false);
              setUser(parsed);
              setLoading(false);
            }
          },
          error => {
            console.log(error);
            setLoading(false);
            setCanCible(false);
            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: t('error_location'),
              position: 'bottom',
              visibilityTime: 2000,
            });
          },
          { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 },
        );
      } else {
        setLoading(false);
      }
    } */
  }, []);

  const handleSelectLocalite = loc => {
    console.log('loc', loc);
    setSelectedLocalite(loc);
    console.log('loc', JSON.stringify(allLocalites.find(l => l._id === loc)));
    AsyncStorage.setItem(
      'selectLocaliteSuper',
      JSON.stringify(allLocalites.find(l => l._id === loc)),
    );
  };

  const handleSelectZone = zone => {
    if (zone !== value) {
      Alert.alert(
        t('confirm'),
        t('confirm_select_zone'),
        [
          { text: t('cancel'), style: 'cancel' },
          {
            text: t('confirm'),
            onPress: () => {
              const zn = zones.filtered(`_id == oid(${zone})`)[0];
              const lct = global.realms[0]
                .objects('localite')
                .filtered(`_id == oid(${zn.localiteId})`)[0];
              AsyncStorage.setItem('selectedZone', JSON.stringify(zn));
              setSelectedZone(zn);
              setSelectedLocalite(lct);
              setSelectZone(false);
            },
          },
        ],
        { cancelable: false },
      );
    }
  };
  const handleSelectZone2 = zone => {
    if (zones.length < 1) return;
    if (zone !== '') {
      const zn = zones.filtered(`_id == oid(${zone})`)[0];
      AsyncStorage.setItem('selectedZone', JSON.stringify(zn));
      setSelectedZone(zn);
      setSelectZone(false);
    }
  };

  useEffect(() => {
    initialize();
  }, [initialize, componentId]);

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}
    >
      {(user?.roleId === enqueterRoleId || user?.roleId === controllerRoleId) && (
        <View>
          {selectedZone && (
            <View style={canCible ? styles.canCible : styles.cantCible}>
              {!canCible && <Text style={styles.whiteText}>{i18n.t('you_cant_begin_text')}</Text>}
            </View>
          )}
        </View>
      )}
      <View style={styles.image}>
        <Lottie source={require('../assets/lottie/simpleClipboardAhimation.json')} autoPlay loop />
      </View>

      <View style={styles.container}>
        {ciblageEnded ? (
          <Text style={{ color: 'red', width: '80%', textAlign: 'center' }}>
            {t('targeting_ended')}
          </Text>
        ) : selectedZone && !selectedZone.active && user?.roleId === enqueterRoleId ? (
          <Text style={{ color: 'red', width: '80%', textAlign: 'center' }}>
            {t('zone_not_active')}
          </Text>
        ) : null}
        {(user?.roleId === enqueterRoleId || user?.roleId === controllerRoleId)
          && (selectZone || allZonesClosed) && (
            <>
              <Text style={{ marginTop: 20 }}>{t('select_zone')}</Text>
              <View style={styles.container2}>
                <RNPickerSelect
                  placeholder={{}}
                  onValueChange={allZonesClosed ? handleSelectZone2 : handleSelectZone}
                  items={
                    allZonesClosed
                      ? [
                        ...zones.map(z => ({
                          label: language === 'fr' ? z.namefr : z.namear,
                          value: z._id,
                        })),
                      ]
                      : [
                        { label: '', value: '' },
                        ...zones.map(z => ({
                          label: language === 'fr' ? z.namefr : z.namear,
                          value: z._id,
                        })),
                      ]
                  }
                  style={pickerSelectStyles}
                />
              </View>
            </>
          )}
        {(user?.roleId === enqueterRoleId || user?.roleId === controllerRoleId)
          && selectedZone
          && selectedZone.active
          && selectedZone.status === 'open' && (
            <ThrottledNavigateButton
              componentId={componentId}
              destination={screenNames.Concessions}
              styles={
                ciblageEnded || !canCible || (selectedZone && !selectedZone.active)
                  ? styles.buttonDiabled
                  : styles.ciblageButton
              }
              tobBarBackgroundColor={Colors.primary}
              passProps={{ user, selectedLocalite }}
              tobBarTitleColor="#fff"
              tobBarTitleText={t('add_family')}
              disabled={ciblageEnded || !canCible || (selectedZone && !selectedZone.active)}
            >
              <Entypo style={{ margin: 5 }} name="new-message" size={20} color="#000" />
              <Text style={styles.normalText}>{t('add_family')}</Text>
            </ThrottledNavigateButton>
          )}

        {(user?.roleId === supervisorRoleId || user?.roleId === controllerRoleId) && (
          <ThrottledNavigateButton
            componentId={componentId}
            destination={screenNames.Localites}
            styles={styles.zonesButton}
            tobBarBackgroundColor={Colors.primary}
            tobBarTitleColor="#fff"
            tobBarTitleText={t('t_localites')}
            passProps={{ user }}
            rightButtons={[
              {
                component: {
                  name: 'ZonesInfoModal',
                  passProps: {
                    user,
                  },
                },
              },
            ]}
          >
            <Octicons style={{ margin: 5 }} name="location" size={20} color="#000" />
            <Text style={styles.normalText}>{t('t_localites')}</Text>
          </ThrottledNavigateButton>
        )}
        {(user?.roleId === supervisorRoleId || user?.roleId === controllerRoleId) && (
          <ThrottledNavigateButton
            componentId={componentId}
            destination={screenNames.Zones}
            styles={styles.zonesButton}
            tobBarBackgroundColor={Colors.primary}
            tobBarTitleColor="#fff"
            tobBarTitleText={t('affectation')}
            passProps={{ user }}
            rightButtons={[
              {
                component: {
                  name: 'ZonesInfoModal',
                  passProps: {
                    user,
                  },
                },
              },
            ]}
          >
            <Octicons style={{ margin: 5 }} name="location" size={20} color="#000" />
            <Text style={styles.normalText}>{t('affectation')}</Text>
          </ThrottledNavigateButton>
        )}
        {((user?.roleId === enqueterRoleId && selectedZone)
          || user?.roleId === controllerRoleId
          || user?.roleId === supervisorRoleId) && (
            <ThrottledNavigateButton
              componentId={componentId}
              destination={screenNames.HistoryCiblage}
              passProps={{ user, setCiblageEnded, setUser }}
              tobBarBackgroundColor={Colors.primary}
              tobBarTitleColor="#fff"
              tobBarTitleText={t('targeting_history')}
              styles={styles.historyButton}
              rightButtons={[
                {
                  component: {
                    name: 'GeneralInfoModal',
                    passProps: {
                      user,
                    },
                  },
                },
              ]}
            >
              <Octicons style={{ margin: 5 }} name="history" size={20} color="#000" />
              <Text style={styles.normalText}>{t('history')}</Text>
            </ThrottledNavigateButton>
          )}
        {user?.roleId === controllerRoleId && selectedZone && (
          <ThrottledNavigateButton
            disabled={!canCible || (selectedZone && !selectedZone.active)}
            styles={
              !canCible || (selectedZone && !selectedZone.active)
                ? styles.buttonDiabled
                : styles.zonesButton
            }
            componentId={componentId}
            destination={screenNames.QuestionaireLocalite}
            tobBarBackgroundColor={Colors.primary}
            tobBarTitleColor="#fff"
            tobBarTitleText={t('formulaire_localite')}
            passProps={{ user, questionaireLocalite, selectedLocalite }}
          >
            <Octicons style={{ margin: 5 }} name="location" size={20} color="#000" />
            <Text style={styles.normalText}>{t('formulaire_localite')}</Text>
          </ThrottledNavigateButton>
        )}

        {user?.roleId === supervisorRoleId && (
          <>
            <Text style={{ marginTop: 20 }}>{t('select_localite')}</Text>
            <View style={styles.container2}>
              <RNPickerSelect
                placeholder={{}}
                onValueChange={handleSelectLocalite}
                items={[
                  ...allLocalites.map(l => ({
                    label: language === 'fr' ? l.namefr_rs : l.namear,
                    value: l._id,
                  })),
                ]}
                style={pickerSelectStyles}
              />
            </View>
          </>
        )}

        {user?.roleId === supervisorRoleId && selectedLocalite ? (
          <ThrottledNavigateButton
            disabled={!canCible || (selectedZone && !selectedZone.active)}
            styles={
              !canCible || (selectedZone && !selectedZone.active)
                ? styles.buttonDiabled
                : styles.zonesButton
            }
            componentId={componentId}
            destination={screenNames.QuestionaireLocalite}
            tobBarBackgroundColor={Colors.primary}
            tobBarTitleColor="#fff"
            tobBarTitleText={t('formulaire_localite')}
            passProps={{ user, questionaireLocalite, selectedLocalite }}
          >
            <Octicons style={{ margin: 5 }} name="location" size={20} color="#000" />
            <Text style={styles.normalText}>{t('formulaire_localite')}</Text>
          </ThrottledNavigateButton>
        ) : null}
      </View>
      <LoadingModalTransparent loading={loading} message={t('getting_location')} />
    </LinearGradient>
  );
};

export default Ciblage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  ciblageButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    width: wp(90) > 300 ? 300 : wp(80),
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
    marginBottom: 20,
  },
  historyButton: {
    width: wp(90) > 300 ? 300 : wp(80),
    padding: 10,
    backgroundColor: Colors.yellow,
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
    marginBottom: 20,
  },
  normalText: {
    fontSize: 22,
    color: '#000',
  },
  buttonDiabled: {
    backgroundColor: '#ccc',
    padding: 10,
    width: wp(90) > 300 ? 300 : wp(80),
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
    marginBottom: 20,
  },
  zonesButton: {
    width: wp(90) > 300 ? 300 : wp(80),
    padding: 10,
    backgroundColor: '#29BB89',
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
    marginBottom: 20,
  },
  image: {
    height: wp(90) > 300 ? 300 : wp(75),
    width: wp(90) > 300 ? 300 : wp(75),
    alignSelf: 'center',
  },
  canCible: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
  },
  cantCible: {
    backgroundColor: Colors.error,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
    opacity: 0.5,
  },
  whiteText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: '700',
  },
  container2: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    width: 300,
    marginBottom: 20,
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
