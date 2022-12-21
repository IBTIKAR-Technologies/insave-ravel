import * as yup from 'yup';

export const schema = (t) => [
  {
    title: t('localite_name'),
    type: 'text',
    name: 'localeName',
    placeholder: t('localite_name'),
    order: 1,
  },
  {
    title: t('other_name'),
    type: 'text',
    name: 'otherName',
    placeholder: t('other_name'),
    order: 2,
  },
  {
    title: t('residence_type'),
    type: 'select',
    name: 'ID4',
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
    title: t('zone_rural_moyens'),
    type: 'select',
    name: 'ID5',
    label: t('zone_rural_moyens'),
    order: 3.1,
    depends: 'ID4',
    answer: 'Rural',
    options: [
      { label: t('nomad_pasto'), value: 'MR01' },
      { label: t('minie_pasto'), value: 'MR02' },
      { label: t('pasto_oas_oud'), value: 'MR03' },
      { label: t('lit_pech'), value: 'MR04' },
      { label: t('pasto_commerc'), value: 'MR05' },
      { label: t('trans_pasto'), value: 'MR06' },
      { label: t('agr_pasto'), value: 'MR07' },
      { label: t('flev_seneg'), value: 'MR08' },
      { label: t('cult_pulv'), value: 'MR09' },
    ],
  },
  {
    title: t('localite_status'),
    type: 'select',
    name: 'ID7',
    label: t('localite_status'),
    order: 4,
    options: [
      { label: t('permenent'), value: 'permenent' },
      { label: t('temporaire'), value: 'temporaire' },
    ],
  },
  {
    title: t('chef_comn_dist'),
    type: 'num',
    name: 'ID8',
    placeholder: t('chef_comn_dist'),
    order: 5,
  },
  {
    title: t('chef_mougha_dist'),
    type: 'num',
    name: 'ID9',
    placeholder: t('chef_mougha_dist'),
    order: 6,
  },
  {
    title: t('roude_dist'),
    type: 'num',
    name: 'ID10',
    placeholder: t('roude_dist'),
    order: 7,
  },
  {
    title: t('accessiblit_period'),
    type: 'num',
    name: 'ID11',
    placeholder: t('accessiblit_period'),
    order: 8,
  },
  {
    title: t('dominant_lang'),
    type: 'select',
    name: 'LPA',
    label: t('dominant_lang'),
    order: 9,
    options: [
      { label: t('arab'), value: 'arab' },
      { label: t('polar'), value: 'polar' },
      { label: t('sonik'), value: 'sonik' },
      { label: t('wolof'), value: 'wolof' },
    ],
  },
  {
    title: t('second_lang'),
    type: 'select',
    name: 'LPB',
    label: t('second_lang'),
    order: 10,
    options: [
      { label: t('arab'), value: 'arab' },
      { label: t('polar'), value: 'polar' },
      { label: t('sonik'), value: 'sonik' },
      { label: t('wolof'), value: 'wolof' },
      { label: t('none'), value: 'none' },
    ],
  },
  {
    title: t('activ_econom'),
    type: 'select',
    multiple: true,
    name: 'activEconom',
    label: t('activ_econom'),
    order: 11,
    options: [
      { label: t('dieri'), value: 'dieri' },
      { label: t('bas_fond'), value: 'bas_fond' },
      { label: t('irrigue'), value: 'irrigue' },
      { label: t('maraichage'), value: 'maraichage' },
      { label: t('walo'), value: 'walo' },
      { label: t('decrue'), value: 'decrue' },
      { label: t('culture_oas'), value: 'culture_oas' },
      { label: t('elevage'), value: 'elevage' },
      { label: t('peche'), value: 'peche' },
      { label: t('industrie'), value: 'industrie' },
      { label: t('mines'), value: 'mines' },
      { label: t('commerce'), value: 'commerce' },
      { label: t('others'), value: 'others' },
    ],
  },
];

export const formValidationSchema = t =>
  yup.object().shape({
    localeName: yup.string().required(`2) ${t('localite_name')}`),
    otherName: yup.string(),
    ID4: yup.string().required(`2) ${t('residence_type')}`),
    ID5: yup.string().when('ID4', {
      is: 'Rural',
      then: yup
        .string()
        .required(`3.1. ${t('zone_rural_moyens')}`)
    }),
    ID7: yup.string().required(`4) ${t('localite_status')}`),
    ID8: yup.string().required(`5) ${t('chef_comn_dist')}`),
    ID9: yup.string().required(`6) ${t('chef_mougha_dist')}`),
    ID10: yup.string().required(`7) ${t('roude_dist')}`),
    ID11: yup.string().required(`8) ${t('accessiblit_period')}`),
    LPA: yup.string().required(`9) ${t('dominant_lang')}`),
    LPB: yup
      .string()
      .required(`9) ${t('second_lang')}`)
      .when('LPA', (LPA, schema) =>
        schema.test({
          test: LPB => {
            console.log('LPA', LPA);
            console.log('LPB', LPB);
            return LPA?.slice(-1) !== LPB?.slice(-1);
          },
          message: t('languages_cant_be equal'),
        }),
      ),
    activEconom: yup.array().required(`10) ${t('activ_econom')}`),
  });

export const initialValues = {
  localeName: '',
  otherName: '',
  ID4: '',
  ID5: '',
  ID7: '',
  ID8: '',
  ID9: '',
  ID10: '',
  ID11: '',
  LPA: '',
  LPB: '',
  activEconom: [],
};
