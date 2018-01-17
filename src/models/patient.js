import bookshelf from '../db';
import Annotation from './annotation';

const TABLE_NAME = 'patients';

/**
 * User model.
 */
class Patient extends bookshelf.Model {
  get tableName() {
    return TABLE_NAME;
  }

  get hasTimestamps() {
    return true;
  }

  get annotations() {
    return this.hasMany(Annotation);
  }
}

export default Patient;
