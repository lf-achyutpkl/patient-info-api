import bookshelf from '../db';

const TABLE_NAME = 'annotations_batches';

/**
 * Patient model.
 */
let AnnotationBatches = bookshelf.Model.extend({
  tableName: TABLE_NAME,

  hasTimestamps: false
});

export default AnnotationBatches;
