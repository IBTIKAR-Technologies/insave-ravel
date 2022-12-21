import * as yup from 'yup';

export const validationSchema = (t, menagesCible) =>
  yup.object().shape({
    NbrMenages: yup
      .string()
      .required(t('input_build_num_hab'))
      .test(t('is_number'), t('must_be_number'), val => !isNaN(val))
      .when(['NbrRefus', 'NbrAbsents'], (NbrRefus, NbrAbsents, schema) =>
        schema.test({
          test: NbrMenages => {
            console.log('menageCount', NbrMenages);
            console.log('isTrue', NbrRefus);
            console.log('isTrue', NbrAbsents);
            console.log('menage', menagesCible);
            return (
              parseInt(NbrRefus || '0', 10) +
              parseInt(NbrAbsents || '0', 10) +
              menagesCible <=
              parseInt(NbrMenages, 10)
            );
          },
          message: t('total_count_must_be_less_than_building_count'),
        }),
      ),
    NbrAbsents: yup
      .string()
      .required(t('input_absent_fam_count'))
      .test(t('is_number'), t('must_be_number'), val => !isNaN(val)),
    NbrDoublons: yup
      .string()
      .required(t('input_build_fam_double_count'))
      .test(t('is_number'), 'must_be_number', val => !isNaN(val)),
    NbrRefus: yup
      .string()
      .required(t('input_build_fam_refused_count'))
      .test(t('is_number'), t('must_be_number'), val => !isNaN(val)),
    Adresse: yup.string().required(t('input_build_address')),
  });

export const initialValues = {
  NbrMenages: '',
  NbrAbsents: '',
  NbrDoublons: '',
  NbrRefus: '',
  Adresse: '',
};
