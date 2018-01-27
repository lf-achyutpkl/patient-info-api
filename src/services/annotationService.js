import Boom from 'boom';
import Annotation from '../models/annotation';

export function getAllAnnotation(queryParams) {
  if (!'true'.localeCompare(queryParams.annotation)) {
    return Annotation.query('where', 'annotation_info', '<>', '').fetchPage({
      pageSize: queryParams.pageSize,
      page: queryParams.page,
      withRelated: ['patient']
    });
  }

  if (!'false'.localeCompare(queryParams.annotation)) {
    return Annotation.query('where', 'annotation_info', '=', '').fetchPage({
      pageSize: queryParams.pageSize,
      page: queryParams.page,
      withRelated: ['patient']
    });
  }

  return Annotation.fetchPage({
    pageSize: queryParams.pageSize,
    page: queryParams.page,
    withRelated: ['patient']
  });
}

export function getAnnotation(id) {
  return new Annotation({ id }).fetch({ withRelated: ['patient'] }).then(annotation => {
    if (!annotation) {
      throw new Boom.notFound('Annotation not found');
    }

    return annotation;
  });
}

export function updateAnnotation(id, newAnnotation) {
  return new Annotation({ id }).fetch().then(annotation => {
    if (!annotation) {
      throw new Boom.notFound('Annotation not found');
    }

    annotation.annotationInfo = newAnnotation.annotationInfo;
    annotation.tags = newAnnotation.tags;
    annotation.remarks = newAnnotation.remarks;

    return new Annotation({ id })
      .save(
        {
          annotationInfo: newAnnotation.annotationInfo,
          tags: newAnnotation.tags,
          remarks: newAnnotation.remarks
        },
        { patch: true }
      )
      .then(annotation => annotation.refresh());
  });
}
