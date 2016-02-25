# hapi-ff
Feature flags for Hapi.js

[![Build Status](https://travis-ci.org/Gattermeier/hapi-ff.svg?branch=master)](https://travis-ci.org/Gattermeier/hapi-ff) 
[![npm version](https://badge.fury.io/js/hapi-ff.svg)](https://badge.fury.io/js/hapi-ff)
[![Dependency Status](https://david-dm.org/gattermeier/hapi-ff.svg)](https://david-dm.org/Gattermeier/hapi-ff) 
[![devDependency Status](https://david-dm.org/Gattermeier/hapi-ff/dev-status.svg)](https://david-dm.org/Gattermeier/hapi-ff#info=devDependencies)    

# Installation
```npm install hapi-ff```

# Usage
Register the plugin and pass an options object with your feature flags.
Simple features accept boolean values. Features with dependencies are objects with a boolean property 'active' and a 'dependencies' array. Feature flags can also be functions, that accept the request object and the entire features object itself, giving access to checking for other flags.

hapi-ff can be run in persistent in dynamic mode (default). In dynamic mode function feature flags have access to the request object and features are resolved on each incoming request. In persistent mode feature flags are set only once when registering the plugin and when running the update server function ('ffUpdate'). Function feature flags do not have access to the request object in persistent mode.

- Persistent mode is helpful if your feature flags are request independent and need only be updated sporadically.
- Dynamic mode is helpful if feature flags are request-dependent. For instance when using a url query object to set a flag.


# Example Configuration

```
server.register({
  register: require('hapi-ff'),
  options: {
    persistent: false,
    features: {
      'feature_1': true,
      'feature_2': {
        active: true,
        dependencies: ['feature_1']
      },
      'feature_3': (request, features) => {
        return !!request.params.id && features.feature_1
      }
    }
  }
});
```
