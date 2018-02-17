/**
 * @param  {object} knex
 * @return {Promise}
 */
export function up(knex) {
  return knex.schema.createTable('annotation_labels', table => {
    table.increments('id');
    table.string('display_label');
    table.string('value');
    table.string('color');
    table.string('label_type');
    table.integer('parent_id');

    table
      .timestamp('created_at')
      .notNull()
      .defaultTo(knex.raw('now()'));
    table.timestamp('updated_at');
  });
}

/**
 * @param  {object} knex
 * @return {Promise}
 */
export function down(knex) {
  return knex.schema.dropTable('annotation_labels');
}
