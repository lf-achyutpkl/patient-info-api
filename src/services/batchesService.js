import Boom from 'boom';
import Batches from '../models/batches';
import BatchesUsers from '../models/batchesUsers';

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

export function getAllBatch(queryParams) {
  return Batches.fetchPage({
    pageSize: queryParams.pageSize,
    page: queryParams.page,
    withRelated: ['users']
  });
}

export function updateBatch(id, newBatch) {
  return new Batches({ id }).fetch({ withRelated: ['users'] }).then(batch => {
    if (!batch) {
      throw new Boom.notFound('batch not found');
    }

    batch = batch.toJSON();

    if (newBatch.users.length > 0) {
      new BatchesUsers({ user_id: batch.users.length > 0 ? batch.users[0].id : 0, batch_id: id })
        .fetch()
        .then(batchUser => {
          if (batchUser) {
            new BatchesUsers({ id: batchUser.id }).save({ user_id: newBatch.users[0].id });
          } else {
            new BatchesUsers({ batch_id: id, user_id: newBatch.users[0].id }).save();
          }
        });
    }

    return new Batches({ id })
      .save(
        {
          isCompleted: newBatch.isCompleted
        },
        { patch: true }
      )
      .then(batch => {
        batch.refresh();

        return batch;
      });
  });
}
