import React, { useCallback, useEffect, useState } from 'react';
import {
  Text, StyleSheet, View, Image, TouchableOpacity,
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

const SubUsers = function ({ componentId, act }) {
  const { t } = useTranslation();
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const initialize = useCallback(async () => {
    let userData = await AsyncStorage.getItem('userData');
    userData = JSON.parse(userData);
    const usrs = global.realms[1].objects('user').filtered(`createdById == oid(${act._id.toString()})`).sorted('createdAt', true);
    const persn = global.realms[0].objects('person');
    setUsers(
      usrs.map(us => ({
        user: us,
        person: persn.filtered(`_id == oid(${us.personId})`)[0] || {},
      })),
    );
    setUser(userData);
  }, [act]);

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
  }, [componentId, initialize]);
  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={CommonStyles.root}
    >
      {
        user?.role && (
          <>
            <Text style={{ textAlign: 'center' }}>
              {t('total_acteurs')}: {users.length}
            </Text>
            <Text style={{ textAlign: 'center' }}>
              {t('t_added')}: {act?.globCount || 0}
            </Text></>
        )
      }
      {/* <Text style={{ textAlign: 'center' }}>
        {t('t_added')}: {users.map(u => u.user).reduce((a, b) => a + b.addedCount || 0, 0)}
      </Text> */}
      {
        user?.role ? (
          <FlashList
            data={users}
            renderItem={({ item }) => {
              console.log('item', item);
              const count = (item.user?.role !== "actniv3" && user?.categorie === "parti") ? global.realms[1].objects('user').filtered(`createdById == oid(${item.user?._id.toString()})`).length : item.user?.addedCount || 0;
              return (
                <ThrottledNavigateButton
                  styles={{
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    elevation: 5,
                    alignSelf: 'center',
                    padding: 10,
                    marginVertical: 5,
                    width: '95%',
                  }}
                  destination={screenNames.SubUsers}
                  componentId={componentId}
                  tobBarBackgroundColor={Colors.primary}
                  tobBarTitleColor="#fff"
                  tobBarTitleText={`${t('sub_users')} (${nextlevels[item?.user?.role]})`}
                  disabled={!nextlevels[item?.user?.role] || !count}
                  tobBarSubtitleText={item.user?.fullName}
                  passProps={{ act: item.user }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <View>
                      <Image
                        resizeMode="contain"
                        source={{
                          uri: item.user?.person.image,
                        }}
                        style={[styles.imageResult, item.user?.syncedAt ? {} : styles.nosync]}
                      />
                    </View>
                    <View>
                      <Text style={{ width: '100%' }}>
                        {t('name')}: {item.user?.fullName}
                      </Text>
                      <Text>{`${t('sex')}: ${t(item.user?.person.sex)}`}</Text>
                      <Text>{`${t('born_at')}: ${item.user?.person.birthDate}`}</Text>
                      <Text>{`${t('nni')}: ${item.user?.person.NNI}`}</Text>
                      <Text>{`${t('added')}: ${count}`}</Text>
                    </View>
                  </View>
                </ThrottledNavigateButton>
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
                <Text style={{ color: 'red' }}>{t('no_sub_act')}</Text>
              </View>
            )}
          />
        ) : null
      }
    </LinearGradient>
  );
};

export default SubUsers;

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
