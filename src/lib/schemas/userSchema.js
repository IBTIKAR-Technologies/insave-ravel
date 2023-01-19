import * as yup from 'yup';

export default function schema(t, role, categorie) {
  const result = [
    // {
    //   title: t('user_name'),
    //   type: 'text',
    //   name: 'username',
    //   placeholder: t('user_name'),
    //   order: 1,
    // },
    // {
    //   title: t('password'),
    //   type: 'num',
    //   name: 'password',
    //   placeholder: t('password'),
    //   order: 2,
    // },
    {
      title: t('phone_number'),
      name: 'phoneNumber',
      type: 'num',
      placeholder: t('phone_number'),
      order: 1,
    },
  ];

  if (role === "admin") {
    if (categorie !== "initiative") {
      result.push(
        {
          title: t('categorie'),
          name: 'categorie',
          type: 'select',
          placeholder: t('select_one'),
          label: t('select_one'),
          order: 2,
          disabled: !!categorie,
          options: [
            {
              label: t('parti'),
              value: 'parti',
            },
            {
              label: t('initiative'),
              value: 'initiative',
            },
            {
              label: t('mouvement'),
              value: 'mouvement',
            },
            {
              label: t('societecivile'),
              value: 'societecivile',
            },
            {
              label: t('orgprofessionnel'),
              value: 'orgprofessionnel',
            },
          ],
        },
        {
          title: t('categorie_details'),
          name: 'categorieDetails',
          type: 'text',
          placeholder: t('categorie_details'),
          order: 3,
        },
      );
    } else {
      result.push(
        {
          title: t('categorie'),
          name: 'categorie',
          type: 'select',
          placeholder: t('select_one'),
          label: t('select_one'),
          order: 2,
          disabled: !!categorie,
          options: [
            {
              label: t('parti'),
              value: 'parti',
            },
            {
              label: t('initiative'),
              value: 'initiative',
            },
            {
              label: t('mouvement'),
              value: 'mouvement',
            },
            {
              label: t('societecivile'),
              value: 'societecivile',
            },
            {
              label: t('orgprofessionnel'),
              value: 'orgprofessionnel',
            },
          ],
        },
        {
          title: t('code_initiative'),
          name: 'codeInitiative',
          type: 'text',
          placeholder: t('code_initiative'),
          order: 3,
        },
        {
          title: t('name_initiative'),
          name: 'nameInitiative',
          type: 'text',
          placeholder: t('name_initiative'),
          order: 4,
        },
      );
    }
  }
  return result;
}

export const formValidationSchema = t =>
  yup.object().shape({
    phoneNumber: yup.string().required(`2) ${t('phone_number')}`),
  });

export const initialValues = {
  phoneNumber: '',
  categorie: '',
  categorieDetails: '',
};
