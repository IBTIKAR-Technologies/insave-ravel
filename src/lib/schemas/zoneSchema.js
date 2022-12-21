import * as yup from 'yup';

export const zoneSchema = t => {
  return [
    {
      title: t('name_fr'),
      type: 'text',
      name: 'namefr',
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
  ];
};

export const validationSchema = t =>
  yup.object().shape({
    namefr: yup
      .string()
      .required(`1. ${t('name_fr')}`)
      .test('is_fr', `1. ${t('must_be_fr')}`, val =>
        /^[a-zàâçéèêëîïôûùüÿñæœ\-\'\/ .0-9]+$/i.test(val),
      ),
    namear: yup
      .string()
      .required(`2. ${t('namear')}`)
      .test('is_ar', `2. ${t('must_be_ar')}`, val => /^[\u0621-\u064A\-\'\/ .0-9]+$/.test(val)),
  });
