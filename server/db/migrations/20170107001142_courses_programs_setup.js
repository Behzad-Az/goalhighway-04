
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTableIfNotExists('institutions', t => {
      t.string('id', 11).notNullable().unique();
      t.string('inst_short_name', 10).notNullable();
      t.string('inst_long_name', 60).notNullable();
      t.string('inst_value', 60).notNullable();
      t.string('inst_display_name', 75).notNullable();
      t.string('photo_name', 35).notNullable().defaultTo('default_inst_photo.png');
      t.string('country', 35).notNullable();
      t.string('province', 35).notNullable();
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    }),

    knex.schema.createTableIfNotExists('programs', t => {
      t.string('id', 11).notNullable().unique();
      t.string('prog_short_name', 10).notNullable();
      t.string('prog_long_name', 60).notNullable();
      t.string('prog_value', 60).notNullable();
      t.string('prog_display_name', 75).notNullable();
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    }),

    knex.schema.createTableIfNotExists('institution_program', t => {
      t.string('id', 11).notNullable().unique();
      t.string('inst_id', 11).notNullable();
      t.string('prog_id', 11).notNullable().references('programs.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    }),

    knex.schema.createTableIfNotExists('courses', t => {
      t.string('id', 11).notNullable().unique();
      t.string('prefix', 10).notNullable();
      t.string('suffix', 10).notNullable();
      t.string('full_display_name', 130).notNullable();
      t.string('short_display_name', 25).notNullable();
      t.string('course_desc', 250).notNullable();
      t.integer('course_year').notNullable();
      t.string('inst_id', 11).notNullable().references('institutions.id');
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    }),

    knex.schema.createTableIfNotExists('docs', t => {
      t.string('id', 11).notNullable().unique();
      t.string('course_id', 11).notNullable().references('courses.id');
      t.string('latest_title', 60).notNullable();
      t.string('latest_type', 35).notNullable();
      t.string('latest_rev_desc', 250).notNullable();
      t.string('latest_file_name', 35).notNullable();
      t.integer('rev_count').notNullable().defaultTo(1);
      t.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
      t.timestamp('deleted_at');
    })

  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('docs'),
    knex.schema.dropTable('courses'),
    knex.schema.dropTable('institution_program'),
    knex.schema.dropTable('programs'),
    knex.schema.dropTable('institutions')
  ]);
};
