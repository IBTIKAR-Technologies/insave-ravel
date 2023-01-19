import {
  View, Text, BackHandler, Alert, StyleSheet, TouchableOpacity,
} from 'react-native';
import React from 'react';
import { Navigation } from 'react-native-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from 'src/styles';
import { wp, hp, requestPermissions } from 'src/lib/utilities';
import { PERMISSIONS } from 'react-native-permissions';
import { FlashList } from '@shopify/flash-list';
import Reanimated, { runOnJS } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { ObjectId } from 'bson';
import { scanOCR } from 'vision-camera-ocr';
import ConfirmPasswordModal from './ConfirmPasswordModal';
import LoadingModalTransparent from './LoadingModalTransparent';

const perms = [
  PERMISSIONS.ANDROID.CAMERA,
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
];

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

const ConfirmSages = ({
  user, componentId, localiteListComponentId, localite,
}) => {
  const [sages, setSages] = React.useState(localite.sages);
  const { t } = useTranslation();
  const [granted, setGranted] = React.useState(false);
  const [scanning, setScanning] = React.useState(false);
  const [selectedSage, setSelectedSage] = React.useState({ sage: {}, index: null });
  const [params, setParams] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const fetchSages = React.useCallback(async () => {
    const param = global.realms[1]
      .objects('param')
      .filtered(`operationId == oid(${user?.operationId})`);
    if (param.length > 0) {
      setParams(param[0]);
    }
  }, [user]);

  const devices = useCameraDevices();
  const device = devices.back;

  const changeScanning = React.useCallback(() => {
    setScanning(true);
  }, []);

  const handleVlidateList = React.useCallback(() => {
    const date = new Date();
    try {
      const menagesToUpdate = global.realms[0]
        .objects('menage')
        .filtered(`localiteId == oid(${localite.localiteId}) && Eligible == true`);
      console.log('menagesToUpdate', menagesToUpdate);
      global.realms[0].beginTransaction();
      menagesToUpdate.forEach(menage => {
        global.realms[0].create(
          'menage',
          { _id: menage._id, listValidated: true, syncedAt: null },
          'modified',
        );
      });
      global.realms[0].commitTransaction();

      setTimeout(() => {
        setOpen(false);
        Navigation.popToRoot(componentId).then(() => {
          Toast.show({
            type: 'success',
            text1: t('success'),
            text2: t('list_validated'),
            position: 'top',
            visibilityTime: 5000,
          });
        });
      }, 100);
      global.realms[0].write(() =>
        global.realms[0].create(
          'formulairelocalite',
          {
            _id: new ObjectId(localite._id),
            syncedAt: null,
            updatedAt: date,
            listConfirmed: true,
          },
          'modified',
        ));
      setLoading(true);
    } catch (error) {
      console.log('eerrr', error);
    }
  }, [localite, localiteListComponentId, t]);

  const onTextRecognized = React.useCallback(
    async textBlocks => {
      console.log('textBlocks', textBlocks);
      for (let i = 0; i < textBlocks.length; i++) {
        const block = textBlocks[i];
        const { text, bounds } = block;
        let doBreak = false;
        if (text.includes('MRT') && text.includes('<') && text.length > 10) {
          const values = [];
          for (let k = 11; k < text.length; k++) {
            const val = text.slice(k - 11, k);
            if (val.slice(-1) === '<' && val.slice(-2, -1) !== '<') {
              values.push(val);
            }
          }
          for (let j = 0; j < values.length; j++) {
            const val = values[j].slice(0, -1);
            const nni = Number(val);
            if (!Number.isNaN(nni) && nni % 97 === 1 && String(nni).length === 10) {
              if (selectedSage.sage.nni === String(nni)) {
                const date = new Date();
                try {
                  const sgs = JSON.parse(JSON.stringify(sages));
                  console.log(sgs[selectedSage.index].validated);
                  sgs[selectedSage.index].validated = true;
                  console.log(sgs[selectedSage.index].validated);
                  setSages(sgs);
                  global.realms[0].write(() =>
                    global.realms[0].create(
                      'formulairelocalite',
                      {
                        _id: new ObjectId(localite._id),
                        syncedAt: null,
                        updatedAt: date,
                        sages: sgs,
                        sagesValidated: localite.sagesValidated ? localite.sagesValidated + 1 : 1,
                      },
                      'modified',
                    ));
                  Toast.show({
                    type: 'success',
                    text1: t('success'),
                    text2: t('nii_is_valid'),
                    position: 'bottom',
                    visibilityTime: 2000,
                  });
                } catch (e) {
                  console.log(e);
                }
                setScanning(false);
              } else {
                Toast.show({
                  type: 'error',
                  text1: t('error'),
                  text2: t('nii_doesnt_match'),
                  position: 'bottom',
                  visibilityTime: 2000,
                });
                setScanning(false);
              }
              doBreak = true;
              return null;
            }
          }
        }
        if (doBreak) {
          break;
        }
      }
      return null;
    },
    [selectedSage, t, sages, localite],
  );

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

  console.log('granted', granted);

  const onInitialized = React.useCallback(() => {
    console.log('Camera initialized!');
  }, []);

  const onError = React.useCallback(error => {
    console.error('error camera', error);
  }, []);

  React.useEffect(() => {
    fetchSages();
  }, [fetchSages]);

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (scanning) {
        setScanning(false);
        return true;
      }

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
  }, [componentId, scanning, t]);
  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}
    >
      <Text style={{ marginTop: 10 }}>{`${t('min_to_confirm')} ${localite.sagesValidated || 0} / ${(params.commitePercentage * localite.sages.length) / 100
        }`}</Text>
      <View style={styles.list}>
        <FlashList
          data={sages}
          contentContainerStyle={{ paddingVertical: 10 }}
          keyExtractor={item => `${item.nni}_${item.num}`}
          estimatedItemSize={182}
          renderItem={({ item, index }) => (
            <View style={styles.itemContainer}>
              <View style={styles.flexRow}>
                <Text>{t('namef')}: </Text>
                <Text style={styles.textBold}>{`${item.firstName} ${item.name}`}</Text>
              </View>
              <View style={styles.flexRow}>
                <Text>{t('phone_number')}: </Text>
                <Text style={styles.textBold}>{item.phone}</Text>
              </View>
              <View style={styles.flexRow}>
                <Text>{t('sex')}: </Text>
                <Text style={styles.textBold}>{t(item.sex)}</Text>
              </View>
              <View style={styles.flexRow}>
                <Text>{t('nni')}: </Text>
                <Text style={styles.textBold}>{item.nni}</Text>
              </View>
              <View style={styles.flexRow}>
                <Text>{t('validated')}: </Text>
                {item.validated ? (
                  <EvilIcons name="check" size={30} color="#00a8ff" />
                ) : (
                  <EvilIcons name="close-o" size={30} color="#FF6666" />
                )}
              </View>
              <TouchableOpacity
                onPress={() => {
                  changeScanning();
                  setSelectedSage({ sage: item, index });
                }}
                disabled={item.validated}
                style={item.validated ? styles.buttonDisabled : styles.button}
              >
                <AntDesign name="camera" size={15} color="#000" />
                <Text style={{ margin: 5 }}>{t('validate')}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <TouchableOpacity style={styles.closeZoneButton} onPress={() => setOpen(true)}>
        <AntDesign name="checkcircleo" size={20} color="#000" />
        <Text style={styles.text}>{t('validate')}</Text>
      </TouchableOpacity>
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
                  }}
                >
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
      {open && (
        <ConfirmPasswordModal
          open={open}
          setOpen={setOpen}
          user={user}
          title={t('confirm_password_list')}
          callBack={handleVlidateList}
        />
      )}
      <LoadingModalTransparent loading={loading} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  update: {
    position: 'absolute',
    top: 0,
    width: wp(100),
  },
  list: {
    flex: 1,
    width: wp(90) > 350 ? 350 : wp(90),
    height: '90%',
  },
  lottie: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie2: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(80),
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  buttonContent: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#888',
    borderRadius: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  info: {
    width: wp(95),
    paddingBottom: wp(2),
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 5,
    position: 'absolute',
    top: hp(2),
  },
  header: {
    width: '100%',
    paddingVertical: wp(1),
    backgroundColor: Colors.primary,
    color: '#000',
    textAlign: 'center',
  },
  typeHeader: {
    color: Colors.primary,
    textAlign: 'left',
    fontWeight: 'bold',
    marginLeft: wp(1),
    textDecorationLine: 'underline',
  },
  typeBody: {
    color: Colors.primary,
    textAlign: 'left',
  },
  type: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: wp(1),
    paddingHorizontal: wp(1),
    alignItems: 'center',
  },
  success: {
    color: Colors.success,
  },
  danger: {
    color: Colors.error,
  },
  itemContainer: {
    marginHorizontal: wp(2),
    backgroundColor: '#000',
    height: 190,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 10,
    padding: 10,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  textBold: {
    fontWeight: 'bold',
  },
  text: {
    color: '#000',
    marginHorizontal: 4,
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
});
export default ConfirmSages;
