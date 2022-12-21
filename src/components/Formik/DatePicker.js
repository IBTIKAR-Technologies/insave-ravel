import React, { useCallback, useState } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import {
  withFormikControl,
} from 'react-native-formik';
import DatePicker from 'react-native-date-picker'
import { useTranslation } from "react-i18next";
import { Colors } from "src/styles";
import { hp, wp } from "src/lib/utilities";

const dateMax = new Date();

const dateMin = new Date("2021-04-01");

const Select = (props) => {
  const { error, value, setFieldValue, label, disabled, items, style, name } = props;
  const [open, setOpen] = useState(false)

  console.log('value', value);

  const { t } = useTranslation();

  const onConfirm = useCallback(
    (date) => {
      console.log('date', date)
      setOpen(false)
      setFieldValue(date)
    },
    [],
  )

  const handleOpen = useCallback(
    () => setOpen(!open),
    [open],
  )


  return (
    <TouchableWithoutFeedback onPress={handleOpen}>
      <View style={[style, styles.wrapper]}>
        <Text style={[styles.label, error ? styles.labelError : {}]}>{label || t("select")}</Text>
        <Text style={styles.date}>{value.toLocaleString("fr-FR", { year: 'numeric', month: '2-digit', day: '2-digit' })}</Text>
        <DatePicker
          modal
          open={open}
          date={value}
          onConfirm={onConfirm}
          onCancel={handleOpen}
          mode="date"
          minimumDate={dateMin}
          maximumDate={dateMax}
          locale="fr"
          androidVariant="nativeAndroid"
          is24hourSource="locale"
          title={label}
          confirmText={t("confirm")}
          cancelText={t("cancel")}
          onDateChange={setFieldValue}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  date: {
    marginTop: hp(2),
    marginHorizontal: wp(4)
  },
  label: {
    color: Colors.gray,
    position: "absolute",
    top: 3,
    left: 12,
  },
  labelError: {
    color: Colors.red,
  }
});

export default withFormikControl(Select);