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
import { fetchLocalites, fetchZones } from 'src/models/cartes';

const controllerRoleId = '62d5635aa5fac5ffb48ef7e4';
const supervisorRoleId = '62d5633aa5fac5ffb48ef7e3';

const ANIMATION_DURATION = 300;

const ZonesInfoModal = ({ user }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [rippleOverflow, setRippleOverflow] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState([]);
  const [localites, setLocalites] = useState([]);
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
    let zns = [];
    let lcts = [];
    if (user?.roleId === supervisorRoleId || user?.roleId === controllerRoleId) {
      zns = await fetchZones(user);
      lcts = await fetchLocalites(user);
    }
    setZones(zns);
    setLocalites(lcts);
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
        }}
      >
        <TouchableNativeFeedback
          onPress={() => {
            setRippleOverflow(!rippleOverflow);
            setOpen(true);
            fadeInAnimation();
          }}
          background={TouchableNativeFeedback.Ripple('rgba(00000002)', rippleOverflow)}
        >
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
        onRequestClose={() => { }}
      >
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
              <View style={[styles.container, { width: wp(80) }]}>
                <Text>
                  {t('moughataa')}:{' '}
                  {language === 'fr'
                    ? user?.moughataa.namefr_rs || user?.moughataa.namefr_ons
                    : user?.moughataa.namear}
                </Text>
                <Text>
                  {t('localites_n')}: {localites.length}
                </Text>
                <Text>
                  {t('zonee_n')}: {zones.length}
                </Text>
              </View>
            )}
          </View>
        </Animated.View>
      </Modal>
    </>
  );
};

export default ZonesInfoModal;

const styles = StyleSheet.create({
  activityIndicatorWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  infoContainer: {
    flex: 1,
    position: 'absolute',
    top: hp(30),
    backgroundColor: '#000',
    alignSelf: 'center',
    width: wp(80) > 400 ? 400 : wp(80),
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
