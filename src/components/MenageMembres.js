import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Alert,
} from 'react-native';
import React, { useCallback, useState, useEffect } from 'react';
import { Colors } from 'src/styles';
import { hp, wp } from 'src/lib/utilities';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import screenNames from 'src/lib/navigation/screenNames';
import { Navigation } from 'react-native-navigation';
import ThrottledNavigateButton from './ThrottledNavigateButton';
import ConfirmPasswordModal from './ConfirmPasswordModal';

const Membres = ({ user, componentId, menage, menagesComponentId, enquete }) => {
  const [membres, setMembres] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [chefSelected, setChefSelected] = useState(false);

  const { t } = useTranslation();
  const getData = useCallback(() => {
    const mbr = global.realms[0].objects('menagemembre').filtered(`menageId == oid(${menage._id})`);
    setMembres(mbr);
    setChefSelected(!!mbr.filtered(`chefLink == $0`, 'chef_m')[0]);
  }, [menage]);

  const handleConfirmMenage = () => {
    global.realms[0].beginTransaction();
    global.realms[0].create(
      'menage',
      {
        _id: menage._id,
        validated: true,
        syncedAt: null,
        updatedAt: new Date(),
      },
      'modified',
    );
    global.realms[0].commitTransaction();
    setShowModal(false);
    Navigation.popTo(menagesComponentId);
  };

  useEffect(() => {
    const listener = {
      componentDidAppear: () => {
        console.log('RNN', 'componentDidAppear');
        getData();
      },
    };
    const unsubscribe = Navigation.events().registerComponentListener(listener, componentId);
    return () => {
      unsubscribe.remove();
    };
  }, [getData, componentId]);

  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        t('confirm'),
        t('confirm_return'),
        [
          { text: t('cancel'), style: 'cancel' },
          { text: t('confirm'), onPress: () => Navigation.pop(componentId) },
        ],
        { cancelable: false },
      );
      return true;
    });
    return () => {
      listener.remove();
    };
  }, [componentId, getData, menagesComponentId, t]);

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      {membres.length < 1 ? (
        <>
          <Text style={{ color: '#f00', fontStyle: 'italic', padding: 5 }}>{t('no_memebres')}</Text>
          <ThrottledNavigateButton
            componentId={componentId}
            destination={screenNames.AddMembre}
            passProps={{ user, menage, chefSelected }}
            tobBarBackgroundColor={Colors.primary}
            tobBarTitleColor="#fff"
            tobBarTitleText={t('add_membre')}
            noBackButton>
            <Text
              style={
                membres.length === parseInt(enquete.NbrMbrMen, 10)
                  ? styles.buttonTextDis
                  : styles.buttonText
              }>
              {t('add_membre')}
            </Text>
          </ThrottledNavigateButton>
        </>
      ) : (
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <Text style={{ fontSize: 18, alignSelf: 'center' }}>{`${t('memebres')} ${
              membres.length
            } / ${parseInt(enquete.NbrMbrMen, 10)}`}</Text>
            <TouchableOpacity
              style={{ alignSelf: 'flex-end', marginLeft: wp(20) }}
              onPress={() => setShowModal(true)}
              disabled={membres.length < parseInt(enquete.NbrMbrMen, 10)}>
              <Feather
                name="check-circle"
                size={30}
                color={
                  membres.length < parseInt(enquete.NbrMbrMen, 10) ? Colors.gray : Colors.primary
                }
              />
            </TouchableOpacity>
          </View>
          <FlatList
            data={membres}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={d => d._id}
            renderItem={({ item }) => (
              <View style={styles.concession}>
                <View style={{ flex: 4 }}>
                  <View style={styles.flexRow}>
                    <Text style={styles.smallText}>{t('name')}: </Text>
                    <Text style={styles.textBold}>{`${item.firstName} ${item.name}`}</Text>
                  </View>
                  <View style={styles.flexRow}>
                    <Text style={styles.smallText}>{t('born_in')}: </Text>
                    <Text style={styles.textBold}>{new Date(item.bornIn).getFullYear()}</Text>
                  </View>
                  <View style={styles.flexRow}>
                    <Text style={styles.smallText}>{t('chef_link')}: </Text>
                    <Text style={styles.textBold}>{t(item.chefLink)}</Text>
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
            destination={screenNames.AddMembre}
            passProps={{ user, menage, chefSelected }}
            tobBarBackgroundColor={Colors.primary}
            tobBarTitleColor="#fff"
            tobBarTitleText={t('add_membre')}
            styles={styles.secondButton}
            noBackButton
            disabled={membres.length === parseInt(enquete.NbrMbrMen, 10)}>
            <Text
              style={
                membres.length === parseInt(enquete.NbrMbrMen, 10)
                  ? styles.buttonTextDis
                  : styles.buttonText
              }>
              {t('add_membre')}
            </Text>
          </ThrottledNavigateButton>
          {showModal && (
            <ConfirmPasswordModal
              callBack={handleConfirmMenage}
              open={showModal}
              setOpen={setShowModal}
              title={t('confirm_password_to_confirm_menage')}
              user={user}
              membres={membres}
              menage={menage}
              handicaps={enquete.hasHandicaps === 'yes' || enquete.hasHandicaps === 'yes_many'}
              cronic={enquete.hasCronicIllness === 'yes'}
            />
          )}
        </>
      )}
    </LinearGradient>
  );
};

export default Membres;

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
  buttonTextDis: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    backgroundColor: Colors.gray,
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 5,
    elevation: 3,
  },
});
