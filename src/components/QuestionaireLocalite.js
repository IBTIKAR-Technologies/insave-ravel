import { View, Text, StyleSheet } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from 'src/styles';
import { useTranslation } from 'react-i18next';
import { Navigation } from 'react-native-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import screenNames from 'src/lib/navigation/screenNames';
import ThrottledNavigateButton from './ThrottledNavigateButton';

const controllerRoleId = '62d5635aa5fac5ffb48ef7e4';
const enqueterRoleId = '62d562fda5fac5ffb48ef7e2';
const supervisorRoleId = '62d5633aa5fac5ffb48ef7e3';

const QuestionaireLocalite = function ({ user, componentId, selectedLocalite }) {
  const { t } = useTranslation();
  const [localite, setLocalite] = useState(null);

  const initialize = useCallback(async () => {
    if (user?.roleId === enqueterRoleId || user?.roleId === controllerRoleId) {
      let zone = await AsyncStorage.getItem('selectedZone');
      zone = JSON.parse(zone);
      const lcal = global.realms[0]
        .objects('formulairelocalite')
        .filtered(`localiteId == oid(${zone.localiteId})`);
      if (lcal[0]) {
        setLocalite(lcal[0]);
      }
    }
    if (user?.roleId === supervisorRoleId) {
      let suplocalite = await AsyncStorage.getItem('selectLocaliteSuper');
      suplocalite = JSON.parse(suplocalite);
      const lcal = global.realms[0]
        .objects('formulairelocalite')
        .filtered(`localiteId == oid(${suplocalite._id})`);
      if (lcal[0]) {
        setLocalite(lcal[0]);
      }
    }
  }, [user]);

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
      <View style={{ marginTop: 100 }}>
        <Text style={styles.title}>{t('formulaire_localite')}</Text>
        {!localite && (
          <ThrottledNavigateButton
            styles={styles.button}
            componentId={componentId}
            destination={screenNames.LocaliteIdentification}
            tobBarBackgroundColor={Colors.primary}
            passProps={{ localite, selectedLocalite }}
            tobBarTitleColor="#fff"
            tobBarTitleText={t('identify')}
          >
            <Text style={{}}>{t('identify')}</Text>
          </ThrottledNavigateButton>
        )}
        {localite && (
          <>
            <Text style={{ textAlign: 'center' }}>{localite.localeName}</Text>
            <ThrottledNavigateButton
              styles={styles.button}
              componentId={componentId}
              destination={screenNames.LocaliteIdentification}
              tobBarBackgroundColor={Colors.primary}
              passProps={{ localite, selectedLocalite }}
              tobBarTitleColor="#fff"
              tobBarTitleText={t('identify')}
            >
              <Text style={{}}>{t('identify')}</Text>
            </ThrottledNavigateButton>
            <ThrottledNavigateButton
              styles={styles.button}
              componentId={componentId}
              destination={screenNames.LocaliteInfras}
              tobBarBackgroundColor={Colors.primary}
              passProps={{ localite }}
              tobBarTitleColor="#fff"
              tobBarTitleText={t('infras')}
            >
              <Text style={{}}>{t('infras')}</Text>
            </ThrottledNavigateButton>
            <ThrottledNavigateButton
              styles={styles.button}
              componentId={componentId}
              destination={screenNames.LocaliteSages}
              tobBarBackgroundColor={Colors.primary}
              passProps={{ localite, user }}
              tobBarTitleColor="#fff"
              tobBarTitleText={t('sages')}
            >
              <Text style={{}}>{t('sages')}</Text>
            </ThrottledNavigateButton>
          </>
        )}
      </View>
    </LinearGradient>
  );
};

export default QuestionaireLocalite;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    margin: 3,
    marginTop: 10,
    padding: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: 50,
    elevation: 3,
    width: 200,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    padding: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    marginBottom: 15,
    marginTop: 15,
  },
  error: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    borderColor: 'red',
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 5,
  },
  scrollView: {
    flex: 1,
    paddingVertical: 10,
    width: '100%',
    marginBottom: 10,
  },
});
