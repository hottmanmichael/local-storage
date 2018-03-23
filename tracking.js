'use strict';

var listeners = {};
var listening = false;

function isTrueObject (value) {
  return Object.prototype.toString.call(value).split(' ')[1].indexOf('Object') > -1
}

function listen () {
  if (global.addEventListener) {
    global.addEventListener('storage', change, false);
  } else if (global.attachEvent) {
    global.attachEvent('onstorage', change);
  } else {
    global.onstorage = change;
  }
}

function change (e) {
  if (!e) {
    e = global.event;
  }
  var all = listeners[e.key];
  if (all) {
    all.forEach(fire);
  }

  function fire (listener) {
    var nv = isTrueObject(e.newValue) ? JSON.parse(e.newValue) : e.newValue;
    var ov = isTrueObject(e.oldValue) ? JSON.parse(e.oldValue) : e.oldValue;
    listener(nv, ov, e.url || e.uri);
  }
}

function on (key, fn) {
  if (listeners[key]) {
    listeners[key].push(fn);
  } else {
    listeners[key] = [fn];
  }
  if (listening === false) {
    listen();
  }
}

function off (key, fn) {
  var ns = listeners[key];
  if (ns.length > 1) {
    ns.splice(ns.indexOf(fn), 1);
  } else {
    listeners[key] = [];
  }
}

module.exports = {
  on: on,
  off: off
};
