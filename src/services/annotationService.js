import Boom from 'boom';
import Annotation from '../models/annotation';
import AnnotationsTags from '../models/annotationsTags';
import * as tagService from './tagService';
import async from 'async';

export function getAllAnnotation(queryParams) {
  if (!'true'.localeCompare(queryParams.annotation)) {
    return Annotation.where({ user_id: queryParams.userId, is_reject: queryParams.isReject })
      .query('where', 'annotation_info', '<>', '')
      .orderBy('id', 'ASC')
      .fetchPage({
        pageSize: queryParams.pageSize,
        page: queryParams.page,
        withRelated: ['patient', 'tags']
      });
  }

  if (!'false'.localeCompare(queryParams.annotation)) {
    return Annotation.where({ user_id: queryParams.userId, is_reject: queryParams.isReject })
      .query('where', 'annotation_info', '=', '')
      .orderBy('id', 'ASC')
      .fetchPage({
        pageSize: queryParams.pageSize,
        page: queryParams.page,
        withRelated: ['patient', 'tags']
      });
  }

  return Annotation.where({ user_id: queryParams.userId, is_reject: queryParams.isReject })
    .orderBy('id', 'ASC')
    .fetchPage({
      pageSize: queryParams.pageSize,
      page: queryParams.page,
      withRelated: ['patient', 'tags']
    });
}

export function getAnnotation(id) {
  return new Annotation({ id }).fetch({ withRelated: ['patient', 'tags'] }).then(annotation => {
    if (!annotation) {
      throw new Boom.notFound('Annotation not found');
    }

    return annotation;
  });
}

export function updateAnnotation(id, newAnnotation) {
  return new Promise((resolve, reject) => {
    new Annotation({ id }).fetch().then(annotation => {
      if (!annotation) {
        throw new Boom.notFound('Annotation not found');
      }

      annotation.annotationInfo = newAnnotation.annotationInfo;
      annotation.tags = newAnnotation.tags;
      annotation.remarks = newAnnotation.remarks;
      annotation.isReject = newAnnotation.isReject;

      async.eachLimit(
        newAnnotation.tags,
        1,
        function(tag, callback) {
          if (tag.id === 0) {
            tagService.createTag({ tagName: tag.tagName }).then(newtag => {
              new AnnotationsTags({ tag_id: newtag.id, annotation_id: id }).save().then(() => {
                callback();
              });
            });
          } else {
            new AnnotationsTags({ annotation_id: id, tag_id: tag.id }).fetch().then(annotationstags => {
              if (!annotationstags) {
                new AnnotationsTags({ tag_id: tag.id, annotation_id: id }).save().then(() => {
                  callback();
                });
              } else {
                callback();
              }
            });
          }
        },
        function(err) {
          if (err) {
            reject(err);
          }

          new Annotation({ id })
            .save(
              {
                annotationInfo: newAnnotation.annotationInfo,
                remarks: newAnnotation.remarks,
                isReject: newAnnotation.isReject
              },
              { patch: true }
            )
            .then(() => {
              resolve(new Annotation({ id }).fetch({ withRelated: ['patient', 'tags'] }));
            });
        }
      );
    });
  });
}
