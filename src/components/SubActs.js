import React, { useCallback, useEffect, useState } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Colors, CommonStyles } from 'src/styles';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Navigation } from 'react-native-navigation';
import SplashScreen from 'react-native-splash-screen';
import { FlashList } from '@shopify/flash-list';

const SubUsers = function ({ componentId, act }) {
  const { t } = useTranslation();
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const initialize = useCallback(async () => {
    let userData = await AsyncStorage.getItem('userData');
    userData = JSON.parse(userData);
    const usrs = global.realms[1].objects('user').filtered(`createdById == oid(${act._id})`);
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
              width: '90%',
            }}
            onPress={() => {
              if (item.user.role === 'actniv1') {
                console.log('hhh');
              }
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
                <Text style={{ width: '100%' }}>
                  {t('name')}: {item.user.fullName}
                </Text>
                <Text>{`${t('sex')}: ${t(item.person.sex)}`}</Text>
                <Text>{`${t('born_at')}: ${item.person.birthDate}`}</Text>
                <Text>{`${t('nni')}: ${item.person.NNI}`}</Text>
                <Text>{`${t('added')}: ${item.user.addedCount || 0}`}</Text>
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
            <Text style={{ color: 'red' }}>{t('no_sub_act')}</Text>
          </View>
        )}
      />
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
    height: 100,
    width: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
