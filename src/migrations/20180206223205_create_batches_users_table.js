/**
 * @param  {object} knex
 * @return {Promise}
 */
export function up(knex) {
  return knex.schema.createTable('batches_users', table => {
    table.increments('id');
    table.integer('batch_id').notNull();
    table.integer('user_id').notNull();
    table
      .timestamp('created_at')
      .notNull()
      .defaultTo(knex.raw('now()'));
    table.timestamp('updated_at');
    table
      .foreign('batch_id')
      .references('id')
      .on('batches');
    table
      .foreign('user_id')
      .references('id')
      .on('users');
    table.index(['batch_id'], 'fki_batches_id_fk');
    table.index(['user_id'], 'fki_user_if_fk');
  });
}

/**
 * @param  {object} knex
 * @return {Promise}
 */
export function down(knex) {
  return knex.schema.dropTable('users_batches');
}
