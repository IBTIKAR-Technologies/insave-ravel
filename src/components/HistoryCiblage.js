import { View, Text, StyleSheet, Alert, TouchableOpacity, Platform, Linking } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { Colors } from 'src/styles';
import { wp, hp } from 'src/lib/utilities';
import {
  fetchConcessionsAdded,
  fetchMenages,
  closeZone,
  getTheSupervisor,
} from 'src/models/cartes';
import { useTranslation } from 'react-i18next';
import { Navigation } from 'react-native-navigation';
import Toast from 'react-native-toast-message';
import { FlashList } from '@shopify/flash-list';
import screenNames from 'src/lib/navigation/screenNames';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from 'i18next';
import HistoryCiblageSupervisor from './HistoryCiblageSupervisor';
import ConfirmPasswordModal from './ConfirmPasswordModal';
import { SkeletonLoad } from './SkeletonLoad';

const enqueterRoleId = '62d562fda5fac5ffb48ef7e2';
const controllerRoleId = '62d5635aa5fac5ffb48ef7e4';
const supervisorRoleId = '62d5633aa5fac5ffb48ef7e3';

const HistoryCiblage = function ({ user, componentId, setCiblageEnded }) {
  const { t } = useTranslation();
  const { language } = i18next;
  const [menages, setMnages] = useState([]);
  const [concessions, setConcessions] = useState([]);
  const [canCloseZone, setCanCloseZone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [supervisor, setSupervisor] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);

  const initialize = useCallback(async () => {
    const zn = await AsyncStorage.getItem('selectedZone');
    const nzn = JSON.parse(zn);
    setSelectedZone(nzn);
    let mngs = [];
    let conces = [];
    if (user?.roleId === enqueterRoleId || user?.roleId === controllerRoleId) {
      mngs = await fetchMenages(user);
      conces = await fetchConcessionsAdded(user);
      setCanCloseZone(conces.filter(con => con.status === 'open').length === 0);
      setTimeout(() => {
        setLoading(false);
      }, 900);
    }
    const spv = await getTheSupervisor();
    setMnages(
      mngs.map(men => {
        const concession = global.realms[0]
          .objects('concession')
          .filtered(`_id == oid(${men.concessionId})`)[0];
        return {
          menage: men,
          concession,
        };
      }),
    );
    setSupervisor(spv[0]);
    setTimeout(() => {
      setLoading(false);
    }, 900);
  }, [user]);

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

  const handleEditMenage = menage => {
    Navigation.push(componentId, {
      component: {
        name: screenNames.EditMenagePhoneNNI,
        options: {
          topBar: {
            title: {
              text: t('edit_menage'),
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
          menage,
        },
      },
    });
  };

  const confirmEditMenage = async menage => {
    const zone = await AsyncStorage.getItem('selectedZone');
    const parsed = JSON.parse(zone);
    if (parsed.status === 'closed') {
      Alert.alert(t('alert'), t('zone_close'), [{ text: t('ok'), style: 'cancel' }], {
        cancelable: false,
      });
      return;
    }
    Alert.alert(
      t('confirm'),
      t('confirm_edit_menage'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('ok'), onPress: () => handleEditMenage(menage) },
      ],
      { cancelable: false },
    );
  };

  const handleCloseZone = async () => {
    Alert.alert(
      t('confirm'),
      t('confirm_zone_close'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('confirm'),
          onPress: async () => {
            await closeZone(user);
            setShowModal(false);
            Navigation.popToRoot(componentId).then(() => {
              setCiblageEnded(true);
              AsyncStorage.removeItem('selectedZone');
              Toast.show({
                type: 'success',
                text1: t('zone_was_closed'),
                position: 'top',
                visibilityTime: 2000,
              });
            });
          },
        },
      ],
      { cancelable: true },
    );
  };

  return user?.roleId === supervisorRoleId ? (
    <HistoryCiblageSupervisor
      user={user}
      setLoading={setLoading}
      t={t}
      supervisor={supervisor}
      setSupervisor={setSupervisor}
      componentId={componentId}
    />
  ) : user?.roleId === enqueterRoleId || user?.roleId === controllerRoleId ? (
    <>
      {loading ? (
        <SkeletonLoad width={wp(90) > 400 ? 400 : wp(90)} height={120} />
      ) : menages.length > 0 ? (
        <View
          style={{
            width: wp(100),
            flex: 5,
          }}>
          <FlashList
            data={menages}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => String(item.menage._id)}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => confirmEditMenage(item.menage)}>
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
                </TouchableOpacity>
              </View>
            )}
            estimatedItemSize={137}
          />
        </View>
      ) : (
        <Text
          style={{
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
      {selectedZone && selectedZone.status === 'open' && !loading && (
        <>
          <TouchableOpacity
            disabled={!canCloseZone}
            style={canCloseZone ? styles.closeZoneButton : styles.closeZoneButtonDisbled}
            onPress={() => setShowModal(true)}>
            <Text style={{}}>{t('close_zone')}</Text>
          </TouchableOpacity>
          {concessions.length > 0 && !canCloseZone && (
            <Text style={styles.smallRedText}>{t('close_all_concessions')}</Text>
          )}
          {showModal && (
            <ConfirmPasswordModal
              callBack={handleCloseZone}
              open={showModal}
              setOpen={setShowModal}
              title={t('confirm_password_to_close_zone')}
              user={user}
            />
          )}
        </>
      )}
    </>
  ) : null;
};
export default HistoryCiblage;

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
    fontSize: 16,
  },
  normalText: {
    fontSize: 18,
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
    backgroundColor: Colors.gray,
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
