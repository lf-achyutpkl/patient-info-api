import bookshelf from '../db';

const TABLE_NAME = 'diagnosis';

/**
 * tags model.
 */
let Diagnosis = bookshelf.Model.extend({
  tableName: TABLE_NAME,

  hasTimestamps: false
});

export default Diagnosis;
