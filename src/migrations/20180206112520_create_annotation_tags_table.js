/**
 * @param  {object} knex
 * @return {Promise}
 */
export function up(knex) {
  return knex.schema.createTable('annotation_tags', table => {
    table.increments('id');
    table.integer('tag_id');
    table.integer('annotation_id');
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
      .foreign('tag_id')
      .references('id')
      .on('tags');
  });
}

/**
 * @param  {object} knex
 * @return {Promise}
 */
export function down(knex) {
  return knex.schema.dropTable('annotation_tags');
}
