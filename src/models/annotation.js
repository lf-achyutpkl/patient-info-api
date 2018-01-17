import bookshelf from '../db';
import Patient from './patient';

const TABLE_NAME = 'annotations';

/**
 * User model.
 */
class Annotation extends bookshelf.Model {
  get tableName() {
    return TABLE_NAME;
  }

  get hasTimestamps() {
    return true;
  }

  get annotations() {
    return this.belongsTo(Patient);
  }
}

export default Annotation;
