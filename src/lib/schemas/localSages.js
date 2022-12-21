import * as yup from 'yup';

export const schema = t => [
  {
    title: t('first_name'),
    type: 'text',
    name: 'prenom',
    placeholder: t('first_name'),
    order: 1,
  },
  {
    title: t('namef'),
    type: 'text',
    name: 'nom',
    placeholder: t('namef'),
    order: 2,
  },
  {
    title: t('sex'),
    type: 'select',
    name: 'sex',
    label: t('sex'),
    options: [
      { label: t('male'), value: 'male' },
      { label: t('female'), value: 'female' },
    ],
    order: 3,
  },
  {
    title: t('nni'),
    type: 'num',
    name: 'NNI',
    placeholder: t('nni'),
    order: 4,
  },
  {
    title: t('tel'),
    type: 'num',
    name: 'Tel',
    placeholder: t('tel'),
    order: 5,
  },
];

export const formValidationSchema = t =>
  yup.object().shape({
    prenom: yup.string().required(`1) ${t('first_name')}`),
    nom: yup.string().required(`2) ${t('namef')}`),
    sex: yup.string().required(`3) ${t('sex')}`),
    NNI: yup.string().required(`4) ${t('nni')}`).test(
      'is_nni',
      `4. ${t('must_be_nni')}`,
      nni => !Number.isNaN(nni) && nni % 97 === 1 && nni.length === 10,
    ),
    Tel: yup.string().required(`5) ${t('tel')}`).test('is_phone', `5. ${t('must_be_phone')}`, val => !Number.isNaN(val) && /^(4|3|2)([0-9]{7})$/.test(val)),
  });
export const initialValues = {
  firstName: '',
  name: '',
  sex: '',
  NNI: '',
  Tel: '',
};
