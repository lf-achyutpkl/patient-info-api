/**
 * Create users table.
 *
 * @param  {object} knex
 * @return {Promise}
 */
export function up(knex) {
  return knex.schema.createTable('annotations', table => {
    table.increments('id');
    table.integer('patient_id').notNullable();
    table.string('image_name');
    table.text('annotation_info');
    table.string('tags');
    table.string('remarks');

    table.timestamp('created_at').notNullable();
    table.timestamp('updated_at');
    table
      .foreign('patient_id')
      .references('id')
      .on('patients');
  });
}

/**
 * Drop users table.
 *
 * @param  {object} knex
 * @return {Promise}
 */
export function down(knex) {
  return knex.schema.dropTable('annotations');
}
