const {QueryFile} = require('pg-promise');
const {join: joinPath} = require('path');

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


module.exports = {
    graphs: {
        insert: sql('graphs/insert.sql'),
        delete: sql('graphs/delete.sql'),
        update: sql('graphs/update.sql'),
        find: sql('graphs/find.sql'),
        findAll: sql('graphs/findAll.sql')
    }
};

