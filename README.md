# hapi-ff
Feature flag management plugin for hapijs

If you are working on an experimental design, launch a closed beta or need to roll out a feature over time, feature flags are the way to go. This plugin for Hapi.js helps to implement your feature flags, allowing to pass functions as criteria truth tests.   


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

a feature test function has access to the request object and the other feature flags.
in persistent mode the feature flags are set once, but can be updated with server.method. feature test functions will not have access to the request object in persistent mode.

in non-persisten mode, feature flags are set on each incoming request, feature function tests are run with access to the respective request object.

persistent option defaults to false.

persistent mode is helpful if your feature flags are request independent and need only be updated sporadically.
non-persisten mode is helpful if feature flags are request dependent. eg: using a url query object to set a flag.
