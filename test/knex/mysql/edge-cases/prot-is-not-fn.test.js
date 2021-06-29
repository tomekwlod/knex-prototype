'use strict';

const log               = require('inspc');

const knex              = require('knex-prototype');

const extend            = knex.extend;

const prototype         = knex.prototype;

require('dotenv-up')(5, false, 'tests');

const config            = require('../../../../models/config');

it('knex - prototype is not a function', async done => {

    try {
        extend(knex, {})
    }
    catch (e) {

        expect(String(e)).toEqual("Error: extend: prototype is not a function, it is: object");

        done();
    }

});
