import * as yup from 'yup';

export const localiteSchema = (t, communes) => {
  const newCommunes = communes.filter(c => c.value !== 'all');
  return [
    {
      title: t('name_fr'),
      type: 'text',
      name: 'namefr_rs',
      placeholder: t('name_fr'),
      order: 1,
    },
    {
      title: t('name_ar'),
      type: 'text',
      name: 'namear',
      placeholder: t('name_ar'),
      order: 2,
    },
    {
      title: t('residence_type'),
      type: 'select',
      name: 'type',
      label: t('residence_type'),
      order: 3,
      options: [
        {
          label: t('Urbain'),
          value: 'Urbain',
        },
        {
          label: t('Rural'),
          value: 'Rural',
        },
      ],
    },
    {
      title: t('commune'),
      type: 'select',
      name: 'communeId',
      placeholder: t('commune'),
      order: 4,
      options: newCommunes,
    },
  ];
};

export const validationSchema = t =>
  yup.object().shape({
    namefr_rs: yup
      .string()
      .required(`1. ${t('name_fr')}`)
      .test('is_fr', `1. ${t('must_be_fr')}`, val =>
        /^[a-zàâçéèêëîïôûùüÿñæœ\-\'\/ .0-9]+$/i.test(val),
      ),
    namear: yup
      .string()
      .required(`2. ${t('namear')}`)
      .test('is_ar', `2. ${t('must_be_ar')}`, val => /^[\u0621-\u064A\-\'\/ .0-9]+$/.test(val)),
    type: yup
      .string()
      .required(`3. ${t('residence_type')}`),
    communeId: yup.string().required(`4. ${t('commune')}`),
  });
