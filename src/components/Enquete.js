import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { wp } from 'src/lib/utilities';
import { Colors } from 'src/styles';
import Lottie from 'lottie-react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import screenNames from 'src/lib/navigation/screenNames';
import RNPickerSelect from 'react-native-picker-select';
import i18next from 'i18next';
import { Navigation } from 'react-native-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThrottledNavigateButton from './ThrottledNavigateButton';

const enqueterRoleId = '62d562fda5fac5ffb48ef7e2';
const controllerRoleId = '62d5635aa5fac5ffb48ef7e4';

const Enquete = ({ user, componentId }) => {
  const [questionaire, setQuestionaire] = useState({});
  const [localites, setLocalites] = useState([]);
  const [zones, setZones] = useState([]);
  const [menages, setMenages] = useState([]);
  const [selectedLocalite, setSelectedLocalite] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const { language, t } = i18next;

  const getMenages = useCallback(async () => {
    if (selectedLocalite) return;
    if ((user.roleId === enqueterRoleId || user.roleId === controllerRoleId) && user.zonesIds) {
      // to fetch the zone by its id
      const zns = global.realms[0]
        .objects('zone')
        .filtered(
          `enqueterId == oid(${user._id}) && communeId == oid(${user.communeId}) && operationId == oid(${user.operationId})`,
        );
      // to fetch localites forms by zone.localiteId
      const nZns = zns.map(z => `localiteId = oid(${z.localiteId})`).join(' OR ');
      const flcts = global.realms[0].objects('formulairelocalite').filtered(nZns);
      // to fetch localites by form.localiteId
      const nflcts = flcts.map(l => `_id = oid(${l.localiteId})`).join(' OR ');
      const locts = global.realms[0].objects('localite').filtered(nflcts);
      let selectedLoct = await AsyncStorage.getItem('selectedLocaliteEnq');
      console.log('selectedLoct', selectedLoct);
      selectedLoct = JSON.parse(selectedLoct);
      setLocalites(locts);
      if (selectedLoct) {
        setSelectedLocalite(selectedLoct);
        setZones(zns.filtered(`localiteId == oid(${selectedLoct._id})`));
        const questio = flcts.filtered(`localiteId == oid(${selectedLoct._id})`)[0];
        setQuestionaire(questio);
        setMenages(
          global.realms[0]
            .objects('menage')
            .filtered(
              `localiteId == oid(${selectedLoct._id}) && operationId == oid(${questio.operationId}) && Eligible == true`,
            ),
        );
        return;
      }
      if (locts.length > 0) {
        setSelectedLocalite(locts[0]);
        AsyncStorage.setItem('selectedLocaliteEnq', JSON.stringify(locts[0]));
        setZones(zns.filtered(`localiteId == oid(${locts[0]._id})`));
        const questio = flcts.filtered(`localiteId == oid(${locts[0]._id})`)[0];
        setQuestionaire(questio);
        console.log('questio', questio.operationId);
        setMenages(
          global.realms[0]
            .objects('menage')
            .filtered(
              `localiteId == oid(${locts[0]._id}) && operationId == oid(${questio.operationId}) && Eligible == true`,
            ),
        );
      }
    }
  }, [selectedLocalite, user]);

  useEffect(() => {
    const listener = {
      componentDidAppear: () => {
        console.log('RNN', 'componentDidAppear');
        getMenages();
      },
    };
    const unsubscribe = Navigation.events().registerComponentListener(listener, componentId);
    return () => {
      unsubscribe.remove();
    };
  }, [componentId, getMenages]);

  const handleSelectLocalite = async loc => {
    if (loc) {
      console.log('here', loc);
      console.log(
        'localites',
        localites.find(l => String(l._id) === String(loc)),
      );
      AsyncStorage.setItem(
        'selectedLocaliteEnq',
        JSON.stringify(localites.find(l => String(l._id) === String(loc))),
      );
      const locFor = global.realms[0]
        .objects('formulairelocalite')
        .filtered(`localiteId == oid(${loc}) && operationId == oid(${user.operationId})`);
      setSelectedLocalite(localites.find(l => String(l._id) === String(loc)));
      setQuestionaire(locFor[0]);
      const mngs = global.realms[0]
        .objects('menage')
        .filtered(
          `localiteId == oid(${loc}) && operationId == oid(${user.operationId}) && Eligible == true`,
        );
      const zns = global.realms[0]
        .objects('zone')
        .filtered(`localiteId == oid(${loc}) && operationId == oid(${user.operationId})`)
        .filtered(`enqueterId == oid(${user._id})`);
      AsyncStorage.setItem('selectedZonEnq', JSON.stringify(zns[0]));
      setMenages(mngs);
      setZones(zns);
      setSelectedZone(zns[0]);
    }
  };
  const handleSelectZone = async zon => {
    if (zon) {
      console.log('here', zon);
      console.log(
        'localites',
        zones.find(z => String(z._id) === String(zon)),
      );
      AsyncStorage.setItem(
        'selectedZonEnq',
        JSON.stringify(zones.find(z => String(z._id) === String(zon))),
      );
      const zn = global.realms[0].objects('zone').filtered(`_id == oid(${zon})`)[0];
      const mngs = global.realms[0]
        .objects('menage')
        .filtered(
          `zoneId == oid(${zon}) && operationId == oid(${zn.operationId}) && Eligible == true`,
        );
      setSelectedZone(zn);
      setMenages(mngs);
    }
  };

  console.log('questionaire', questionaire);
  console.log('selectedZone', selectedZone);
  console.log('selectedLocalite', selectedLocalite);

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      <View style={styles.container}>
        <View style={styles.image}>
          <Lottie source={require('../assets/lottie/clipboardAnimation.json')} autoPlay loop />
        </View>
        {(user.roleId === enqueterRoleId || user.roleId === controllerRoleId) &&
          localites.length > 0 && (
            <>
              <Text style={{ marginTop: 20 }}>{t('select_localite')}</Text>
              <View style={styles.container2}>
                <RNPickerSelect
                  placeholder={{}}
                  onValueChange={handleSelectLocalite}
                  items={localites.map(z => ({
                    label: language === 'fr' ? z.namefr_rs : z.namear,
                    value: String(z._id),
                  }))}
                  style={pickerSelectStyles}
                  value={String(selectedLocalite?._id)}
                />
              </View>
            </>
          )}
        {(user.roleId === enqueterRoleId || user.roleId === controllerRoleId) &&
          selectedLocalite &&
          selectedLocalite?.type === 'Urbain' && (
            <>
              <Text style={{ marginTop: 5 }}>{t('select_zone')}</Text>
              <View style={styles.container2}>
                <RNPickerSelect
                  placeholder={{}}
                  onValueChange={handleSelectZone}
                  items={zones.map(z => ({
                    label: language === 'fr' ? z.namefr : z.namear,
                    value: String(z._id),
                  }))}
                  style={pickerSelectStyles}
                  value={String(selectedZone?._id)}
                />
              </View>
            </>
          )}
        {(user.roleId === enqueterRoleId || user.roleId === controllerRoleId) &&
        menages.length > 0 &&
        selectedLocalite &&
        selectedLocalite.type === 'Rural' &&
        !questionaire.listConfirmed ? (
          <ThrottledNavigateButton
            componentId={componentId}
            destination={screenNames.FinalSelection}
            passProps={{
              user,
              localite: questionaire,
              localiteListComponentId: componentId,
            }}
            tobBarBackgroundColor={Colors.primary}
            tobBarTitleColor="#fff"
            tobBarTitleText={t('validate_List')}
            styles={styles.validateButton}>
            <Octicons style={{ margin: 5 }} name="codescan-checkmark" size={20} color={'#000'} />
            <Text style={styles.normalText}>{t('validate_List')}</Text>
          </ThrottledNavigateButton>
        ) : null}
        {(user.roleId === enqueterRoleId || user.roleId === controllerRoleId) &&
          menages.length === 0 && <Text style={styles.errorText}>{t('no_list')}</Text>}
        {(selectedLocalite && selectedLocalite.type === 'Rural' && questionaire.listConfirmed) ||
        (selectedLocalite &&
          selectedLocalite.type === 'Urbain' &&
          selectedZone &&
          questionaire.listConfirmed) ? (
          <ThrottledNavigateButton
            componentId={componentId}
            destination={screenNames.MenagesSelected}
            passProps={{ user, selectedLocalite, selectedZone }}
            tobBarBackgroundColor={Colors.primary}
            tobBarTitleColor="#fff"
            tobBarTitleText={t('menages')}
            styles={styles.menagesButton}>
            <Fontisto style={{ margin: 5 }} name="persons" size={20} color={'#000'} />
            <Text style={styles.normalText}>{t('menage_to_enquete')}</Text>
          </ThrottledNavigateButton>
        ) : null}
        <ThrottledNavigateButton
          componentId={componentId}
          destination={screenNames.HistoryEnquete}
          passProps={{ user, selectedLocalite, selectedZone }}
          tobBarBackgroundColor={Colors.primary}
          tobBarTitleColor="#fff"
          tobBarTitleText={t('menages')}
          styles={styles.historyButton}>
          <Fontisto style={{ margin: 5 }} name="history" size={20} color={'#000'} />
          <Text style={styles.normalText}>{t('history')}</Text>
        </ThrottledNavigateButton>
      </View>
    </LinearGradient>
  );
};

export default Enquete;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    height: wp(90) > 300 ? 300 : wp(75),
    width: wp(90) > 300 ? 300 : wp(75),
    alignSelf: 'center',
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
  validateButton: {
    width: wp(90) > 300 ? 300 : wp(80),
    padding: 10,
    backgroundColor: Colors.blue,
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
    marginBottom: 20,
  },
  menagesButton: {
    width: wp(90) > 300 ? 300 : wp(80),
    padding: 10,
    backgroundColor: Colors.primary,
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
  errorText: {
    fontSize: 14,
    color: Colors.error,
    fontStyle: 'italic',
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
