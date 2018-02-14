import bookshelf from '../db';

const TABLE_NAME = 'tags';

/**
 * tags model.
 */
let Tags = bookshelf.Model.extend({
  tableName: TABLE_NAME,

  hasTimestamps: false
});

export default Tags;
