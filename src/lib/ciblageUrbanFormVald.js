import * as yup from 'yup';

export const validationSchema = t =>
  yup.object({
    chefNameFr: yup
      .string()
      .required(`1. ${t('menag_chef_name')}`)
      .test('is_french', `1. ${t('must_be_french')}`, val =>
        /^[a-zàâçéèêëîïôûùüÿñæœ\-'/ .0-9]+$/i.test(val),
      ),
    familyNameFr: yup
      .string()
      .required(`2. ${t('chef_family_name')}`)
      .test('is_french', `2. ${t('must_be_french')}`, val =>
        /^[a-zàâçéèêëîïôûùüÿñæœ\-'/ .0-9]+$/i.test(val),
      ),
    chefNameAr: yup
      .string()
      .required(`3. ${t('menag_chef_name_ar')}`)
      .test('is_arabic', `3. ${t('must_be_arabic')}`, val =>
        /^[\u0621-\u064A\-'/ .0-9]+$/.test(val),
      ),
    familyNameAr: yup
      .string()
      .required(`4. ${t('chef_family_name_ar')}`)
      .test('is_arabic', `4. ${t('must_be_arabic')}`, val =>
        /^[\u0621-\u064A\-'/ .0-9]+$/.test(val),
      ),
    ChefEstEnrole: yup.string().required(`5. ${t('has_nni')}`),
    NNIChef: yup.string().when('ChefEstEnrole', {
      is: 'yes',
      then: yup
        .string()
        .required(`5.1. ${t('chef_nni')}`)
        .test(
          'is_nni',
          `5.1. ${t('must_be_nni')}`,
          nni => !Number.isNaN(nni) && parseInt(nni, 10) % 97 === 1 && nni.length === 10,
        ),
    }),
    Raisons: yup.string().when('ChefEstEnrole', {
      is: 'no',
      then: yup.string().required(`5.1. ${t('why_no_nni')}`),
    }),
    NomMereChef: yup
      .string()
      .required(`6. ${t('chef_menage_mom_name')}`)
      .min(2),
    TelChef: yup.string().test('is_phone', `7. ${t('must_be_phone')}`, val => {
      if (!val) return true;
      return !Number.isNaN(val) && /^(4|3|2)([0-9]{7})$/.test(val);
    }),
    NationaliteChef: yup.string().required(`8. ${t('chef_national')}`),
    ChefRefugie: yup.string().when('NationaliteChef', {
      is: natio => natio !== '6159e3d69182321f6506cad7',
      then: yup.string().required(`9. ${t('is_refugee')}`),
    }),
    NbrProGres: yup.string().when('ChefRefugie', {
      is: 'yes',
      then: yup.string().required(`9.1. ${t('refugee_number')}`),
    }),
    SexeChef: yup.string().required(`10. ${t('chef_sex')}`),
    AgeChef: yup
      .string()
      .required(`11. ${t('chef_age')}`)
      .when('SexeChef', (sex, schema) =>
        schema.test({
          test: age => {
            if (sex === 'male') {
              return age >= 18 && age <= 90;
            }
            if (sex === 'female') {
              return age >= 12 && age <= 90;
            }
          },
          message: `11. ${t('chef_age')}`,
        }),
      ),
    SituatMatrChef: yup.string().required(`12. ${t('chef_mariage_state')}`),
    NivEdChef: yup.string().required(`13. ${t('chef_education')}`),
    NbrMbrMen: yup
      .string()
      .required(`14. ${t('family_size')}`)
      .test(
        'is_number',
        `14. ${t('must_be_number')}`,
        val => /^(0|[1-9]\d*)$/.test(val) && parseInt(val, 10) > 0,
      )
      .when(['NbrMbrMenM', 'NbrMbrMenF'], (NbrMbrMenM, NbrMbrMenF, schema) =>
        schema.test({
          test: NbrMbrMen =>
            parseInt(NbrMbrMenF, 10) + parseInt(NbrMbrMenM, 10) === parseInt(NbrMbrMen, 10),
          message: `14. ${t('male_female_eq')}`,
        }),
      ),
    NbrMbrMenM: yup
      .string()
      .required(`14.1. ${t('family_male')}`)
      .test(
        'is_number',
        `14.1. ${t('must_be_number')}`,
        val => /^(0|[1-9]\d*)$/.test(val) && parseInt(val, 10) >= 0,
      ),
    NbrMbrMenF: yup
      .string()
      .required(`14.2. ${t('family_female')}`)
      .test(
        'is_number',
        `14.2. ${t('must_be_number')}`,
        val => /^(0|[1-9]\d*)$/.test(val) && parseInt(val, 10) >= 0,
      ),
    childrenLess2: yup
      .string()
      .required(`15. ${t('children_less_than_2')}`)
      .when(['NbrMbrMen'], (NbrMbrMen, schema) =>
        schema.test({
          test: childrenLess2 => parseInt(childrenLess2, 10) <= parseInt(NbrMbrMen, 10) - 1,
          message: `15. ${t('cant_be_more_tot')}`,
        }),
      ),
    children614: yup
      .string()
      .required(`16. ${t('children_614')}`)
      .test(
        'is_number',
        `16. ${t('must_be_number')}`,
        val => /^(0|[1-9]\d*)$/.test(val) && parseInt(val, 10) >= 0,
      )
      .when(['NbrMbrMen'], (NbrMbrMen, schema) =>
        schema.test({
          test: children614 => parseInt(children614, 10) <= parseInt(NbrMbrMen, 10) - 1,
          message: `16. ${t('cant_be_more_tot')}`,
        }),
      ),
    children614M: yup
      .string()
      .required(`16.1. ${t('children_614_m')}`)
      .test(
        'is_number',
        `16.1. ${t('must_be_number')}`,
        val => /^(0|[1-9]\d*)$/.test(val) && parseInt(val, 10) >= 0,
      )
      .when(['children614'], (children614, schema) =>
        schema.test({
          test: children614M => parseInt(children614M, 10) <= parseInt(children614, 10),
          message: `16.1. ${t('cat_m_6_14')}`,
        }),
      )
      .when(['children614F', 'children614'], (children614F, children614, schema) =>
        schema.test({
          test: children614M =>
            parseInt(children614M, 10) + parseInt(children614F, 10) === parseInt(children614, 10),
          message: `16. ${t('male_female_614_eq')}`,
        }),
      ),
    children614F: yup
      .string()
      .required(`16.2. ${t('children_614_f')}`)
      .test(
        'is_number',
        `16.2. ${t('must_be_number')}`,
        val => /^(0|[1-9]\d*)$/.test(val) && parseInt(val, 10) >= 0,
      )
      .when(['children614'], (children614, schema) =>
        schema.test({
          test: children614F => parseInt(children614F, 10) <= parseInt(children614, 10),
          message: `16.2. ${t('cat_m_6_14')}`,
        }),
      ),
    children614NoEduc: yup
      .string()
      .required(`17. ${t('children_6_14')}`)
      .test(
        'is_number',
        `17. ${t('must_be_number')}`,
        val => /^(0|[1-9]\d*)$/.test(val) && parseInt(val, 10) >= 0,
      )
      .when(['children614'], (children614, schema) =>
        schema.test({
          test: children614NoEduc => parseInt(children614NoEduc, 10) <= parseInt(children614, 10),
          message: `17. ${t('cat_m_6_14')}`,
        }),
      ),
    children614NoEducM: yup
      .string()
      .required(`17.1. ${t('children_6_14_m')}`)
      .test(
        'is_number',
        `17.1. ${t('must_be_number')}`,
        val => /^(0|[1-9]\d*)$/.test(val) && parseInt(val, 10) >= 0,
      )
      .when(['children614NoEduc'], (children614NoEduc, schema) =>
        schema.test({
          test: children614NoEducM =>
            parseInt(children614NoEducM, 10) <= parseInt(children614NoEduc, 10),
          message: `17.1. ${t('cant_be_more_tot')}`,
        }),
      )
      .when(
        ['children614NoEducF', 'children614NoEduc'],
        (children614NoEducF, children614NoEduc, schema) =>
          schema.test({
            test: children614NoEducM =>
              parseInt(children614NoEducM, 10) + parseInt(children614NoEducF, 10) ===
              parseInt(children614NoEduc, 10),
            message: `17. ${t('no_ed_male_female_eq')}`,
          }),
      ),
    children614NoEducF: yup
      .string()
      .required(`17.2. ${t('children_6_14_f')}`)
      .test(
        'is_number',
        `17.2. ${t('must_be_number')}`,
        val => /^(0|[1-9]\d*)$/.test(val) && parseInt(val, 10) >= 0,
      )
      .when(['children614NoEduc'], (children614NoEduc, schema) =>
        schema.test({
          test: children614NoEducF =>
            parseInt(children614NoEducF, 10) <= parseInt(children614NoEduc, 10),
          message: `17.2. ${t('cant_be_more_tot')}`,
        }),
      ),
    pregnantNum: yup
      .string()
      .required(`18. ${t('num_pregnant')}`)
      .test(
        'is_number',
        `18. ${t('must_be_number')}`,
        val => /^(0|[1-9]\d*)$/.test(val) && parseInt(val, 10) >= 0,
      )
      .when(['NbrMbrMen'], (NbrMbrMen, schema) =>
        schema.test({
          test: pregnantNum => parseInt(pregnantNum, 10) <= parseInt(NbrMbrMen, 10),
          message: `18. ${t('cant_be_more_tot')}`,
        }),
      ),
    nbrHandicap: yup
      .string()
      .required(`19. ${t('handicap')}`)
      .test('is_number', `19. ${t('must_be_number')}`, val => /^(0|[1-9]\d*)$/.test(val))
      .when(['NbrMbrMen'], (NbrMbrMen, schema) =>
        schema.test({
          test: nbrHandicap => parseInt(nbrHandicap, 10) <= parseInt(NbrMbrMen, 10),
          message: `19. ${t('cant_be_more_tot')}`,
        }),
      ),
    NbrMC: yup
      .string()
      .required(`20. ${t('cronic_illness')}`)
      .test('is_number', `20. ${t('must_be_number')}`, val => /^(0|[1-9]\d*)$/.test(val))
      .when(['NbrMbrMen'], (NbrMbrMen, schema) =>
        schema.test({
          test: NbrMC => parseInt(NbrMC, 10) <= parseInt(NbrMbrMen, 10),
          message: `20. ${t('cant_be_more_tot')}`,
        }),
      ),
    withRevenue: yup
      .string()
      .required(`21. ${t('with_revenue')}`)
      .test('is_number', `21. ${t('must_be_number')}`, val => /^(0|[1-9]\d*)$/.test(val))
      .when(['NbrMbrMen'], (NbrMbrMen, schema) =>
        schema.test({
          test: withRevenue => parseInt(withRevenue, 10) <= parseInt(NbrMbrMen, 10),
          message: `21. ${t('cant_be_more_tot')}`,
        }),
      ),
    habitTerre: yup.string().required(`23. ${t('habit_terre')}`),
    landSize: yup.string().when('habitTerre', {
      is: 'yes',
      then: yup.string().required(`23.1. ${t('land_size')}`),
    }),
    nonRegisteredNum: yup
      .string()
      .required(`24. ${t('num_non_registered')}`)
      .test('is_number', `24. ${t('must_be_number')}`, val => /^(0|[1-9]\d*)$/.test(val))
      .when(['NbrMbrMen'], (NbrMbrMen, schema) =>
        schema.test({
          test: nonRegisteredNum => parseInt(nonRegisteredNum, 10) <= parseInt(NbrMbrMen, 10),
          message: `24. ${t('cant_be_more_tot')}`,
        }),
      ),
    StatOccLog: yup.string().required(`25. ${t('housing_state')}`),
    housingType: yup.string().required(`26. ${t('housing_type')}`),
    roofMaterial: yup
      .string()
      .required(`27. ${t('roof_material')}`)
      .when(['housingType'], (housingType, schema) =>
        schema.test({
          test: roofMaterial =>
            ((housingType === 'villa' ||
              housingType === 'indepent_piece' ||
              housingType === 'normal_house') &&
              roofMaterial === 'ciment_beton') ||
            ((housingType === 'normalhousessemi' ||
              housingType === 'indepent_piece2' ||
              housingType === 'case' ||
              housingType === 'tent' ||
              housingType === 'barac') &&
              roofMaterial !== 'ciment_beton'),
          message: v => `27. (${t(housingType)}) ${t('roof_cant_be')}(${t(v.value)})`,
        }),
      ),
    wallMaterial: yup
      .string()
      .required(`28. ${t('wall_material')}`)
      .when(['housingType'], (housingType, schema) =>
        schema.test({
          test: wallMaterial =>
            ((housingType === 'villa' ||
              housingType === 'indepent_piece' ||
              housingType === 'normal_house') &&
              wallMaterial === 'ciment_beton') ||
            ((housingType === 'normalhousessemi' ||
              housingType === 'indepent_piece2' ||
              housingType === 'case' ||
              housingType === 'tent' ||
              housingType === 'barac') &&
              wallMaterial !== 'ciment_beton'),
          message: v => `28. (${t(housingType)}) ${t('wall_cant_be')}(${t(v.value)})`,
        }),
      ),
    floorMaterial: yup
      .string()
      .required(`29. ${t('floor_material')}`)
      .when(['housingType'], (housingType, schema) =>
        schema.test({
          test: floorMaterial => housingType === 'villa' && floorMaterial === 'carrelage',
          message: v => `28. (${t(housingType)}) ${t('sol_cant_be')}(${t(v.value)})`,
        }),
      ),
    NbrPieces: yup
      .string()
      .required(`30. ${t('num_rooms')}`)
      .test(
        'is_number',
        `30. ${t('must_be_number')}`,
        val => /^(0|[1-9]\d*)$/.test(val) && parseInt(val, 10) > 0,
      ),
    waterSource: yup.string().required(`31. ${t('water_source')}`),
    lightSource: yup.string().required(`32. ${t('light_source')}`),
    TypeLatr: yup.string().required(`33. ${t('toilet')}`),
    PSRDD: yup.string().required(`34. ${t('income_source_last_year')}`),
    AutrePSR: yup.string().when('PSRDD', {
      is: 'other',
      then: yup.string().required(`34.1. ${t('precise_income_source_last_year')}`),
    }),
    doYouHaveOneOrMore: yup
      .array()
      .required(`35. ${t('do_you_have_one_or_more')}`)
      .when(
        ['childrenLess2', 'children614NoEduc', 'pregnantNum', 'NbrMbrMen'],
        (childrenLess2, children614NoEduc, pregnantNum, NbrMbrMen, schema) =>
          schema.test({
            test: () =>
              parseInt(childrenLess2, 10) +
                parseInt(children614NoEduc, 10) +
                parseInt(pregnantNum, 10) <=
              parseInt(NbrMbrMen, 10),
            message: `15. 16. 18. ${t('cant_be_more_tot')}`,
          }),
      ),
    PSEC: yup.string().required(`36. ${t('energy_source_kitchen')}`),
    PersonnelMaison: yup.string().required(`37. ${t('home_servant')}`),
    benefitsFromServices: yup.array().required(`38. ${t('benefits_from_services')}`),
    AMSituatMen: yup.string().required(`39. ${t('eveluate_your_situation')}`),
    AASituatMen: yup.string().required(`40. ${t('animater_evaluation')}`),
    Repondant: yup.string().required(`41. ${t('podent_name')}`),
    AutreTel: yup.string().test('is_phone', `42. ${t('must_be_phone')}`, val => {
      if (!val) return true;
      return !Number.isNaN(val) && /^(4|3|2)([0-9]{7})$/.test(val);
    }),
  });
export const initialValues = {
  chefNameFr: '',
  chefNameAr: '',
  familyNameFr: '',
  familyNameAr: '',
  ChefEstEnrole: 'yes',
  NNIChef: '',
  Raisons: '',
  NomMereChef: '',
  TelChef: '',
  NationaliteChef: '6159e3d69182321f6506cad7',
  ChefRefugie: 'no',
  NbrProGres: '',
  AgeChef: '',
  SexeChef: '',
  SituatMatrChef: '',
  NivEdChef: '',
  NbrMbrMen: '',
  childrenLess2: '',
  pregnantNum: '',
  nbrHandicap: '',
  NbrMC: '',
  withRevenue: '',
  nonRegisteredNum: '',
  StatOccLog: '',
  housingType: '',
  NbrPieces: '',
  waterSource: '',
  lightSource: '',
  TypeLatr: '',
  PSRDD: '',
  AutrePSR: '',
  doYouHaveOneOrMore: [],
  PSEC: '',
  PersonnelMaison: '',
  benefitsFromServices: [],
  AMSituatMen: '',
  AASituatMen: '',
  Repondant: '',
  AutreTel: '',
  animals: '',
  camelin: '0',
  vache: '0',
  mouton: '0',
  chevre: '0',
  roofMaterial: '',
  wallMaterial: '',
  floorMaterial: '',
  habitTerre: '',
  landSize: '',
  children614: '0',
  children614M: '0',
  children614F: '0',
  children614NoEduc: '0',
  children614NoEducM: '0',
  children614NoEducF: '0',
};
