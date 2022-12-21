import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from 'src/styles';
import { wp } from 'src/lib/utilities';

const SubmitButton = ({ handleSubmit, t, disabled }) => (
  <TouchableOpacity
    style={disabled ? styles.submitButtonDis : styles.submitButton}
    onPress={handleSubmit}>
    <Ionicons style={{ margin: 5 }} name="save" size={18} color={'#000'} />
    <Text
      style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
      }}>
      {t('submit')}
    </Text>
  </TouchableOpacity>
);

export default SubmitButton;

const styles = StyleSheet.create({
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
    width: wp(90) > 400 ? 400 : wp(90),
    alignSelf: 'center',
  },
  submitButtonDis: {
    backgroundColor: Colors.gray,
    borderRadius: 50,
    padding: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    marginBottom: 15,
    marginTop: 15,
    width: wp(90) > 400 ? 400 : wp(90),
    alignSelf: 'center',
  },
});
