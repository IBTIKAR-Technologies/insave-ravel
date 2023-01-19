import React, { useCallback, useEffect, useState } from 'react';
import {
  Text, StyleSheet, View, Image,
} from 'react-native';
import { Colors, CommonStyles } from 'src/styles';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Navigation } from 'react-native-navigation';
import SplashScreen from 'react-native-splash-screen';
import { FlashList } from '@shopify/flash-list';
import screenNames from 'src/lib/navigation/screenNames';
import { nextlevels } from 'src/lib/utilities';
import ThrottledNavigateButton from './ThrottledNavigateButton';

const UnitesLiees = function ({ componentId }) {
  const { t } = useTranslation();
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const initialize = useCallback(async () => {
    let userData = await AsyncStorage.getItem('userData');
    userData = JSON.parse(userData);
    const usrs = global.realms[1].objects('user').filtered(`initiativeId == oid(${userData._id})`).sorted('communeId', true);
    console.log('usrs.length', usrs.length);
    const persn = global.realms[0].objects('person');
    setUsers(
      usrs.map(us => ({
        user: us,
        person: persn.filtered(`_id == oid(${us.personId})`)[0] || {},
      })),
    );
    setUser(userData);
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
    initialize();
    return () => {
      unsubscribe.remove();
    };
  }, [componentId, initialize]);

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={CommonStyles.root}
    >
      <Text style={{ textAlign: 'center' }}>
        {t('total_unites_liees')}: {users.length}
      </Text>
      <Text style={{ textAlign: 'center' }}>
        {t('t_added')}: {users.reduce((acc, obj) => (acc + (obj?.user?.addedCount || 0)), 0) || 0}
      </Text>

      {
        user?.role ? (
          <FlashList
            data={users}
            renderItem={({ item }) => {
              console.log('item', item);
              return (
                <View style={{
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  elevation: 5,
                  alignSelf: 'center',
                  padding: 10,
                  marginVertical: 5,
                  width: '95%',
                }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <View>
                      <Image
                        resizeMode="contain"
                        source={{
                          uri: item?.user?.person?.image,
                        }}
                        style={[styles.imageResult, item.user?.syncedAt ? {} : styles.nosync]}
                      />
                    </View>
                    <View>
                      <Text style={{ width: '100%' }}>
                        {t('name')}: {item.user?.fullName}
                      </Text>
                      <Text>{`${t('location')}: ${global.realms[1].objectForPrimaryKey("commune", item.user?.communeId)?.namefr_rs}`}</Text>
                      <Text>{`${t('nni')}: ${item.user?.nni}`}</Text>
                      <Text>{`${t('added')}: ${item.user?.addedCount}`}</Text>
                    </View>
                  </View>
                </View>
              );
            }}
            keyExtractor={item => item.user?._id}
            ListEmptyComponent={() => (
              <View
                style={{
                  backgroundColor: '#fff',
                  elevation: 10,
                  borderRadius: 10,
                  padding: 10,
                  minHeight: 100,
                  margin: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: 'red' }}>{t('no_unites_liees')}</Text>
              </View>
            )}
          />
        ) : null
      }
    </LinearGradient>
  );
};

export default UnitesLiees;

// react native styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
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
  nosync: {
    borderWidth: 1,
    borderColor: "red",
  },
});
