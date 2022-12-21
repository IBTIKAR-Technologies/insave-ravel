import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Alert,
  BackHandler,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from 'src/styles';
import { TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Formik, getIn } from 'formik';
import { hp, wp, requestPermissions } from 'src/lib/utilities';
import Reanimated, { runOnJS } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { withNextInputAutoFocusForm } from 'react-native-formik';
import { Navigation } from 'react-native-navigation';
import Toast from 'react-native-toast-message';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { launchImageLibrary } from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { uploader } from 'src/models/uploadFile';
import { PERMISSIONS } from 'react-native-permissions';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import LottieView from 'lottie-react-native';
import { scanOCR } from 'vision-camera-ocr';
import { getListRougeInfTypes } from 'src/models/auth';
import { storage } from '../../index';
import Select from './Formik/Select';
import { SkeletonLoad } from './SkeletonLoad';
import { useIsConnected } from 'react-native-offline';

const perms = [PERMISSIONS.ANDROID.CAMERA];

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

// @ts-ignore

const Form = withNextInputAutoFocusForm(View);

const AddInfraction = function ({ user, componentId }) {
  const { t } = useTranslation();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [granted, setGranted] = React.useState(false);
  const [scanning, setScanning] = React.useState(false);
  const [matric, setMatric] = useState('');
  const isConnected = useIsConnected();
  const [loading, setLoading] = useState(true);
  const [infractionTypes, setInfractionTypes] = useState([]);

  console.log('infractionTypes', infractionTypes);

  const devices = useCameraDevices();
  const device = devices.back;

  const changeScanning = React.useCallback(() => {
    setScanning(true);
  }, []);

  useEffect(() => {
    (async () => {
      storage.clearAll();
      let infTyp;
      let storageInfras = storage.getString('infrTypes');
      console.log('storageInfras_s', storageInfras);
      if (storageInfras) {
        storageInfras = JSON.parse(storageInfras);
      }
      if (isConnected && !storageInfras) {
        getListRougeInfTypes(storageInfras).then(infTyps => {
          setInfractionTypes(
            (infTyps || []).map(i => ({
              label: `${i.name}(${i.amount})`,
              value: i._id,
            })),
          );
          setLoading(false);
          storage.set('infrTypes', JSON.stringify(infTyps));
        });
      } else if (isConnected && storageInfras) {
        getListRougeInfTypes(storageInfras).then(infTyps => {
          setInfractionTypes(
            (infTyps || []).map(i => ({
              label: `${i.name}(${i.amount})`,
              value: i._id,
            })),
          );
          setLoading(false);
          storage.set('infrTypes', JSON.stringify([...storageInfras, ...infTyps]));
        });
      } else {
        console.log('else');
        infTyp = storageInfras;
        setInfractionTypes(
          (infTyp || []).map(i => ({
            label: `${i.name}(${i.amount})`,
            value: i._id,
          })),
        );
        setTimeout(() => {
          setLoading(false);
        }, 100);
      }
    })();
  }, [isConnected]);

  const onTextRecognized = React.useCallback(async textBlocks => {
    console.log('textBlocks', textBlocks);
    for (let i = 0; i < textBlocks.length; i++) {
      const block = textBlocks[i];
      const { text, bounds } = block;
      const regex =
        /^([0-9]{4}|[0-9]{2}\s*[0-9]{2}|[0-9]{1}\s*[0-9]{1}\s*[0-9]{1}\s*[0-9]{1})\s*([A-Z]{2}|[A-Z]{1}\s*[A-Z]{1})\s*([1]\s*[0-4]|[0]\s*[0-9])$/g;
      if (regex.test(text)) {
        const noWhitespace = text.replace(/\s/g, '');
        console.log('noWhiteSpace', noWhitespace);
        console.log('text', text);
        setMatric(noWhitespace);
        setScanning(false);
      }
    }
    return null;
  }, []);

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      const objectOcr = scanOCR(frame);
      if (scanning) {
        runOnJS(onTextRecognized)(objectOcr);
      }
    },
    [onTextRecognized, scanning],
  );

  const onFrameProcessorSuggestionAvailable = React.useCallback(suggestion => {
    console.log(
      `Suggestion available! ${suggestion.type}: Can do ${suggestion.suggestedFrameProcessorFps} FPS`,
    );
  }, []);
  React.useEffect(() => {
    requestPermissions(setGranted, perms);
  }, []);

  const onInitialized = React.useCallback(() => {
    console.log('Camera initialized!');
  }, []);

  const onError = React.useCallback(error => {
    console.error('error camera', error);
  }, []);

  const submitTheForm = async infraction => {
    const nonSyncedInfras = storage.getString('nonSyncedInfras');
    if (nonSyncedInfras) {
      console.log('j', nonSyncedInfras);
      storage.set('nonSyncedInfras', JSON.stringify([...JSON.parse(nonSyncedInfras), infraction]));
    } else {
      console.log('non', nonSyncedInfras);
      storage.set('nonSyncedInfras', JSON.stringify([infraction]));
    }
    const add = true;
    if (add) {
      Navigation.pop(componentId).then(() => {
        Toast.show({
          type: 'success',
          text1: t('inf_add_success'),
          position: 'bottom',
          visibilityTime: 2000,
        });
      });
    } else {
      Toast.show({
        type: 'error',
        text1: t('inf_add_failed'),
        position: 'bottom',
        visibilityTime: 2000,
      });
    }
  };

  const confimeInfraction = infract => {
    Alert.alert(
      t('confirm'),
      t('confirm_infraction_message'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('confirm'), onPress: () => submitTheForm(infract) },
      ],
      { cancelable: false },
    );
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true); // or some other action
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false); // or some other action
    });
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
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
    return () => backHandler.remove();
  }, [componentId, t, user]);

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      <ScrollView
        contentContainerStyle={{ alignItems: 'center' }}
        style={styles.scrollView}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled>
        {loading ? (
          <SkeletonLoad height={50} marginTop={30} width={wp(90) > 400 ? 400 : wp(90)} />
        ) : (
          <Formik onSubmit={confimeInfraction} validateOnMount={false} initialValues={{}}>
            {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => {
              const realErrors = [];
              Object.keys(errors).map(name => {
                let error = getIn(errors, name);
                const touch = getIn(touched, name);
                if (touch && error) {
                  if (typeof error === 'object') {
                    error = error && error[0] ? Object.values(error[0]).join(', ') : 'Erreur';
                  }
                  realErrors.push(error);
                }
              });
              console.log('values', values);
              return (
                <Form
                  style={{
                    height: '97%',
                    justifyContent: 'space-evenly',
                    minHeight: hp(80),
                  }}>
                  <View
                    style={{ flex: 1, width: wp(90) > 400 ? 400 : wp(90), alignSelf: 'center' }}>
                    <Text style={styles.questTitle}>{t('matri')}</Text>
                    <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                      <TextInput
                        style={styles.textInput}
                        onChangeText={t => setMatric(t)}
                        value={matric}
                      />
                      <TouchableOpacity onPress={() => changeScanning()}>
                        <FontAwesome5
                          style={{ padding: 10 }}
                          name="camera"
                          size={30}
                          color={Colors.primary}
                        />
                      </TouchableOpacity>
                    </View>
                    <View>
                      <Select
                        name="type"
                        label="select_one"
                        title="inf_type"
                        options={infractionTypes}
                      />
                    </View>
                    <View>
                      <Text style={styles.questTitle}>{t('proof')}</Text>
                      <TouchableOpacity
                        onPress={async () => {
                          if (image) {
                            Toast.show({
                              type: 'error',
                              text1: t('max_files'),
                              position: 'bottom',
                            });
                            return;
                          }
                          const result = await launchImageLibrary({
                            mediaType: 'photo',
                            includeBase64: true,
                          });
                          if (result.didCancel) return;
                          if (result.errorCode) return;
                          if (result.errorMessage) return;
                          setImage(result);
                        }}>
                        <Feather
                          style={{ alignSelf: 'center' }}
                          name="file-plus"
                          size={40}
                          color={Colors.primary}
                        />
                      </TouchableOpacity>
                    </View>
                    <View>
                      <Select
                        name="papers"
                        label="select_what_applies"
                        title="papers"
                        options={[
                          {
                            label: t('assurance'),
                            value: 'assurance',
                          },
                          {
                            label: t('driver_licence'),
                            value: 'driver_licence',
                          },
                          {
                            label: t('carte_grise'),
                            value: 'carte_grise',
                          },
                          {
                            label: t('cart_identite'),
                            value: 'cart_identite',
                          },
                          {
                            label: t('carte_professionnelle'),
                            value: 'carte_professionnelle',
                          },
                          {
                            label: t('vignette'),
                            value: 'vignette',
                          },
                        ]}
                        multiple
                      />
                    </View>
                  </View>
                  {!isKeyboardVisible && (
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                      <Ionicons style={{ margin: 5 }} name="save" size={18} color="#000" />
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: 'bold',
                          color: '#000',
                          textAlign: 'center',
                        }}>
                        {t('submit')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </Form>
              );
            }}
          </Formik>
        )}
      </ScrollView>
      <>
        {!granted && <Text>{t('cam_permission_problem')}</Text>}
        {scanning && granted && (
          <Reanimated.View style={StyleSheet.absoluteFill}>
            <ReanimatedCamera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={scanning}
              onInitialized={onInitialized}
              onError={onError}
              enableZoomGesture={false}
              photo={false}
              video={false}
              audio={false}
              focusable
              frameProcessor={frameProcessor}
              frameProcessorFps={1}
              onFrameProcessorPerformanceSuggestionAvailable={onFrameProcessorSuggestionAvailable}
            />
            {scanning && (
              <View style={styles.lottieView}>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 5,
                    top: 5,
                    alignSelf: 'flex-start',
                    zIndex: 100,
                  }}
                  onPress={() => {
                    setScanning(false);
                  }}>
                  <AntDesign name="closecircleo" size={40} color={Colors.error} />
                </TouchableOpacity>
                <LottieView
                  source={require('../images/41663-scan-matrix.json')}
                  resizeMode="cover"
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            )}
          </Reanimated.View>
        )}
        <Toast />
      </>
    </LinearGradient>
  );
};

export default AddInfraction;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  questTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
  },
  button: {
    margin: 3,
    marginTop: 10,
    padding: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: 50,
    flex: 1,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    padding: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    marginBottom: 15,
    marginTop: 15,
    width: wp(90) > 400 ? 400 : wp(90),
    alignSelf: 'center',
  },
  error: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    borderColor: 'red',
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 5,
    width: '80%',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    paddingVertical: 10,
    width: '100%',
    marginBottom: 10,
  },
  nButton: {
    padding: 10,
    flex: 1,
    justifyContent: 'center',
    borderTopColor: '#fff',
    borderTopWidth: 1,
  },
  textInput: { flex: 1, height: 40, justifyContent: 'center' },
  lottie: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
