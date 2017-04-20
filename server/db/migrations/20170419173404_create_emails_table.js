
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('emails', t => {
      t.increments('id');
      t.string('subject', 100).notNullable();
      t.integer('from_id').notNullable().references('users.id');
      t.integer('to_id').notNullable().references('users.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    }),
    knex.schema.createTableIfNotExists('email_conversations', t => {
      t.increments('id');
      t.string('content', 1000).notNullable();
      t.integer('email_id').notNullable().references('emails.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('email_conversations'),
    knex.schema.dropTable('emails')
  ]);
};
