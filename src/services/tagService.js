import Tags from '../models/tags';
import AnnotationTags from '../models/annotationsTags';

/**
 * Get all tags.
 *
 * @return {Promise}
 */
export function getAllTags() {
  return Tags.fetchAll();
}

/**
 * Create new tag.
 *
 * @param  string  tagName
 * @return {Promise}
 */
export function createTag(tag) {
  return new Tags({ tagName: tag.tagName }).save().then(tag => tag.refresh());
}

/**
 * Delete new tag for image.
 *
 * @param  integer  tagId
 * @param  integer  imageId
 * @return {Promise}
 */

export function deleteTagForImage(tagId, imageId) {
  return AnnotationTags.where({ tag_id: tagId })
    .where({ annotation_id: imageId })
    .destroy();
}
