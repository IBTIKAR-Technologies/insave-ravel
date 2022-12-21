import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { fetchCommunes, fetchLocalites, fetchZones } from 'src/models/cartes';
import { Colors } from 'src/styles';
import RNPickerSelect from 'react-native-picker-select';
import i18next, { t } from 'i18next';
import { ObjectId } from 'bson';
import { wp } from 'src/lib/utilities';
import { FlashList } from '@shopify/flash-list';
import screenNames from 'src/lib/navigation/screenNames';
import { Navigation } from 'react-native-navigation';
import ThrottledNavigateButton from './ThrottledNavigateButton';

const supervisorRoleId = '62d5633aa5fac5ffb48ef7e3';
const controllerRoleId = '62d5635aa5fac5ffb48ef7e4';

const Localites = ({ user, componentId }) => {
  const [localites, setLocalites] = useState([]);
  const [zones, setZones] = useState([]);
  const [filters, setFilters] = useState([]);
  const [value, setValue] = useState('all');
  const [loading, setLoading] = useState(true);
  const { language } = i18next;

  const initialize = useCallback(async () => {
    setLoading(true);
    let lcts = await fetchLocalites();
    let zns = await fetchZones(user);
    if (user.roleId === controllerRoleId) {
      lcts = lcts.filtered(`communeId == oid(${user.communeId})`);
      zns = zns.filtered(`communeId == oid(${user.communeId})`);
    }
    const cmns = await fetchCommunes();
    const newComns = JSON.parse(JSON.stringify(cmns));
    setFilters([
      { label: t('all'), value: 'all' },
      ...newComns.map(c => ({
        label: language === 'fr' ? c.namefr_rs || c.namefr_ons : c.namear,
        value: c._id,
      })),
    ]);
    setZones(JSON.parse(JSON.stringify(zns)));
    if (value === 'all') {
      setLocalites(JSON.parse(JSON.stringify(lcts)));
    } else {
      setLocalites(JSON.parse(JSON.stringify(lcts)).filter(l => l.communeId === value));
    }
    setLoading(false);
  }, [language, user, value]);

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

  const updateFilter = useCallback(
    commune => {
      if (commune !== value) {
        setLoading(true);
        setValue(commune);
        setTimeout(async () => {
          if (commune === 'all') {
            const lcts = global.realms[0].objects('localite').sorted('namefr_rs', false);
            setLocalites(JSON.parse(JSON.stringify(lcts)));
          } else {
            const lcts = global.realms[0]
              .objects('localite')
              .filtered(`communeId == oid(${commune}) && active == true`)
              .sorted('namefr_rs', false);
            setLocalites(JSON.parse(JSON.stringify(lcts)));
          }
          setLoading(false);
        }, 400);
      }
    },
    [setLoading, value],
  );

  const handleEditLocalite = localite => {
    Navigation.push(componentId, {
      component: {
        name: screenNames.AddLocalite,
        options: {
          topBar: {
            title: {
              text: t('edit_localite'),
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
          user,
          communes: filters,
          t,
          language,
          selectedCommune: value,
          edit: true,
          localite,
        },
      },
    });
  };

  const handleDeleteLocalite = async localite => {
    const thezones = global.realms[0]
      .objects('zone')
      .filtered(`localiteId == oid(${localite._id})`);
    if (thezones.length > 0) return;
    global.realms[0].write(() => {
      global.realms[0].create(
        'localite',
        { _id: new ObjectId(localite._id), active: false, updatedAt: new Date(), syncedAt: null },
        'modified',
      );
    });
    initialize();
  };

  const confirmDeleteLocalite = localite => {
    Alert.alert(
      t('confirm'),
      t('confirm_delete_localite'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('confirm'), onPress: () => handleDeleteLocalite(localite) },
      ],
      { cancelable: true },
    );
  };

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      <View style={{ alignContent: 'flex-start', flex: 1 }}>
        {user.roleId === supervisorRoleId && (
          <>
            <Text style={{ fontSize: 18, alignSelf: 'center' }}>{t('commune')}: </Text>
            <View style={styles.container2}>
              <RNPickerSelect
                placeholder={{}}
                onValueChange={updateFilter}
                value={value}
                items={filters}
                style={pickerSelectStyles}
              />
            </View>
          </>
        )}
        {loading ? (
          <ActivityIndicator style={{ flex: 1 }} size={50} />
        ) : localites.length > 0 ? (
          <View style={{ alignContent: 'flex-start', flex: 1, width: wp(90) > 400 ? 400 : wp(90) }}>
            <FlashList
              contentContainerStyle={styles.listContent}
              data={localites}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item._id}
              estimatedItemSize={131}
              renderItem={({ item, index }) => {
                const localZones = zones.filter(d => d.localiteId === item._id);
                const localCommune = filters.find(f => f.value === item.communeId);
                return (
                  <TouchableOpacity
                    style={styles.itemContainer}
                    onLongPress={() => {
                      confirmDeleteLocalite(item);
                    }}
                    onPress={() => {
                      handleEditLocalite(item);
                    }}>
                    <View style={styles.flexRow}>
                      <Text style={styles.title}>{`${t('local_name_fr')}:`}</Text>
                      <Text style={styles.result}>{item.namefr_rs || item.namefr_ons}</Text>
                    </View>
                    <View style={styles.flexRow}>
                      <Text style={styles.title}>{`${t('local_name_ar')}:`}</Text>
                      <Text style={styles.result}>{item.namear}</Text>
                    </View>
                    <View style={styles.flexRow}>
                      <Text style={styles.title}>{`${t('commune')}:`}</Text>
                      <Text style={styles.result}>{localCommune?.label}</Text>
                    </View>
                    <View style={styles.flexRow}>
                      <Text style={styles.title}>{`${t('zonee_n')}:`}</Text>
                      <Text style={styles.result}>{localZones.length}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
            <ThrottledNavigateButton
              componentId={componentId}
              destination={screenNames.AddLocalite}
              passProps={{ user, communes: filters, t, language, selectedCommune: value }}
              tobBarBackgroundColor={Colors.primary}
              tobBarTitleColor="#fff"
              tobBarTitleText={t('add_local')}
              styles={styles.button}
              noBackButton>
              <Text style={styles.buttonText}>{t('add_local')}</Text>
            </ThrottledNavigateButton>
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ color: '#900', textAlign: 'center' }}>{t('no_localites')}</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

export default Localites;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container2: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    width: wp(90) > 400 ? 400 : wp(90),
  },
  itemContainer: {
    margin: 10,
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  list: {
    width: wp(90) > 400 ? 400 : wp(90),
    marginBottom: 10,
  },
  listContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    width: wp(90) > 400 ? 400 : wp(90),
  },
  listContent: {
    paddingVertical: 10,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  title: {
    flex: 1,
  },
  result: {
    flex: 1,
    fontWeight: '800',
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 5,
    elevation: 3,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
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
