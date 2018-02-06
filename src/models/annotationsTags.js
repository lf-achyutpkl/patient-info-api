import bookshelf from '../db';

const TABLE_NAME = 'annotations_tags';

/**
 * Patient model.
 */
let AnnotationTags = bookshelf.Model.extend({
  tableName: TABLE_NAME,

  hasTimestamps: false
});

export default AnnotationTags;
