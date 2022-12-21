import {
  View,
  TouchableNativeFeedback,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Animated,
} from 'react-native';
import React, { useCallback, useState, useEffect } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { Colors } from 'src/styles';
import { hp, wp } from 'src/lib/utilities';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  fetchConcessionsAdded,
  fetchConcessionsForSupervisor,
  fetchMenages,
  fetchMenagesForSupervisor,
  fetchZones,
} from 'src/models/cartes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const enqueterRoleId = '62d562fda5fac5ffb48ef7e2';
const controllerRoleId = '62d5635aa5fac5ffb48ef7e4';
const supervisorRoleId = '62d5633aa5fac5ffb48ef7e3';

const ANIMATION_DURATION = 300;

const GeneralInfoModal = ({ user }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [rippleOverflow, setRippleOverflow] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menages, setMenages] = useState([]);
  const [contMenages, setContMenages] = useState([]);
  const [concessions, setConcessions] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const { language } = i18next;
  const { t } = useTranslation();

  const fadeInAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  };

  const fadeOutAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  };

  const getAllData = useCallback(async () => {
    const zn = await AsyncStorage.getItem('selectedZone');
    const nzn = JSON.parse(zn);
    setSelectedZone(nzn);
    let mgs = [];
    let cocs = [];
    let zns = [];
    if (user.roleId === controllerRoleId) {
      const cmngs = global.realms[0].objects('menage').filtered(`enqueterId == oid(${user._id})`);
      setContMenages(cmngs);
    }
    if (user.roleId === supervisorRoleId || user.roleId === controllerRoleId) {
      mgs = await fetchMenagesForSupervisor(user);
      cocs = await fetchConcessionsForSupervisor(user);
      zns = await fetchZones(user);
    } else if (user.roleId === enqueterRoleId) {
      mgs = await fetchMenages(user);
      cocs = await fetchConcessionsAdded(user);
    }
    setMenages(mgs);
    setConcessions(cocs);
    setZones(zns);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    getAllData();
  }, [getAllData]);

  return (
    <>
      <View
        style={{
          alignItems: 'center',
          borderRadius: 50,
          overflow: 'hidden',
        }}>
        <TouchableNativeFeedback
          onPress={() => {
            setRippleOverflow(!rippleOverflow);
            setOpen(true);
            fadeInAnimation();
          }}
          background={TouchableNativeFeedback.Ripple('rgba(00000007)', rippleOverflow)}>
          <View style={{ flex: 1, padding: 10 }}>
            <Feather name="info" size={20} color="white" />
          </View>
        </TouchableNativeFeedback>
      </View>
      <Modal
        animationType="none"
        transparent
        visible={open}
        style={{ zIndex: 1100 }}
        onRequestClose={() => {}}>
        <Animated.View style={[styles.closeButton1, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={{ width: '100%', height: '100%' }}
            onPress={() => {
              setTimeout(() => {
                setOpen(false);
              }, ANIMATION_DURATION);
              fadeOutAnimation();
            }}
          />
        </Animated.View>
        <Animated.View style={[styles.infoContainer, { opacity: fadeAnim }]}>
          <Text style={styles.title}>{t('targeting_history_title')}</Text>

          <View style={{ padding: 20 }}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <>
                {user.roleId === enqueterRoleId && (
                  <View style={[styles.container, { width: wp(80) }]}>
                    <Text>
                      {t('commune')}:{' '}
                      {language === 'fr'
                        ? user.commune.namefr_rs || user.commune.namefr_ons
                        : user.commune.namear}
                    </Text>
                    <Text>
                      {t('zone')}:{' '}
                      {language === 'fr'
                        ? selectedZone && selectedZone.namefr
                        : selectedZone && selectedZone.namear}
                    </Text>
                    <View style={styles.flexRow}>
                      <Text>{`${t('total_targeted')}: ${menages.length}`}</Text>
                      <Text>{`${t('total_concessions')}: ${concessions.length}`}</Text>
                    </View>
                  </View>
                )}
                {(user.roleId === controllerRoleId || user.roleId === supervisorRoleId) && (
                  <View style={[styles.container, { width: wp(80) }]}>
                    <Text>
                      {t('moughataa')}:{' '}
                      {language === 'fr'
                        ? user.moughataa.namefr_rs || user.moughataa.namefr_ons
                        : user.moughataa.namear}
                    </Text>
                    <View style={styles.flexRow}>
                      <Text>{`${t('total_targeted')}: ${menages.length}`}</Text>
                      {user.roleId === controllerRoleId && (
                        <Text>{`${t('your_total')}: ${contMenages.length}`}</Text>
                      )}
                      <Text>{`${t('total_concessions')}: ${concessions.length}`}</Text>
                    </View>
                    <View style={styles.flexRow}>
                      <Text>{`${t('zone_closed')}: ${
                        zones.filter(z => z.status === 'closed').length
                      } / ${zones.length}`}</Text>
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        </Animated.View>
      </Modal>
    </>
  );
};

export default GeneralInfoModal;

const styles = StyleSheet.create({
  activityIndicatorWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  infoContainer: {
    flex: 1,
    position: 'absolute',
    top: hp(35),
    backgroundColor: '#000',
    width: wp(80) > 400 ? 400 : wp(80),
    alignSelf: 'center',
    borderRadius: 10,
    zIndex: 2000,
  },
  closeButton1: {
    flex: 1,
    backgroundColor: '#4449',
    width: wp(100),
    height: hp(150),
    position: 'absolute',
    top: 0,
    overflow: 'visible',
  },
  asking: {},
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: Colors.primary,
    color: '#000',
    paddingHorizontal: 20,
    paddingVertical: 3,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: wp(80) > 400 ? 400 : wp(80),
  },
});
