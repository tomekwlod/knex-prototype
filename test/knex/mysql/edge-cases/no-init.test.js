'use strict';

const log               = require('inspc');

const knex              = require('knex-prototype');

require('dotenv-up')(5, false, 'tests');

const config            = require('../../../../models/config');

// knex.init(config);  // commented out

it('knex - no init', async done => {

    try {

        await knex().model.common.query({}, 'show databases');
    }
    catch (e) {

        expect(String(e)).toEqual("Error: Before use require('knex-prototype')() first use require('knex-prototype').init(config) and pass config");

        done();
    }

});
