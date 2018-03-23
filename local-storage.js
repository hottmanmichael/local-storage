'use strict';

var stub = require('./stub');
var tracking = require('./tracking');
var ls = 'localStorage' in global && global.localStorage ? global.localStorage : stub;

function accessor (key, value) {
  if (arguments.length === 1) {
    return get(key);
  }
  return set(key, value);
}

function isTrueObject (value) {
  return Object.prototype.toString.call(value).split(' ')[1].indexOf('Object') > -1
}

function get (key) {
  var item = ls.getItem(key);
  return isTrueObject(item) ? JSON.parse(item) : item;
}

function set (key, value) {
  try {
    var val = isTrueObject(value) ? JSON.stringify(value) : value;
    ls.setItem(key, val);
    return true;
  } catch (e) {
    return false;
  }
}

function remove (key) {
  return ls.removeItem(key);
}

function clear () {
  return ls.clear();
}

accessor.set = set;
accessor.get = get;
accessor.remove = remove;
accessor.clear = clear;
accessor.on = tracking.on;
accessor.off = tracking.off;

module.exports = accessor;
