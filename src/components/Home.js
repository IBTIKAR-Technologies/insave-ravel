import React, { useCallback, useEffect, useState } from 'react';
import { Colors, CommonStyles } from 'src/styles';
import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import { ObjectId } from 'bson';
import {
  Alert, StyleSheet, Text, View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsConnected } from 'react-native-offline';
import { Navigation } from 'react-native-navigation';
import SplashScreen from 'react-native-splash-screen';
import { TextInput } from 'react-native-paper';
import { wp } from 'src/lib/utilities';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import Sample from './Blink';
import Icon from './Icon';
import SelectInsav from './Formik/SelectInsav';

const Ciblage = function ({ componentId }) {
  const { t } = useTranslation();
  const isConnected = useIsConnected();
  const [user, setUser] = useState({});
  const [total, setTotal] = useState(0);
  const [geoLocation, setGeoLocation] = useState({});
  const [wilayas, setWilayas] = useState(global.realms[1].objects('wilaya').sorted('code_rs'));
  const [communes, setCommunes] = useState([]);
  const [moughataas, setMoughataas] = useState([]);

  console.log('wilayas.length', wilayas.length);

  const handleChange = (name) => (value) => {
    console.log('value()', value());
    if (name === 'wilaya') {
      setGeoLocation({
        ...geoLocation,
        wilaya: value(),
        commune: '',
        moughataa: '',
      });
      setMoughataas(global.realms[1].objects('moughataa').filtered(`wilaya_id == oid(${value()})`).sorted('code_rs'));
      setCommunes([]);
    } else if (name === 'moughataa') {
      setGeoLocation({
        ...geoLocation,
        commune: '',
        moughataa: value(),
      });
      setCommunes(global.realms[1].objects('commune').filtered(`moughataa_id == oid(${value()})`).sorted('code_rs'));
    } else {
      setGeoLocation({
        ...geoLocation,
        [name]: value(),
      });
    }
  };

  const initialize = useCallback(async () => {
    let userData = await AsyncStorage.getItem('userData');
    userData = JSON.parse(userData);
    setUser(userData);
  }, []);

  useEffect(() => {
    const mngs = global.realms[0].objects('person');

    setTotal(mngs.length);
  }, []);

  useEffect(() => {
    const listener = {
      componentDidAppear: () => {
        console.log('RNN', 'componentDidAppear');
        initialize();
        SplashScreen.hide();
      },
    };
    const unsubscribe = Navigation.events().registerComponentListener(listener, componentId);
    return () => {
      unsubscribe.remove();
    };
  }, [componentId, initialize, isConnected]);

  const savePerson = person => {
    const exists = global.realms[0].objects('person').filtered(`NNI == "${person.NNI}"`);
    if (exists.length > 0 || person.NNI === user?.nni) {
      Alert.alert(t('error'), t('person_exists'));
      return;
    }
    const personObj = {
      ...person,
      _partition: user?._id,
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      syncedAt: null,
      createdById: new ObjectId(user?._id),
    };
    if (geoLocation.commune) {
      personObj.communeId = new ObjectId(geoLocation.commune);
      personObj.moughataaId = new ObjectId(geoLocation.moughataa);
      personObj.wilayaId = new ObjectId(geoLocation.wilaya);
    }
    console.log('personObj', personObj);
    global.realms[0].write(() => {
      global.realms[0].create('person', personObj, 'modified');
    });
    Toast.show({
      type: 'success',
      text1: t('success'),
      position: 'bottom',
    });
  };

  console.log('total', total);

  console.log('geoLocation', geoLocation);

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={CommonStyles.root}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {
          user?.categorie !== "parti" && user?.role !== "admin" ? (
            <View style={styles.commune}>
              <SelectInsav
                name="wilaya"
                title={t('wilaya')}
                style={styles.input}
                options={wilayas}
                selectValue={geoLocation.wilaya}
                setSelectValue={handleChange('wilaya')}
              />
              <SelectInsav
                name="moughataa"
                title={t('moughataa')}
                style={styles.input}
                options={moughataas}
                selectValue={geoLocation.moughataa}
                setSelectValue={handleChange('moughataa')}
              />
              <SelectInsav
                name="commune"
                title={t('commune')}
                style={styles.input}
                options={communes}
                selectValue={geoLocation.commune}
                setSelectValue={handleChange('commune')}
              />
            </View>
          ) : null
        }
        <View style={styles.commune}>
          {
            // eslint-disable-next-line max-len
            user?.categorie === "parti" && (["actniv1", "actniv2"].includes(user?.role) || (user?.role === "actniv3" && total >= 100)) ? <Text>{t("no_sympath")}</Text> : user?.categorie !== "parti" && user?.role !== "admin" && (!geoLocation.wilaya || !geoLocation.moughataa || !geoLocation.commune) ? <Text style={{ marginVertical: 20, textAlign: "center" }}>{t("no_commune")}</Text> : <Sample text={t('scan_card')} t={t} savePerson={savePerson} />
          }
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Ciblage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  secondContainer: {
    width: "100%",
    alignItems: 'center',
  },
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  inputContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    borderRadius: 50,
    paddingLeft: 5,
    marginVertical: 10,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: 'none',
    flex: 1,
    padding: 0,
    width: '100%',
  },
  commune: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  strong: {
    fontWeight: 'bold',
  },
  bigText: {
    fontSize: 30,
    color: Colors.black,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    width: '90%',
    textAlign: 'center',
  },
  avatar: {
    paddingLeft: '5%',
  },
  userInfo: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
    padding: 10,
    width: '90%',
  },
  details: {
    fontSize: 15,
    paddingBottom: 5,
  },
  buttons: {
    marginTop: 20,
    alignItems: 'center',
    width: wp(100),
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
    backgroundColor: '#ccc',
  },
});
