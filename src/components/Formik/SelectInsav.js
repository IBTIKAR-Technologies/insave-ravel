import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useTranslation } from 'react-i18next';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors } from 'src/styles';

const SelectInsav = props => {
  const {
    value,
    label,
    disabled,
    style,
    multiple,
    min,
    max,
    options,
    order,
    title,
    searchable,
    setSelectValue,
    selectValue,
  } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(options);
  }, [options]);

  return (
    <View style={style}>
      <Text style={styles.questTitle}>{t(title)}</Text>
      <DropDownPicker
        style={{
          borderRadius: 0,
          borderWidth: 0,
          backgroundColor: '#eee',
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
        }}
        labelStyle={{ fontSize: 18 }}
        textStyle={{ fontSize: 18 }}
        selectedItemContainerStyle={{
          backgroundColor: Colors.primary,
        }}
        selectedItemLabelStyle={{}}
        open={open}
        value={selectValue}
        items={items}
        setItems={setItems}
        placeholder={t(label) || t('select')}
        setOpen={setOpen}
        disabled={disabled}
        stickyHeader
        setValue={setSelectValue}
        multiple={multiple}
        searchPlaceholder={t('search')}
        multipleText={multiple && `${selectValue.length} ${t('selected')}`}
        min={min || 0}
        max={max || items.length}
        listMode="MODAL"
        modalProps={{
          animationType: 'slide',
          transparent: true,
          presentationStyle: 'overFullScreen',
        }}
        modalContentContainerStyle={{
          backgroundColor: '#fff',
          width: '90%',
          alignSelf: 'center',
          borderRadius: 10,
          marginBottom: '8%',
        }}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>{t('empty')}</Text>
          </View>
        )}
        TickIconComponent={({ style }) => <AntDesign name="check" color="white" size={20} />}
        CloseIconComponent={({ style }) => <AntDesign name="close" color="#f00" size={30} />}
        modalTitle={t(title)}
        searchable={searchable}
      />
      {multiple && (
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
  );
};

const styles = StyleSheet.create({
  questTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
  },
  errorMessage: {
    color: 'red',
    fontSize: 12,
    marginTop: 6,
  },
});

export default SelectInsav;
