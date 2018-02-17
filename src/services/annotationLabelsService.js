import AnnotationLabels from '../models/annotationLabels';

/**
 * Get annotation labels by type.
 *
 * @return {Promise}
 */
export function getLabelByType(type) {
  return new AnnotationLabels({ labelType: type }).fetchAll();
}
