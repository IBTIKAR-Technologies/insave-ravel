import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  TextInput,
  Keyboard,
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { ObjectId } from 'bson';
import { Colors } from 'src/styles';
import { hp, wp } from 'src/lib/utilities';
import { useTranslation } from 'react-i18next';

const ANIMATION_DURATION = 500;

const MenageRemoveRaisons = ({
  open,
  setOpen,
  title,
  selectedMenage,
  questionaire,
  setLoading,
  getAllData,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [raisonError, setRaisonError] = useState(false);
  const [raison, setRaison] = useState('');
  const [hasShown, setHasShown] = useState(false);
  const { t } = useTranslation();

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
            RaisExlution: raison,
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
  }, [getAllData, questionaire, selectedMenage, setLoading, raison]);

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
    if (raison.length < 50) {
      setRaisonError(true);
      return;
    }
    excludeMenage();
    setOpen(false);
  };

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
            }, ANIMATION_DURATION);
            fadeOutAnimation();
            Keyboard.dismiss();
          }}
        />
      </Animated.View>
      <Animated.View style={[styles.infoContainer, { opacity: fadeAnim }]}>
        <View style={{ padding: 20 }}>
          <Text style={{ textAlign: 'center' }}>{title}</Text>
          <TextInput
            value={raison}
            onChangeText={val => {
              setRaison(val);
              setRaisonError(false);
            }}
            style={[styles.input, { borderColor: raisonError ? Colors.error : Colors.primary }]}
          />
          <Text style={[styles.smallRedText, { marginBottom: 0, marginTop: 0 }]}>
            {raisonError ? t('to_short') : ''}
          </Text>
          <TouchableOpacity onPress={handleCallBack}>
            <Text style={styles.button}>{t('confirm')}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default MenageRemoveRaisons;

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
    width: wp(90) > 400 ? 400 : wp(90),
  },
  button: {
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 50,
    color: '#000',
    marginHorizontal: 10,
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
