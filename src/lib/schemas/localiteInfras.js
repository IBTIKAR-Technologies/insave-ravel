import * as yup from 'yup';

export const schema = t => [
  {
    title: t('ecol_coran_num'),
    type: 'num',
    name: 'IV1E1',
    placeholder: t('ecol_coran_num'),
    order: 1,
  },
  {
    title: t('mahadr_num'),
    type: 'num',
    name: 'IV1E2',
    placeholder: t('mahadr_num'),
    order: 2,
  },
  {
    title: t('jardin_num'),
    type: 'num',
    name: 'IV1E3',
    placeholder: t('jardin_num'),
    order: 3,
  },
  {
    title: t('prim_complet_num'),
    type: 'num',
    name: 'IV1E4',
    placeholder: t('prim_complet_num'),
    order: 4,
  },
  {
    title: t('prim_complet_dist'),
    type: 'select',
    name: 'IV1E5',
    label: t('select_one'),
    depends: 'IV1E4',
    isPositif: true,
    order: '4.1',
    options: [
      { label: t('less_2km'), value: 'less_2km' },
      { label: t('less_5km'), value: 'less_5km' },
      { label: t('less_10km'), value: 'less_10km' },
      { label: t('more_10km'), value: 'more_10km' },
    ],
  },
  {
    title: t('prime_incomplet_num'),
    type: 'num',
    name: 'IV1E6',
    placeholder: t('prime_incomplet_num'),
    order: 5,
  },
  {
    title: t('prim_incomplet_dist'),
    type: 'select',
    name: 'IV1E7',
    label: t('select_one'),
    depends: 'IV1E6',
    isPositif: true,
    order: '5.1',
    options: [
      { label: t('less_2km'), value: 'less_2km' },
      { label: t('less_5km'), value: 'less_5km' },
      { label: t('less_10km'), value: 'less_10km' },
      { label: t('more_10km'), value: 'more_10km' },
    ],
  },
  {
    title: t('college_num'),
    type: 'num',
    name: 'IV1E8',
    placeholder: t('college_num'),
    order: 6,
  },
  {
    title: t('college_dist'),
    type: 'select',
    name: 'IV1E9',
    label: t('select_one'),
    depends: 'IV1E8',
    isPositif: true,
    order: '6.1',
    options: [
      { label: t('less_2km'), value: 'less_2km' },
      { label: t('less_5km'), value: 'less_5km' },
      { label: t('less_10km'), value: 'less_10km' },
      { label: t('more_10km'), value: 'more_10km' },
    ],
  },
  {
    title: t('lycee_num'),
    type: 'num',
    name: 'IV1E10',
    placeholder: t('lycee_num'),
    order: 7,
  },
  {
    title: t('lycee_dist'),
    type: 'select',
    name: 'IV1E11',
    label: t('select_one'),
    depends: 'IV1E10',
    isPositif: true,
    order: '7.1',
    options: [
      { label: t('less_2km'), value: 'less_2km' },
      { label: t('less_5km'), value: 'less_5km' },
      { label: t('less_10km'), value: 'less_10km' },
      { label: t('more_10km'), value: 'more_10km' },
    ],
  },
  {
    title: t('e_c_profesion_num'),
    type: 'num',
    name: 'IV1E12',
    placeholder: t('e_c_profesion_num'),
    order: 8,
  },
  {
    title: t('c_profes_dist'),
    type: 'select',
    name: 'IV1E13',
    label: t('select_one'),
    depends: 'IV1E12',
    isPositif: true,
    order: '8.1',
    options: [
      { label: t('less_2km'), value: 'less_2km' },
      { label: t('less_5km'), value: 'less_5km' },
      { label: t('less_10km'), value: 'less_10km' },
      { label: t('more_10km'), value: 'more_10km' },
    ],
  },
  {
    title: t('class_alphab_num'),
    type: 'num',
    name: 'IV1E14',
    placeholder: t('class_alphab_num'),
    order: 9,
  },
  {
    title: t('hospital_num'),
    type: 'num',
    name: 'IV2S7',
    placeholder: t('hospital_num'),
    order: 10,
  },
  {
    title: t('health_hospital_dist'),
    type: 'select',
    name: 'IV2S8',
    label: t('select_one'),
    depends: 'IV2S7',
    isPositif: true,
    order: '10.1',
    options: [
      { label: t('less_2km'), value: 'less_2km' },
      { label: t('less_5km'), value: 'less_5km' },
      { label: t('less_10km'), value: 'less_10km' },
      { label: t('more_10km'), value: 'more_10km' },
    ],
  },
  {
    title: t('health_centre_num'),
    type: 'num',
    name: 'IV2S5',
    placeholder: t('health_centre_num'),
    order: 11,
  },
  {
    title: t('health_center_dist'),
    type: 'select',
    name: 'IV2S6',
    label: t('select_one'),
    depends: 'IV2S5',
    isPositif: true,
    order: '11.1',
    options: [
      { label: t('less_2km'), value: 'less_2km' },
      { label: t('less_5km'), value: 'less_5km' },
      { label: t('less_10km'), value: 'less_10km' },
      { label: t('more_10km'), value: 'more_10km' },
    ],
  },
  {
    title: t('health_post_num'),
    type: 'num',
    name: 'IV2S3',
    placeholder: t('health_post_num'),
    order: 12,
  },
  {
    title: t('health_post_dist'),
    type: 'select',
    name: 'IV2S4',
    label: t('select_one'),
    depends: 'IV2S3',
    isPositif: true,
    order: '12.1',
    options: [
      { label: t('less_2km'), value: 'less_2km' },
      { label: t('less_5km'), value: 'less_5km' },
      { label: t('less_10km'), value: 'less_10km' },
      { label: t('more_10km'), value: 'more_10km' },
    ],
  },
  {
    title: t('health_unit_num'),
    type: 'num',
    name: 'IV2S1',
    placeholder: t('health_unit_num'),
    order: 13,
  },
  {
    title: t('health_unit_dist'),
    type: 'select',
    name: 'IV2S2',
    label: t('health_unit_dist'),
    depends: 'IV2S1',
    isPositif: true,
    order: '13.1',
    options: [
      { label: t('less_2km'), value: 'less_2km' },
      { label: t('less_5km'), value: 'less_5km' },
      { label: t('less_10km'), value: 'less_10km' },
      { label: t('more_10km'), value: 'more_10km' },
    ],
  },
  {
    title: t('pharmacy_num'),
    type: 'num',
    name: 'IV2S9',
    placeholder: t('pharmacy_num'),
    order: 14,
  },
  {
    title: t('cabinet_num'),
    type: 'num',
    name: 'IV2S11',
    placeholder: t('cabinet_num'),
    order: 15,
  },
  {
    title: t('clinic_num'),
    type: 'num',
    name: 'IV2S13',
    placeholder: t('clinic_num'),
    order: 16,
  },
  {
    title: t('puits_num'),
    type: 'num',
    name: 'puits',
    placeholder: t('puits_num'),
    order: 17,
  },
  {
    title: t('sondage_num'),
    type: 'num',
    name: 'sondage',
    placeholder: t('sondage_num'),
    order: 18,
  },
  {
    title: t('brone_num'),
    type: 'num',
    name: 'brone',
    placeholder: t('brone_num'),
    order: 19,
  },
  {
    title: t('aep_line_num'),
    type: 'num',
    name: 'AEP',
    placeholder: t('aep_line_num'),
    order: 20,
  },
  {
    title: t('SNDE'),
    type: 'select',
    name: 'SNDE',
    label: t('select_one'),
    order: 21,
    options: [
      { label: t('yes'), value: 'yes' },
      { label: t('no'), value: 'no' },
    ],
  },
  {
    title: t('electric_line'),
    type: 'select',
    name: 'electricLine',
    label: t('select_one'),
    order: 22,
    options: [
      { label: t('yes'), value: 'yes' },
      { label: t('no'), value: 'no' },
    ],
  },
  {
    title: t('solar'),
    type: 'num',
    name: 'solar',
    placeholder: t('solar'),
    order: 23,
  },
  {
    title: t('mosq_num'),
    type: 'num',
    name: 'mosqNum',
    placeholder: t('mosq_num'),
    order: 24,
  },
  {
    title: t('youn_house_num'),
    type: 'num',
    name: 'younHouseNum',
    placeholder: t('youn_house_num'),
    order: 25,
  },
  {
    title: t('CFPF_num'),
    type: 'num',
    name: 'CFPFNum',
    placeholder: t('CFPF_num'),
    order: 26,
  },
  {
    title: t('stad_num'),
    type: 'num',
    name: 'stadNum',
    placeholder: t('stad_num'),
    order: 27,
  },
  {
    title: t('store'),
    type: 'num',
    name: 'store',
    placeholder: t('store'),
    order: 28,
  },
  {
    title: t('hebdo'),
    type: 'num',
    name: 'hebdo',
    placeholder: t('hebdo'),
    order: 29,
  },
  {
    title: t('betail'),
    type: 'num',
    name: 'betail',
    placeholder: t('betail'),
    order: 30,
  },
  {
    title: t('bettoir'),
    type: 'num',
    name: 'bettoir',
    placeholder: t('bettoir'),
    order: 31,
  },
  {
    title: t('parc_vaccination'),
    type: 'num',
    name: 'parcVaccination',
    placeholder: t('parc_vaccination'),
    order: 32,
  },
  {
    title: t('veterin'),
    type: 'num',
    name: 'veterin',
    placeholder: t('veterin'),
    order: 33,
  },
  {
    title: t('station'),
    type: 'num',
    name: 'station',
    placeholder: t('station'),
    order: 34,
  },
  {
    title: t('hotel'),
    type: 'num',
    name: 'hotel',
    placeholder: t('hotel'),
    order: 35,
  },
];

export const formValidationSchema = t =>
  yup.object().shape({
    IV1E1: yup.string().required(`1) ${t('ecol_coran_num')}`),
    IV1E2: yup.string().required(`2) ${t('mahadr_num')}`),
    IV1E3: yup.string().required(`3) ${t('jardin_num')}`),
    IV1E4: yup.string().required(`4) ${t('prim_complet_num')}`),
    IV1E6: yup.string().required(`5) ${t('prime_incomplet_num')}`),
    IV1E8: yup.string().required(`6) ${t('college_num')}`),
    IV1E10: yup.string().required(`7) ${t('lycee_num')}`),
    IV1E12: yup.string().required(`8) ${t('e_c_profesion_num')}`),
    IV1E14: yup.string().required(`9) ${t('class_alphab_num')}`),
    IV2S7: yup.string().required(`10) ${t('hospital_num')}`),
    IV2S5: yup.string().required(`11) ${t('health_centre_num')}`),
    IV2S3: yup.string().required(`12) ${t('health_post_num')}`),
    IV2S1: yup.string().required(`13) ${t('health_unit_num')}`),
    IV2S9: yup.string().required(`14) ${t('pharmacy_num')}`),
    IV2S11: yup.string().required(`15') ${t('cabinet_num')}`),
    IV2S13: yup.string().required(`16) ${t('clinic_num')}`),
    puits: yup.string().required(`17) ${t('puits_num')}`),
    sondage: yup.string().required(`18) ${t('sondage_num')}`),
    brone: yup.string().required(`19) ${t('brone_num')}`),
    AEP: yup.string().required(`20) ${t('aep_line_num')}`),
    SNDE: yup.string().required(`21) ${t('SNDE')}`),
    electricLine: yup.string().required(`22) ${t('electric_line')}`),
    solar: yup.string().required(`23) ${t('solar')}`),
    mosqNum: yup.string().required(`24) ${t('mosq_num')}`),
    younHouseNum: yup.string().required(`25) ${t('youn_house_num')}`),
    CFPFNum: yup.string().required(`26) ${t('CFPF_num')}`),
    stadNum: yup.string().required(`27) ${t('stad_num')}`),
    store: yup.string().required(`28) ${t('store')}`),
    hebdo: yup.string().required(`29) ${t('hebdo')}`),
    betail: yup.string().required(`30) ${t('betail')}`),
    bettoir: yup.string().required(`31) ${t('bettoir')}`),
    parcVaccination: yup.string().required(`32) ${t('parc_vaccination')}`),
    veterin: yup.string().required(`33) ${t('veterin')}`),
    station: yup.string().required(`34) ${t('station')}`),
    hotel: yup.string().required(`35) ${t('hotel')}`),
    IV1E5: yup.string().when('IV1E4', {
      is: val => !Number.isNaN(val) && parseInt(val, 10) <= 0,
      then: yup.string().required(`4.1) ${t('prim_complet_dist')}`),
    }),
    IV1E7: yup.string().when('IV1E6', {
      is: val => !Number.isNaN(val) && parseInt(val, 10) <= 0,
      then: yup.string().required(`5.1) ${t('prim_incomplet_dist')}`),
    }),
    IV1E9: yup.string().when('IV1E8', {
      is: val => !Number.isNaN(val) && parseInt(val, 10) <= 0,
      then: yup.string().required(`6.1) ${t('college_dist')}`),
    }),
    IV1E11: yup.string().when('IV1E10', {
      is: val => !Number.isNaN(val) && parseInt(val, 10) <= 0,
      then: yup.string().required(`7.1) ${t('lycee_dist')}`),
    }),
    IV1E13: yup.string().when('IV1E12', {
      is: val => !Number.isNaN(val) && parseInt(val, 10) <= 0,
      then: yup.string().required(`8.1) ${t('c_profes_dist')}`),
    }),
    IV2S8: yup.string().when('IV2S7', {
      is: val => !Number.isNaN(val) && parseInt(val, 10) <= 0,
      then: yup.string().required(`10.1) ${t('health_hospital_dist')}`),
    }),
    IV2S6: yup.string().when('IV2S5', {
      is: val => !Number.isNaN(val) && parseInt(val, 10) <= 0,
      then: yup.string().required(`11.1) ${t('health_center_dist')}`),
    }),
    IV2S4: yup.string().when('IV2S1', {
      is: val => !Number.isNaN(val) && parseInt(val, 10) <= 0,
      then: yup.string().required(`12.1) ${t('health_post_dist')}`),
    }),
    IV2S2: yup.string().when('IV2S1', {
      is: val => !Number.isNaN(val) && parseInt(val, 10) <= 0,
      then: yup.string().required(`13.1) ${t('health_unit_dist')}`),
    }),
  });

export const initialValues = {
  IV1E1: '',
  IV1E2: '',
  IV1E3: '',
  IV1E4: '',
  IV1E5: '',
  IV1E6: '',
  IV1E7: '',
  IV1E8: '',
  IV1E9: '',
  IV1E10: '',
  IV1E11: '',
  IV1E12: '',
  IV1E13: '',
  IV1E14: '',
  IV2S1: '',
  IV2S2: '',
  IV2S3: '',
  IV2S4: '',
  IV2S5: '',
  IV2S6: '',
  IV2S7: '',
  IV2S8: '',
  IV2S9: '',
  IV2S10: '',
  IV2S11: '',
  IV2S12: '',
  IV2S13: '',
  IV2S14: '',
  puits: '',
  sondage: '',
  brone: '',
  AEP: '',
  SNDE: '',
  electricLine: '',
  solar: '',
  mosqNum: '',
  younHouseNum: '',
  CFPFNum: '',
  stadNum: '',
  store: '',
  hebdo: '',
  betail: '',
  bettoir: '',
  parcVaccination: '',
  veterin: '',
  station: '',
  hotel: '',
};
