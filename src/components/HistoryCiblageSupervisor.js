import { View, Text, StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  fetchConcessionsForSupervisor,
  fetchControlers,
  fetchEnquetersForSupervisor,
  fetchMenagesForSupervisor,
  fetchZones,
  fetchLocalites,
  fetchCommunes,
} from 'src/models/cartes';
import { wp } from 'src/lib/utilities';
import i18next from 'i18next';
import { Colors } from 'src/styles';
import RNPickerSelect from 'react-native-picker-select';
import ListAllMenages from './ListAllMenages';
import ListAllConcessions from './ListAllConcessions';
import ListAllEnqueters from './ListAllEnqueters';
import ListAllZones from './ListAllZones';
import ListAllCommunes from './ListAllCommunes';

const HistoryCiblageSupervisor = ({ user, setLoading, t, supervisor, componentId }) => {
  const [menages, setMnages] = useState([]);
  const [concessions, setConcessions] = useState([]);
  const [enqueters, setEnqueters] = useState([]);
  const [zones, setZones] = useState([]);
  const [controlers, setControlers] = useState([]);
  const [localites, setLocalites] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [value, setValue] = useState('menages');

  const { language } = i18next;

  useEffect(() => {
    setTimeout(() => {
      (async () => {
        let mngs = [];
        let conces = [];
        let enqs = [];
        let zns = [];
        let cntrlrs = [];
        let lclts = [];
        let cmns = [];
        mngs = await fetchMenagesForSupervisor(user);
        conces = await fetchConcessionsForSupervisor(user);
        enqs = await fetchEnquetersForSupervisor(user);
        zns = await fetchZones(user);
        cntrlrs = await fetchControlers(user);
        lclts = await fetchLocalites();
        cmns = await fetchCommunes();

        setMnages(mngs);
        setConcessions(conces);
        setEnqueters(enqs);
        setZones(zns);
        setControlers(cntrlrs);
        setLocalites(lclts);
        setCommunes(cmns);
        setLoading(false);
      })();
    }, 1);
  }, [setLoading, user]);

  const updateLanguage = useCallback(
    category => {
      if (category !== value) {
        setLoading(true);
        setTimeout(() => {
          setValue(category);
          setLoading(false);
        }, 400);
      }
    },
    [setLoading, value],
  );

  return (
    <>
      <View style={[styles.flexRow, { width: wp(80) > 400 ? 400 : wp(80) }]}>
        <Text style={{ fontSize: 18, alignSelf: 'center', flex: 1 }}>{t('category')}: </Text>
        <View style={styles.container2}>
          <RNPickerSelect
            placeholder={{}}
            onValueChange={updateLanguage}
            value={value}
            items={[
              { label: t('menages'), value: 'menages' },
              { label: t('concessions'), value: 'concessions' },
              { label: t('zones'), value: 'zones' },
              { label: t('enqueters'), value: 'enqueters' },
              { label: t('communes'), value: 'communes' },
            ]}
            style={pickerSelectStyles}
          />
        </View>
      </View>
      {value === 'menages' ? (
        <ListAllMenages menages={menages} componentId={componentId} />
      ) : value === 'concessions' ? (
        <ListAllConcessions
          menages={menages}
          concessions={concessions}
          zones={zones}
          t={t}
          language={language}
        />
      ) : value === 'enqueters' ? (
        <ListAllEnqueters
          enqueters={enqueters}
          menages={menages}
          zones={zones}
          language={language}
          t={t}
          concessions={concessions}
          controlers={controlers}
        />
      ) : value === 'zones' ? (
        <ListAllZones
          enqueters={enqueters}
          menages={menages}
          zones={zones}
          language={language}
          t={t}
          concessions={concessions}
          communes={communes}
          localites={localites}
        />
      ) : (
        value === 'communes' && (
          <ListAllCommunes
            menages={menages}
            zones={zones}
            language={language}
            t={t}
            concessions={concessions}
            communes={communes}
            supervisor={supervisor}
            componentId={componentId}
          />
        )
      )}
    </>
  );
};

export default HistoryCiblageSupervisor;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.primaryGradientEnd,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
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
    backgroundColor: Colors.primaryGradientEnd,
    borderRadius: 10,
    padding: 10,
    elevation: 3,
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
  container2: {
    backgroundColor: '#fff',
    borderRadius: 10,
    flex: 2,
    elevation: 3,
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
