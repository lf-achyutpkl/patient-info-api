import Boom from 'boom';
import Annotation from '../models/annotation';
import AnnotationsTags from '../models/annotationsTags';
import * as tagService from './tagService';
import Batches from '../models/batches';
import async from 'async';

export function getAllAnnotation(queryParams) {
  return Batches.where({ id: queryParams.batchId })
    .fetch({
      withRelated: ['annotations']
    })
    .then(batch => {
      if (!batch) {
        throw new Boom.notFound('Batch not found');
      }
      let annotationIds = batch.toJSON().annotations.map(annotation => {
        return annotation.id;
      });
      if (queryParams.tagId > 0) {
        return AnnotationsTags.where({ tag_id: queryParams.tagId })
          .fetchAll()
          .then(tags => {
            let annotationIdsWithTag = tags.map(tag => {
              return tag.get('annotationId');
            });
            let intersectionAnnotationIds = [annotationIds, annotationIdsWithTag].reduce((a, b) =>
              a.filter(c => b.includes(c))
            );

            return Annotation.where({ is_reject: queryParams.isReject })
              .where('id', 'in', intersectionAnnotationIds)
              .orderBy('id', 'ASC')
              .fetchPage({
                pageSize: queryParams.pageSize,
                page: queryParams.page,
                withRelated: ['patient', 'tags']
              });
          });
      }

      if (!'true'.localeCompare(queryParams.annotation)) {
        return Annotation.where('id', 'in', annotationIds)
          .where({ is_reject: queryParams.isReject })
          .query('where', 'annotation_info', '<>', '')
          .orderBy('id', 'ASC')
          .fetchPage({
            pageSize: queryParams.pageSize,
            page: queryParams.page,
            withRelated: ['patient', 'tags']
          });
      }

      if (!'false'.localeCompare(queryParams.annotation)) {
        return Annotation.where('id', 'in', annotationIds)
          .where({ is_reject: queryParams.isReject })
          .where('annotation_info', null)
          .orderBy('id', 'ASC')
          .fetchPage({
            pageSize: queryParams.pageSize,
            page: queryParams.page,
            withRelated: ['patient', 'tags']
          });
      }

      return Annotation.where('id', 'in', annotationIds)
        .where({ is_reject: queryParams.isReject })
        .orderBy('id', 'ASC')
        .fetchPage({
          pageSize: queryParams.pageSize,
          page: queryParams.page,
          withRelated: ['patient', 'tags']
        });
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
      annotation.remarks = newAnnotation.remarks;
      annotation.isReject = newAnnotation.isReject;
      async.eachLimit(
        newAnnotation.tags,
        1,
        function(tag, callback) {
          if (tag.id === 0 || tag.id === '0') {
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
