import Boom from 'boom';
import Annotation from '../models/annotation';

export function getAllAnnotation(queryParams) {
  if (queryParams.annotation.toLowerCase() == 'true') {
    return Annotation.query('where', 'annotation_info', '<>', '').fetchPage({
      pageSize: queryParams.pageSize,
      page: queryParams.page,
      withRelated: ['patient']
    });
  }

  if (queryParams.annotation.toLowerCase() == 'false') {
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
