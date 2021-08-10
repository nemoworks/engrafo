const {QueryFile} = require('pg-promise');
const {join: joinPath} = require('path');
var pgp = require('pg-promise')(/* options */)
function sql(file) {

    const fullPath = joinPath(__dirname, file); // generating full path;

    const options = {

        // minifying the SQL is always advised;
        // see also option 'compress' in the API;
        minify: true

        // See also property 'params' for two-step template formatting
    };

    const qf = new QueryFile(fullPath, options);

    if (qf.error) {
        // Something is wrong with our query file :(
        // Testing all files through queries can be cumbersome,
        // so we also report it here, while loading the module:
        console.error(qf.error);
    }

    return qf;
}

const cn = {
  host: 'localhost',
  port: 28432,
  database: 'ticflow',
  user: 'jieshixin',
  password: 'jieshixin,.#',
  max: 30 // use up to 30 connections

  // "types" - in case you want to set custom type parsers on the pool level
};

var db = pgp(cn)

module.exports = {
    db: db,
    graph: {
        insert: sql('sql/graph/insert.sql'),
        delete: sql('sql/graph/delete.sql'),
        update: sql('sql/graph/update.sql'),
        find: sql('sql/graph/find.sql'),
        findAll: sql('sql/graph/findAll.sql')
    },
    process: {
        insert: sql('sql/process/insert.sql'),
        delete: sql('sql/process/delete.sql'),
        update: sql('sql/process/update.sql'),
        find: sql('sql/process/find.sql'),
        findAll: sql('sql/process/findAll.sql')
    },
    outgoing: {
        insert: sql('sql/outgoing/insert.sql'),
        delete: sql('sql/outgoing/delete.sql'),
        update: sql('sql/outgoing/update.sql'),
        find: sql('sql/outgoing/find.sql'),
        findAll: sql('sql/outgoing/findAll.sql')
    },
    account: {
        insert: sql('sql/account/insert.sql'),
        delete: sql('sql/account/delete.sql'),
        update: sql('sql/account/update.sql'),
        find: sql('sql/account/find.sql'),
        findAll: sql('sql/account/findAll.sql')
    }
};

