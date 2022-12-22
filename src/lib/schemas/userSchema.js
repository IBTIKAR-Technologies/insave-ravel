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
  ];
}

export const formValidationSchema = t =>
  yup.object().shape({
    username: yup.string().required(`1) ${t('user_name')}`),
    password: yup.string().required(`2) ${t('password')}`),
  });

export const initialValues = {
  username: '',
  password: '',
};
