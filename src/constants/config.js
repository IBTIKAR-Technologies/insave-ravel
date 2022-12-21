import { Dirs } from 'react-native-file-access';

const isDevEnv = __DEV__;

export default {
  appName: 'Ciblage Interrieur',
  isDevEnv,
  realmPath: Dirs.DatabaseDir,
  appConfig: {
    id: 'ciblage-registre-qdflj',
    timeout: 15000,
  },
  LOG_TO_FILE: isDevEnv,
  TRACE_LOG: isDevEnv,
  schemaNames: [
    'menage',
    'concession',
    'zone',
    'user',
    'localite',
    'commune',
    'formulairelocalite',
    'quota',
    'param',
    'formulairelocalite_sages',
    'formulairelocalite_position',
    'country',
    'enquete',
    'menagemembre',
    'sage',
    'closedcommune',
  ],
  version: 'v0.7.1',
};
