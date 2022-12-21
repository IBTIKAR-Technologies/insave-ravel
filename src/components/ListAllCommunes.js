import { View, Text, StyleSheet, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { Colors } from 'src/styles';
import { wp } from 'src/lib/utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlashList } from '@shopify/flash-list';
import { closeCommune, getQuota } from 'src/models/cartes';
import { selectedMenagesForSurvery } from 'src/utils/ciblage';
import screenNames from 'src/lib/navigation/screenNames';
import ConfirmPasswordModal from './ConfirmPasswordModal';
import ThrottledNavigateButton from './ThrottledNavigateButton';
import { SkeletonLoad } from './SkeletonLoad';

const Renderer = ({
  item,
  index,
  language,
  zones,
  concessions,
  menages,
  t,
  supervisor,
  setSelectedCommune,
  setShowModal,
  closedCommunes,
  componentId,
}) => {
  const communeZonesTotal = zones.filtered(`communeId == oid(${item._id})`);
  const communeZonesClosed = communeZonesTotal.filtered(`status == $0`, 'closed');
  const totalMenages = menages.filtered(`communeId == oid(${item._id})`);
  const totalConcessions = concessions.filtered(`communeId == oid(${item._id})`);
  return (
    <View style={styles.itemContainer}>
      <View style={styles.flexRow}>
        <Text>{t('name')}: </Text>
        <Text style={styles.textBold}>
          {language === 'fr' ? item.namefr_rs || item.namefr_ons : item.namear}
        </Text>
      </View>
      <View style={styles.flexRow}>
        <Text>{t('zones_finished')}: </Text>
        <Text
          style={
            styles.textBold
          }>{`${communeZonesClosed.length} / ${communeZonesTotal.length}`}</Text>
      </View>
      <View style={styles.flexRow}>
        <Text>{t('menages_added')}: </Text>
        <Text style={styles.textBold}>{totalMenages.length}</Text>
      </View>
      <View style={styles.flexRow}>
        <Text>{t('concessions_added')}: </Text>
        <Text style={styles.textBold}>{totalConcessions.length}</Text>
      </View>
      {!closedCommunes.find(c => c.communeId === String(item._id)) ? (
        <TouchableOpacity
          style={
            communeZonesClosed.length === communeZonesTotal.length && communeZonesTotal.length > 0
              ? styles.button
              : styles.buttonDis
          }
          disabled={
            communeZonesClosed.length !== communeZonesTotal.length || communeZonesTotal.length < 1
          }
          onPress={() => {
            setSelectedCommune(item);
            setShowModal(true);
          }}>
          <Text style={{}}>{t('close_commune')}</Text>
        </TouchableOpacity>
      ) : closedCommunes.find(c => c.communeId === String(item._id)) ? (
        <ThrottledNavigateButton
          componentId={componentId}
          destination={screenNames.SeeQuotasLocalites}
          styles={styles.quotasButton}
          tobBarBackgroundColor={Colors.primary}
          tobBarTitleColor="#fff"
          tobBarTitleText={t('see_quota')}
          passProps={{ commune: item }}>
          <Text style={styles.normalText}>{t('see_quota')}</Text>
        </ThrottledNavigateButton>
      ) : null}
    </View>
  );
};

const ListAllCommunes = ({
  language,
  zones,
  t,
  concessions,
  menages,
  communes,
  supervisor,
  componentId,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCommune, setSelectedCommune] = useState({});
  const [closedCommunes, setClosedCommunes] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const getUserData = useCallback(async () => {
    const userData = await AsyncStorage.getItem('userData');
    const parsed = JSON.parse(userData);
    const clscmns = global.realms[0]
      .objects('closedcommune')
      .filtered(`operationId == oid(${parsed.operationId}) && _partition == $0`, parsed._partition);
    setUser(parsed);
    setClosedCommunes(JSON.parse(JSON.stringify(clscmns)));
  }, [user]);

  useEffect(() => {
    setTimeout(() => {
      getUserData();
    }, 1);
  }, [getUserData]);

  const handleCloseCommune = async () => {
    const quotaCommune = await getQuota(user, selectedCommune);
    if (quotaCommune.length < 1) {
      setShowModal(false);
      setSelectedCommune({});
      ToastAndroid.show(t('no_quota'), ToastAndroid.LONG);
      return;
    }
    Alert.alert(
      t('confirm'),
      `${t('confirm_commune_close')} (${
        language === 'fr'
          ? selectedCommune.namefr_rs || selectedCommune.namefr_ons
          : selectedCommune.namear
      })`,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('confirm'),
          onPress: async () => {
            setShowModal(false);
            const did = await selectedMenagesForSurvery(
              user,
              selectedCommune._id,
              quotaCommune[0].quota,
              menages,
            );
            if (!did) {
              ToastAndroid.show(t('commune_n_closed'), ToastAndroid.LONG);
              return;
            }
            await closeCommune(user, selectedCommune._id);
            getUserData();
            ToastAndroid.show(t('commune_closed_success'), ToastAndroid.LONG);
          },
        },
      ],
      { cancelable: true },
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      {showModal && (
        <ConfirmPasswordModal
          callBack={handleCloseCommune}
          open={showModal}
          setOpen={setShowModal}
          user={user}
          title={`${t('confirm_password_to_close_commune')}\n"${t('commune')} (${
            language === 'fr'
              ? selectedCommune.namefr_rs || selectedCommune.namefr_ons
              : selectedCommune.namear
          })"`}
        />
      )}
      {loading ? (
        <SkeletonLoad width={wp(90) > 400 ? 400 : wp(90)} height={120} />
      ) : (
        <View style={styles.list}>
          <FlashList
            contentContainerStyle={styles.listContent}
            data={communes}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item._id}
            renderItem={props => (
              <Renderer
                {...props}
                concessions={concessions}
                language={language}
                menages={menages}
                setSelectedCommune={setSelectedCommune}
                setShowModal={setShowModal}
                supervisor={supervisor}
                t={t}
                zones={zones}
                closedCommunes={closedCommunes}
                componentId={componentId}
              />
            )}
            estimatedItemSize={176}
          />
        </View>
      )}
    </>
  );
};

export default ListAllCommunes;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.primaryGradientEnd,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    marginHorizontal: 20,
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
    width: '100%',
    margin: 10,
    height: '88%',
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
  button: {
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
    color: '#000',
    marginTop: 10,
  },
  quotasButton: {
    alignSelf: 'center',
    backgroundColor: Colors.green,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
    color: '#000',
    marginTop: 10,
  },
  buttonDis: {
    alignSelf: 'center',
    backgroundColor: Colors.gray,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
    color: '#000',
    marginTop: 10,
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
  smallRedText: {
    fontSize: 10,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: -20,
  },
  closed: {
    color: Colors.error,
    alignSelf: 'center',
  },
  listContent: {
    paddingVertical: 10,
  },
});
