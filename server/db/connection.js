import knex from 'knex';

export const connection = knex({
  client: 'better-sqlite3',
  connection: {
    filename: './data/db.sqlite3',
  },
  useNullAsDefault: true,
});

connection.on('query', (data) => {
  const { sql, bindings } = data;
  const query = connection.raw(sql, bindings).toQuery();
  console.log('data is: ', query);
})
