import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { getParams, fetchNonSelectedMenages } from 'src/models/cartes';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors } from 'src/styles';
import { hp, wp } from 'src/lib/utilities';
import { ObjectId } from 'bson';
import i18next, { t } from 'i18next';
import screenNames from 'src/lib/navigation/screenNames';
import { Navigation } from 'react-native-navigation';
import LoadingModalTransparent from './LoadingModalTransparent';
import SelectMenageForSurveyModal from './SelectMenageForSurveyModal';
import ThrottledNavigateButton from './ThrottledNavigateButton';
import MenageRemoveRaisons from './MenageRemoveRaisons';

const ITEM_HEIGHT = 127.1;

const FinalSelection = ({ componentId, localiteListComponentId, localite, user }) => {
  const [nonSelectedMenages, setNonSelectedMenages] = React.useState([]);
  const [maxExclutions, setMaxExclutions] = React.useState(0);
  const [currentExclutions, setCurrentExclutions] = React.useState(0);
  const [questionaire, setQuestionaire] = React.useState({});
  const [selectedBySys, setSelectedBySys] = React.useState([]);
  const [selectedByUser, setSelectedByUser] = React.useState([]);
  const [leftForSelection, setLeftForSelection] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [giveReasons, setGiveReasons] = React.useState(false);
  const [selectedMenage, setSelectedMenage] = React.useState(null);
  const { language } = i18next;

  console.log('localite,', localite);
  console.log(
    'nonSelectedMenages.length <= leftForSelection.length,',
    nonSelectedMenages.length <= leftForSelection.length,
  );
  console.log('nonSelectedMenages.length <= leftForSelection.length,', nonSelectedMenages.length);
  console.log('nonSelectedMenages.length <= leftForSelection.length,', leftForSelection.length);
  const getAllData = React.useCallback(async () => {
    if (!user._id) return;
    const slctdMngs = global.realms[0]
      .objects('menage')
      .filtered(
        `localiteId == oid(${localite.localiteId}) && operationId == oid(${user.operationId}) && Eligible == true`,
      )
      .sorted('zoneId', true);
    const mngsSys = slctdMngs.filtered(`selectedBySys == true`);
    const mngsUsr = slctdMngs.filtered(`selectedBySys != true`);
    const params = await getParams(user);
    const mngs = await fetchNonSelectedMenages(user, localite.localiteId);
    const localQuest = global.realms[0]
      .objects('formulairelocalite')
      .filtered(`_id == oid(${localite._id})`);
    const lefSelcts = [];
    for (let i = 0; i < localQuest[0].leftForSelection; i++) {
      lefSelcts.push({});
    }
    setLeftForSelection(lefSelcts);
    setCurrentExclutions(localQuest[0].excludedNum || 0);
    setQuestionaire(JSON.parse(JSON.stringify(localQuest[0])));
    setMaxExclutions(Math.ceil((params[0].maxNumExclusion / 100) * localQuest[0].sysmenages));
    console.log('params[0].maxNumExclusion', params[0].maxNumExclusion);
    setNonSelectedMenages(JSON.parse(JSON.stringify(mngs)));
    setSelectedBySys(mngsSys);
    setSelectedByUser(mngsUsr);
    setLoading(false);
  }, [localite, user]);

  React.useEffect(() => {
    const listener = {
      componentDidAppear: () => {
        console.log('RNN', 'componentDidAppear');
        getAllData();
      },
    };
    const unsubscribe = Navigation.events().registerComponentListener(listener, componentId);
    return () => {
      unsubscribe.remove();
    };
  }, [componentId, getAllData]);

  const excludeMenage = React.useCallback(async () => {
    const date = new Date();
    console.log('menage', selectedMenage);
    try {
      global.realms[0].write(() =>
        global.realms[0].create(
          'menage',
          {
            _id: new ObjectId(selectedMenage._id),
            excluded: true,
            Eligible: false,
            syncedAt: null,
            updatedAt: date,
          },
          'modified',
        ),
      );
      global.realms[0].write(() =>
        global.realms[0].create(
          'formulairelocalite',
          {
            _id: new ObjectId(questionaire._id),
            leftForSelection: questionaire.leftForSelection + 1,
            excludedNum: selectedMenage.selectedBySys
              ? questionaire.excludedNum
                ? questionaire.excludedNum + 1
                : 1
              : questionaire.excludedNum || 0,
            syncedAt: null,
            updatedAt: date,
          },
          'modified',
        ),
      );
      setLoading(true);
      setTimeout(() => {
        getAllData();
      }, 1);
    } catch (e) {
      console.log(e);
    }
  }, [getAllData, questionaire, selectedMenage]);

  const handleExcludeMenage = React.useCallback(
    menage => {
      console.log('curren', currentExclutions);
      console.log('max', maxExclutions);
      if (currentExclutions >= maxExclutions && menage.selectedBySys) {
        Alert.alert(
          t('attention'),
          t('max_eclutions_excuded'),
          [{ text: t('confirm'), onPress: () => console.log('dismiss') }],
          { cancelable: false },
        );
      } else {
        Alert.alert(
          t('confirm'),
          t('confirm_exclude_menage'),
          [
            { text: t('cancel'), style: 'cancel' },
            {
              text: t('confirm'),
              onPress: () => {
                setSelectedMenage(menage);
                if (menage.selectedBySys) {
                  setGiveReasons(true);
                } else {
                  excludeMenage();
                }
              },
            },
          ],
          { cancelable: false },
        );
      }
    },
    [currentExclutions, excludeMenage, maxExclutions],
  );

  const Renderer = React.useCallback(
    ({ item, index }) => (
      <View style={item?.selectedBySys ? styles.itemContainerSys : styles.itemContainer}>
        {item?.Eligible ? (
          <>
            <View style={{ flex: 4 }}>
              <View style={styles.flexRow}>
                <Text style={styles.smallText}>{t('chef_name')}: </Text>
                <Text style={styles.textBold}>
                  {language === 'ar' ? item.chefNameAr : item.chefNameFr}
                </Text>
              </View>
              <View style={styles.flexRow}>
                <Text style={styles.smallText}>{t('family_name')}: </Text>
                <Text style={styles.textBold}>
                  {language === 'ar' ? item.familyNameAr : item.familyNameFr}
                </Text>
              </View>
              <View style={styles.flexRow}>
                <Text style={styles.smallText}>{t('tel_chef')}: </Text>
                <Text style={styles.textBold}>{item.TelChef || t('no_phone')}</Text>
              </View>
              <View style={styles.flexRow}>
                <Text style={styles.smallText}>{t('nni')}: </Text>
                <Text style={styles.textBold}>{item.NNIChef}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => handleExcludeMenage(item)}
              disabled={nonSelectedMenages.length <= leftForSelection.length}>
              <AntDesign
                name="minuscircleo"
                size={40}
                color={
                  (currentExclutions >= maxExclutions && item.selectedBySys) ||
                  nonSelectedMenages.length <= leftForSelection.length
                    ? '#C6475650'
                    : Colors.error
                }
              />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 16,
            }}
            onPress={() => {
              setOpen(true);
            }}>
            <AntDesign name="pluscircleo" size={40} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    ),
    [
      currentExclutions,
      handleExcludeMenage,
      language,
      maxExclutions,
      leftForSelection,
      nonSelectedMenages,
    ],
  );

  console.log('rendered');
  return (
    <View
      style={{
        width: wp(90) > 400 ? 400 : wp(90),
        flex: 5,
      }}>
      <LoadingModalTransparent loading={loading} />
      <View>
        <Text style={{ padding: 10, textAlign: 'center' }}>{`${t(
          'exluction_n',
        )} ${currentExclutions} / ${maxExclutions}`}</Text>
      </View>
      <FlatList
        data={[...selectedBySys, ...selectedByUser, ...leftForSelection]}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, i) => `${String(item._id)} ${String(i)}`}
        renderItem={Renderer}
      />
      <ThrottledNavigateButton
        disabled={leftForSelection.length > 0}
        componentId={componentId}
        destination={screenNames.ConfirmSages}
        tobBarBackgroundColor={Colors.primary}
        passProps={{
          user,
          localiteListComponentId,
          localite,
        }}
        styles={
          leftForSelection.length > 0 ? styles.closeZoneButtonDisbled : styles.closeZoneButton
        }
        tobBarTitleColor="#fff"
        tobBarTitleText={t('confirm_sages')}>
        <AntDesign name="checkcircleo" size={20} color={'#000'} />
        <Text style={styles.text}>{t('confirm_sages')}</Text>
      </ThrottledNavigateButton>
      {open && (
        <SelectMenageForSurveyModal
          nonSelectedMenages={nonSelectedMenages}
          questionaire={questionaire}
          getAllData={getAllData}
          componentId={componentId}
          open={open}
          setOpen={setOpen}
          setLoadingModal={setLoading}
          user={user}
        />
      )}
      {giveReasons && (
        <MenageRemoveRaisons
          open={giveReasons}
          setOpen={setGiveReasons}
          title={t('give_reasons')}
          getAllData={getAllData}
          questionaire={questionaire}
          selectedMenage={selectedMenage}
          setLoading={setLoading}
        />
      )}
    </View>
  );
};

export default FinalSelection;

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
    padding: 10,
    backgroundColor: '#000',
    borderRadius: 10,
    elevation: 10,
    flexDirection: 'row',
    height: ITEM_HEIGHT,
  },
  itemContainerSys: {
    margin: 10,
    padding: 10,
    backgroundColor: '#aaa',
    borderRadius: 10,
    elevation: 10,
    flexDirection: 'row',
    height: ITEM_HEIGHT,
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
    fontSize: 15,
  },
  normalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeZoneButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    width: wp(100) < 400 ? 160 : 230,
    borderRadius: 50,
    elevation: 3,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    flexDirection: 'row',
  },
  closeZoneButtonDisbled: {
    backgroundColor: '#666',
    padding: 10,
    width: wp(100) < 400 ? 160 : 230,
    borderRadius: 50,
    elevation: 3,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    flexDirection: 'row',
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
  text: {
    color: '#000',
    marginHorizontal: 4,
  },
});
