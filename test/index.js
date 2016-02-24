'use strict';

const tape = require('tape');
const Hapi = require('hapi');

const server = new Hapi.Server();

server.connection({
  port: 3001
});


const options = {
  persistent: false,
  features: {
    'ff_bool_1': true, // resolve true
    'ff_bool_2': false, // resolve false
    'ff_dep_1': { // resolve true
      active: true,
      dependencies: ['ff_bool_1']
    },
    'ff_dep_2': { // resolve false
      active: true,
      dependencies: ['ff_bool_2']
    },
    'ff_dep_3': { // resolve false
      active: true,
      dependencies: ['ff_bool_1', 'ff_bool_2']
    },
    'ff_dep_4': { // resolve false
      active: false,
      dependencies: ['ff_bool_1']
    },
    'ff_func_1': () => { // resolve true
      return true
    },
    'ff_func_2': (request, features) => { // resolve true
      return !!request.params.id && features.ff_bool_1
    },
    'ff_func_3': (request, features) => { // resolve false
      return !!request.params.id && features.ff_bool_2
    }
  }
}

server.register([
  require('inject-then'), {
    register: require('../lib'),
    options: options
  }
], (err) => {
  if (err) {
    throw err
  }

  server.route({
    method: 'GET',
    path: '/{id?}',
    handler: (request, reply) => {
      reply(request.plugins.features)
    }
  })

  tape('GET /', (t) => {
    server.injectThen({
        method: 'GET',
        url: '/1'
      })
      .then((response) => {
        t.equal(response.statusCode, 200);
        t.equal(response.result['ff_bool_1'], true)
        t.equal(response.result['ff_bool_2'], false)
        t.equal(response.result['ff_dep_1'], true)
        t.equal(response.result['ff_dep_2'], false)
        t.equal(response.result['ff_dep_3'], false)
        t.equal(response.result['ff_dep_4'], false)
        t.equal(response.result['ff_func_1'], true)
        t.equal(response.result['ff_func_2'], true)
        t.equal(response.result['ff_func_3'], false)
        server.stop(t.end);
      });
  })

})
