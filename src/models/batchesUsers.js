import bookshelf from '../db';

const TABLE_NAME = 'batches_users';

/**
 * BatchesUsers model.
 */
let BatchesUsers = bookshelf.Model.extend({
  tableName: TABLE_NAME,

  hasTimestamps: false
});

export default BatchesUsers;
