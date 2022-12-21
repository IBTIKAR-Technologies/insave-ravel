import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { ObjectId } from 'bson';
import React, { useCallback, useEffect, useState } from 'react';
import { Colors } from 'src/styles';
import { wp } from 'src/lib/utilities';
import { useTranslation } from 'react-i18next';
import { Navigation } from 'react-native-navigation';
import screenNames from 'src/lib/navigation/screenNames';
import {
  deleteConcession,
  closeConcession,
  fetchOpenedConcessions,
  fetchMenagesOpenedConcession,
} from 'src/models/cartes';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import ThrottledNavigateButton from './ThrottledNavigateButton';
import { SkeletonLoad } from './SkeletonLoad';

const Concessions = function ({ componentId, user, selectedLocalite }) {
  const { t } = useTranslation();
  const [concessions, setConcessions] = useState([]);
  const [menages, setMenages] = useState([]);
  const [loading, setLoading] = useState(true);

  if (selectedLocalite.type !== 'Urbain' && selectedLocalite.type !== 'Rural') {
    Navigation.pop(componentId).then(() => {
      Toast.show({
        type: 'error',
        text1: t('nloc_type'),
        position: 'bottom',
        visibilityTime: 2000,
      });
    });
  }

  const initialize = useCallback(async () => {
    const all = await fetchOpenedConcessions(user);
    setConcessions(
      all.map(con => {
        const mngs = global.realms[0].objects('menage').filtered(`concessionId == oid(${con._id})`);
        return {
          concession: con,
          menages: mngs.length,
        };
      }),
    );
    setLoading(false);
  }, [user]);

  useEffect(() => {
    initialize();
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
  }, [initialize, componentId]);

  const handleDeleteConcession = async item => {
    Alert.alert(
      t('confirm'),
      `${t('concession_delete_message')}\n${item.Numero}, ${item.Adresse}`,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('confirm'),
          onPress: () => {
            setLoading(true);
            deleteConcession(item).then(() => initialize());
          },
        },
      ],
      { cancelable: true },
    );
  };
  const handleCloseAllConcessions = () => {
    const concessionsToDl = JSON.parse(JSON.stringify(concessions)).filter(c => {
      const hasMenages = menages.filter(
        menage => menage.concessionId.toString() === c._id.toString(),
      );
      const canClose = hasMenages.length + c.NbrAbsents + c.NbrRefus === c.NbrMenages;
      return canClose && c.NbrAbsents < 1;
    });
    console.log('con length', concessionsToDl.length);
    if (concessionsToDl.length < 1) return;
    concessionsToDl.forEach(c => {
      global.realms[0].write(() => {
        global.realms[0].create(
          'concession',
          {
            _id: new ObjectId(c._id),
            status: 'closed',
          },
          'modified',
        );
      });
    });
    setLoading(true);
    initialize();
  };

  const handleOpenLocation = concession => {
    console.log('lat', concession.Latitude);
    console.log('long', concession.Longitude);
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${concession.Latitude},${concession.Longitude}`;
    const label = concession.Adresse;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };

  const handleCloseConcession = item => {
    Alert.alert(
      t('confirm'),
      `${t('concession_close_message')}\n${item.Numero}, ${item.Adresse}`,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('confirm'),
          onPress: () => {
            setLoading(true);
            closeConcession(item).then(() => initialize());
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      {loading ? (
        <SkeletonLoad height={190} width={wp(90) > 400 ? 400 : wp(90)} />
      ) : concessions.length === 0 ? (
        <View style={styles.noConcessions}>
          <Text style={styles.noConcessionsText}>{t('no_opened_concessions')}</Text>
          <ThrottledNavigateButton
            componentId={componentId}
            destination={screenNames.AddConcession}
            tobBarTitleText={t('add_concession')}
            tobBarTitleColor={'#000'}
            tobBarBackgroundColor={Colors.primary}
            noBackButton
            passProps={{ user }}
            styles={styles.addConsBut}>
            <Text style={styles.buttonText}>{t('add_concession')}</Text>
          </ThrottledNavigateButton>
        </View>
      ) : (
        <>
          <Text style={[styles.bigCenteredText, { marginTop: 10 }]}>
            {t('concessions_list_open')}
          </Text>
          <TouchableOpacity
            onPress={handleCloseAllConcessions}
            style={{
              paddingVertical: 5,
              paddingHorizontal: 15,
              backgroundColor: Colors.primary,
              borderRadius: 20,
            }}>
            <Text style={styles.whiteText}>{t('clo_all_con')}</Text>
          </TouchableOpacity>
          <FlatList
            data={concessions}
            keyExtractor={item => item.concession._id}
            contentContainerStyle={styles.concessionsList}
            style={styles.list}
            renderItem={({ item }) => {
              const hasMenages = menages.filter(
                menage => menage.concessionId.toString() === item._id.toString(),
              );
              const canAddMenage =
                item.menages + item.concession.NbrAbsents + item.concession.NbrRefus <
                item.concession.NbrMenages;
              const canClose =
                item.menages + item.concession.NbrAbsents + item.concession.NbrRefus ===
                item.concession.NbrMenages;
              console.log('canClose', canClose);
              return (
                <View style={styles.concession}>
                  <TouchableOpacity
                    style={styles.position}
                    onPress={() => handleOpenLocation(item.concession)}>
                    <EvilIcons name="location" size={20} color={Colors.primary} />
                  </TouchableOpacity>
                  <View>
                    <View style={styles.textWraper}>
                      <Text style={styles.concessionTitle}>{t('concession_num')}: </Text>
                      <Text style={styles.concessionText}>{item.concession.Numero}</Text>
                    </View>
                    <View style={styles.textWraper}>
                      <Text style={styles.concessionTitle}>{t('created_at')}: </Text>
                      <Text style={styles.concessionText}>
                        {new Date(item.concession.createdAt).toLocaleDateString('fr')}
                      </Text>
                    </View>
                    <View style={styles.flexRow}>
                      <View style={styles.textWraper}>
                        <Text style={styles.concessionTitle}>{t('menages_count')} : </Text>
                        <Text style={styles.concessionText}>{item.concession.NbrMenages}</Text>
                      </View>
                      <View style={styles.textWraper}>
                        <Text style={styles.concessionTitle}>{t('menages_added')} : </Text>
                        <Text style={styles.concessionText}>{item.menages}</Text>
                      </View>
                    </View>
                    <View style={styles.flexRow}>
                      <View style={styles.textWraper}>
                        <Text style={styles.concessionTitle}>{t('refus')} : </Text>
                        <Text style={styles.concessionText}>{item.concession.NbrRefus}</Text>
                      </View>
                      <View style={[styles.textWraper]}>
                        <Text style={styles.concessionTitle}>{t('absent')} : </Text>
                        <Text style={styles.concessionText}>{item.concession.NbrAbsents}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.buttonsWraper}>
                    <ThrottledNavigateButton
                      componentId={componentId}
                      destination={screenNames.AddMenage}
                      tobBarTitleText={t('add_menage')}
                      tobBarTitleColor={'#000'}
                      tobBarBackgroundColor={Colors.primary}
                      noBackButton
                      passProps={{
                        user,
                        concession: item.concession,
                      }}
                      disabled={!canAddMenage}>
                      <Text
                        style={
                          canAddMenage
                            ? [styles.addMenageB, styles.whiteText]
                            : [styles.buttonDisabled, styles.whiteText]
                        }>
                        {t('add_family')}
                      </Text>
                    </ThrottledNavigateButton>
                    <ThrottledNavigateButton
                      componentId={componentId}
                      destination={screenNames.AddConcession}
                      tobBarTitleText={t('edit_concession')}
                      tobBarTitleColor={'#000'}
                      tobBarBackgroundColor={Colors.primary}
                      noBackButton
                      passProps={{
                        user,
                        concession: item.concession,
                        edit: true,
                        menagesAdded: item.menages,
                      }}
                      confirm
                      confirmMessages={{
                        first: t('confirm'),
                        second: `${t('concession_edit_message')}\n${item.Numero}, ${item.Adresse}`,
                      }}>
                      <Text style={[styles.editConcessionB, styles.whiteText]}>
                        {t('edit_concession')}
                      </Text>
                    </ThrottledNavigateButton>
                    <TouchableOpacity
                      disabled={item.menages > 0}
                      onPress={() => handleDeleteConcession(item.concession)}>
                      <Text
                        style={
                          item.menages > 0
                            ? [styles.buttonDisabled, styles.whiteText]
                            : [styles.deleteConcessionB, styles.whiteText]
                        }>
                        {t('delete_concession')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={item.concession.maintype === 'habit' && !canClose}
                      onPress={() => handleCloseConcession(item.concession)}>
                      <Text
                        style={
                          item.maintype === 'nohabit'
                            ? [styles.clotureConB, styles.whiteText]
                            : !canClose
                            ? [styles.buttonDisabled, styles.whiteText]
                            : [styles.clotureConB, styles.whiteText]
                        }>
                        {t('close_concession')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
          />
          <ThrottledNavigateButton
            componentId={componentId}
            destination={screenNames.AddConcession}
            tobBarTitleText={t('add_concession')}
            tobBarTitleColor={'#000'}
            tobBarBackgroundColor={Colors.primary}
            noBackButton
            passProps={{ user }}
            styles={styles.addConsBut}>
            <Text style={styles.buttonText}>{t('add_concession')}</Text>
          </ThrottledNavigateButton>
        </>
      )}
    </LinearGradient>
  );
};

export default Concessions;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  addConsBut: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    padding: 10,
    marginBottom: 20,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  itemsCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  bigCenteredText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonText2: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 50,
    padding: 10,
    elevation: 3,
    marginBottom: 15,
    width: wp(80) > 200 ? 200 : wp(80),
  },
  submitButton: {
    backgroundColor: Colors.lightBlue,
    borderRadius: 40,
    padding: 10,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  openConcession: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  openConcession2: {
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noConcessionsText: {
    color: Colors.error,
    marginBottom: 10,
  },
  concessionsList: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  list: {
    flex: 1,
    width: wp(90) > 400 ? 400 : wp(90),
  },
  concession: {
    marginHorizontal: wp(2),
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 5,
    marginVertical: 10,
    elevation: 3,
    width: wp(90) > 400 ? 400 : wp(90),
  },
  textWraper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  addMenageB: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 50,
    padding: 5,
    elevation: 3,
    marginVertical: 2,
  },
  editConcessionB: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: Colors.yellow,
    borderRadius: 50,
    padding: 5,
    elevation: 3,
    marginVertical: 2,
  },
  deleteConcessionB: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: Colors.error,
    borderRadius: 50,
    padding: 5,
    elevation: 3,
    marginVertical: 2,
  },
  clotureConB: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: Colors.success,
    borderRadius: 50,
    padding: 5,
    elevation: 3,
    marginVertical: 2,
  },
  buttonDisabled: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 50,
    padding: 5,
    elevation: 3,
    marginVertical: 2,
  },
  buttonsWraper: {
    marginTop: 10,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  flexColumn: {
    flexDirection: 'column',
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
  position: {
    width: 30,
    position: 'absolute',
    top: 5,
    left: 5,
  },
  noConcessions: {
    justifyContent: 'center',
    flex: 1,
  },
  whiteText: {},
});
