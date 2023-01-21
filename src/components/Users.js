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
import { isTimePast, nextlevels } from 'src/lib/utilities';
import ThrottledNavigateButton from './ThrottledNavigateButton';

const Users = function ({ componentId }) {
  const { t } = useTranslation();
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [canAttach, setCanAttach] = useState(false);
  const initialize = useCallback(async () => {
    let userData = await AsyncStorage.getItem('userData');
    userData = JSON.parse(userData);
    const usrs = global.realms[1].objects('user').filtered(`createdById == oid(${userData._id})`).sorted('createdAt', true);
    console.log('usrs.length', usrs.length);
    setUsers(
      usrs.map(us => ({
        user: us,
      })),
    );
    const user = global.realms[1].objects('user').filtered(`_id == oid(${userData._id})`)[0];
    console.log('user realm', user);
    setUser(user || userData);
    const canAttach = await isTimePast(userData.wilayaId);
    console.log('canAttach', canAttach);
    setCanAttach(!canAttach);
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
      {
        user?.role && (
          <>
            <Text style={{ textAlign: 'center' }}>
              {t('total_acteurs')}: {users.length}
            </Text>
            <Text style={{ textAlign: 'center' }}>
              {t('t_added')}: {user?.globCount || 0}
            </Text></>
        )
      }
      {
        canAttach ? (
          <ThrottledNavigateButton
            styles={{
              backgroundColor: Colors.primary,
              paddingVertical: 5,
              paddingHorizontal: 20,
              borderRadius: 20,
              alignSelf: 'center',
              marginVertical: 15,
              elevation: 5,
            }}
            destination={screenNames.AddUser}
            componentId={componentId}
            tobBarTitleText={t('add_user')}
            tobBarBackgroundColor={Colors.primary}
            passProps={{ user }}
          >
            <Text>{t('add_user')}</Text>
          </ThrottledNavigateButton>
        ) : <Text style={{ alignSelf: "center", color: Colors.error }}>{t("add_disabled")}</Text>
      }
      {
        user?.role === "actniv1" && user?.categorie === "initiative" ? (
          <ThrottledNavigateButton
            styles={{
              backgroundColor: Colors.primary,
              paddingVertical: 5,
              paddingHorizontal: 20,
              borderRadius: 20,
              alignSelf: 'center',
              elevation: 5,
            }}
            destination={screenNames.UnitesLiees}
            componentId={componentId}
            tobBarTitleText={t('unites_liees')}
            tobBarBackgroundColor={Colors.primary}
            passProps={{ user }}
          >
            <Text>{t('unites_liees')}</Text>
          </ThrottledNavigateButton>
        ) : null
      }
      {
        user?.role ? (
          <FlashList
            data={users}
            renderItem={({ item }) => {
              const count = (item.user?.role !== "actniv3" && user?.categorie === "parti") ? global.realms[1].objects('user').filtered(`createdById == oid(${item.user?._id.toString()})`).length : item.user?.addedCount || 0;
              console.log('item', item);
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
                  tobBarTitleText={`${t('sub_users')} (${nextlevels[nextlevels[user?.role]]})`}
                  disabled={!count}
                  tobBarSubtitleText={item.user?.fullName}
                  passProps={{ act: item.user }}
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
                      {user?.role === "admin" && user?.categorie === "initiative" ? <Text>{`${t('code_initiative')}: ${item.user?.codeInitiative}`}</Text> : <Text>{`${t('born_at')}: ${item?.user?.person?.birthDate}`}</Text>}
                      <Text>{`${t('nni')}: ${item.user?.nni}`}</Text>
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
                <Text style={{ color: 'red' }}>{t('no_users')}</Text>
              </View>
            )}
          />
        ) : null
      }
    </LinearGradient>
  );
};

export default Users;

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
