import Tags from '../models/tags';

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
