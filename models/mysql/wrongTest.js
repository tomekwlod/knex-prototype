
const abstract          = require('knex-prototype');

const extend            = abstract.extend;

const prototype         = abstract.prototype_mysql;

const log               = require('inspc');

module.exports = knex => extend(knex, prototype, {
    fromDb: async function (row, opt, trx) {

        if (opt.opt) {

            row.fromDb = true;
        }

        return null;
    },
}, 'users', 'id');