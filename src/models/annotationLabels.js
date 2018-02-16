import bookshelf from '../db';

const TABLE_NAME = 'annotation_labels';

/**
 * tags model.
 */
let AnnotationLabels = bookshelf.Model.extend({
  tableName: TABLE_NAME,

  hasTimestamps: false
});

export default AnnotationLabels;
