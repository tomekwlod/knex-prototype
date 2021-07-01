'use strict';

const log = require('inspc');

const knex = require('knex-prototype');

require('dotenv-up')(5, false, 'tests');

const config = require('../../../../models/config');

knex.init(config);

it('knex - wrong connection name', (done) => {
  (async function () {
    try {
      knex('test').model.common;
    } catch (e) {
      expect(String(e)).toEqual(
        "Error: knex-prototype: Connection 'test' is not defined in config.js under 'knex' key"
      );

      done();
    }
  })();
});
