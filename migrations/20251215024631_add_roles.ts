import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
      await knex.raw(`
    alter table users add column roles varchar(32)[] not null default array['user']::varchar(32)[];
  `);
   await knex.raw(`alter table users drop column role;`);
}


export async function down(knex: Knex): Promise<void> {
  await knex.raw(`alter table users drop column roles;`);
  await knex.raw(`alter table users add column role varchar(32) not null default 'user';`);
}

