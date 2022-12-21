import * as yup from 'yup';

export default function concession(t) {
  return [
    {
      title: t('type'),
      type: 'select',
      name: 'maintype',
      label: t('type'),
      order: 1,
      options: [
        { value: 'habit', label: t('habit') },
        { value: 'nohabit', label: t('nohabit') },
      ],
    },
    {
      title: t('soustype'),
      type: 'select',
      name: 'soustype',
      label: t('soustype'),
      order: 2,
      depends: 'maintype',
      answer: 'nohabit',
      options: [
        { value: 'adm', label: t('adm') },
        { value: 'mili', label: t('mili') },
        { value: 'bur', label: t('bur') },
        { value: 'hot', label: t('hot') },
        { value: 'mos', label: t('mos') },
        { value: 'eco', label: t('eco') },
        { value: 'maha', label: t('maha') },
        { value: 'sante', label: t('sante') },
        { value: 'pharma', label: t('pharma') },
        { value: 'marc', label: t('marc') },
        { value: 'sta', label: t('sta') },
        { value: 'stas', label: t('stas') },
        { value: 'epi', label: t('epi') },
        { value: 'bou', label: t('bou') },
        { value: 'chant', label: t('chant') },
        { value: 'other', label: t('other') },
      ],
    },
    {
      title: t('building_num_hab'),
      type: 'num',
      name: 'NbrMenages',
      placeholder: t('input_build_num_hab'),
      order: 3,
      depends: 'maintype',
      answer: 'habit',
    },
    {
      title: t('abscent_family_count'),
      type: 'num',
      name: 'NbrAbsents',
      placeholder: t('input_absent_fam_count'),
      order: 4,
      depends: 'maintype',
      answer: 'habit',
    },
    {
      title: t('building_family_refused_count'),
      type: 'num',
      name: 'NbrRefus',
      placeholder: t('input_build_fam_refused_count'),
      order: 5,
      depends: 'maintype',
      answer: 'habit',
    },
    {
      title: t('building_address'),
      type: 'text',
      name: 'Adresse',
      placeholder: t('input_build_address'),
      order: 6,
    },
  ];
}

export const validationSchema = (t, menagesCible) =>
  yup.object().shape({
    maintype: yup.string().required(t('type')),
    soustype: yup.string().when('maintype', {
      is: 'nohabit',
      then: yup.string().required(t('soustype')),
    }),
    NbrMenages: yup
      .string()
      .when('maintype', {
        is: 'habit',
        then: yup
          .string()
          .required(t('building_num_hab'))
          .test(t('is_number'), t('must_be_number'), val => !isNaN(val)),
      })
      .when(['NbrRefus', 'NbrAbsents', 'maintype'], (NbrRefus, NbrAbsents, maintype, schema) => {
        if (maintype === 'habit') {
          return schema.test({
            test: NbrMenages =>
              parseInt(NbrRefus || '0', 10) + parseInt(NbrAbsents || '0', 10) + menagesCible <=
              parseInt(NbrMenages, 10),
            message: t('total_count_must_be_less_than_building_count'),
          });
        }
      }),
    NbrAbsents: yup.string().when('maintype', {
      is: 'habit',
      then: yup
        .string()
        .required(t('abscent_family_count'))
        .test(t('is_number'), t('must_be_number'), val => !isNaN(val)),
    }),
    NbrRefus: yup.string().when('maintype', {
      is: 'habit',
      then: yup
        .string()
        .required(t('building_family_refused_count'))
        .test(t('is_number'), t('must_be_number'), val => !isNaN(val)),
    }),
    Adresse: yup.string().required(t('input_build_address')),
  });

export const initialValues = {
  NbrMenages: '',
  NbrAbsents: '',
  NbrRefus: '',
  Adresse: '',
  maintype: '',
  soustype: '',
};
