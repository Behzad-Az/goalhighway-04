
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('resumes', t => {
      t.increments('id');
      t.string('title', 50).notNullable();
      t.string('intent', 250).notNullable();
      t.string('file_name', 200).notNullable();
      t.integer('user_id').notNullable().references('users.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('resumes')
  ]);
};
