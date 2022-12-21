/* eslint-disable import/prefer-default-export */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ObjectId } from 'bson';
import { calculateScoring, calculateScoringSup } from 'src/utils/ciblage';
import Toast from 'react-native-toast-message';


export const addMenage = async (menage, user, concession, edit, oldmenage) => {
  const zn = await AsyncStorage.getItem('selectedZone');
  const nzn = JSON.parse(zn);
  const Score = await calculateScoring(menage, edit);
  const date = new Date();
  const menageId = new ObjectId();
  const order =
    global.realms[0].objects('menage').filtered(`concessionId == oid(${concession._id})`).length +
    1;
  const PossRefr = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossRefr') ? 'Oui' : 'No';
  const PossCuisMod = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossCuisMod') ? 'Oui' : 'No';
  const PossClim = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossClim') ? 'Oui' : 'No';
  const PossGrpElectr = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossGrpElectr') ? 'Oui' : 'No';
  const PossChauffeEau = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossChauffeEau') ? 'Oui' : 'No';
  const PossMachLaver = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossMachLaver') ? 'Oui' : 'No';
  const PossVoit = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossVoit') ? 'Oui' : 'No';
  const PossLit = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossLit') ? 'Oui' : 'No';
  const PossTele = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossTele') ? 'Oui' : 'No';
  const PossPirogBat = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossPirogBat') ? 'Oui' : 'No';
  const PossFer = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossFer') ? 'Oui' : 'No';
  const PossMoto = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossMoto') ? 'Oui' : 'No';
  const PossSmartPhone = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossSmartPhone') ? 'Oui' : 'No';
  const taazour_boutique = menage.benefitsFromServices && menage.benefitsFromServices.includes('taazour_boutique') ? 'Oui' : 'No';
  const sndp = menage.benefitsFromServices && menage.benefitsFromServices.includes('sndp') ? 'Oui' : 'No';
  const masef = menage.benefitsFromServices && menage.benefitsFromServices.includes('masef') ? 'Oui' : 'No';
  const csa = menage.benefitsFromServices && menage.benefitsFromServices.includes('csa') ? 'Oui' : 'No';
  const ong_nationale = menage.benefitsFromServices && menage.benefitsFromServices.includes('ong_nationale') ? 'Oui' : 'No';
  const ong_internationale = menage.benefitsFromServices && menage.benefitsFromServices.includes('ong_internationale') ? 'Oui' : 'No';
  const tekavoul_cache = menage.benefitsFromServices && menage.benefitsFromServices.includes('tekavoul_cache') ? 'Oui' : 'No';
  let rest = {
    _id: edit ? new ObjectId(oldmenage._id) : menageId,
    updatedAt: date,
    syncedAt: null,
    chefNameFr: menage.chefNameFr.trim(),
    chefNameAr: menage.chefNameAr.trim(),
    familyNameFr: menage.familyNameFr.trim(),
    familyNameAr: menage.familyNameAr.trim(),
    ChefEstEnrole: menage.ChefEstEnrole,
    NNIChef: menage.ChefEstEnrole === 'yes' ? menage.NNIChef : null,
    Raisons: menage.ChefEstEnrole === 'yes' ? menage.Raisons : null,
    NomMereChef: menage.NomMereChef.trim(),
    TelChef: menage.TelChef,
    habitTerre: menage.habitTerre,
    landSize: menage.habitTerre === 'yes' ? parseInt(menage.landSize, 10) : 0,
    NationaliteChef: new ObjectId(menage.NationaliteChef),
    ChefRefugie: menage.NationaliteChef !== '6159e3d69182321f6506cad7' ? menage.ChefRefugie : null,
    NbrProGres: menage.ChefRefugie === 'yes' ? menage.NbrProGres : null,
    AgeChef: parseInt(menage.AgeChef, 10),
    SexeChef: menage.SexeChef,
    SituatMatrChef: menage.SituatMatrChef,
    NivEdChef: menage.NivEdChef,
    NbrMbrMen: parseInt(menage.NbrMbrMen, 10),
    NbrMbrMenF: parseInt(menage.NbrMbrMenF, 10),
    NbrMbrMenM: parseInt(menage.NbrMbrMenM, 10),
    childrenLess2: parseInt(menage.childrenLess2, 10),
    children614: parseInt(menage.children614, 10),
    children614M: parseInt(menage.children614M, 10),
    children614F: parseInt(menage.children614F, 10),
    children614NoEduc: parseInt(menage.children614NoEduc, 10),
    children614NoEducM: parseInt(menage.children614NoEducM, 10),
    children614NoEducF: parseInt(menage.children614NoEducF, 10),
    pregnantNum: parseInt(menage.pregnantNum, 10),
    nbrHandicap: parseInt(menage.nbrHandicap, 10),
    NbrMC: parseInt(menage.NbrMC, 10),
    withRevenue: parseInt(menage.withRevenue, 10),
    nonRegisteredNum: parseInt(menage.nonRegisteredNum, 10),
    StatOccLog: menage.StatOccLog,
    housingType: menage.housingType,
    roofMaterial: menage.roofMaterial,
    wallMaterial: menage.wallMaterial,
    floorMaterial: menage.floorMaterial,
    NbrPieces: parseInt(menage.NbrPieces, 10),
    waterSource: menage.waterSource,
    lightSource: menage.lightSource,
    TypeLatr: menage.TypeLatr,
    PSRDD: menage.PSRDD === 'other' ? menage.AutrePSR : menage.PSRDD,
    doYouHaveOneOrMore: menage.doYouHaveOneOrMore || [],
    PossRefr,
    PossCuisMod,
    PossClim,
    PossGrpElectr,
    PossChauffeEau,
    PossMachLaver,
    PossVoit,
    PossLit,
    PossTele,
    PossPirogBat,
    PossFer,
    PossMoto,
    PossSmartPhone,
    taazour_boutique,
    sndp,
    masef,
    csa,
    ong_nationale,
    ong_internationale,
    tekavoul_cache,
    PSEC: menage.PSEC,
    PersonnelMaison: menage.PersonnelMaison,
    benefitsFromServices: menage.benefitsFromServices || [],
    AMSituatMen: menage.AMSituatMen,
    AASituatMen: menage.AASituatMen,
    Repondant: menage.Repondant ? menage.Repondant.trim() : null,
    AutreTel: menage.AutreTel || null,
    Score,
    order: edit ? parseInt(oldmenage.order, 10) : order,
    animals: {
      vache: parseInt(menage.vache, 10) || 0,
      mouton: parseInt(menage.mouton, 10) || 0,
      chevre: parseInt(menage.chevre, 10) || 0,
      camelin: parseInt(menage.camelin, 10) || 0,
    },
  };
  if (!edit) {
    rest = {
      ...rest,
      _partition: user.moughataaId.toString(),
      wilayaId: new ObjectId(user.wilayaId),
      moughataaId: new ObjectId(nzn.moughataaId),
      communeId: new ObjectId(nzn.communeId),
      localiteId: new ObjectId(nzn.localiteId),
      zoneId: new ObjectId(nzn._id),
      concessionId: edit ? new ObjectId(oldmenage.concessionId) : new ObjectId(concession._id),
      enqueterId: new ObjectId(user._id),
      operationId: new ObjectId(user.operationId),
      controllerId: new ObjectId(user.controllerId || user._id),
      createdAt: date,
    };
  }
  try {
    global.realms[0].write(() => {
      global.realms[0].create(
        'menage',
        {
          ...rest,
        },
        'modified',
      );
    });
  } catch (error) {
    return false;
  }
  return menageId;
};
export const editMenageSup = async (menage, oldmenage) => {
  const localite = global.realms[0].objects('localite').filtered(`_id == oid(${oldmenage.localiteId})`)[0]
  const Score = await calculateScoringSup(menage, localite);
  const date = new Date();
  const PossRefr = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossRefr') ? 'Oui' : 'No';
  const PossCuisMod = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossCuisMod') ? 'Oui' : 'No';
  const PossClim = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossClim') ? 'Oui' : 'No';
  const PossGrpElectr = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossGrpElectr') ? 'Oui' : 'No';
  const PossChauffeEau = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossChauffeEau') ? 'Oui' : 'No';
  const PossMachLaver = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossMachLaver') ? 'Oui' : 'No';
  const PossVoit = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossVoit') ? 'Oui' : 'No';
  const PossLit = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossLit') ? 'Oui' : 'No';
  const PossTele = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossTele') ? 'Oui' : 'No';
  const PossPirogBat = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossPirogBat') ? 'Oui' : 'No';
  const PossFer = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossFer') ? 'Oui' : 'No';
  const PossMoto = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossMoto') ? 'Oui' : 'No';
  const PossSmartPhone = menage.doYouHaveOneOrMore && menage.doYouHaveOneOrMore.includes('PossSmartPhone') ? 'Oui' : 'No';
  const taazour_boutique = menage.benefitsFromServices && menage.benefitsFromServices.includes('taazour_boutique') ? 'Oui' : 'No';
  const sndp = menage.benefitsFromServices && menage.benefitsFromServices.includes('sndp') ? 'Oui' : 'No';
  const masef = menage.benefitsFromServices && menage.benefitsFromServices.includes('masef') ? 'Oui' : 'No';
  const csa = menage.benefitsFromServices && menage.benefitsFromServices.includes('csa') ? 'Oui' : 'No';
  const ong_nationale = menage.benefitsFromServices && menage.benefitsFromServices.includes('ong_nationale') ? 'Oui' : 'No';
  const ong_internationale = menage.benefitsFromServices && menage.benefitsFromServices.includes('ong_internationale') ? 'Oui' : 'No';
  const tekavoul_cache = menage.benefitsFromServices && menage.benefitsFromServices.includes('tekavoul_cache') ? 'Oui' : 'No';
  const rest = {
    _id: new ObjectId(oldmenage._id),
    updatedAt: date,
    syncedAt: null,
    chefNameFr: menage.chefNameFr.trim(),
    chefNameAr: menage.chefNameAr.trim(),
    familyNameFr: menage.familyNameFr.trim(),
    familyNameAr: menage.familyNameAr.trim(),
    ChefEstEnrole: menage.ChefEstEnrole,
    NNIChef: menage.ChefEstEnrole === 'yes' ? menage.NNIChef : null,
    Raisons: menage.ChefEstEnrole === 'yes' ? menage.Raisons : null,
    NomMereChef: menage.NomMereChef.trim(),
    TelChef: menage.TelChef,
    habitTerre: menage.habitTerre,
    landSize: menage.habitTerre === 'yes' ? parseInt(menage.landSize, 10) : 0,
    NationaliteChef: new ObjectId(menage.NationaliteChef),
    ChefRefugie: menage.NationaliteChef !== '6159e3d69182321f6506cad7' ? menage.ChefRefugie : null,
    NbrProGres: menage.ChefRefugie === 'yes' ? menage.NbrProGres : null,
    AgeChef: parseInt(menage.AgeChef, 10),
    SexeChef: menage.SexeChef,
    SituatMatrChef: menage.SituatMatrChef,
    NivEdChef: menage.NivEdChef,
    NbrMbrMen: parseInt(menage.NbrMbrMen, 10),
    NbrMbrMenM: parseInt(menage.NbrMbrMenM, 10),
    NbrMbrMenF: parseInt(menage.NbrMbrMenF, 10),
    childrenLess2: parseInt(menage.childrenLess2, 10),
    children614: parseInt(menage.children614, 10),
    children614M: parseInt(menage.children614M, 10),
    children614F: parseInt(menage.children614F, 10),
    children614NoEduc: parseInt(menage.children614NoEduc, 10),
    children614NoEducM: parseInt(menage.children614NoEducM, 10),
    children614NoEducF: parseInt(menage.children614NoEducF, 10),
    pregnantNum: parseInt(menage.pregnantNum, 10),
    nbrHandicap: parseInt(menage.nbrHandicap, 10),
    NbrMC: parseInt(menage.NbrMC, 10),
    withRevenue: parseInt(menage.withRevenue, 10),
    nonRegisteredNum: parseInt(menage.nonRegisteredNum, 10),
    StatOccLog: menage.StatOccLog,
    housingType: menage.housingType,
    roofMaterial: menage.roofMaterial,
    wallMaterial: menage.wallMaterial,
    floorMaterial: menage.floorMaterial,
    NbrPieces: parseInt(menage.NbrPieces, 10),
    waterSource: menage.waterSource,
    lightSource: menage.lightSource,
    TypeLatr: menage.TypeLatr,
    PSRDD: menage.PSRDD === 'other' ? menage.AutrePSR : menage.PSRDD,
    doYouHaveOneOrMore: menage.doYouHaveOneOrMore || [],
    PossRefr,
    PossCuisMod,
    PossClim,
    PossGrpElectr,
    PossChauffeEau,
    PossMachLaver,
    PossVoit,
    PossLit,
    PossTele,
    PossPirogBat,
    PossFer,
    PossMoto,
    PossSmartPhone,
    taazour_boutique,
    sndp,
    masef,
    csa,
    ong_nationale,
    ong_internationale,
    tekavoul_cache,
    PSEC: menage.PSEC,
    PersonnelMaison: menage.PersonnelMaison,
    benefitsFromServices: menage.benefitsFromServices || [],
    AMSituatMen: menage.AMSituatMen,
    AASituatMen: menage.AASituatMen,
    Repondant: menage.Repondant ? menage.Repondant.trim() : null,
    AutreTel: menage.AutreTel || null,
    Score,
    animals: {
      vache: parseInt(menage.vache, 10) || 0,
      mouton: parseInt(menage.mouton, 10) || 0,
      chevre: parseInt(menage.chevre, 10) || 0,
      camelin: parseInt(menage.camelin, 10) || 0,
    },
    edited: true,
  };
  try {
    global.realms[0].write(() => {
      global.realms[0].create(
        'menage',
        {
          ...rest,
        },
        'modified',
      );
    });
  } catch (error) {
    return false;
  }
  return true;
};

export const addEnquete = (menage, enquete, beginAt, enqueteId, t, oldEnquete) => {
  console.log('oldEnquete', oldEnquete)
  const date = new Date();
  if ((enquete.hasHandicaps === 'yes' || enquete.hasHandicaps === 'yes_many') && (enquete.handicapType || []).length < 1) {
    Toast.show({
      type: 'error',
      text1: `4.1. ${t('what_hadicap')}`,
      position: 'bottom',
      visibilityTime: 2000,
    });
    return 'err';
  }
  if (enquete.statePrograms === 'yes' && (enquete.wichProgram || []).length < 1) {
    Toast.show({
      type: 'error',
      text1: `7.1. ${t('which_program')}`,
      position: 'bottom',
      visibilityTime: 2000,
    });
    return 'err';
  }
  if ((enquete.foodSource || []).length < 1) {
    Toast.show({
      type: 'error',
      text1: `22. ${t('food_source')}`,
      position: 'bottom',
      visibilityTime: 2000,
    });
    return 'err';
  }
  try {
    global.realms[0].write(() => {
      global.realms[0].create('enquete', {
        ...enquete,
        _id: new ObjectId(oldEnquete._id),
        menageId: new ObjectId(menage._id),
        createdAt: date,
        updatedAt: date,
        syncedAt: null,
        operationId: new ObjectId(menage.operationId),
        _partition: menage._partition,
        beginAt: oldEnquete?.beginAt ? new Date(oldEnquete.beginAt) : beginAt,
        TelChef: enquete.TelChef,
        NbrMbrMen: parseInt(enquete.NbrMbrMen, 10),
        handicapType:
          enquete.hasHandicaps === 'yes' || enquete.hasHandicaps === 'yes_many'
            ? enquete.handicapType || []
            : [],
        hasCronicIllness: enquete.hasCronicIllness,
        infRenal: enquete.hasCronicIllness === 'yes' ? parseInt(enquete.infRenal, 10) : null,
        debetes: enquete.hasCronicIllness === 'yes' ? parseInt(enquete.debetes, 10) : null,
        cardiaque: enquete.hasCronicIllness === 'yes' ? parseInt(enquete.cardiaque, 10) : null,
        otherIllness: enquete.hasCronicIllness === 'yes' ? parseInt(enquete.otherIllness, 10) : null,
        wichProgram: enquete.statePrograms === 'yes' ? enquete.wichProgram || [] : [],
        NNIChef: enquete.NNIChef,
        hasHandicaps: enquete.hasHandicaps,
        asurrance: enquete.asurrance,
        statePrograms: enquete.statePrograms,
        otherHouse: enquete.otherHouse,
        farmingLand: enquete.farmingLand,
        waloLand: enquete.farmingLand === 'yes' ? enquete.waloLand : null,
        waloMoud: enquete.waloLand === 'yes' ? parseInt(enquete.waloMoud, 10) : null,
        diriLand: enquete.farmingLand === 'yes' ? enquete.diriLand : null,
        diriMoud: enquete.diriLand === 'yes' ? parseInt(enquete.diriMoud, 10) : null,
        freeFarmLand: enquete.freeFarmLand,
        waloLandNoProp: enquete.waloLandNoProp || null,
        waloNoPropMoud: enquete.waloLandNoProp === 'yes' ? parseInt(enquete.waloNoPropMoud, 10) : null,
        diriLandNoProp: enquete.diriLandNoProp || null,
        diriNoPropMoud: enquete.diriLandNoProp === 'yes' ? parseInt(enquete.diriNoPropMoud, 10) : null,
        irigueLandNoProp: enquete.irigueLandNoProp || null,
        irigueNoPropMoud: enquete.irigueLandNoProp === 'yes' ? parseInt(enquete.irigueNoPropMoud, 10) : null,
        chiken: parseInt(enquete.chiken, 10),
        donkey: parseInt(enquete.donkey, 10),
        horse: parseInt(enquete.horse, 10),
        familyHasAny: enquete.familyHasAny || [],
        foodSource: enquete.foodSource || [],
        mealCount: enquete.mealCount,
        lesFavrable: enquete.lesFavrable,
        lendForFood: enquete.lendForFood,
        reduceFood: enquete.reduceFood,
        reduceFoodAdult: enquete.reduceFoodAdult,
        reduceMealCount: enquete.reduceMealCount,
        sellDomestique: enquete.sellDomestique,
        sellAnim: enquete.sellAnim,
        spendSaving: enquete.spendSaving,
        lendMoneyFood: enquete.lendMoneyFood,
        sellProductif: enquete.sellProductif,
        reduceExpences: enquete.reduceExpences,
        childenOutSchool: enquete.childenOutSchool,
        sellLand: enquete.sellLand,
        mandier: enquete.mandier,
        sellProductifFemale: enquete.sellProductifFemale,
      }, 'modified');
    });
  } catch (err) {
    console.log('error', err);
    return false;
  }
  return true;
};

export const addMembre = async (membre, user, menage) => {
  const date = new Date();
  try {
    global.realms[0].write(() => {
      global.realms[0].create('menagemembre', {
        ...membre,
        _id: new ObjectId(),
        _partition: menage._partition,
        menageId: new ObjectId(menage._id),
        createdAt: date,
        updatedAt: date,
        syncedAt: null,
        operationId: new ObjectId(menage.operationId),
        wilayaId: new ObjectId(menage.wilayaId),
        moughataaId: new ObjectId(menage.moughataaId),
        communeId: new ObjectId(menage.communeId),
        localiteId: new ObjectId(menage.localiteId),
      });
    });
  } catch (err) {
    console.log('error', err);
    return false;
  }
  return true;
};
export const addLocalite = async (localite, user, edit, theOld) => {
  const date = new Date();
  if (edit) {
    try {
      global.realms[0].write(() => {
        global.realms[0].create(
          'localite',
          {
            _id: new ObjectId(theOld._id),
            updatedAt: date,
            syncedAt: null,
            communeId: new ObjectId(localite.communeId),
            namefr_rs: localite.namefr_rs.trim(),
            namear: localite.namear.trim(),
            active: true,
            type: localite.type,
          },
          'modified',
        );
      });
      return true;
    } catch (err) {
      console.log('error', err);
      return false;
    }
  }

  try {
    global.realms[0].write(() => {
      global.realms[0].create('localite', {
        _id: new ObjectId(),
        _partition: user.moughataaId,
        createdAt: date,
        updatedAt: date,
        syncedAt: null,
        active: true,
        wilayaId: new ObjectId(user.wilayaId),
        moughataaId: new ObjectId(user.moughataaId),
        communeId: new ObjectId(localite.communeId),
        namefr_rs: localite.namefr_rs.trim(),
        namear: localite.namear.trim(),
        type: localite.type,
      });
    });
  } catch (err) {
    console.log('error', err);
    return false;
  }
  return true;
};
export const addZone = async (zone, user, localite, edit, oldzone) => {
  const date = new Date();

  if (edit) {
    try {
      global.realms[0].write(() => {
        global.realms[0].create('zone', {
          _id: new ObjectId(oldzone._id),
          updatedAt: date,
          syncedAt: null,
          namefr: zone.namefr.trim(),
          namear: zone.namear.trim(),
          status: 'open',
          type: 'free',
          active: true,
        }, 'modified');
      });
    } catch (e) {
      return false;
    }
  } else {
    try {
      global.realms[0].write(() => {
        global.realms[0].create('zone', {
          _id: new ObjectId(),
          _partition: user.moughataaId,
          createdAt: date,
          updatedAt: date,
          syncedAt: null,
          wilayaId: new ObjectId(user.wilayaId),
          moughataaId: new ObjectId(user.moughataaId),
          communeId: new ObjectId(localite.communeId),
          localiteId: new ObjectId(localite._id),
          namefr: zone.namefr.trim(),
          namear: zone.namear.trim(),
          operationId: new ObjectId(user.operationId),
          status: 'open',
          type: 'free',
          active: true,
          enqueterId: null,
        });
      });
    } catch (err) {
      console.log('error', err);
      return false;
    }
  }
  return true;
};

export const fetchMenages = async user => {
  const zn = await AsyncStorage.getItem('selectedZone');
  const nzn = JSON.parse(zn);
  const menages = global.realms[0]
    .objects('menage')
    .filtered(`zoneId == oid(${nzn._id})`)
    .sorted('_id', true);
  return menages;
};

export const fetchMenagesForSupervisor = user => {
  const menages = global.realms[0]
    .objects('menage')
    .filtered(`operationId == oid(${user.operationId}) && moughataaId == oid(${user.moughataaId})`)
    .sorted(`zoneId`, true);
  return menages;
};
export const fetchMenagesForController = user => {
  const menages = global.realms[0]
    .objects('menage')
    .filtered(`controllerId == oid(${user._id})`)
    .sorted(`zoneId`, true);
  return menages;
};

export const fetchMenagesOpenedConcession = async (user, concessionsIds) => {
  const zn = await AsyncStorage.getItem('selectedZone');
  const nzn = JSON.parse(zn);
  if (!concessionsIds || concessionsIds.length === 0) {
    return [];
  }
  console.log(concessionsIds);
  const idsQuery = concessionsIds.map(c => `concessionId = oid(${c._id})`).join(' OR ');
  const menages = global.realms[0]
    .objects('menage')
    .filtered(`zoneId == oid(${nzn._id}) && ${idsQuery}`);
  return menages;
};

export const fetchOpenedConcessions = async user => {
  const zn = await AsyncStorage.getItem('selectedZone');
  const nzn = JSON.parse(zn);
  const concessions = global.realms[0]
    .objects('concession')
    .filtered(`zoneId == oid(${nzn._id}) && status == $0`, 'open')
    .sorted('createdAt', true);
  return concessions;
};

export const fetchConcessionsAdded = async user => {
  const zn = await AsyncStorage.getItem('selectedZone');
  const nzn = JSON.parse(zn);
  const concessions = global.realms[0]
    .objects('concession')
    .filtered(`zoneId == oid(${nzn._id})`)
    .sorted('_id', true);
  return concessions;
};

export const fetchConcessionsForSupervisor = async user => {
  const concessions = global.realms[0]
    .objects('concession')
    .filtered(`operationId == oid(${user.operationId}) && moughataaId == oid(${user.moughataaId})`);
  return concessions;
};

export const deleteConcession = async (concession) => {
  try {
    global.realms[0].write(() => {
      global.realms[0].delete(concession);
    });
  } catch (error) {
    console.log('error', error);
  }
  return true;
};

export const closeConcession = async (concession) => {
  const date = new Date();
  try {
    global.realms[0].write(() => {
      global.realms[0].create(
        'concession',
        {
          ...concession,
          _id: new ObjectId(concession._id),
          status: 'closed',
          syncedAt: null,
          updatedAt: date,
        },
        'modified',
      );
    });
  } catch (error) {
    console.log('error', error);
  }
  return true;
};

export const addConcession = async (concession, user, location) => {
  const zn = await AsyncStorage.getItem('selectedZone');
  const nzn = JSON.parse(zn);
  const concessions = global.realms[0]
    .objects('concession')
    .filtered(`zoneId == oid(${nzn._id})`)
    .sorted('Numero', true);
  console.log('concessions', concessions);
  const date = new Date();
  const concessionId = new ObjectId();
  try {
    global.realms[0].write(() =>
      global.realms[0].create('concession', {
        _id: concessionId,
        _partition: user.moughataaId.toString(),
        wilayaId: new ObjectId(nzn.wilayaId),
        moughataaId: new ObjectId(nzn.moughataaId),
        communeId: new ObjectId(nzn.communeId),
        localiteId: new ObjectId(nzn.localiteId),
        zoneId: new ObjectId(nzn._id),
        enqueterId: new ObjectId(user._id),
        operationId: new ObjectId(user.operationId),
        controllerId: new ObjectId(user.controllerId),
        createdAt: date,
        updatedAt: date,
        syncedAt: null,
        status: 'open',
        Numero: concessions.length > 0 ? concessions[0].Numero + 1 : 1,
        NbrMenages: concession.maintype === 'habit' ? parseInt(concession.NbrMenages, 10) : 0,
        NbrAbsents: concession.maintype === 'habit' ? parseInt(concession.NbrAbsents, 10) : 0,
        NbrRefus: concession.maintype === 'habit' ? parseInt(concession.NbrRefus, 10) : 0,
        maintype: concession.maintype,
        soustype: concession.maintype !== 'habit' ? concession.soustype : null,
        Adresse: concession.Adresse,
        Latitude: location.latitude,
        Longitude: location.longitude,
        geo: {
          type: 'Point',
          coordinates: [parseInt(location.latitude, 10), parseInt(location.longitude, 10)],
        },
      }),
    );
  } catch (error) {
    console.log('error', error);
  }
  return concessionId;
};

export const updateConcession = async (concession, oldConcession) => {
  console.log('consession', concession);
  console.log('oldConcession', oldConcession);
  const date = new Date();
  try {
    global.realms[0].write(() =>
      global.realms[0].create(
        'concession',
        {
          _id: new ObjectId(oldConcession._id),
          num: concession.num,
          NbrMenages: concession.maintype === 'habit' ? parseInt(concession.NbrMenages, 10) : 0,
          NbrAbsents: concession.maintype === 'habit' ? parseInt(concession.NbrAbsents, 10) : 0,
          NbrRefus: concession.maintype === 'habit' ? parseInt(concession.NbrRefus, 10) : 0,
          maintype: concession.maintype,
          soustype: concession.maintype !== 'habit' ? concession.soustype : null,
          Adresse: concession.Adresse,
          updatedAt: date,
          syncedAt: null,
        },
        'modified',
      ),
    );
  } catch (error) {
    console.log('error', error);
  }
  return true;
};

export const fetchEnquetersForSupervisor = async user => {
  const controllerRoleId = '62d5635aa5fac5ffb48ef7e4';
  const users = global.realms[0]
    .objects('user')
    .filtered(
      `operationId == oid(${user.operationId}) && moughataaId == oid(${user.moughataaId}) && (roleId == oid(62d562fda5fac5ffb48ef7e2) OR roleId == oid(${controllerRoleId}))`,
    )
    .sorted('createdAt', true);
  return users;
};

export const fetchEnquetersForController = async user => {
  const users = global.realms[0]
    .objects('user')
    .filtered(`controllerId == oid(${user._id}) OR _id == oid(${user._id})`)
    .sorted('createdAt', true);
  return users;
};

export const fetchZones = async user => {
  const zones = global.realms[0]
    .objects('zone')
    .filtered(`operationId == oid(${user.operationId}) && moughataaId == oid(${user.moughataaId})`)
    .sorted('namefr', true)
    .sorted('status', true);
  return zones;
};

export const fetchControlers = async user => {
  const controlers = global.realms[0]
    .objects('user')
    .filtered(
      `operationId == oid(${user.operationId}) && moughataaId == oid(${user.moughataaId}) && roleId == oid(62d5635aa5fac5ffb48ef7e4)`,
    )
    .sorted('createdAt', true);
  return controlers;
};

export const changeZoneEnqueter = async (localite, enqueterId, user, enqueters) => {
  console.log('enqueterId', enqueterId);
  console.log('zone', localite);
  const date = new Date();
  const zoneid = new ObjectId();
  const enqueter = enqueters.find(e => e._id === enqueterId);
  console.log(enqueter);
  let zonesIds;
  if (enqueter.zonesIds) {
    zonesIds = [...enqueter.zonesIds.map(z => new ObjectId(z)), zoneid];
  } else {
    zonesIds = [zoneid];
  }
  try {
    global.realms[0].write(() =>
      global.realms[0].create(
        'user',
        {
          _id: new ObjectId(enqueterId),
          zonesIds,
          syncedAt: null,
          updatedAt: date,
        },
        'modified',
      ),
    );
    global.realms[0].write(() =>
      global.realms[0].create('zone', {
        _id: zoneid,
        _partition: user._partition,
        createdAt: date,
        updatedAt: date,
        syncedAt: null,
        wilayaId: new ObjectId(localite.wilayaId),
        moughataaId: new ObjectId(localite.moughataaId),
        communeId: new ObjectId(localite.communeId),
        localiteId: new ObjectId(localite._id),
        namefr: localite.namefr_rs,
        namear: localite.namear,
        operationId: new ObjectId(user.operationId),
        status: 'open',
        type: 'free',
        active: true,
        enqueterId: new ObjectId(enqueterId),
      }),
    );
  } catch (error) {
    console.log('error', error);
  }
  return true;
};
export const changeZoneEnqueter2 = async (zone, enqueterId, oldEnqueterId) => {
  const newEnqueter = global.realms[0].objects('user').filtered(`_id == oid(${enqueterId})`);
  const newEnqueterZones = newEnqueter[0].zonesIds
    ? [...newEnqueter[0].zonesIds, new ObjectId(zone._id)]
    : [new ObjectId(zone._id)];
  const date = new Date();
  if (oldEnqueterId) {
    if (String(enqueterId) === String(oldEnqueterId)) {
      return false;
    }
    const oldEnqueter = global.realms[0].objects('user').filtered(`_id == oid(${oldEnqueterId})`);
    const oldEnqueterZones = oldEnqueter[0]?.zonesIds;
    console.log(oldEnqueter);
    console.log(newEnqueter);
    let newZones = [];
    if (oldEnqueterZones) {
      newZones = oldEnqueterZones.filter(z => String(z) !== String(zone._id));
    }

    try {
      global.realms[0].write(() =>
        global.realms[0].create(
          'user',
          {
            _id: new ObjectId(enqueterId),
            zonesIds: [...newEnqueterZones],
            updatedAt: date,
            syncedAt: null,
          },
          'modified',
        ),
      );
      console.log('beforeThe second');
      global.realms[0].write(() =>
        global.realms[0].create(
          'user',
          {
            _id: new ObjectId(oldEnqueterId),
            zonesIds: newZones,
            syncedAt: null,
            updatedAt: date,
          },
          'modified',
        ),
      );
      global.realms[0].write(() =>
        global.realms[0].create(
          'zone',
          {
            _id: new ObjectId(zone._id),
            enqueterId: new ObjectId(enqueterId),
            syncedAt: null,
            updatedAt: date,
          },
          'modified',
        ),
      );
    } catch (error) {
      console.log('error', error);
    }
    return true;
  }
  try {
    global.realms[0].write(() =>
      global.realms[0].create(
        'user',
        {
          _id: new ObjectId(enqueterId),
          zonesIds: [...newEnqueterZones],
          updatedAt: date,
          syncedAt: null,
        },
        'modified',
      ),
    );
    global.realms[0].write(() =>
      global.realms[0].create(
        'zone',
        {
          _id: new ObjectId(zone._id),
          enqueterId: new ObjectId(enqueterId),
          syncedAt: null,
          updatedAt: date,
        },
        'modified',
      ),
    );
    return true;
  } catch (err) {
    return false;
  }
};

export const closeZone = async user => {
  const zn = await AsyncStorage.getItem('selectedZone');
  const nzn = JSON.parse(zn);
  const date = new Date();
  try {
    global.realms[0].write(() =>
      global.realms[0].create(
        'zone',
        {
          _id: new ObjectId(nzn._id),
          status: 'closed',
          syncedAt: null,
          updatedAt: date,
        },
        'modified',
      ),
    );
    AsyncStorage.removeItem('selectedZone');
  } catch (error) {
    console.log('error', error);
  }
  return true;
};

export const fetchLocalites = () => {
  const localites = global.realms[0]
    .objects('localite')
    .filtered(`active == true`)
    .sorted('namefr_rs', false);
  return localites;
};
export const fetchCommunes = () => {
  const localites = global.realms[0].objects('commune');
  return localites;
};

export const getTheSupervisor = () => {
  const superVisor = global.realms[0]
    .objects('user')
    .filtered(`roleId == oid(62d5633aa5fac5ffb48ef7e3)`);
  return superVisor;
};

export const closeCommune = (supervisor, communeId) => {
  const date = new Date();
  try {
    global.realms[0].write(() =>
      global.realms[0].create(
        'closedcommune',
        {
          _id: new ObjectId(),
          communeId: new ObjectId(communeId),
          _partition: supervisor._partition,
          operationId: new ObjectId(supervisor.operationId),
          syncedAt: null,
          updatedAt: date,
          createdAt: date,
        },
        'modified',
      ),
    );
  } catch (error) {
    console.log('error', error);
    return false;
  }
  const superv = global.realms[0].objects('user').filtered(`_id == oid(${supervisor._id})`);
  return superv;
};

export const getQuetionaiLocalite = (user = {}) => {
  const quetionaiLocalite = global.realms[0]
    .objects('formulairelocalite')
    .filtered(`localiteId == oid(${user.localiteId}) && operationId == oid(${user.operationId})`);
  return quetionaiLocalite;
};

export const submitLocaliteIndent = async (form, oldForm) => {
  let user = await AsyncStorage.getItem('userData');
  let zone = await AsyncStorage.getItem('selectedZone');
  let loct = await AsyncStorage.getItem('selectLocaliteSuper');
  zone = JSON.parse(zone);
  user = JSON.parse(user);
  loct = JSON.parse(loct);
  const date = new Date();
  const rest = {
    _id: oldForm ? new ObjectId(oldForm._id) : new ObjectId(),
    _partition: user.moughataaId,
    wilayaId: new ObjectId(user.wilayaId),
    moughataaId: new ObjectId(user.moughataaId),
    communeId: new ObjectId(zone?.communeId || loct.communeId),
    localiteId: new ObjectId(zone?.localiteId || loct._id),
    operationId: new ObjectId(user.operationId),
    updatedAt: date,
    syncedAt: null,
    localeName: form.localeName.trim(),
    otherName: form.otherName.trim(),
    ID4: form.ID4,
    ID5: form.ID4 === 'Rural' ? form.ID5 : null,
    ID7: form.ID7,
    ID8: parseInt(form.ID8, 10),
    ID9: parseInt(form.ID9, 10),
    ID10: parseInt(form.ID10, 10),
    ID11: parseInt(form.ID11, 10),
    LPA: form.LPA,
    LPB: form.LPB,
    activEconom: form.activEconom || [],
  };

  if (!oldForm) {
    rest.createdAt = date;
  }

  try {
    global.realms[0].write(() => {
      if (oldForm?._id) {
        global.realms[0].create('formulairelocalite', { ...rest }, 'modified')
      }
      else {
        global.realms[0].create('formulairelocalite', { ...rest })
      }
    }
    );
    return true;
  } catch (error) {
    console.log('error', error);
    return false;
  }
};
export const submitLocaliteInfras = async (form, oldForm) => {
  const date = new Date();
  const rest = {
    _id: oldForm ? new ObjectId(oldForm._id) : new ObjectId(),
    IV1E1: parseInt(form.IV1E1, 10),
    IV1E2: parseInt(form.IV1E2, 10),
    IV1E3: parseInt(form.IV1E3, 10),
    IV1E4: parseInt(form.IV1E4, 10),
    IV1E5: form.IV1E5,
    IV1E6: parseInt(form.IV1E6, 10),
    IV1E7: form.IV1E7,
    IV1E8: parseInt(form.IV1E8, 10),
    IV1E9: form.IV1E9,
    IV1E10: parseInt(form.IV1E10, 10),
    IV1E11: form.IV1E11,
    IV1E12: parseInt(form.IV1E12, 10),
    IV1E13: form.IV1E13,
    IV1E14: parseInt(form.IV1E14, 10),
    IV2S1: parseInt(form.IV2S1, 10),
    IV2S2: form.IV2S2,
    IV2S3: parseInt(form.IV2S3, 10),
    IV2S4: form.IV2S4,
    IV2S5: parseInt(form.IV2S5, 10),
    IV2S6: form.IV2S6,
    IV2S7: parseInt(form.IV2S7, 10),
    IV2S8: form.IV2S8,
    IV2S9: parseInt(form.IV2S9, 10),
    IV2S10: form.IV2S10,
    IV2S11: parseInt(form.IV2S11, 10),
    IV2S12: form.IV2S12,
    IV2S13: parseInt(form.IV2S13, 10),
    IV2S14: form.IV2S14,
    puits: parseInt(form.puits, 10),
    sondage: parseInt(form.sondage, 10),
    brone: parseInt(form.brone, 10),
    AEP: parseInt(form.AEP, 10),
    SNDE: form.SNDE,
    electricLine: form.electricLine,
    solar: parseInt(form.solar, 10),
    mosqNum: parseInt(form.mosqNum, 10),
    younHouseNum: parseInt(form.younHouseNum, 10),
    CFPFNum: parseInt(form.CFPFNum, 10),
    stadNum: parseInt(form.stadNum, 10),
    store: parseInt(form.store, 10),
    hebdo: parseInt(form.hebdo, 10),
    betail: parseInt(form.betail, 10),
    bettoir: parseInt(form.bettoir, 10),
    parcVaccination: parseInt(form.parcVaccination, 10),
    veterin: parseInt(form.veterin, 10),
    station: parseInt(form.station, 10),
    hotel: parseInt(form.hotel, 10),
  };

  if (!oldForm) {
    rest.createdAt = date;
  }

  try {
    global.realms[0].write(() =>
      global.realms[0].create('formulairelocalite', { ...rest }, 'modified'),
    );
    return true;
  } catch (error) {
    console.log('error', error);
    return false;
  }
};

export const submitLocaliteSage = async (form, localite, zone = {}) => {
  const date = new Date();
  let user = await AsyncStorage.getItem('userData');
  user = JSON.parse(user);
  const rest = {
    _id: new ObjectId(),
    updatedAt: date,
    createdAt: date,
    syncedAt: null,
    prenom: form.prenom,
    _partition: localite._partition,
    nom: form.nom,
    sex: form.sex,
    NNI: form.NNI,
    Tel: form.Tel,
    operationId: new ObjectId(user.operationId),
    wilayaId: new ObjectId(localite.wilayaId),
    moughataaId: new ObjectId(localite.moughataaId),
    communeId: new ObjectId(localite.communeId),
    localiteId: new ObjectId(localite.localiteId),
  };
  if (zone) {
    rest.zoneId = new ObjectId(zone._id);
  }
  try {
    global.realms[0].write(() =>
      global.realms[0].create(
        'sage',
        { ...rest },
      ),
    );
  } catch (error) {
    console.log('error', error);
    return false;
  }
  return true;
};
export const addQuetionaireLocalite = (questionaire, user, location) => {
  console.log('questionaire', questionaire);
  const date = new Date();
  const sages = questionaire.sages.map((s, i) => ({
    firstName: s.firstName,
    name: s.name,
    nni: s.nni,
    num: i + 1,
    phone: parseInt(s.phone, 10),
    sex: s.sex,
    validated: false,
  }));
  const rest = {
    ...questionaire,
    _id: new ObjectId(),
    _partition: user.moughataaId,
    wilayaId: new ObjectId(user.wilayaId),
    moughataaId: new ObjectId(user.moughataaId),
    communeId: new ObjectId(user.communeId),
    localiteId: new ObjectId(user.localiteId),
    operationId: new ObjectId(user.operationId),
    sages,
    updatedAt: date,
    createdAt: date,
    syncedAt: null,
    location: {
      type: 'Point',
      cordinates: [location.latitude, location.longitude],
    },
    AEP: parseInt(questionaire.AEP, 10),
    CFPFNum: parseInt(questionaire.CFPFNum, 10),
    ID10: parseInt(questionaire.ID10, 10),
    ID11: parseInt(questionaire.ID11, 10),
    ID8: parseInt(questionaire.ID8, 10),
    ID9: parseInt(questionaire.ID9, 10),
    IV1E1: parseInt(questionaire.IV1E1, 10),
    IV1E10: parseInt(questionaire.IV1E10, 10),
    IV1E12: parseInt(questionaire.IV1E12, 10),
    IV1E14: parseInt(questionaire.IV1E14, 10),
    IV1E15: parseInt(questionaire.IV1E15, 10),
    IV1E2: parseInt(questionaire.IV1E2, 10),
    IV1E3: parseInt(questionaire.IV1E3, 10),
    IV1E4: parseInt(questionaire.IV1E4, 10),
    IV1E6: parseInt(questionaire.IV1E6, 10),
    IV1E8: parseInt(questionaire.IV1E8, 10),
    IV2S1: parseInt(questionaire.IV2S1, 10),
    IV2S11: parseInt(questionaire.IV2S11, 10),
    IV2S13: parseInt(questionaire.IV2S13, 10),
    IV2S3: parseInt(questionaire.IV2S3, 10),
    IV2S5: parseInt(questionaire.IV2S5, 10),
    IV2S7: parseInt(questionaire.IV2S7, 10),
    IV2S9: parseInt(questionaire.IV2S9, 10),
    betail: parseInt(questionaire.betail, 10),
    bettoir: parseInt(questionaire.bettoir, 10),
    brone: parseInt(questionaire.brone, 10),
    hebdo: parseInt(questionaire.hebdo, 10),
    hotel: parseInt(questionaire.hotel, 10),
    mosqNum: parseInt(questionaire.mosqNum, 10),
    parcVaccination: parseInt(questionaire.parcVaccination, 10),
    puits: parseInt(questionaire.puits, 10),
    solar: parseInt(questionaire.solar, 10),
    sondage: parseInt(questionaire.sondage, 10),
    stadNum: parseInt(questionaire.stadNum, 10),
    station: parseInt(questionaire.station, 10),
    store: parseInt(questionaire.store, 10),
    veterin: parseInt(questionaire.veterin, 10),
    younHouseNum: parseInt(questionaire.younHouseNum, 10),
  };
  try {
    global.realms[0].write(() => global.realms[0].create('formulairelocalite', { ...rest }));
  } catch (error) {
    console.log('error', error);
    return false;
  }
  return true;
};

export const getParams = (user = {}) => {
  console.log(user.operationId);
  const params = global.realms[1]
    .objects('param')
    .filtered(`operationId == oid(${user.operationId})`);
  return params;
};

export const getQuota = (user = {}, commune = {}) => {
  console.log(user.operationId);
  const quota = global.realms[0]
    .objects('quota')
    .filtered(`operationId == oid(${user.operationId}) &&communeId == oid(${commune._id})`);
  return quota;
};

export const fetchSelectedMenages = (user = {}) => {
  const menages = global.realms[0]
    .objects('menage')
    .filtered(
      `localiteId == oid(${user.localiteId}) && operationId == oid(${user.operationId}) && Eligible == true && listValidated == true`,
    )
    .sorted('Score', false);
  return menages;
};
export const fetchAllSelectedMenages = (user = {}) => {
  console.log('user', user);
  const menages = global.realms[0]
    .objects('menage')
    .filtered(`operationId == oid(${user.operationId}) && Eligible == true`)
    .sorted('Score', false);
  return menages;
};
export const fetchNonSelectedMenages = (user = {}, localiteId) => {
  console.log('user', user);
  const menages = global.realms[0]
    .objects('menage')
    .filtered(`operationId == oid(${user.operationId}) && Eligible != true && localiteId == oid(${localiteId})`)
    .sorted('Score', false);
  return menages;
};

export const getAllCommuneMenages = (user, communeId) => {
  const menages = global.realms[0]
    .objects('menage')
    .filtered(`operationId == oid(${user.operationId}) && communeId == oid(${communeId})`)
    .sorted('Score', false);
  return menages;
};

export const getCommuneLocalites = communeId => {
  const localites = global.realms[0].objects('localite').filtered(`communeId == oid(${communeId}) && active == true`);
  return localites;
};

export const getCommuneEnquters = (user, communeId) => {
  const enquters = global.realms[0]
    .objects('user')
    .filtered(
      `operationId == oid(${user.operationId}) && communeId == oid(${communeId}) && roleId == oid(62d562fda5fac5ffb48ef7e2)`,
    );
  return enquters;
};
