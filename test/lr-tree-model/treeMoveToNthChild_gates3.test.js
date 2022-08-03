'use strict';

const path              = require('path');

const log               = require('inspc');

const knex              = require('knex-prototype');

require('dotenv-up')(4, false, 'tests');

const fixturesTool      = require('./tree-fixtures');

const config            = require('../lr-tree-model/config');

knex.init(config);

let man;

let mtree;

beforeAll(async () => {

    man     = knex().model.users;

    mtree   = knex().model.tree;
});

afterAll(async () => {

    // await clear();

    await man.destroy();
});

const prepare = async (file = 'tree-fixture-test-set-2') => {

    const fixtures = fixturesTool({
        yamlFile: path.resolve(__dirname, `${file}.yml`),
        knex,
    });

    await fixtures.reset();
}

const test = async (opt, equal) => {

    let tmp;

    try {

        await prepare();

        expect(await mtree.count({})).toEqual(85);

        tmp = await mtree.treeCheckIntegrity({});

        expect(tmp.valid).toBeTruthy();

        await mtree.treeMoveToNthChild({}, {
            ...opt,
            gate        : true,
            strict: true,
        });
    }
    catch (e) {

        return expect(e.message).toEqual(equal);
    }

    throw new Error('Gate test failed, params: ' + JSON.stringify({
        opt,
        equal,
    }, null, 4));
}

it('nestedset - treeMoveToNthChild #3', done => {

  (async function () {

    await test({
        sourceId    : 6,
        parentId    : 12,
        nOneIndexed : 2,
    }, '#3');

    done()
  }())
});

it('nestedset - treeMoveToNthChild #3 1', done => {

  (async function () {

    await test({
        sourceId    : 6,
        parentId    : 15,
        nOneIndexed : 2,
    }, '#3');

    done()
  }())
});

it('nestedset - treeMoveToNthChild #3 2', done => {

  (async function () {

    await test({
        sourceId    : 6,
        parentId    : 27,
        // nOneIndexed : 2,
    }, '#3');

    done()
  }())
});

it('nestedset - treeMoveToNthChild #3 3', done => {

  (async function () {

    await test({
        sourceId    : 6,
        parentId    : 27,
        nOneIndexed : 5,
    }, '#3');

    done()
  }())
});


it('nestedset - treeMoveToNthChild #3 3 equal', done => {

  (async function () {

    await test({
        sourceId    : 6,
        parentId    : 6,
        nOneIndexed : 2,
    }, '#8');

    done()
  }())
});
