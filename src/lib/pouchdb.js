import PouchDB from '@craftzdog/pouchdb-core-react-native';
import HttpPouch from 'pouchdb-adapter-http';
import replication from '@craftzdog/pouchdb-replication-react-native';
import mapreduce from 'pouchdb-mapreduce';

import SQLite from 'react-native-sqlite-2';
import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite';

const SQLiteAdapter = SQLiteAdapterFactory(SQLite);

export const nameIndex = { UPDATED_AT: 'index-updated_at' };

const myIP = 'couchdb.ibtikar-tech.com';

export default PouchDB.plugin(HttpPouch)
  .plugin(replication)
  .plugin(mapreduce)
  .plugin(SQLiteAdapter);

export const remoteNoteDb = new PouchDB('https://couchdb:123321@couchdb.ibtikar-tech.com/');
export const localNoteDb = new PouchDB('note', { adapter: 'react-native-sqlite' });
