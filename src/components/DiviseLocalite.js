import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from 'src/styles';
import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import screenNames from 'src/lib/navigation/screenNames';
import { Navigation } from 'react-native-navigation';
import { hp, wp } from 'src/lib/utilities';
import ThrottledNavigateButton from './ThrottledNavigateButton';

const NoZones = ({ componentId, user, localite }) => {
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1, marginTop: '50%' }}>
      <Text style={{ color: 'red', textAlign: 'center' }}>{t('no_zone')}</Text>
      <ThrottledNavigateButton
        componentId={componentId}
        destination={screenNames.AddZone}
        passProps={{ user, t, localite }}
        tobBarBackgroundColor={Colors.primary}
        tobBarTitleColor="#fff"
        tobBarTitleText={t('add_zone')}
        styles={styles.button}
      >
        <Text style={{}}>{t('add_zone')}</Text>
      </ThrottledNavigateButton>
    </View>
  );
};

const DiviseLocalite = ({
  localite, user, t, componentId,
}) => {
  const [zones, setZones] = useState([]);

  const initialize = useCallback(async () => {
    const zns = global.realms[0]
      .objects('zone')
      .filtered(`localiteId == oid(${localite._id}) && operationId == oid(${user?.operationId})`);
    setZones(zns);
  }, [user, localite]);

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
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}
    >
      <Text>
        {t('zones')}: {zones.length}
      </Text>
      <View style={styles.list}>
        <FlashList
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <NoZones componentId={componentId} user={user} localite={localite} />
          )}
          data={zones}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item._id}
          estimatedItemSize={131}
          renderItem={({ item, index }) => (
            <ThrottledNavigateButton
              componentId={componentId}
              destination={screenNames.AddZone}
              passProps={{
                user, t, localite, edit: true, oldzone: item,
              }}
              tobBarBackgroundColor={Colors.primary}
              tobBarTitleColor="#fff"
              tobBarTitleText={t('add_zone')}
              styles={styles.itemContainer}
            >
              <View style={styles.flexRow}>
                <Text style={styles.title}>{`${t('local_name_fr')}:`}</Text>
                <Text style={styles.result}>{item.namefr}</Text>
              </View>
              <View style={styles.flexRow}>
                <Text style={styles.title}>{`${t('local_name_ar')}:`}</Text>
                <Text style={styles.result}>{item.namear}</Text>
              </View>
            </ThrottledNavigateButton>
          )}
        />
        {zones.length > 0 && (
          <ThrottledNavigateButton
            componentId={componentId}
            destination={screenNames.AddZone}
            passProps={{ user, t, localite }}
            tobBarBackgroundColor={Colors.primary}
            tobBarTitleColor="#fff"
            tobBarTitleText={t('add_zone')}
            styles={styles.button}
          >
            <Text style={{}}>{t('add_zone')}</Text>
          </ThrottledNavigateButton>
        )}
      </View>
    </LinearGradient>
  );
};

export default DiviseLocalite;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  divButton: {
    marginTop: 50,
    paddingVertical: 5,
    backgroundColor: Colors.blue,
    borderRadius: 20,
    width: 200,
    alignSelf: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 3,
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: 30,
    justifySelf: 'flex-end',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    padding: 7,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  error: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    borderColor: 'red',
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 5,
    width: '80%',
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  itemContainer: {
    margin: 10,
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  list: {
    width: wp(90) > 400 ? 400 : wp(90),
    marginBottom: 10,
    height: hp(80),
  },
  listContent: {
    paddingVertical: 10,
  },
  title: {
    flex: 1,
  },
  result: {
    flex: 1,
    fontWeight: '800',
    flexWrap: 'wrap',
  },
});
