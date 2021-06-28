
const abstract          = require('knex-prototype');

const extend            = abstract.extend;

const prototype         = abstract.prototype_mysql;

module.exports = knex => extend(knex, prototype, {

});