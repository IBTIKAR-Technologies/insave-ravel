import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from 'src/styles';
import DropDownPicker from 'react-native-dropdown-picker';
import { wp } from 'src/lib/utilities';
import { changeZoneEnqueter, changeZoneEnqueter2 } from 'src/models/cartes';
import { Navigation } from 'react-native-navigation';
import Toast from 'react-native-toast-message';

const EditZone = ({ user, enqueter, zone, t, language, enqueters, componentId }) => {
  const [items, setItems] = useState([
    ...enqueters.map(en => ({ value: en._id.toString(), label: en.fullName })),
  ]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(enqueter?._id.toString() || '');

  console.log('value1', typeof value);
  console.log('items1', items);
  const confirmChange = () => {
    Alert.alert(
      t('confirm'),
      t('confirm_zone_change'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('confirm'), onPress: () => changeZone() },
      ],
      { cancelable: true },
    );
  };

  const changeZone = async () => {
    if (!zone.localiteId) {
      await changeZoneEnqueter(zone, value, user, enqueters).then(() => {
        Navigation.pop(componentId).then(() =>
          Toast.show({
            type: 'success',
            text1: t('zone_modified'),
            position: 'top',
            visibilityTime: 2000,
          }),
        );
      });
    } else {
      await changeZoneEnqueter2(zone, value, enqueter?._id).then(() => {
        Navigation.pop(componentId).then(() =>
          Toast.show({
            type: 'success',
            text1: t('zone_modified'),
            position: 'top',
            visibilityTime: 2000,
          }),
        );
      });
    }
  };

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      <Text style={styles.largeText}>{`${
        language === 'fr' ? zone.namefr || zone.namefr_rs : zone.namear
      }`}</Text>
      <View style={{ width: wp(70) > 300 ? 300 : wp(70), marginTop: 30 }}>
        <Text>{t('enqueter')}</Text>
        <DropDownPicker
          placeholder={t('select_enqueter')}
          items={items}
          setItems={setItems}
          open={open}
          setOpen={setOpen}
          value={value}
          setValue={setValue}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={confirmChange}>
        <Text style={styles.textWhite}>{t('submit')}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default EditZone;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeText: {
    fontSize: wp(100) < 400 ? 30 : 35,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    width: wp(100) < 400 ? 160 : 230,
    marginTop: 20,
    borderRadius: 50,
    elevation: 3,
    alignItems: 'center',
    marginBottom: 20,
  },
  textWhite: {},
});
