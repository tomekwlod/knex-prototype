/**
 * require('knex-prototype').init();
 */

//import configServer from 'server.config';

const log = require('inspc');

let connections = false;

function isObject(a) {
  return !!a && a.constructor === Object;
}

// import models from 'models';

let config = false;

const extend = (knex, name) => {
  const models = Object.entries(config)
    .filter(([key]) => key !== 'def')
    .reduce((acc, k) => {
      const {models, ...cc} = k[1];

      acc[k[0]] = models;

      return acc;
    }, {});

  if (models[name]) {
    const model = Object.keys(models[name]).reduce((a, key) => {
      a[key] = models[name][key](knex);

      return a;
    }, {});

    knex.model = new Proxy(model, {
      get(target, propKey, receiver) {
        if (typeof propKey === 'symbol') {
          return;
        }

        if (typeof target[propKey] !== 'undefined') {
          return target[propKey];
        }

        const keys = Object.keys(target);

        throw new Error(`No such ${name} manager '${propKey}', registered managers are: ` + keys.join(', '));
      },
    });
  } else {
    throw new Error(`key '${name}' defined under server.config -> 'knex' config but there is no models defined for it`);
  }
};

/**
 * https://knexjs.org/#Installation-client
 */
const tool = (name) => {
  if (config === false) {
    throw new Error(
      `Before use require('knex-prototype')() first use require('knex-prototype').init(config) and pass config`
    );
  }

  if (!name) {
    name = config.def;
  }

  if (!config[name]) {
    throw new Error(`knex-prototype: Connection '${name}' is not defined in config.js under 'knex' key`);
  }

  return connections[name];
};

tool.init = (c) => {
  if (connections !== false) {
    return `knex-prototype: Connections are already initialized, no need to call init() again`;
  }

  if (!c || !isObject(c)) {
    throw new Error(`knex-prototype: init(config), config has to be an object`);
  }

  const keys = Object.keys(c);

  if (!keys.length) {
    throw new Error(`knex-prototype: key 'knex' is an object but there is not connections defined in it`);
  }

  if (typeof c.def !== 'string') {
    throw new Error(`knex-prototype: Not 'def' connection specified: 'config.js' for knex key 'knex.def'`);
  }

  config = c;

  connections = keys
    .filter((c) => c !== 'def')
    .reduce((acc, name) => {
      const {models, ...cc} = c[name];

      acc[name] = eval('require')('knex')(cc);

      acc[name].provider = cc.client;

      extend(acc[name], name);

      return acc;
    }, {});

  return 0;
};

module.exports = tool;
