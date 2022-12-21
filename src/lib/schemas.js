export const personesSchema = {
  name: 'person',
  properties: {
    _id: 'objectId',
    NNI: 'string?',
    _partition: 'string',
    createdAt: 'date?',
    sex: 'string?',
    syncedAt: 'date?',
    birthDate: 'string?',
    updatedAt: 'date?',
    createdById: 'objectId',
    firstName: 'string?',
    lastName: 'string?',
    image: 'string?',
  },
  primaryKey: '_id',
};
