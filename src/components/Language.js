import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, CommonStyles } from 'src/styles';
import { wp, hp } from 'src/lib/utilities';
import RNPickerSelect from 'react-native-picker-select';
import i18next from 'i18next';
import i18n from 'src/lib/languages/i18n';

const Language = function () {
  const { language } = i18next;
  console.log('language', language);
  const updateLanguage = useCallback(
    languageX => {
      if (languageX !== language) {
        const isRTL = languageX === 'ar';
        i18n.setLanguage(languageX, isRTL);
      }
    },
    [language],
  );

  return (
    <View style={styles.container}>
      <RNPickerSelect
        placeholder={{}}
        onValueChange={updateLanguage}
        value={language}
        items={[
          { label: 'العربية', value: 'ar' },
          { label: 'Français', value: 'fr' },
        ]}
        style={pickerSelectStyles}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: wp(40) > 180 ? 180 : wp(40),
    paddingHorizontal: wp(2),
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 99,
    borderTopRightRadius: 5,
    backgroundColor: Colors.primaryLight,
    borderRightColor: Colors.primary,
    borderRightWidth: 1,
    borderTopColor: Colors.primary,
    borderTopWidth: 1,
  },
  picker: {
    height: hp(5),
    width: wp(100),
  },
  pickerSelect: {
    ...CommonStyles.text,
    fontSize: hp(2),
    color: Colors.primary,
    backgroundColor: Colors.primaryLight,
    borderRadius: wp(1),
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
    marginBottom: hp(1),
  },
  pickerItem: {
    height: hp(5),
    ...CommonStyles.text,
    fontSize: wp(4),
  },
  sectionHeadingStyle: {
    paddingVertical: hp(2),
    paddingHorizontal: hp(2),
    color: '#000',
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default Language;
