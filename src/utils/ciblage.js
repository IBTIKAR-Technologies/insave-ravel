import { getParams, getCommuneLocalites } from 'src/models/cartes';
import { ObjectId } from 'bson';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const calculateScoring = async (menage, edit) => {
  let zn;
  let localite;
  if (edit) {
    let enqloc = await AsyncStorage.getItem('selectedLocaliteEnq');
    enqloc = JSON.parse(enqloc);
    localite = [enqloc];
  } else {
    zn = await AsyncStorage.getItem('selectedZone');
    const nzn = JSON.parse(zn);
    localite = global.realms[0].objects('localite').filtered(`_id == oid(${nzn.localiteId})`);
  }
  let finalScore = 0;
  if (localite[0].type === 'Rural') {
    finalScore += (menage.NbrPieces / menage.NbrMbrMen) * 0.1691;
    if (menage.habitTerre === 'yes' && parseInt(menage.landSize, 10) >= 500) {
      finalScore += 0.053;
      console.log('🚀 ~ file: ciblage.js ~ line 8 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (parseInt(menage.vache, 10) + parseInt(menage.camelin, 10) === 0) {
      finalScore -= 0.0235;
      console.log('🚀 ~ file: ciblage.js ~ line 12 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (parseInt(menage.vache, 10) + parseInt(menage.camelin, 10) >= 10) {
      finalScore += 0.0312;
      console.log('🚀 ~ file: ciblage.js ~ line 16 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (parseInt(menage.mouton, 10) + parseInt(menage.chevre, 10) === 0) {
      finalScore -= 0.0046;
      console.log('🚀 ~ file: ciblage.js ~ line 20 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (parseInt(menage.mouton, 10) + parseInt(menage.chevre, 10) >= 3) {
      finalScore += 0.0015;
      console.log('🚀 ~ file: ciblage.js ~ line 24 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.housingType === 'normal_house' || menage.housingType === 'normalhousessemi') {
      finalScore += 0.3312;
      console.log('🚀 ~ file: ciblage.js ~ line 33 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.housingType === 'villa') {
      finalScore += 0.1803;
      console.log('🚀 ~ file: ciblage.js ~ line 37 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.housingType === 'mbar') {
      finalScore -= 0.2632;
      console.log('🚀 ~ file: ciblage.js ~ line 41 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.housingType === 'barac') {
      finalScore -= 0.0281;
      console.log('🚀 ~ file: ciblage.js ~ line 45 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.housingType === 'case' || menage.housingType === 'tent') {
      finalScore -= 0.1267;
      console.log('🚀 ~ file: ciblage.js ~ line 49 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.floorMaterial === 'terre') {
      finalScore -= 0.2094;
      console.log('🚀 ~ file: ciblage.js ~ line 53 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.floorMaterial === 'ciment_beton' || menage.floorMaterial === 'carrelage') {
      finalScore += 0.2172;
      console.log('🚀 ~ file: ciblage.js ~ line 57 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.wallMaterial === 'ciment_beton') {
      finalScore += 0.2523;
      console.log('🚀 ~ file: ciblage.js ~ line 61 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.wallMaterial === 'no_walls') {
      finalScore -= 0.2563;
      console.log('🚀 ~ file: ciblage.js ~ line 65 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (
      menage.wallMaterial === 'terre' ||
      menage.wallMaterial === 'piere' ||
      menage.wallMaterial === 'brique'
    ) {
      finalScore += 0.0787;
      console.log('🚀 ~ file: ciblage.js ~ line 73 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (
      menage.wallMaterial === 'bois' ||
      menage.wallMaterial === 'zinc' ||
      menage.wallMaterial === 'tole_metal'
    ) {
      finalScore -= 0.095;
      console.log('🚀 ~ file: ciblage.js ~ line 81 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.TypeLatr === 'modern_toilet') {
      finalScore += 0.2057;
      console.log('🚀 ~ file: ciblage.js ~ line 85 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.TypeLatr === 'traditional_toilet') {
      finalScore += 0.1014;
      console.log('🚀 ~ file: ciblage.js ~ line 89 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.TypeLatr === 'nature' || menage.TypeLatr === 'baril') {
      finalScore -= 0.2497;
      console.log('🚀 ~ file: ciblage.js ~ line 97 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'house_robin') {
      finalScore += 0.0083;
      console.log('🚀 ~ file: ciblage.js ~ line 101 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'neighbor_robin') {
      finalScore -= 0.0307;
      console.log('🚀 ~ file: ciblage.js ~ line 105 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'public_robin') {
      finalScore += 0.2382;
      console.log('🚀 ~ file: ciblage.js ~ line 109 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'puit') {
      finalScore -= 0.2402;
      console.log('🚀 ~ file: ciblage.js ~ line 113 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'citerne') {
      finalScore += 0.0698;
      console.log('🚀 ~ file: ciblage.js ~ line 117 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'charrete') {
      finalScore -= 0.0005;
      console.log('🚀 ~ file: ciblage.js ~ line 121 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (
      menage.waterSource === 'fleuve' ||
      menage.waterSource === 'mar' ||
      menage.waterSource === 'pluie'
    ) {
      finalScore -= 0.0029;
      console.log('🚀 ~ file: ciblage.js ~ line 129 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.PSEC === 'colected_wood') {
      finalScore -= 0.181;
      console.log('🚀 ~ file: ciblage.js ~ line 133 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.PSEC === 'bought_wood') {
      finalScore += 0.0492;
      console.log('🚀 ~ file: ciblage.js ~ line 137 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.PSEC === 'wood_charcoal') {
      finalScore -= 0.0139;
      console.log('🚀 ~ file: ciblage.js ~ line 141 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.PSEC === 'gaz') {
      finalScore += 0.1929;
      console.log('🚀 ~ file: ciblage.js ~ line 145 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.lightSource === 'electricity_network') {
      finalScore += 0.3213;
      console.log('🚀 ~ file: ciblage.js ~ line 149 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.lightSource === 'candle_torch') {
      finalScore -= 0.3475;
      console.log('🚀 ~ file: ciblage.js ~ line 153 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.lightSource === 'solar_panel') {
      finalScore += 0.0473;
      console.log('🚀 ~ file: ciblage.js ~ line 157 ~ calculateScoring ~ finalScore', finalScore);
    }
  }
  if (localite[0].type === 'Urbain') {
    finalScore += (menage.NbrPieces / menage.NbrMbrMen) * 0.1964;
    if (menage.PersonnelMaison === 'yes') {
      finalScore += 0.19911;
    }
    if (menage.housingType === 'mbar') {
      finalScore -= 0.3036;
      console.log('🚀 ~ file: ciblage.js ~ line 65 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.housingType === 'villa') {
      finalScore += 0.21652;
      console.log('🚀 ~ file: ciblage.js ~ line 65 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.floorMaterial === 'ciment_beton' && menage.wallMaterial === 'ciment_beton') {
      finalScore += 0.266;
      console.log('🚀 ~ file: ciblage.js ~ line 65 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (
      menage.housingType === 'barac' ||
      menage.housingType === 'case' ||
      menage.housingType === 'tent'
    ) {
      finalScore -= 0.1111;
      console.log('🚀 ~ file: ciblage.js ~ line 65 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (
      Array.isArray(menage.doYouHaveOneOrMore) &&
      menage.doYouHaveOneOrMore.includes('PossMoto')
    ) {
      finalScore += 0.002545;
    }
    if (
      Array.isArray(menage.doYouHaveOneOrMore) &&
      menage.doYouHaveOneOrMore.includes('PossGrpElectr')
    ) {
      finalScore += 0.01984;
    }
    if (Array.isArray(menage.doYouHaveOneOrMore) && menage.doYouHaveOneOrMore.includes('PossLit')) {
      finalScore += 0.05926;
    }
    if (
      Array.isArray(menage.doYouHaveOneOrMore) &&
      menage.doYouHaveOneOrMore.includes('PossChauffeEau')
    ) {
      finalScore += 0.09959;
    }
    if (
      Array.isArray(menage.doYouHaveOneOrMore) &&
      menage.doYouHaveOneOrMore.includes('PossCuisMod')
    ) {
      finalScore += 0.1327;
    }
    if (Array.isArray(menage.doYouHaveOneOrMore) && menage.doYouHaveOneOrMore.includes('PossFer')) {
      finalScore += 0.1405;
    }
    if (
      Array.isArray(menage.doYouHaveOneOrMore) &&
      menage.doYouHaveOneOrMore.includes('PossVoit')
    ) {
      finalScore += 0.154;
    }
    if (
      Array.isArray(menage.doYouHaveOneOrMore) &&
      menage.doYouHaveOneOrMore.includes('PossClim')
    ) {
      finalScore += 0.1813;
    }
    if (
      Array.isArray(menage.doYouHaveOneOrMore) &&
      menage.doYouHaveOneOrMore.includes('PossTele')
    ) {
      finalScore += 0.2099;
    }
    if (menage.TypeLatr === 'modern_toilet') {
      finalScore += 0.181;
      console.log('🚀 ~ file: ciblage.js ~ line 85 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.TypeLatr === 'traditional_toilet') {
      finalScore -= 0.00685;
      console.log('🚀 ~ file: ciblage.js ~ line 93 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.TypeLatr === 'nature' || menage.TypeLatr === 'baril') {
      finalScore -= 0.2813;
      console.log('🚀 ~ file: ciblage.js ~ line 97 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'house_robin') {
      finalScore += 0.2582;
      console.log('🚀 ~ file: ciblage.js ~ line 101 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'neighbor_robin') {
      finalScore -= 0.2578;
      console.log('🚀 ~ file: ciblage.js ~ line 105 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'public_robin') {
      finalScore -= 0.09219;
      console.log('🚀 ~ file: ciblage.js ~ line 109 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'puit') {
      finalScore -= 0.1941;
      console.log('🚀 ~ file: ciblage.js ~ line 113 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'citerne') {
      finalScore += 0.02183;
      console.log('🚀 ~ file: ciblage.js ~ line 117 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'charrete') {
      finalScore -= 0.1159;
      console.log('🚀 ~ file: ciblage.js ~ line 121 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.PSEC === 'colected_wood') {
      finalScore -= 0.1048;
      console.log('🚀 ~ file: ciblage.js ~ line 133 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.PSEC === 'bought_wood') {
      finalScore -= 0.04107;
      console.log('🚀 ~ file: ciblage.js ~ line 137 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.PSEC === 'wood_charcoal') {
      finalScore -= 0.1401;
      console.log('🚀 ~ file: ciblage.js ~ line 141 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.PSEC === 'gaz') {
      finalScore += 0.1735;
      console.log('🚀 ~ file: ciblage.js ~ line 145 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.PSEC === 'electricity') {
      finalScore += 0.08712;
      console.log('🚀 ~ file: ciblage.js ~ line 145 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.lightSource === 'electricity_network') {
      finalScore += 0.3565;
      console.log('🚀 ~ file: ciblage.js ~ line 149 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.lightSource === 'candle_torch') {
      finalScore -= 0.3539;
      console.log('🚀 ~ file: ciblage.js ~ line 153 ~ calculateScoring ~ finalScore', finalScore);
    }
  }

  return Math.round((finalScore + Number.EPSILON) * 1000000) / 1000000;
};

export const calculateScoringSup = async (menage, localite) => {
  let finalScore = 0;
  if (localite.type === 'Rural') {
    finalScore += (menage.NbrPieces / menage.NbrMbrMen) * 0.1691;
    if (menage.habitTerre === 'yes' && parseInt(menage.landSize, 10) >= 500) {
      finalScore += 0.053;
      console.log('🚀 ~ file: ciblage.js ~ line 8 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (parseInt(menage.vache, 10) + parseInt(menage.camelin, 10) === 0) {
      finalScore -= 0.0235;
      console.log('🚀 ~ file: ciblage.js ~ line 12 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (parseInt(menage.vache, 10) + parseInt(menage.camelin, 10) >= 10) {
      finalScore += 0.0312;
      console.log('🚀 ~ file: ciblage.js ~ line 16 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (parseInt(menage.mouton, 10) + parseInt(menage.chevre, 10) === 0) {
      finalScore -= 0.0046;
      console.log('🚀 ~ file: ciblage.js ~ line 20 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (parseInt(menage.mouton, 10) + parseInt(menage.chevre, 10) >= 3) {
      finalScore += 0.0015;
      console.log('🚀 ~ file: ciblage.js ~ line 24 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.housingType === 'normal_house' || menage.housingType === 'normalhousessemi') {
      finalScore += 0.3312;
      console.log('🚀 ~ file: ciblage.js ~ line 33 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.housingType === 'villa') {
      finalScore += 0.1803;
      console.log('🚀 ~ file: ciblage.js ~ line 37 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.housingType === 'mbar') {
      finalScore -= 0.2632;
      console.log('🚀 ~ file: ciblage.js ~ line 41 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.housingType === 'barac') {
      finalScore -= 0.0281;
      console.log('🚀 ~ file: ciblage.js ~ line 45 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.housingType === 'case' || menage.housingType === 'tent') {
      finalScore -= 0.1267;
      console.log('🚀 ~ file: ciblage.js ~ line 49 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.floorMaterial === 'terre') {
      finalScore -= 0.2094;
      console.log('🚀 ~ file: ciblage.js ~ line 53 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.floorMaterial === 'ciment_beton' || menage.floorMaterial === 'carrelage') {
      finalScore += 0.2172;
      console.log('🚀 ~ file: ciblage.js ~ line 57 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.wallMaterial === 'ciment_beton') {
      finalScore += 0.2523;
      console.log('🚀 ~ file: ciblage.js ~ line 61 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.wallMaterial === 'no_walls') {
      finalScore -= 0.2563;
      console.log('🚀 ~ file: ciblage.js ~ line 65 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (
      menage.wallMaterial === 'terre' ||
      menage.wallMaterial === 'piere' ||
      menage.wallMaterial === 'brique'
    ) {
      finalScore += 0.0787;
      console.log('🚀 ~ file: ciblage.js ~ line 73 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (
      menage.wallMaterial === 'bois' ||
      menage.wallMaterial === 'zinc' ||
      menage.wallMaterial === 'tole_metal'
    ) {
      finalScore -= 0.095;
      console.log('🚀 ~ file: ciblage.js ~ line 81 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.TypeLatr === 'modern_toilet') {
      finalScore += 0.2057;
      console.log('🚀 ~ file: ciblage.js ~ line 85 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.TypeLatr === 'traditional_toilet') {
      finalScore += 0.1014;
      console.log('🚀 ~ file: ciblage.js ~ line 89 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.TypeLatr === 'nature' || menage.TypeLatr === 'baril') {
      finalScore -= 0.2497;
      console.log('🚀 ~ file: ciblage.js ~ line 97 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'house_robin') {
      finalScore += 0.0083;
      console.log('🚀 ~ file: ciblage.js ~ line 101 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'neighbor_robin') {
      finalScore -= 0.0307;
      console.log('🚀 ~ file: ciblage.js ~ line 105 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'public_robin') {
      finalScore += 0.2382;
      console.log('🚀 ~ file: ciblage.js ~ line 109 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'puit') {
      finalScore -= 0.2402;
      console.log('🚀 ~ file: ciblage.js ~ line 113 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'citerne') {
      finalScore += 0.0698;
      console.log('🚀 ~ file: ciblage.js ~ line 117 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'charrete') {
      finalScore -= 0.0005;
      console.log('🚀 ~ file: ciblage.js ~ line 121 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (
      menage.waterSource === 'fleuve' ||
      menage.waterSource === 'mar' ||
      menage.waterSource === 'pluie'
    ) {
      finalScore -= 0.0029;
      console.log('🚀 ~ file: ciblage.js ~ line 129 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.PSEC === 'colected_wood') {
      finalScore -= 0.181;
      console.log('🚀 ~ file: ciblage.js ~ line 133 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.PSEC === 'bought_wood') {
      finalScore += 0.0492;
      console.log('🚀 ~ file: ciblage.js ~ line 137 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.PSEC === 'wood_charcoal') {
      finalScore -= 0.0139;
      console.log('🚀 ~ file: ciblage.js ~ line 141 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.PSEC === 'gaz') {
      finalScore += 0.1929;
      console.log('🚀 ~ file: ciblage.js ~ line 145 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.lightSource === 'electricity_network') {
      finalScore += 0.3213;
      console.log('🚀 ~ file: ciblage.js ~ line 149 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.lightSource === 'candle_torch') {
      finalScore -= 0.3475;
      console.log('🚀 ~ file: ciblage.js ~ line 153 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.lightSource === 'solar_panel') {
      finalScore += 0.0473;
      console.log('🚀 ~ file: ciblage.js ~ line 157 ~ calculateScoring ~ finalScore', finalScore);
    }
  }
  if (localite.type === 'Urbain') {
    finalScore += (menage.NbrPieces / menage.NbrMbrMen) * 0.1964;
    if (menage.PersonnelMaison === 'yes') {
      finalScore += 0.19911;
    }
    if (menage.housingType === 'mbar') {
      finalScore -= 0.3036;
      console.log('🚀 ~ file: ciblage.js ~ line 65 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.housingType === 'villa') {
      finalScore += 0.21652;
      console.log('🚀 ~ file: ciblage.js ~ line 65 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.floorMaterial === 'ciment_beton' && menage.wallMaterial === 'ciment_beton') {
      finalScore += 0.266;
      console.log('🚀 ~ file: ciblage.js ~ line 65 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (
      menage.housingType === 'barac' ||
      menage.housingType === 'case' ||
      menage.housingType === 'tent'
    ) {
      finalScore -= 0.1111;
      console.log('🚀 ~ file: ciblage.js ~ line 65 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (
      Array.isArray(menage.doYouHaveOneOrMore) &&
      menage.doYouHaveOneOrMore.includes('PossMoto')
    ) {
      finalScore += 0.002545;
    }
    if (
      Array.isArray(menage.doYouHaveOneOrMore) &&
      menage.doYouHaveOneOrMore.includes('PossGrpElectr')
    ) {
      finalScore += 0.01984;
    }
    if (Array.isArray(menage.doYouHaveOneOrMore) && menage.doYouHaveOneOrMore.includes('PossLit')) {
      finalScore += 0.05926;
    }
    if (
      Array.isArray(menage.doYouHaveOneOrMore) &&
      menage.doYouHaveOneOrMore.includes('PossChauffeEau')
    ) {
      finalScore += 0.09959;
    }
    if (
      Array.isArray(menage.doYouHaveOneOrMore) &&
      menage.doYouHaveOneOrMore.includes('PossCuisMod')
    ) {
      finalScore += 0.1327;
    }
    if (Array.isArray(menage.doYouHaveOneOrMore) && menage.doYouHaveOneOrMore.includes('PossFer')) {
      finalScore += 0.1405;
    }
    if (
      Array.isArray(menage.doYouHaveOneOrMore) &&
      menage.doYouHaveOneOrMore.includes('PossVoit')
    ) {
      finalScore += 0.154;
    }
    if (
      Array.isArray(menage.doYouHaveOneOrMore) &&
      menage.doYouHaveOneOrMore.includes('PossClim')
    ) {
      finalScore += 0.1813;
    }
    if (
      Array.isArray(menage.doYouHaveOneOrMore) &&
      menage.doYouHaveOneOrMore.includes('PossTele')
    ) {
      finalScore += 0.2099;
    }
    if (menage.TypeLatr === 'modern_toilet') {
      finalScore += 0.181;
      console.log('🚀 ~ file: ciblage.js ~ line 85 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.TypeLatr === 'traditional_toilet') {
      finalScore -= 0.00685;
      console.log('🚀 ~ file: ciblage.js ~ line 93 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.TypeLatr === 'nature' || menage.TypeLatr === 'baril') {
      finalScore -= 0.2813;
      console.log('🚀 ~ file: ciblage.js ~ line 97 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'house_robin') {
      finalScore += 0.2582;
      console.log('🚀 ~ file: ciblage.js ~ line 101 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'neighbor_robin') {
      finalScore -= 0.2578;
      console.log('🚀 ~ file: ciblage.js ~ line 105 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'public_robin') {
      finalScore -= 0.09219;
      console.log('🚀 ~ file: ciblage.js ~ line 109 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'puit') {
      finalScore -= 0.1941;
      console.log('🚀 ~ file: ciblage.js ~ line 113 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'citerne') {
      finalScore += 0.02183;
      console.log('🚀 ~ file: ciblage.js ~ line 117 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.waterSource === 'charrete') {
      finalScore -= 0.1159;
      console.log('🚀 ~ file: ciblage.js ~ line 121 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.PSEC === 'colected_wood') {
      finalScore -= 0.1048;
      console.log('🚀 ~ file: ciblage.js ~ line 133 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.PSEC === 'bought_wood') {
      finalScore -= 0.04107;
      console.log('🚀 ~ file: ciblage.js ~ line 137 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.PSEC === 'wood_charcoal') {
      finalScore -= 0.1401;
      console.log('🚀 ~ file: ciblage.js ~ line 141 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.PSEC === 'gaz') {
      finalScore += 0.1735;
      console.log('🚀 ~ file: ciblage.js ~ line 145 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.PSEC === 'electricity') {
      finalScore += 0.08712;
      console.log('🚀 ~ file: ciblage.js ~ line 145 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.lightSource === 'electricity_network') {
      finalScore += 0.3565;
      console.log('🚀 ~ file: ciblage.js ~ line 149 ~ calculateScoring ~ finalScore', finalScore);
    }
    if (menage.lightSource === 'candle_torch') {
      finalScore -= 0.3539;
      console.log('🚀 ~ file: ciblage.js ~ line 153 ~ calculateScoring ~ finalScore', finalScore);
    }
  }

  return Math.round((finalScore + Number.EPSILON) * 1000000) / 1000000;
};

export const selectedMenagesForSurvery = async (user, communeId, quota, amenages) => {
  const menages = amenages.filtered(`communeId == oid(${communeId})`).sorted('Score', false);
  const menagesToSelect = menages.filtered(
    `(AASituatMen == $0 OR AASituatMen == $1) && (AMSituatMen == $0 OR AMSituatMen == $1)`,
    'so_poor',
    'poor',
  );
  const params = await getParams(user);
  const localites = getCommuneLocalites(communeId);
  const { localMinQuota, systemPercentage } = params[0];
  const tauxComn = Math.ceil((menages.length * quota) / 100);
  const selectedMenages = [];

  if (localites.find(l => !l.type)) {
    return false;
  }
  console.log('taux', tauxComn);

  for (let i = 0; i < tauxComn; i++) {
    if (menagesToSelect[i]) selectedMenages.push(menagesToSelect[i]);
  }

  for (let i = 0; i < localites.length; i++) {
    const localQuest = global.realms[0]
      .objects('formulairelocalite')
      .filtered(
        `operationId == oid(${user.operationId}) && localiteId == oid(${localites[i]._id})`,
      );
    if (localites[i].type === 'Urbain') {
      const localiteSelectedMngs = selectedMenages.filter(
        m => String(m.localiteId) === String(localites[i]._id),
      );
      console.log('localiteSleectedMenages', localiteSelectedMngs.length);
      const date = new Date();
      try {
        global.realms[0].write(() => {
          for (const menage of localiteSelectedMngs) {
            menage.syncedAt = null;
            menage.updatedAt = date;
            menage.Eligible = true;
            menage.selectedBySys = true;
            menage.excluded = false;
            menage.listValidated = true;
          }
        });
      } catch (error) {
        console.log('error', error);
      }
      try {
        global.realms[0].write(() => {
          if (localQuest[0]) {
            global.realms[0].create(
              'formulairelocalite',
              {
                _id: new ObjectId(localQuest[0]._id),
                _partition: user._partition,
                syncedAt: null,
                updatedAt: date,
                leftForSelection: 0,
                excludedNum: 0,
                listConfirmed: true,
                sysmenages: 0,
              },
              'modified',
            );
          } else {
            global.realms[0].create('formulairelocalite', {
              _id: new ObjectId(),
              _partition: user._partition,
              syncedAt: null,
              updatedAt: date,
              leftForSelection: 0,
              excludedNum: 0,
              listConfirmed: true,
              sysmenages: 0,
              createdAt: date,
              wilayaId: new ObjectId(localites[i].wilayaId),
              moughataaId: new ObjectId(localites[i].moughataaId),
              communeId: new ObjectId(localites[i].communeId),
              localiteId: new ObjectId(localites[i]._id),
              operationId: new ObjectId(user.operationId),
              localeName: localites[i].namefr_rs,
              otherName: localites[i].namear,
            });
          }
        });
      } catch (error) {
        console.log('error', error);
      }
    }
    if (localites[i].type === 'Rural') {
      const localiteSelectedMngs = selectedMenages.filter(
        m => String(m.localiteId) === String(localites[i]._id),
      );
      const localiteMenages = menages.filtered(`localiteId == oid(${localites[i]._id})`);
      if (localiteMenages.length > 5) {
        if (localiteSelectedMngs.length < localMinQuota) {
          const difr = localMinQuota - localiteSelectedMngs.length;
          const m = localiteSelectedMngs.length;
          for (let j = 0; j < difr; j++) {
            if (localiteMenages[m + j]) {
              localiteSelectedMngs.push(localiteMenages[localiteSelectedMngs.length + j]);
            }
          }
          const localSysQuot = Math.ceil((localiteSelectedMngs.length * systemPercentage) / 100);
          const left = localiteSelectedMngs.length - localSysQuot;
          const date = new Date();
          try {
            global.realms[0].write(() => {
              for (const menage of localSysQuot) {
                menage.syncedAt = null;
                menage.updatedAt = date;
                menage.Eligible = true;
                menage.selectedBySys = true;
                menage.excluded = false;
                menage.validated = false;
                menage.listValidated = false;
              }
            });
          } catch (error) {
            console.log('error', error);
          }
          try {
            global.realms[0].write(() => {
              if (localQuest[0]) {
                global.realms[0].create(
                  'formulairelocalite',
                  {
                    _id: new ObjectId(localQuest[0]._id),
                    _partition: user._partition,
                    communeId: new ObjectId(communeId),
                    localiteId: new ObjectId(localites[i]._id),
                    syncedAt: null,
                    updatedAt: date,
                    leftForSelection: left,
                    excludedNum: 0,
                    listConfirmed: false,
                    sysmenages: localSysQuot,
                  },
                  'modified',
                );
              } else {
                global.realms[0].create('formulairelocalite', {
                  _id: new ObjectId(),
                  _partition: user._partition,
                  syncedAt: null,
                  updatedAt: date,
                  leftForSelection: left,
                  excludedNum: 0,
                  listConfirmed: false,
                  sysmenages: localSysQuot,
                  createdAt: date,
                  wilayaId: new ObjectId(localites[i].wilayaId),
                  moughataaId: new ObjectId(localites[i].moughataaId),
                  communeId: new ObjectId(localites[i].communeId),
                  localiteId: new ObjectId(localites[i]._id),
                  operationId: new ObjectId(user.operationId),
                  localeName: localites[i].namefr_rs,
                  otherName: localites[i].namear,
                });
              }
            });
          } catch (error) {
            console.log('error', error);
          }
        } else {
          const localSysQuot = Math.floor((localiteSelectedMngs.length * systemPercentage) / 100);
          const sysMenages = [];
          const left = localiteSelectedMngs.length - localSysQuot;
          for (let j = 0; j < localSysQuot; j++) {
            sysMenages.push(localiteSelectedMngs[j]);
          }
          const date = new Date();
          if (localiteSelectedMngs.length === localiteMenages.length) {
            try {
              global.realms[0].write(() => {
                for (const menage of localiteMenages) {
                  menage.syncedAt = null;
                  menage.updatedAt = date;
                  menage.Eligible = true;
                  menage.selectedBySys = true;
                  menage.excluded = false;
                  menage.validated = false;
                  menage.listValidated = true;
                }
              });
            } catch (error) {
              console.log('error', error);
            }
            try {
              if (localQuest[0]) {
                global.realms[0].write(() => {
                  global.realms[0].create(
                    'formulairelocalite',
                    {
                      _id: new ObjectId(localQuest[0]._id),
                      _partition: user._partition,
                      syncedAt: null,
                      updatedAt: date,
                      leftForSelection: 0,
                      excludedNum: 0,
                      listConfirmed: true,
                      sysmenages: localSysQuot,
                    },
                    'modified',
                  );
                });
              } else {
                global.realms[0].write(() => {
                  global.realms[0].create('formulairelocalite', {
                    _id: new ObjectId(),
                    _partition: user._partition,
                    syncedAt: null,
                    updatedAt: date,
                    leftForSelection: 0,
                    excludedNum: 0,
                    listConfirmed: true,
                    sysmenages: localSysQuot,
                    createdAt: date,
                    wilayaId: new ObjectId(localites[i].wilayaId),
                    moughataaId: new ObjectId(localites[i].moughataaId),
                    communeId: new ObjectId(localites[i].communeId),
                    localiteId: new ObjectId(localites[i]._id),
                    operationId: new ObjectId(user.operationId),
                    localeName: localites[i].namefr_rs,
                    otherName: localites[i].namear,
                  });
                });
              }
            } catch (error) {
              console.log('error', error);
            }
          } else {
            try {
              global.realms[0].write(() => {
                for (const menage of sysMenages) {
                  menage.syncedAt = null;
                  menage.updatedAt = date;
                  menage.Eligible = true;
                  menage.selectedBySys = true;
                  menage.excluded = false;
                  menage.validated = false;
                  menage.listValidated = false;
                }
              });
            } catch (error) {
              console.log('error', error);
            }
            try {
              if (localQuest[0]) {
                global.realms[0].write(() => {
                  global.realms[0].create(
                    'formulairelocalite',
                    {
                      _id: new ObjectId(localQuest[0]._id),
                      _partition: user._partition,
                      syncedAt: null,
                      updatedAt: date,
                      leftForSelection: left,
                      excludedNum: 0,
                      listConfirmed: false,
                      sysmenages: localSysQuot,
                    },
                    'modified',
                  );
                });
              } else {
                global.realms[0].write(() => {
                  global.realms[0].create('formulairelocalite', {
                    _id: new ObjectId(),
                    _partition: user._partition,
                    syncedAt: null,
                    updatedAt: date,
                    leftForSelection: left,
                    excludedNum: 0,
                    listConfirmed: false,
                    sysmenages: localSysQuot,
                    createdAt: date,
                    wilayaId: new ObjectId(localites[i].wilayaId),
                    moughataaId: new ObjectId(localites[i].moughataaId),
                    communeId: new ObjectId(localites[i].communeId),
                    localiteId: new ObjectId(localites[i]._id),
                    operationId: new ObjectId(user.operationId),
                    localeName: localites[i].namefr_rs,
                    otherName: localites[i].namear,
                  });
                });
              }
            } catch (error) {
              console.log('error', error);
            }
          }
        }
      }
      if (localiteMenages.length <= 5) {
        const date = new Date();
        try {
          global.realms[0].write(() => {
            for (const menage of localiteSelectedMngs) {
              menage.syncedAt = null;
              menage.updatedAt = date;
              menage.Eligible = true;
              menage.selectedBySys = true;
              menage.excluded = false;
              menage.validated = false;
              menage.listValidated = true;
            }
          });
        } catch (error) {
          console.log('error', error);
        }
        try {
          global.realms[0].write(() => {
            if (localQuest[0]) {
              global.realms[0].create(
                'formulairelocalite',
                {
                  _id: new ObjectId(localQuest[0]._id),
                  _partition: user._partition,
                  syncedAt: null,
                  updatedAt: date,
                  excludedNum: 0,
                  listConfirmed: true,
                },
                'modified',
              );
            } else {
              global.realms[0].create('formulairelocalite', {
                _id: new ObjectId(),
                _partition: user._partition,
                syncedAt: null,
                updatedAt: date,
                createdAt: date,
                excludedNum: 0,
                listConfirmed: true,
                wilayaId: new ObjectId(localites[i].wilayaId),
                moughataaId: new ObjectId(localites[i].moughataaId),
                communeId: new ObjectId(localites[i].communeId),
                localiteId: new ObjectId(localites[i]._id),
                operationId: new ObjectId(user.operationId),
                localeName: localites[i].namefr_rs,
                otherName: localites[i].namear,
              });
            }
          });
        } catch (error) {
          console.log('error', error);
        }
      }
    }
  }

  return true;
};

export const selectedMenagesForSurveryNoFilter = async (user, communeId, quota, amenages) => {
  console.log('amenages', quota);
  const menages = amenages;
  const menagesToSelect = menages;
  const params = await getParams(user);
  const localites = getCommuneLocalites(communeId);
  const { localMinQuota, systemPercentage } = params[0];
  const tauxComn = Math.ceil((menages.length * quota.quota) / 100);
  const selectedMenages = [];

  if (localites.find(l => !l.type)) {
    return false;
  }
  console.log('taux', tauxComn);

  for (let i = 0; i < tauxComn; i++) {
    if (menagesToSelect[i]) selectedMenages.push(menagesToSelect[i]);
  }

  for (let i = 0; i < localites.length; i++) {
    const localQuest = global.realms[0]
      .objects('formulairelocalite')
      .filtered(
        `operationId == oid(${user.operationId}) && localiteId == oid(${localites[i]._id})`,
      );
    if (localites[i].type === 'Urbain') {
      const localiteSelectedMngs = selectedMenages.filter(
        m => String(m.localiteId) === String(localites[i]._id),
      );
      const date = new Date();
      try {
        global.realms[0].write(() => {
          for (const menage of localiteSelectedMngs) {
            menage.syncedAt = null;
            menage.updatedAt = date;
            menage.EligibleS = true;
          }
        });
      } catch (error) {
        console.log('error', error);
      }
    }
    if (localites[i].type === 'Rural') {
      const localiteSelectedMngs = selectedMenages.filter(
        m => String(m.localiteId) === String(localites[i]._id),
      );
      const localiteMenages = menages.filtered(`localiteId == oid(${localites[i]._id})`);
      if (localiteMenages.length > 5) {
        if (localiteSelectedMngs.length < localMinQuota) {
          const difr = localMinQuota - localiteSelectedMngs.length;
          const m = localiteSelectedMngs.length;
          for (let j = 0; j < difr; j++) {
            if (localiteMenages[m + j]) {
              localiteSelectedMngs.push(localiteMenages[localiteSelectedMngs.length + j]);
            }
          }
          const localSysQuot = Math.ceil((localiteSelectedMngs.length * systemPercentage) / 100);
          const date = new Date();
          try {
            global.realms[0].write(() => {
              for (const menage of localSysQuot) {
                menage.syncedAt = null;
                menage.updatedAt = date;
                menage.EligibleS = true;
              }
            });
          } catch (error) {
            console.log('error', error);
          }
        } else {
          const localSysQuot = Math.floor((localiteSelectedMngs.length * systemPercentage) / 100);
          const sysMenages = [];
          for (let j = 0; j < localSysQuot; j++) {
            sysMenages.push(localiteSelectedMngs[j]);
          }
          const date = new Date();
          if (localiteSelectedMngs.length === localiteMenages.length) {
            try {
              global.realms[0].write(() => {
                for (const menage of localiteMenages) {
                  menage.syncedAt = null;
                  menage.updatedAt = date;
                  menage.EligibleS = true;
                }
              });
            } catch (error) {
              console.log('error', error);
            }
          } else {
            try {
              global.realms[0].write(() => {
                for (const menage of sysMenages) {
                  menage.syncedAt = null;
                  menage.updatedAt = date;
                  menage.EligibleS = true;
                }
              });
            } catch (error) {
              console.log('error', error);
            }
          }
        }
      }
      if (localiteMenages.length <= 5) {
        const date = new Date();
        try {
          global.realms[0].write(() => {
            for (const menage of localiteSelectedMngs) {
              menage.syncedAt = null;
              menage.updatedAt = date;
              menage.EligibleS = true;
            }
          });
        } catch (error) {
          console.log('error', error);
        }
      }
    }
  }

  return true;
};
