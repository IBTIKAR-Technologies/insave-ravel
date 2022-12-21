import React from 'react';
import i18n from 'src/lib/languages/i18n';
import { StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { wp } from 'src/lib/utilities';
import Icon from './Icon';
import Text from './Text';

export default function HistoryItem({ item, index }) {
  const getGender = {
    F: 'female',
    M: 'male',
  };
  const {
    nMbNNI, PRENOM, NOM, NOM_FAMILLE, SEXE, ID_CARTE_CNAM, Wilaya, Moughataa, Commune,
  } = item;
  return (
    <List.Item
      key={nMbNNI}
      title={`${PRENOM} ${NOM} ${NOM_FAMILLE}`}
      description={`${i18n.t('location')} : ${Wilaya}/${Moughataa}/${Commune}`}
      left={() => <Icon style={styles.icon} name={getGender[SEXE]} size={30} />}
      right={() => <Text style={styles.text}>{ID_CARTE_CNAM}</Text>}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: wp(2.5),
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(1),
  },
});
