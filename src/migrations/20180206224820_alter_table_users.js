/**
 * @param  {object} knex
 * @return {Promise}
 */
export function up(knex) {
  return knex.schema.table('users', table => {
    table.string('roles');
  });
}

/**
 * @param  {object} knex
 * @return {Promise}
 */
export function down(knex) {
  return knex.schema.table('users', table => {
    table.dropColumn('roles');
  });
}
