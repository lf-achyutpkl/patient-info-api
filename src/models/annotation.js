import bookshelf from '../db';
import Patient from './patient';

const TABLE_NAME = 'annotations';

/**
 * Annotation model.
 */
let Annotation = bookshelf.Model.extend({
  tableName: TABLE_NAME,

  hasTimestamps: true,


  patient: function () {
    return this.belongsTo(Patient, 'patient_id');
  }
});

export default Annotation;
