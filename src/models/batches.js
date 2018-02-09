import bookshelf from '../db';
import Annotation from './annotation';
import User from './user';

const TABLE_NAME = 'batches';

/**
 * User model.
 */
let Batches = bookshelf.Model.extend({
  tableName: TABLE_NAME,
  hasTimestamps: false,
  annotations: function() {
    return this.belongsToMany(Annotation);
  },
  users: function() {
    return this.belongsToMany(User);
  }
});

export default Batches;
