import { View, Modal, StyleSheet, TouchableOpacity, Text, Animated, Keyboard } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { Colors } from 'src/styles';
import { hp, wp } from 'src/lib/utilities';
import { useTranslation } from 'react-i18next';

const ANIMATION_DURATION = 500;

const WorningModal = ({ open, setOpen, callBack, warnings, menage }) => {
  const { t } = useTranslation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [hasShown, setHasShown] = useState(false);

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
    callBack();
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
        <View style={{ padding: 5 }}>
          {warnings.NbrPieces && (
            <View>
              <Text style={{ textAlign: 'center', fontSize: 18 }}>{t('num_rooms')}</Text>
              <Text style={{ color: '#f00', textAlign: 'center', fontSize: 20 }}>
                {menage.NbrPieces}
              </Text>
            </View>
          )}
          {warnings.NbrMbrMen && (
            <View>
              <Text style={{ textAlign: 'center', fontSize: 18 }}>{t('family_size')}</Text>
              <Text style={{ color: '#f00', textAlign: 'center', fontSize: 20 }}>
                {menage.NbrMbrMen}
              </Text>
            </View>
          )}
        </View>
        <View style={{ padding: 20, flexDirection: 'row' }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (!hasShown) return;
              setTimeout(() => {
                setOpen(false);
              }, ANIMATION_DURATION);
              fadeOutAnimation();
              Keyboard.dismiss();
            }}>
            <Text style={styles.buttonTxt}>{t('cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonR} onPress={handleCallBack}>
            <Text style={styles.buttonTxt}>{t('confirm')}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default WorningModal;

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
    paddingHorizontal: 40,
    borderRadius: 50,
    marginHorizontal: 10,
    elevation: 5,
  },
  buttonR: {
    alignSelf: 'center',
    backgroundColor: Colors.error,
    paddingVertical: 5,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginHorizontal: 10,
    elevation: 5,
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
