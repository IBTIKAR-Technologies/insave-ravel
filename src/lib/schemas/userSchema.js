import * as yup from 'yup';

export default function schema(t) {
  return [
    {
      title: t('user_name'),
      type: 'text',
      name: 'username',
      placeholder: t('user_name'),
      order: 1,
    },
    {
      title: t('password'),
      type: 'text',
      name: 'password',
      placeholder: t('password'),
      order: 2,
    },
    {
      title: t('phone_number'),
      name: 'phoneNumber',
      type: 'text',
      placeholder: t('phone_number'),
      order: 3,
    },
  ];
}

export const formValidationSchema = t =>
  yup.object().shape({
    username: yup.string().required(`1) ${t('user_name')}`),
    password: yup.string().required(`2) ${t('password')}`),
    phoneNumber: yup.string().required(`2) ${t('phone_number')}`),
  });

export const initialValues = {
  username: '',
  password: '',
  phoneNumber: '',
};
