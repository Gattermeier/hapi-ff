'use strict';

exports.register = (server, options, next) => {

  if (options.persistent === true) {
    server.plugins.features = require('./resolve')(options.features, null);
    server.ext('onPreHandler', (request, reply) => {
      request.plugins.features = server.plugins.features;
      return reply.continue()
    });
  }

  server.ext('onPreHandler', (request, reply) => {
    request.plugins.features = require('./resolve')(options.features, request);
    return reply.continue()
  });

	server.method('ffUpdate', (config) =>{
		server.plugins.features = require('./resolve')(config);
	});

  next();
}

exports.register.attributes = {
    pkg: require('../package.json')
}
