export const personSchema = {
  name: 'person',
  properties: {
    _id: 'objectId',
    NNI: 'string?',
    _partition: 'string',
    birthDate: 'string?',
    createdAt: 'date?',
    createdById: 'objectId',
    firstName: 'string?',
    image: 'string?',
    lastName: 'string?',
    sex: 'string?',
    syncedAt: 'date?',
    updatedAt: 'date?',
    userId: 'string?',
  },
  primaryKey: '_id',
};

export const userSchema = {
  name: 'user',
  properties: {
    _id: 'objectId',
    _partition: 'string',
    active: 'bool?',
    addedCount: 'int?',
    closedCommunes: 'string[]',
    communeId: 'objectId?',
    controllerId: 'objectId?',
    createdAt: 'date?',
    createdById: 'objectId?',
    excluded: 'int?',
    fullName: 'string?',
    id: 'string?',
    lastLoggedIn: 'date?',
    moughataaId: 'objectId?',
    nni: 'string?',
    operationId: 'objectId?',
    password: 'string?',
    person: 'user_person',
    personId: 'objectId?',
    phoneNumber: 'string?',
    role: 'string?',
    roleId: 'objectId?',
    syncedAt: 'date?',
    toBeSelectedCount: 'int?',
    updatedAt: 'date?',
    username: 'string?',
    wilayaId: 'objectId?',
    zonesIds: 'objectId[]',
  },
  primaryKey: '_id',
};

export const user_personSchema = {
  name: 'user_person',
  embedded: true,
  properties: {
    NNI: 'string?',
    birthDate: 'string?',
    firstName: 'string?',
    image: 'string?',
    lastName: 'string?',
    sex: 'string?',
    updatedAt: 'date?',
  },
};
