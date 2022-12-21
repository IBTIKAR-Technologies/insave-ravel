import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Animated,
  Alert,
  BackHandler,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { Colors } from 'src/styles';
import { hp, wp } from 'src/lib/utilities';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native-paper';
import { ObjectId } from 'bson';
import { FlashList } from '@shopify/flash-list';
import { Navigation } from 'react-native-navigation';
import i18next from 'i18next';
import screenNames from 'src/lib/navigation/screenNames';

const ANIMATION_DURATION = 300;
const ITEM_HEIGHT = 127.1;

const List = ({ data, t, setOpen, handleAddMenage, search, handleSearch, handleOpenForm }) => {
  const { language } = i18next;
  const Renderer = React.useCallback(
    ({ item, index }) => (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          onPress={() => {
            setOpen(true);
            handleAddMenage(item);
          }}
          onLongPress={() => handleOpenForm(item)}
          style={styles.item}>
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
        </TouchableOpacity>
      </View>
    ),
    [handleAddMenage, handleOpenForm, language, setOpen, t],
  );
  return (
    <>
      <TextInput
        mode="outlined"
        label={t('search_f_n_or_pho')}
        value={search}
        onChangeText={txt => handleSearch(txt)}
        style={{ height: 45, marginBottom: 20 }}
      />
      <View
        style={{
          width: '100%',
          height: hp(70),
        }}>
        <FlashList
          data={data}
          keyExtractor={item => String(item._id)}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          renderItem={Renderer}
          estimatedItemSize={146}
        />
      </View>
    </>
  );
};

const SelectMenageForSurveyModal = ({
  nonSelectedMenages,
  questionaire,
  getAllData,
  componentId,
  open,
  setOpen,
  setLoadingModal,
  user,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [hasShown, setHasShown] = useState(false);
  const [peviesLength, setPeviesLength] = useState(0);
  const { t } = useTranslation();
  const { language } = i18next;

  const fadeInAnimation = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const fadeOutAnimation = React.useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  React.useEffect(() => {
    setLoading(true);
    setData(JSON.parse(JSON.stringify(nonSelectedMenages)));
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [nonSelectedMenages]);

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (open) {
        setOpen(false);
        return true;
      }
      Navigation.pop(componentId);
      return true;
    });
  }, [componentId, open, setOpen]);

  const handleSearch = text => {
    setSearch(text);
    setPeviesLength(text.length);
    if (text === '') {
      setData(JSON.parse(JSON.stringify(nonSelectedMenages)));
      return;
    }
    console.log('stex', text);
    const pattern = new RegExp(`^${text}`);
    if (peviesLength > text.length) {
      setData(
        JSON.parse(JSON.stringify(nonSelectedMenages)).filter(
          item =>
            pattern.test(item.familyNameAr) ||
            pattern.test(item.familyNameFr) ||
            pattern.test(item.TelChef),
        ),
      );
      return;
    }
    setData(
      data.filter(
        item =>
          pattern.test(item.familyNameFr) ||
          pattern.test(item.familyNameAr) ||
          pattern.test(item.TelChef),
      ),
    );
  };

  const addMenage = React.useCallback(
    async menage => {
      fadeOutAnimation();
      setLoadingModal(true);
      setTimeout(() => {
        setOpen(false);
        setSearch('');
      }, ANIMATION_DURATION);
      try {
        global.realms[0].write(() =>
          global.realms[0].create(
            'menage',
            {
              _id: new ObjectId(menage._id),
              Eligible: true,
            },
            'modified',
          ),
        );
        global.realms[0].write(() =>
          global.realms[0].create(
            'formulairelocalite',
            {
              _id: new ObjectId(questionaire._id),
              leftForSelection: questionaire.leftForSelection - 1,
            },
            'modified',
          ),
        );
        setTimeout(() => {
          getAllData();
        }, 1);
      } catch (error) {
        console.log(error);
      }
    },
    [
      fadeOutAnimation,
      getAllData,
      questionaire._id,
      questionaire.leftForSelection,
      setLoadingModal,
      setOpen,
    ],
  );
  const handleAddMenage = React.useCallback(
    menage => {
      Alert.alert(
        t('confirm'),
        `${t('confirm_menage_message')} (${
          language === 'ar' ? menage.familyNameAr : menage.familyNameFr
        })`,
        [
          { text: t('cancel'), style: 'cancel' },
          { text: t('confirm'), onPress: () => addMenage(menage) },
        ],
        { cancelable: false },
      );
    },
    [addMenage, language, t],
  );

  const handleOpenForm = menage => {
    const concession = global.realms[0]
      .objects('concession')
      .filtered(`_id == oid(${menage.concessionId})`)[0];
    setOpen(false);
    Navigation.push(componentId, {
      component: {
        name: screenNames.AddMenage,
        options: {
          topBar: {
            title: {
              text: t('add_menage'),
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
          concession,
          edit: true,
          oldmenage: menage,
        },
      },
    });
  };

  useEffect(() => {
    fadeInAnimation();
  }, [fadeInAnimation]);
  useEffect(() => {
    setTimeout(() => setHasShown(true), ANIMATION_DURATION);
  }, []);

  return (
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
            if (!hasShown) return;
            setTimeout(() => {
              setOpen(false);
              setLoading(true);
              setSearch('');
            }, ANIMATION_DURATION);
            fadeOutAnimation();
          }}
        />
      </Animated.View>
      <Animated.View style={[styles.infoContainer, { opacity: fadeAnim }]}>
        <Text style={styles.title}>{t('select_a_menage_for_survey')}</Text>

        <View style={{ padding: 20 }}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <List
              data={data}
              setOpen={setOpen}
              handleAddMenage={handleAddMenage}
              t={t}
              handleSearch={handleSearch}
              search={search}
              handleOpenForm={handleOpenForm}
            />
          )}
        </View>
      </Animated.View>
    </Modal>
  );
};

export default SelectMenageForSurveyModal;

const styles = StyleSheet.create({
  activityIndicatorWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  infoContainer: {
    flex: 1,
    position: 'absolute',
    top: hp(5),
    backgroundColor: Colors.primaryGradientEnd,
    width: wp(90),
    alignSelf: 'center',
    borderRadius: 10,
    zIndex: 2000,
    height: hp(90),
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
    width: wp(90),
  },
  itemContainer: {
    margin: 10,
    height: ITEM_HEIGHT,
  },
  item: {
    padding: 10,
    backgroundColor: '#000',
    borderRadius: 10,
    elevation: 10,
    flexDirection: 'row',
    height: ITEM_HEIGHT,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
});
