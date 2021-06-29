
const knex            = require('./knex');

const extend          = require('./extend');

const mysql           = require('./mysql');

const promiseall      = require('nlab/promiseall');

knex.extend           = extend;

knex.prototype_mysql  = mysql;

knex.promiseall       = promiseall;

module.exports        = knex;