import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CommonStyles } from 'src/styles';
import { wp, hp } from 'src/lib/utilities';

import logoImg from 'src/images/ravel_logo.png';

const Logo = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Image source={logoImg} style={styles.image} />
      <Text style={[CommonStyles.title, styles.title]}>{t('login')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 30,
  },
  image: {
    width: wp(45),
    height: wp(45),
  },
  title: {
    marginTop: 20,
  },
});

export default Logo;
