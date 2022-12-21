import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { hp, wp } from 'src/lib/utilities';
import { withNextInputAutoFocusForm } from 'react-native-formik';
import { Formik } from 'formik';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from 'src/styles';
import Toast from 'react-native-toast-message';
import { ObjectId } from 'bson';
import { Navigation } from 'react-native-navigation';
import ItemRenderer from './Formik/ItemRenderer';

const Form = withNextInputAutoFocusForm(View);

const CorrectMenage = ({ menage, user, concession, componentId }) => {
  const { t } = useTranslation();

  const validationSchema = yup.object({
    habitTerre: yup.string().required(`1. ${t('habit_terre')}`),
    landSize: yup.string().when('habitTerre', {
      is: 'yes',
      then: yup.string().required(`1.1. ${t('land_size')}`),
    }),
  });

  const schema = [
    {
      title: t('habit_terre'),
      type: 'select',
      name: 'habitTerre',
      label: t('select_one'),
      options: [
        {
          label: t('yes'),
          value: 'yes',
        },
        {
          label: t('no'),
          value: 'no',
        },
      ],
      order: 1,
    },
    {
      title: t('land_size'),
      type: 'num',
      name: 'landSize',
      placeholder: t('land_size'),
      order: 1.1,
      depends: 'habitTerre',
      answer: 'yes',
    },
  ];

  const initialValues = {
    habitTerre: '',
    landSize: '',
  };

  const submitTheForm = async mm => {
    console.log('menage', menage);
    console.log('🚀 ~ file: AddMenage.js ~ line 46 ~ submitTheForm ~ concession', concession);
    let add = true;
    try {
      global.realms[0].write(() => {
        global.realms[0].create(
          'menage',
          {
            _id: new ObjectId(menage._id),
            habitTerre: mm.habitTerre,
            landSize: mm.habitTerre === 'yes' ? parseInt(mm.landSize, 10) : null,
            reCible: false,
          },
          'modified',
        );
      });
    } catch (e) {
      console.log('err', e);
      add = false;
    }
    console.log('edit', add);
    if (add) {
      Navigation.pop(componentId).then(() => {
        Toast.show({
          type: 'success',
          text1: t('menage_added'),
          position: 'bottom',
          visibilityTime: 2000,
        });
      });
    } else {
      Toast.show({
        type: 'error',
        text1: t('menage_add_failed'),
        position: 'bottom',
        visibilityTime: 2000,
      });
    }
  };

  return (
    <LinearGradient
      colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
      style={styles.root}>
      <Formik
        initialValues={initialValues}
        onSubmit={submitTheForm}
        validationSchema={validationSchema}
        validateOnMount={false}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <Form
            style={{
              width: wp(90) > 400 ? 400 : wp(90),
              height: '97%',
              marginTop: 200,
              minHeight: hp(80),
            }}>
            {schema.map(item => (
              <ItemRenderer item={item} values={values} key={`${item.name}_${item.order}`} />
            ))}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Ionicons style={{ margin: 5 }} name="save" size={18} color="#fff" />
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
          </Form>
        )}
      </Formik>
    </LinearGradient>
  );
};

export default CorrectMenage;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
});
