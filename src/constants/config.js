import { Dirs } from 'react-native-file-access';

const isDevEnv = __DEV__;

export default {
  appName: 'PSE',
  isDevEnv,
  realmPath: Dirs.DatabaseDir,
  appConfig: {
    id: 'ravel-insave-yliiy',
    timeout: 15000,
  },
  LOG_TO_FILE: isDevEnv,
  TRACE_LOG: isDevEnv,
  schemaNames: [],
  version: 'v0.9.24',
};
