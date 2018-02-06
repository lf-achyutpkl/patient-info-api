import Boom from 'boom';
import Batches from '../models/batches';

export function getBatch(id) {
  return Batches.where({ id: id })
    .fetch({
      withRelated: ['annotations']
    })
    .then(batch => {
      if (!batch) {
        throw new Boom.notFound('Batch not found');
      }

      return batch;
    });
}
