/**
 * @param  {object} knex
 * @return {Promise}
 */
export function up(knex) {
  return knex.schema.table('annotations', table => {
    table.dropColumn('tags');
    table.boolean('is_reject').defaultTo(false);
  });
}

/**
 * @param  {object} knex
 * @return {Promise}
 */
export function down(knex) {
  return knex.schema.table('annotations', table => {
    table.string('tags');
    table.dropColumn('is_reject');
  });
}
