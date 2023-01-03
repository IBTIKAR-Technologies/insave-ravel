import {
  View, Text, StyleSheet, Image,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { Colors } from 'src/styles';
import { wp, hp } from 'src/lib/utilities';
import { useTranslation } from 'react-i18next';
import { Navigation } from 'react-native-navigation';
import { FlashList } from '@shopify/flash-list';
import i18next from 'i18next';

const HistoryCiblage = function ({ componentId }) {
  const { t } = useTranslation();
  const { language } = i18next;
  const [menages, setMnages] = useState([]);

  const initialize = useCallback(async () => {
    const mngs = global.realms[0].objects('person');
    setMnages(mngs);
  }, []);

  useEffect(() => {
    const listener = {
      componentDidAppear: () => {
        console.log('RNN', 'componentDidAppear');
        initialize();
      },
    };
    const unsubscribe = Navigation.events().registerComponentListener(listener, componentId);
    return () => {
      unsubscribe.remove();
    };
  }, [componentId, initialize]);

  return (
    <View
      style={{
        width: '100%',
        flex: 1,
      }}
    >
      <Text style={{ textAlign: 'center' }}>
        {t('total')}: {menages.length}
      </Text>
      <FlashList
        data={menages}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => String(item._id)}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              elevation: 5,
              alignSelf: 'center',
              padding: 10,
              marginVertical: 5,
              width: '95%',
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: "flex-start" }}>
              <View style={styles.imageContainer}>
                <Image
                  resizeMode="contain"
                  source={{
                    uri: item.image,
                  }}
                  style={styles.imageResult}
                />
              </View>
              <View>
                <Text style={{ width: '100%' }}>
                  {t('name')}: {item.firstName} {item.lastName}
                </Text>
                <Text>{`${t('sex')}: ${t(item.sex)}`}</Text>
                <Text>{`${t('born_at')}: ${item.birthDate}`}</Text>
                <Text>{`${t('nni')}: ${item.NNI}`}</Text>
              </View>
            </View>
          </View>
        )}
        estimatedItemSize={137}
      />
    </View>
  );
};
export default HistoryCiblage;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    backgroundColor: Colors.primaryGradientEnd,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    marginHorizontal: 20,
    padding: 5,
  },
  imageContainer: {
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: Colors.primary,
    color: '#000',
    paddingHorizontal: 20,
    paddingVertical: 3,
    marginHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: wp(90) > 400 ? 400 : wp(90),
    marginTop: 10,
  },
  list: {
    backgroundColor: '#000',
    width: wp(90) > 400 ? 400 : wp(90),
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 10,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  itemContainer: {
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 10,
    width: wp(90) > 400 ? 400 : wp(90),
    alignSelf: 'center',
  },
  closeButton: {
    position: 'relative',
    top: 0,
    right: 0,
    backgroundColor: '#eee',
    alignSelf: 'flex-end',
    borderRadius: 5,
    marginRight: -15,
  },
  zoneFinished: {
    alignSelf: 'flex-end',
    marginTop: -6,
    marginRight: -10,
  },
  textBold: {
    fontWeight: 'bold',
  },
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(2),
    paddingVertical: hp(2),
    backgroundColor: Colors.primaryGradientEnd,
    borderRadius: wp(5),
    margin: hp(1.5),
    marginHorizontal: wp(2),
    flexWrap: 'wrap',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  listItem: {
    backgroundColor: Colors.primaryGradientEnd,
    width: wp(40),
    paddingVertical: hp(0.5),
  },
  smallText: {
    fontSize: 16,
  },
  normalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeZoneButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    width: wp(100) < 400 ? 160 : 230,
    marginTop: 20,
    borderRadius: 50,
    elevation: 3,
    alignItems: 'center',
    marginBottom: 20,
  },
  closeZoneButtonDisbled: {
    backgroundColor: Colors.gray,
    padding: 10,
    width: wp(100) < 400 ? 160 : 230,
    marginTop: 20,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 20,
  },
  smallRedText: {
    fontSize: 10,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: -20,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  modalWraper: {
    display: 'flex',
    backgroundColor: '#000',
    width: wp(100) < 400 ? wp(80) : 400,
    padding: 20,
    paddingTop: 5,
    borderRadius: 10,
  },
  input: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    marginTop: 10,
    width: wp(100) < 400 ? wp(70) : 300,
    fontSize: 20,
    textAlign: 'center',
  },
  imageResult: {
    height: 75,
    width: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
});
