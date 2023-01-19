import {
  View, Text, FlatList, StyleSheet,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Navigation } from 'react-native-navigation';
import LinearGradient from 'react-native-linear-gradient';
import screenNames from 'src/lib/navigation/screenNames';
import Toast from 'react-native-toast-message';
import RNPickerSelect from 'react-native-picker-select';
import i18next from 'i18next';
import { Colors } from 'src/styles';
import { hp, wp } from 'src/lib/utilities';
import { useTranslation } from 'react-i18next';
import ThrottledNavigateButton from './ThrottledNavigateButton';

const LocaliteSages = ({ componentId, localite, user }) => {
  console.log('user', user);
  console.log('localite', localite);
  const [sages, setSages] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState('');
  const { t } = useTranslation();
  const { language } = i18next;

  const initialize = useCallback(async () => {
    if (localite && localite.ID4 === 'Rural') {
      const sg = global.realms[0]
        .objects('sage')
        .filtered(
          `localiteId == oid(${localite.localiteId}) && operationId == oid(${user?.operationId})`,
        );
      setSages(sg);
    }
    if (localite && localite.ID4 === 'Urbain') {
      const zn = global.realms[0]
        .objects('zone')
        .filtered(
          `localiteId == oid(${localite.localiteId}) && operationId == oid(${user?.operationId})`,
        );
      const sg = global.realms[0].objects('sage').filtered(`zoneId == oid(${zn[0]._id})`);
      console.log(zn[0]._id);
      console.log('sn', sg);
      setSages(sg);
      setZones(zn);
      setSelectedZone(String(zn[0]._id));
    }
    if (!localite?.ID4) {
      Navigation.pop(componentId).then(() => {
        Toast.show({
          type: 'error',
          text1: t('no_loc_type'),
          position: 'bottom',
          visibilityTime: 2000,
        });
      });
    }
  }, [localite, componentId, t, user]);
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

  console.log('selcted', selectedZone);

  const updateZone = val => {
    setSelectedZone(val);
    const sg = global.realms[0].objects('sage').filtered(`zoneId == oid(${val})`);
    setSages(sg);
  };
  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}
    >
      {zones.length > 0 && (
        <View style={[styles.flexRow, { width: wp(80) > 400 ? 400 : wp(80) }]}>
          <Text style={{ fontSize: 18, alignSelf: 'center' }}>{t('zone')}: </Text>
          <View style={styles.container2}>
            <RNPickerSelect
              placeholder={{}}
              onValueChange={updateZone}
              value={selectedZone}
              items={zones.map(z => ({ label: `${z[`name${language}`]}`, value: String(z._id) }))}
              style={pickerSelectStyles}
            />
          </View>
        </View>
      )}
      {sages.length < 1 ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ color: '#f00', padding: 5, textAlign: 'center' }}>{t('no_memebres')}</Text>
          <ThrottledNavigateButton
            componentId={componentId}
            destination={screenNames.AddSage}
            tobBarBackgroundColor={Colors.primary}
            tobBarTitleColor="#fff"
            tobBarTitleText={t('add_membre')}
            passProps={{ zone: selectedZone, localite }}
            noBackButton
          >
            <Text style={styles.buttonText}>{t('add_membre')}</Text>
          </ThrottledNavigateButton>
        </View>
      ) : (
        <>
          <FlatList
            data={sages}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={d => String(d._id)}
            renderItem={({ item }) => (
              <View style={styles.concession}>
                <View style={{ flex: 4 }}>
                  <View style={styles.flexRow}>
                    <Text style={styles.smallText}>{t('name')}: </Text>
                    <Text style={styles.textBold}>{`${item.prenom} ${item.nom}`}</Text>
                  </View>
                  <View style={styles.flexRow}>
                    <Text style={styles.smallText}>{t('nni')}: </Text>
                    <Text style={styles.textBold}>{item.NNI}</Text>
                  </View>
                  <View style={styles.flexRow}>
                    <Text style={styles.smallText}>{t('tel')}: </Text>
                    <Text style={styles.textBold}>{t(item.Tel)}</Text>
                  </View>
                  <View style={styles.flexRow}>
                    <Text style={styles.smallText}>{t('sex')}: </Text>
                    <Text style={styles.textBold}>{t(item.sex)}</Text>
                  </View>
                </View>
              </View>
            )}
          />
          <ThrottledNavigateButton
            componentId={componentId}
            destination={screenNames.AddSage}
            tobBarBackgroundColor={Colors.primary}
            tobBarTitleColor="#fff"
            tobBarTitleText={t('add_membre')}
            styles={styles.secondButton}
            passProps={{ zone: selectedZone, localite }}
            noBackButton
          >
            <Text style={styles.buttonText}>{t('add_membre')}</Text>
          </ThrottledNavigateButton>
        </>
      )}
    </LinearGradient>
  );
};

export default LocaliteSages;

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
    padding: 15,
    marginVertical: 10,
    elevation: 10,
  },
  list: {
    flex: 1,
    width: wp(90) > 400 ? 400 : wp(90),
    minHeight: hp(65),
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
  secondButton: {
    marginBottom: 10,
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
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 5,
    elevation: 3,
  },
  container2: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    flex: 2,
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
