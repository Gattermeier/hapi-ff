'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({
  port: 3000
});


server.register({
  register: require('../lib'),
  options: {
    persistent: false,
    features: {
      'ff_bool_1': true,
      'ff_func_1': require('./testParam'),
      'ff_func_2': {
        active: true,
        dependencies: ['feature_1']
      },
      'ff_func_3': {
        active: true,
        dependencies: ['ff_func_1']
      },
      'ff_func_4': {
        active: true,
        dependencies: ['ff_bool_1']
      },
      'feature_3': (request, features) => {
        return !!request.params.id && features.feature_1
      }
    }
  }
}, (err) => {
  if (err) {
    console.error('Failed to load plugin:', err);
  }

  server.route({
    method: 'GET',
    path: '/{id}',
    handler: (request, reply) => {
      reply(request.plugins.features)
    }
  })

  server.start((err) => {
    if (err) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);
  });
});
