import { View, Text, StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from 'src/styles';
import { FlashList } from '@shopify/flash-list';
import { wp } from 'src/lib/utilities';
import i18next from 'i18next';

const SeeQuotasLocalites = ({ commune }) => {
  const [localites, setLocalites] = useState([]);
  const [questionaire, setQuestionaire] = useState([]);
  const [menages, setMenages] = useState([]);
  const [user, setUser] = useState({});
  const { language } = i18next;

  const getAllData = useCallback(async () => {
    const user = await AsyncStorage.getItem('userData');
    const parsed = JSON.parse(user);
    setUser(parsed);
    const lcts = global.realms[0].objects('localite').filtered(`communeId == oid(${commune._id})`);
    const quesLocal = global.realms[0]
      .objects('formulairelocalite')
      .filtered(`operationId == oid(${parsed.operationId}) && communeId == oid(${commune._id})`);
    const mngs = global.realms[0]
      .objects('menage')
      .filtered(
        `communeId == oid(${commune._id}) && operationId == oid(${parsed.operationId}) && Eligible == true`,
      );
    console.log('leng', mngs.length);
    setLocalites(lcts);
    setQuestionaire(quesLocal);
    setMenages(mngs);
  }, [commune]);

  useEffect(() => {
    getAllData();
  }, [getAllData]);

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}
    >
      <View style={styles.list}>
        <FlashList
          data={localites}
          renderItem={({ item }) => {
            const locQuota = menages.filtered(
              `localiteId == oid(${item._id}) && operationId == oid(${user?.operationId})`,
            );
            const locQuotaLeft = questionaire.filtered(
              `localiteId == oid(${item._id}) && operationId == oid(${user?.operationId})`,
            )[0];
            return (
              <View style={styles.localite}>
                <Text>{language === 'fr' ? item.namefr_rs : item.namear}</Text>
                <Text>
                  {locQuotaLeft ? locQuotaLeft.leftForSelection + locQuota.length : locQuota.length}
                </Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => String(item._id)}
          estimatedItemSize={73}
        />
      </View>
    </LinearGradient>
  );
};

export default SeeQuotasLocalites;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  list: {
    width: '100%',
    margin: 10,
    height: '88%',
  },
  localite: {
    marginHorizontal: wp(2),
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 5,
    marginVertical: 10,
    elevation: 3,
    width: wp(90) > 400 ? 400 : wp(90),
    alignSelf: 'center',
  },
});
