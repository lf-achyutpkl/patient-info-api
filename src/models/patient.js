import bookshelf from '../db';
import Annotation from './annotation';

const TABLE_NAME = 'patients';

/**
 * Patient model.
 */
let Patient = bookshelf.Model.extend({
  tableName: TABLE_NAME,

  hasTimestamps: true,

  annotations: function() {
    return this.hasMany(Annotation);
  }
});

export default Patient;
