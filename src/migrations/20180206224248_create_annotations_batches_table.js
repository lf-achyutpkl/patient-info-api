/**
 * @param  {object} knex
 * @return {Promise}
 */
export function up(knex) {
  return knex.schema.createTable('annotations_batches', table => {
    table.increments('id');
    table.integer('batch_id').notNull();
    table.integer('annotation_id').notNull();
    table
      .timestamp('created_at')
      .notNull()
      .defaultTo(knex.raw('now()'));
    table.timestamp('updated_at');
    table
      .foreign('annotation_id')
      .references('id')
      .on('annotations');
    table
      .foreign('batch_id')
      .references('id')
      .on('batches');
    table.index(['annotation_id'], 'fki_annotaion_id_fk');
    table.index(['batch_id'], 'fki_batch_id_fk');
  });
}

/**
 * @param  {object} knex
 * @return {Promise}
 */
export function down(knex) {
  return knex.schema.dropTable('batches_annotations');
}
