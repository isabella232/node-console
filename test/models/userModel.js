var knex = require('knex')({
  client: 'pg',
  connection: {
    host     : 'localhost',
    user     : 'lob_user',
    password : '',
    database : 'lob_local',
    charset  : 'utf8'
  }
});

var bookshelf = require('bookshelf')(knex);

var User = bookshelf.Model.extend({
  tableName: 'users',
});

module.exports = {
  User: User
};
