import bookshelf from '../db';
import Annotation from './annotation';

const TABLE_NAME = 'batches';

/**
 * User model.
 */
let Batches = bookshelf.Model.extend({
  tableName: TABLE_NAME,
  hasTimestamps: false,
  annotations: function() {
    return this.belongsToMany(Annotation);
  }
});

export default Batches;
