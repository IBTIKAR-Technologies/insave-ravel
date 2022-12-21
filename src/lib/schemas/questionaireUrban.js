export default function qutionaireUban(t, countries) {
  return [
    {
      title: t('menag_chef_name'),
      type: 'text',
      name: 'chefNameFr',
      placeholder: t('menag_chef_name'),
      order: 1,
    },
    {
      title: t('chef_family_name'),
      type: 'text',
      name: 'familyNameFr',
      placeholder: t('chef_family_name'),
      order: 2,
    },
    {
      title: t('menag_chef_name_ar'),
      type: 'text',
      name: 'chefNameAr',
      placeholder: t('menag_chef_name_ar'),
      order: 3,
    },
    {
      title: t('chef_family_name_ar'),
      type: 'text',
      name: 'familyNameAr',
      placeholder: t('chef_family_name_ar'),
      order: 4,
    },
    {
      title: t('has_nni'),
      type: 'select',
      name: 'ChefEstEnrole',
      label: t('select_one'),
      options: [
        {
          label: t('yes'),
          value: 'yes',
        },
        {
          label: t('no'),
          value: 'no',
        },
        {
          label: t('yes_no_nni'),
          value: 'yesNo',
        },
      ],
      order: 5,
    },
    {
      title: t('nni_number'),
      type: 'num',
      name: 'NNIChef',
      depends: 'ChefEstEnrole',
      answer: 'yes',
      placeholder: t('nni_number'),
      order: 5.1,
    },
    {
      title: t('why_no_nni'),
      type: 'text',
      name: 'Raisons',
      depends: 'ChefEstEnrole',
      answer: 'no',
      placeholder: t('why_no_nni'),
      order: 5.1,
    },
    {
      title: t('chef_menage_mom_name'),
      type: 'text',
      name: 'NomMereChef',
      placeholder: t('chef_menage_mom_name'),
      order: 6,
    },
    {
      title: t('tel_chef'),
      type: 'num',
      name: 'TelChef',
      placeholder: t('tel_chef'),
      order: 7,
    },
    {
      title: t('chef_national'),
      type: 'select',
      name: 'NationaliteChef',
      label: t('select_one'),
      options: countries,
      order: 8,
      searchable: true,
    },
    {
      title: t('is_refugee'),
      type: 'select',
      name: 'ChefRefugie',
      label: t('select_one'),
      notAnswer: '6159e3d69182321f6506cad7',
      depends: 'NationaliteChef',
      options: [
        {
          label: t('yes'),
          value: 'yes',
        },
        {
          label: t('no'),
          value: 'no',
        },
      ],
      order: 9,
    },
    {
      title: t('refugee_number'),
      type: 'text',
      name: 'NbrProGres',
      depends: 'ChefRefugie',
      answer: 'yes',
      placeholder: t('refugee_number'),
      order: 9.1,
    },
    {
      title: t('chef_sex'),
      type: 'select',
      name: 'SexeChef',
      label: t('select_one'),
      options: [
        {
          label: t('male'),
          value: 'male',
        },
        {
          label: t('female'),
          value: 'female',
        },
      ],
      order: 10,
    },
    {
      title: t('chef_age'),
      type: 'num',
      name: 'AgeChef',
      placeholder: t('chef_age'),
      order: 11,
    },
    {
      title: t('chef_mariage_state'),
      type: 'select',
      name: 'SituatMatrChef',
      label: t('select_one'),
      options: [
        {
          label: t('single'),
          value: 'single',
        },
        {
          label: t('maried'),
          value: 'maried',
        },
        {
          label: t('divorced'),
          value: 'divorced',
        },
        {
          label: t('widowed'),
          value: 'widowed',
        },
      ],
      order: 12,
    },
    {
      title: t('chef_education'),
      type: 'select',
      name: 'NivEdChef',
      label: t('select_one'),
      options: [
        {
          label: t('none'),
          value: 'none',
        },
        {
          label: t('coran'),
          value: 'coran',
        },
        {
          label: t('marhdara'),
          value: 'marhdara',
        },
        {
          label: t('primary'),
          value: 'primary',
        },
        {
          label: t('secondary'),
          value: 'secondary',
        },
        {
          label: t('highschool'),
          value: 'highschool',
        },
        {
          label: t('university'),
          value: 'university',
        },
      ],
      order: 13,
    },
    {
      title: t('family_size'),
      type: 'num',
      name: 'NbrMbrMen',
      placeholder: t('family_size'),
      order: 14,
    },
    {
      title: t('family_male'),
      type: 'num',
      name: 'NbrMbrMenM',
      placeholder: t('family_male'),
      order: 14.1,
    },
    {
      title: t('family_female'),
      type: 'num',
      name: 'NbrMbrMenF',
      placeholder: t('family_female'),
      order: 14.2,
    },
    {
      title: t('children_less_than_2'),
      type: 'num',
      name: 'childrenLess2',
      placeholder: t('children_less_than_2'),
      order: 15,
    },
    {
      order: Math.random(),
    },
    {
      title: t('children_614'),
      type: 'num',
      name: 'children614',
      placeholder: t('children_614'),
      order: 16,
    },
    {
      title: t('children_614_m'),
      type: 'num',
      name: 'children614M',
      placeholder: t('children_614_m'),
      order: 16.1,
    },
    {
      title: t('children_614_f'),
      type: 'num',
      name: 'children614F',
      placeholder: t('children_614_f'),
      order: 16.2,
    },
    {
      title: t('children_6_14'),
      type: 'num',
      name: 'children614NoEduc',
      placeholder: t('children_6_14'),
      order: 17,
    },
    {
      title: t('children_6_14_m'),
      type: 'num',
      name: 'children614NoEducM',
      placeholder: t('children_6_14_m'),
      order: 17.1,
    },
    {
      title: t('children_6_14_f'),
      type: 'num',
      name: 'children614NoEducF',
      placeholder: t('children_6_14_f'),
      order: 17.2,
    },
    {
      title: t('num_pregnant'),
      type: 'num',
      name: 'pregnantNum',
      placeholder: t('num_pregnant'),
      order: 18,
    },
    {
      title: t('handicap'),
      type: 'num',
      name: 'nbrHandicap',
      placeholder: t('handicap'),
      order: 19,
    },
    {
      title: t('cronic_illness'),
      type: 'num',
      name: 'NbrMC',
      placeholder: t('cronic_illness'),
      order: 20,
    },
    {
      title: t('with_revenue'),
      type: 'num',
      name: 'withRevenue',
      placeholder: t('with_revenue'),
      order: 21,
    },
    {
      title: t('animals'),
      type: 'subtitle',
      name: 'animals',
    },
    {
      title: t('camelin'),
      type: 'num',
      name: 'camelin',
      placeholder: t('camelin'),
      order: 1,
    },
    {
      title: t('vache'),
      type: 'num',
      name: 'vache',
      placeholder: t('vache'),
      order: 2,
    },
    {
      title: t('mouton'),
      type: 'num',
      name: 'mouton',
      placeholder: t('mouton'),
      order: 3,
    },
    {
      title: t('chevre'),
      type: 'num',
      name: 'chevre',
      placeholder: t('chevre'),
      order: 4,
    },
    {
      title: t('habit_terre'),
      type: 'select',
      name: 'habitTerre',
      label: t('select_one'),
      options: [
        {
          label: t('yes'),
          value: 'yes',
        },
        {
          label: t('no'),
          value: 'no',
        },
      ],
      order: 23,
    },
    {
      title: t('land_size'),
      type: 'num',
      name: 'landSize',
      placeholder: t('land_size'),
      order: 23.1,
      depends: 'habitTerre',
      answer: 'yes',
    },
    {
      title: t('num_non_registered'),
      type: 'num',
      name: 'nonRegisteredNum',
      placeholder: t('num_non_registered'),
      order: 24,
    },
    {
      title: t('housing_state'),
      type: 'select',
      name: 'StatOccLog',
      label: t('select_one'),
      options: [
        {
          label: t('own'),
          value: 'own',
        },
        {
          label: t('rent'),
          value: 'rent',
        },
        {
          label: t('free_housing'),
          value: 'free_housing',
        },
        {
          label: t('appropriation'),
          value: 'appropriation',
        },
      ],
      order: 25,
    },
    {
      title: t('housing_type'),
      type: 'select',
      name: 'housingType',
      label: t('select_one'),
      options: [
        {
          label: t('big_house'),
          value: 'big_house',
        },
        {
          label: t('villa'),
          value: 'villa',
        },
        {
          label: t('normal_house'),
          value: 'normal_house',
        },
        {
          label: t('normalhousessemi'),
          value: 'normalhousessemi',
        },
        {
          label: t('houseClay'),
          value: 'houseClay',
        },
        {
          label: t('apartment'),
          value: 'apartment',
        },
        {
          label: t('indepent_piece'),
          value: 'indepent_piece',
        },
        {
          label: t('indepent_piece2'),
          value: 'indepent_piece2',
        },
        {
          label: t('indepent_piece3'),
          value: 'indepent_piece3',
        },
        {
          label: t('mbar'),
          value: 'mbar',
        },
        {
          label: t('barac'),
          value: 'barac',
        },
        {
          label: t('case'),
          value: 'case',
        },
        {
          label: t('tent'),
          value: 'tent',
        },
      ],
      order: 26,
    },
    {
      title: t('roof_material'),
      type: 'select',
      name: 'roofMaterial',
      label: t('select_one'),
      options: [
        {
          label: t('terre'),
          value: 'terre',
        },
        {
          label: t('paille'),
          value: 'paille',
        },
        {
          label: t('bois'),
          value: 'bois',
        },
        {
          label: t('toles_zinc'),
          value: 'toles_zinc',
        },
        {
          label: t('ciment_beton'),
          value: 'ciment_beton',
        },
        {
          label: t('tissu'),
          value: 'tissu',
        },
      ],
      order: 27,
    },
    {
      title: t('wall_material'),
      type: 'select',
      name: 'wallMaterial',
      label: t('select_one'),
      options: [
        {
          label: t('terre'),
          value: 'terre',
        },
        {
          label: t('piere'),
          value: 'piere',
        },
        {
          label: t('brique'),
          value: 'brique',
        },
        {
          label: t('ciment_beton'),
          value: 'ciment_beton',
        },
        {
          label: t('bois'),
          value: 'bois',
        },
        {
          label: t('zinc'),
          value: 'zinc',
        },
        {
          label: t('tole_metal'),
          value: 'tole_metal',
        },
        {
          label: t('no_walls'),
          value: 'no_walls',
        },
      ],
      order: 28,
    },
    {
      title: t('floor_material'),
      type: 'select',
      name: 'floorMaterial',
      label: t('select_one'),
      options: [
        {
          label: t('terre'),
          value: 'terre',
        },
        {
          label: t('ciment_beton'),
          value: 'ciment_beton',
        },
        {
          label: t('carrelage'),
          value: 'carrelage',
        },
      ],
      order: 29,
    },
    {
      title: t('num_rooms'),
      type: 'num',
      name: 'NbrPieces',
      placeholder: t('num_rooms'),
      order: 30,
    },
    {
      title: t('water_source'),
      type: 'select',
      label: t('select_one'),
      name: 'waterSource',
      options: [
        {
          label: t('house_robin'),
          value: 'house_robin',
        },
        {
          label: t('neighbor_robin'),
          value: 'neighbor_robin',
        },
        {
          label: t('public_robin'),
          value: 'public_robin',
        },
        {
          label: t('citerne'),
          value: 'citerne',
        },
        {
          label: t('charrete'),
          value: 'charrete',
        },
        {
          label: t('puit'),
          value: 'puit',
        },
        {
          label: t('mar'),
          value: 'mar',
        },
        {
          label: t('fleuve'),
          value: 'fleuve',
        },
        {
          label: t('pluie'),
          value: 'pluie',
        },
      ],
      order: 31,
    },
    {
      title: t('light_source'),
      type: 'select',
      name: 'lightSource',
      label: t('select_one'),
      options: [
        {
          label: t('candle_torch'),
          value: 'candle_torch',
        },
        {
          label: t('neighbor_cable'),
          value: 'neighbor_cable',
        },
        {
          label: t('solar_panel'),
          value: 'solar_panel',
        },
        {
          label: t('electricity_network'),
          value: 'electricity_network',
        },
        {
          label: t('elect_generator'),
          value: 'elect_generator',
        },
        {
          label: t('b_collectif'),
          value: 'bCollectif',
        },
      ],
      order: 32,
    },
    {
      title: t('toilet'),
      type: 'select',
      name: 'TypeLatr',
      label: t('select_one'),
      options: [
        {
          label: t('traditional_toilet'),
          value: 'traditional_toilet',
        },
        {
          label: t('modern_toilet'),
          value: 'modern_toilet',
        },
        {
          label: t('baril'),
          value: 'baril',
        },
        {
          label: t('nature'),
          value: 'nature',
        },
      ],
      order: 33,
    },
    {
      title: t('income_source_last_year'),
      type: 'select',
      name: 'PSRDD',
      label: t('select_one'),
      options: [
        {
          label: t('agriculture'),
          value: 'agriculture',
        },
        {
          label: t('breeding'),
          value: 'breeding',
        },
        {
          label: t('commerce'),
          value: 'commerce',
        },
        {
          label: t('fishing'),
          value: 'fishing',
        },
        {
          label: t('mine'),
          value: 'mine',
        },
        {
          label: t('informal_salary'),
          value: 'informalsalary',
        },
        {
          label: t('drudgery'),
          value: 'drudgery',
        },
        {
          label: t('formal_salary'),
          value: 'formalsalary',
        },
        {
          label: t('daily_wage'),
          value: 'dailywage',
        },
        {
          label: t('retirement'),
          value: 'retirement',
        },
        {
          label: t('help_gift'),
          value: 'helpgift',
        },
        {
          label: t('cueillette'),
          value: 'cueillette',
        },
        {
          label: t('other'),
          value: 'other',
        },
      ],
      order: 34,
    },
    {
      title: t('precise_income_source_last_year'),
      type: 'text',
      name: 'AutrePSR',
      depends: 'PSRDD',
      answer: 'other',
      placeholder: t('precise_income_source_last_year'),
      order: 34.1,
    },
    {
      title: t('do_you_have_one_or_more'),
      type: 'select',
      name: 'doYouHaveOneOrMore',
      multiple: true,
      label: t('select_what_applies'),
      options: [
        {
          label: t('PossRefr'),
          value: 'PossRefr',
        },
        {
          label: t('PossCuisMod'),
          value: 'PossCuisMod',
        },
        {
          label: t('PossClim'),
          value: 'PossClim',
        },
        {
          label: t('PossGrpElectr'),
          value: 'PossGrpElectr',
        },
        {
          label: t('PossChauffeEau'),
          value: 'PossChauffeEau',
        },
        {
          label: t('PossMachLaver'),
          value: 'PossMachLaver',
        },
        {
          label: t('PossVoit'),
          value: 'PossVoit',
        },
        {
          label: t('PossLit'),
          value: 'PossLit',
        },
        {
          label: t('PossTele'),
          value: 'PossTele',
        },
        {
          label: t('PossPirogBat'),
          value: 'PossPirogBat',
        },
        {
          label: t('PossFer'),
          value: 'PossFer',
        },
        {
          label: t('PossMoto'),
          value: 'PossMoto',
        },
        {
          label: t('PossSmartPhone'),
          value: 'PossSmartPhone',
        },
      ],
      order: 35,
    },
    {
      title: t('energy_source_kitchen'),
      type: 'select',
      name: 'PSEC',
      label: t('select_one'),
      options: [
        {
          label: t('colected_wood'),
          value: 'colected_wood',
        },
        {
          label: t('bought_wood'),
          value: 'bought_wood',
        },
        {
          label: t('wood_charcoal'),
          value: 'wood_charcoal',
        },
        {
          label: t('gaz'),
          value: 'gaz',
        },
        {
          label: t('electricity'),
          value: 'electricity',
        },
      ],
      order: 36,
    },
    {
      title: t('home_servant'),
      type: 'select',
      name: 'PersonnelMaison',
      label: t('select_one'),
      options: [
        {
          label: t('yes'),
          value: 'yes',
        },
        {
          label: t('no'),
          value: 'no',
        },
      ],
      order: 37,
    },
    {
      title: t('benefits_from_services'),
      type: 'select',
      name: 'benefitsFromServices',
      multiple: true,
      label: t('select_what_applies'),
      options: [
        {
          label: t('taazour_boutique'),
          value: 'taazour_boutique',
        },
        {
          label: t('sndp'),
          value: 'sndp',
        },
        {
          label: t('masef'),
          value: 'masef',
        },
        {
          label: t('csa'),
          value: 'csa',
        },
        {
          label: t('ong_nationale'),
          value: 'ong_nationale',
        },
        {
          label: t('ong_internationale'),
          value: 'ong_internationale',
        },
        {
          label: t('tekavoul_cache'),
          value: 'tekavoul_cache',
        },
      ],
      order: 38,
    },
    {
      title: t('eveluate_your_situation'),
      type: 'select',
      name: 'AMSituatMen',
      label: t('select_one'),
      options: [
        {
          label: t('so_poor'),
          value: 'so_poor',
        },
        {
          label: t('poor'),
          value: 'poor',
        },
        {
          label: t('average'),
          value: 'average',
        },
        {
          label: t('wealthy'),
          value: 'wealthy',
        },
        {
          label: t('so_wealthy'),
          value: 'so_wealthy',
        },
      ],
      order: 39,
    },
    {
      title: t('animater_evaluation'),
      type: 'select',
      name: 'AASituatMen',
      label: t('select_one'),
      options: [
        {
          label: t('so_poor'),
          value: 'so_poor',
        },
        {
          label: t('poor'),
          value: 'poor',
        },
        {
          label: t('average'),
          value: 'average',
        },
        {
          label: t('wealthy'),
          value: 'wealthy',
        },
        {
          label: t('so_wealthy'),
          value: 'so_wealthy',
        },
      ],
      order: 40,
    },
    {
      title: t('podent_name'),
      type: 'text',
      name: 'Repondant',
      placeholder: t('podent_name'),
      order: 41,
    },
    {
      title: t('another_phone'),
      type: 'num',
      name: 'AutreTel',
      placeholder: t('another_phone'),
      order: 42,
    },
  ];
}
