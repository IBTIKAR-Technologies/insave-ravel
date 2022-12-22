import React, { useCallback, useEffect, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { Colors, CommonStyles } from 'src/styles';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Navigation } from 'react-native-navigation';
import SplashScreen from 'react-native-splash-screen';
import { FlashList } from '@shopify/flash-list';
import screenNames from 'src/lib/navigation/screenNames';
import Sample from './Blink';
import ThrottledNavigateButton from './ThrottledNavigateButton';

const Users = function ({ componentId }) {
  const { t } = useTranslation();
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const initialize = useCallback(async () => {
    let userData = await AsyncStorage.getItem('userData');
    userData = JSON.parse(userData);
    const usrs = global.realms[1].objects('user').filtered(`createdById == oid(${userData._id})`);
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
    return () => {
      unsubscribe.remove();
    };
  }, [componentId, initialize]);
  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={CommonStyles.root}>
      <Text style={{ textAlign: 'center' }}>
        {t('total')}: {users.length}
      </Text>
      <Text style={{ textAlign: 'center' }}>
        {t('t_added')}: {users.map(u => u.user).reduce((a, b) => a + b.addedCount || 0, 0)}
      </Text>
      <FlashList
        data={users}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              elevation: 10,
              alignSelf: 'center',
              padding: 10,
              marginTop: 10,
              marginVertical: 10,
            }}>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <Image
                  resizeMode="contain"
                  source={{
                    uri: item.person.image,
                  }}
                  style={styles.imageResult}
                />
              </View>
              <View>
                <Text>
                  {t('name')}: {item.user.fullName}
                </Text>
                <Text>{`${t('sex')}: ${t(item.person.sex)}`}</Text>
                <Text>{`${t('born_at')}: ${item.person.birthDate}`}</Text>
                <Text>{`${t('nni')}: ${item.person.NNI}`}</Text>
              </View>
            </View>
          </View>
        )}
        keyExtractor={item => item.user._id}
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
            }}>
            <Text style={{ color: 'red' }}>{t('no_users')}</Text>
          </View>
        )}
      />
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
        passProps={{ user }}>
        <Text>{t('add_user')}</Text>
      </ThrottledNavigateButton>
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
    height: 100,
    width: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
