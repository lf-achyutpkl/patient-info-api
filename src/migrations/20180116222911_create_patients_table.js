/**
 * Create users table.
 *
 * @param  {object} knex
 * @return {Promise}
 */
export function up(knex) {
  return knex.schema.createTable('patients', table => {
    table.increments('id');
    table.string('first_name').notNullable();
    table.string('middle_name');
    table.string('last_name').notNullable();
    table.enu('gender', ['male', 'female', 'other']).notNullable();
    table.integer('age');
    table.string('address');
    table.string('remarks');

    table
      .timestamp('created_at')
      .notNullable();
    table.timestamp('updated_at');

  });
}

/**
 * Drop users table.
 *
 * @param  {object} knex
 * @return {Promise}
 */
export function down(knex) {
  return knex.schema.dropTable('patients');
}
