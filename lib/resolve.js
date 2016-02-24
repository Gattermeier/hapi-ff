'use strict';

const  _ = require('underscore');

module.exports = (features, request) => {
  return _.reduce(features, (memo, value, key) => {

    if (typeof value === 'function') {
      memo[key] = value(request, features);
    }

    if (typeof value === 'number') {
      memo[key] = !!value
    }

    if (typeof value === 'boolean') {
      memo[key] = value
    }

    if (typeof value === 'object') {
      memo[key] = !value.active ? false : _.every(value.dependencies, (dep) => {
        return memo[dep] || (typeof features[dep] === 'function' ? features[dep](request, features) : features[dep])
      }, value.active)
    }
    return memo
  }, {})
}
