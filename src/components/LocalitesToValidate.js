import { View, Text, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from 'src/styles';
import { wp } from 'src/lib/utilities';
import i18next, { t } from 'i18next';
import { FlashList } from '@shopify/flash-list';
import screenNames from 'src/lib/navigation/screenNames';
import FontIncons from 'react-native-vector-icons/FontAwesome5';
import { Navigation } from 'react-native-navigation';
import { fetchCommunes } from 'src/models/cartes';
import ThrottledNavigateButton from './ThrottledNavigateButton';

const LocalitesToValidate = ({ user = {}, localites = [], menages = [], componentId }) => {
  const [loading, setLoading] = useState(true);
  const [localitesToVerifie, setLocalitesToVerifie] = useState([]);
  const [communes, setCommunes] = useState([]);
  const { language } = i18next;

  useEffect(() => {
    (async () => {
      const cmns = await fetchCommunes();
      setCommunes(JSON.parse(JSON.stringify(cmns)));
    })();
  }, []);

  useEffect(() => {
    const listener = {
      componentDidAppear: () => {
        console.log('RNN', 'componentDidAppear');
        setLocalitesToVerifie(
          localites.filter(loc => menages.find(m => m.localiteId === loc.localiteId)),
        );
        menages.map(m => console.log('localteId', m.localiteId));
      },
    };
    const unsubscribe = Navigation.events().registerComponentListener(listener, componentId);
    return () => {
      unsubscribe.remove();
    };
  }, [componentId, localites, menages]);

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      <Text style={{ margin: 10 }}>{`${t('lists_to_verifie')}: ${localitesToVerifie.length}`}</Text>
      <View style={styles.list}>
        <FlashList
          data={localitesToVerifie}
          keyExtractor={item => item._id}
          estimatedItemSize={136}
          renderItem={({ item }) => {
            const localiteCommune = communes.find(c => c._id === item.communeId);
            const localiteMenages = menages.filter(m => m.localiteId === item.localiteId);
            return (
              <View style={styles.itemContainer}>
                <View style={styles.flexRow}>
                  <Text>{t('local_name')}: </Text>
                  <Text style={styles.textBold}>{`${item.localeName} (${item.otherName})`}</Text>
                </View>
                <View style={styles.flexRow}>
                  <Text>{t('commune')}: </Text>
                  <Text style={styles.textBold}>
                    {language === 'fr'
                      ? localiteCommune.namefr_rs || localiteCommune.namefr_ons
                      : localiteCommune.namear}
                  </Text>
                </View>
                <View style={styles.flexRow}>
                  <Text>{t('quota')}: </Text>
                  <Text style={styles.textBold}>
                    {localiteMenages.length + item.leftForSelection}
                  </Text>
                </View>
                <View style={styles.flexRow}>
                  <Text>{t('sages')}: </Text>
                  <Text style={styles.textBold}>{item.sages?.length}</Text>
                </View>
                <ThrottledNavigateButton
                  componentId={componentId}
                  destination={screenNames.FinalSelection}
                  tobBarTitleText={`${t('validate_list')}(${item.localeName})`}
                  tobBarTitleColor={'#000'}
                  tobBarBackgroundColor={Colors.primary}
                  noBackButton
                  passProps={{
                    user,
                    localite: item,
                    localiteListComponentId: componentId,
                  }}
                  styles={styles.button}>
                  <FontIncons
                    style={{ margin: 5 }}
                    name="clipboard-check"
                    size={10}
                    color={'#000'}
                  />
                  <Text style={{}}>{t('validate')}</Text>
                </ThrottledNavigateButton>
              </View>
            );
          }}
        />
      </View>
    </LinearGradient>
  );
};

export default LocalitesToValidate;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    height: wp(90) > 300 ? 300 : wp(75),
    width: wp(90) > 300 ? 300 : wp(75),
    alignSelf: 'center',
  },
  historyButton: {
    width: wp(90) > 300 ? 300 : wp(80),
    padding: 10,
    backgroundColor: Colors.yellow,
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
    marginBottom: 20,
  },
  validateButton: {
    width: wp(90) > 300 ? 300 : wp(80),
    padding: 10,
    backgroundColor: Colors.blue,
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
    marginBottom: 20,
  },
  menagesButton: {
    width: wp(90) > 300 ? 300 : wp(80),
    padding: 10,
    backgroundColor: Colors.primary,
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
    marginBottom: 20,
  },
  normalText: {
    fontSize: 22,
    color: '#000',
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    fontStyle: 'italic',
  },
  itemContainer: {
    marginHorizontal: wp(2),
    backgroundColor: '#000',
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
  list: {
    flex: 1,
    width: wp(90) > 350 ? 350 : wp(90),
    height: '90%',
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
});
