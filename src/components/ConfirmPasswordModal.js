import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  TextInput,
  Keyboard,
  ScrollView,
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { Colors } from 'src/styles';
import { hp, wp } from 'src/lib/utilities';
import { useTranslation } from 'react-i18next';
import { ObjectId } from 'bson';
import DropDownPicker from 'react-native-dropdown-picker';

const ANIMATION_DURATION = 500;

const ConfirmPasswordModal = ({
  user,
  open,
  setOpen,
  callBack,
  title,
  membres,
  menage,
  handicaps,
  cronic,
}) => {
  const { t } = useTranslation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [passwordError, setPasswordError] = useState(false);
  const [password, setPassword] = useState('');
  const [hasShown, setHasShown] = useState(false);
  const [selectValue, setSelectValue] = useState([]);
  const [openS, setOpenS] = useState(false);
  const [items, setItems] = useState(
    membres
      ? membres.map(m => ({
        value: m._id,
        label: `${m.firstName} (${t(m.chefLink)})`,
      }))
      : [],
  );
  const [selectContValue, setSelectContValue] = useState('');
  const [openContS, setOpenContS] = useState(false);
  const [itemsCont, setItemsCont] = useState(
    membres
      ? membres.map(m => ({
        value: m._id,
        label: `${m.firstName} (${t(m.chefLink)})`,
      }))
      : [],
  );
  const [selectCronicValue, setSelectCronicValue] = useState([]);
  const [openCronicS, setOpenCronicS] = useState(false);
  const [itemsCronic, setItemsCronic] = useState(
    membres
      ? membres.map(m => ({
        value: m._id,
        label: `${m.firstName} (${t(m.chefLink)})`,
      }))
      : [],
  );

  const fadeInAnimation = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const fadeOutAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    fadeInAnimation();
  }, [fadeInAnimation]);
  useEffect(() => {
    setTimeout(() => setHasShown(true), ANIMATION_DURATION);
  }, []);

  const handleCallBack = () => {
    if (!menage && password !== user?.password) {
      setPasswordError(true);
      return;
    }
    if (handicaps || cronic) {
      if (handicaps && selectValue.length < 1) {
        return;
      }
      if (cronic && selectCronicValue.length < 1) {
        return;
      }
      if (menage && !selectContValue) {
        return;
      }
      const cronicIds = selectCronicValue.map(v => new ObjectId(v));
      const mostContribut = new ObjectId(selectContValue);
      const brasActif = membres.filter(
        m =>
          m.ocup7Days === 'ocup' || m.ocup7Days === 'inOcupNever' || m.ocup7Days === 'inOcupAlredy',
      );
      const menq = global.realms[0]
        .objects('enquete')
        .filtered(`menageId == oid(${menage._id})`)[0];
      const handicapIds = selectValue.map(v => new ObjectId(v));
      const finishAt = new Date();
      global.realms[0].beginTransaction();
      global.realms[0].create(
        'enquete',
        {
          _id: menq._id,
          syncedAt: null,
          handicapIds,
          brasActif: brasActif.length,
          mostContribut,
          cronicIds,
          finishAt,
          updatedAt: finishAt,
        },
        'modified',
      );
      global.realms[0].commitTransaction();
    } else if (menage) {
      if (!selectContValue) {
        return;
      }
      const mostContribut = new ObjectId(selectContValue);
      const brasActif = membres.filter(
        m =>
          m.ocup7Days === 'ocup' || m.ocup7Days === 'inOcupNever' || m.ocup7Days === 'inOcupAlredy',
      );
      const menq = global.realms[0]
        .objects('enquete')
        .filtered(`menageId == oid(${menage._id})`)[0];
      const finishAt = new Date();
      global.realms[0].beginTransaction();
      global.realms[0].create(
        'enquete',
        {
          _id: menq._id,
          syncedAt: null,
          brasActif: brasActif.length,
          mostContribut,
          finishAt,
          updatedAt: finishAt,
        },
        'modified',
      );
      global.realms[0].commitTransaction();
    }
    callBack();
  };

  return (
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
            if (!hasShown) return;
            setTimeout(() => {
              setOpen(false);
            }, ANIMATION_DURATION);
            fadeOutAnimation();
            Keyboard.dismiss();
          }}
        />
      </Animated.View>
      <Animated.View style={[styles.infoContainer, { opacity: fadeAnim }]}>
        <ScrollView style={{ padding: 20 }}>
          {membres && (
            <View style={{ marginVertical: 20 }}>
              <Text style={{ fontSize: 18, alignSelf: 'center', flex: 1 }}>{t('most_cont')}</Text>
              <DropDownPicker
                style={{ borderRadius: 10, borderColor: Colors.primary }}
                labelStyle={{ fontSize: 18 }}
                textStyle={{ fontSize: 18 }}
                selectedItemContainerStyle={{
                  backgroundColor: Colors.primary,
                }}
                selectedItemLabelStyle={{}}
                open={openContS}
                value={selectContValue}
                items={itemsCont}
                setItems={setItemsCont}
                placeholder={t('select_one')}
                setOpen={setOpenContS}
                stickyHeader
                setValue={setSelectContValue}
                listMode="MODAL"
                searchPlaceholder={t('search')}
                modalProps={{
                  animationType: 'slide',
                }}
                modalTitle={title}
                searchable
              />
            </View>
          )}
          {handicaps && (
            <View style={{ marginVertical: 20 }}>
              <Text style={{ fontSize: 18, alignSelf: 'center', flex: 1 }}>
                {t('s_handicap')}:{' '}
              </Text>
              <DropDownPicker
                style={{ borderRadius: 10, borderColor: Colors.primary }}
                labelStyle={{ fontSize: 18 }}
                textStyle={{ fontSize: 18 }}
                selectedItemContainerStyle={{
                  backgroundColor: Colors.primary,
                }}
                selectedItemLabelStyle={{}}
                open={openS}
                value={selectValue}
                items={items}
                setItems={setItems}
                placeholder={t('select_what_applies')}
                setOpen={setOpenS}
                multipleText={`${selectValue.length} ${t('selected')}`}
                stickyHeader
                setValue={setSelectValue}
                multiple
                searchPlaceholder={t('search')}
                listMode="MODAL"
                modalProps={{
                  animationType: 'slide',
                }}
                modalTitle={title}
                searchable
              />
              {selectValue && (
                <Text style={{ fontSize: 18, fontStyle: 'italic' }}>{`*${items
                  .filter(item => {
                    const keys = Object.keys(selectValue);
                    let included = false;
                    for (let i = 0; i < keys.length; i++) {
                      if (selectValue[keys[i]] === item.value) included = true;
                    }
                    return included;
                  })
                  .map(v => v.label)
                  .join(', ')}`}</Text>
              )}
            </View>
          )}
          {cronic && (
            <View style={{ marginVertical: 20 }}>
              <Text style={{ fontSize: 18, alignSelf: 'center', flex: 1 }}>{t('s_cronics')}: </Text>
              <DropDownPicker
                style={{ borderRadius: 10, borderColor: Colors.primary }}
                labelStyle={{ fontSize: 18 }}
                textStyle={{ fontSize: 18 }}
                selectedItemContainerStyle={{
                  backgroundColor: Colors.primary,
                }}
                selectedItemLabelStyle={{}}
                open={openCronicS}
                value={selectCronicValue}
                items={itemsCronic}
                setItems={setItemsCronic}
                placeholder={t('select_what_applies')}
                setOpen={setOpenCronicS}
                multipleText={`${selectCronicValue.length} ${t('selected')}`}
                stickyHeader
                setValue={setSelectCronicValue}
                multiple
                searchPlaceholder={t('search')}
                listMode="MODAL"
                modalProps={{
                  animationType: 'slide',
                }}
                modalTitle={title}
                searchable
              />
              {selectCronicValue && (
                <Text style={{ fontSize: 18, fontStyle: 'italic' }}>{`*${itemsCronic
                  .filter(item => {
                    const keys = Object.keys(selectCronicValue);
                    let included = false;
                    for (let i = 0; i < keys.length; i++) {
                      if (selectCronicValue[keys[i]] === item.value) included = true;
                    }
                    return included;
                  })
                  .map(v => v.label)
                  .join(', ')}`}</Text>
              )}
            </View>
          )}
          {!menage && (
            <>
              <Text style={{ textAlign: 'center' }}>{title}</Text>
              <TextInput
                value={password}
                onChangeText={val => {
                  setPassword(val);
                  setPasswordError(false);
                }}
                secureTextEntry
                style={[
                  styles.input,
                  { borderColor: passwordError ? Colors.error : Colors.primary },
                ]}
              />
              <Text style={[styles.smallRedText, { marginBottom: 0, marginTop: 0 }]}>
                {passwordError ? t('password_not_correect') : ''}
              </Text>
            </>
          )}
          <TouchableOpacity style={styles.button} onPress={handleCallBack}>
            <Text style={styles.buttonTxt}>{t('confirm')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

export default ConfirmPasswordModal;

const styles = StyleSheet.create({
  activityIndicatorWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  infoContainer: {
    backgroundColor: '#000',
    alignSelf: 'center',
    width: wp(80) > 400 ? 400 : wp(80),
    marginTop: hp(10),
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
    width: wp(90) > 400 ? 400 : wp(90),
  },
  button: {
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginHorizontal: 10,
    elevation: 5,
    marginBottom: 20,
  },
  buttonTxt: {
    color: '#000',
    fontSize: 18,
  },
  input: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    marginTop: 10,
    width: wp(80) > 355 ? 355 : wp(80),
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
});
