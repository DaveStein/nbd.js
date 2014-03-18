if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(['./Class',
       './util/async',
       './util/extend',
       './util/diff',
       './trait/pubsub'
], function(Class, async, extend, diff, pubsub) {
  "use strict";

  var dirtyCheck = function(old, novel) {
    if (!this._dirty) { return; }
    if (old) {
      diff.call(this, novel || this._data, old, this.trigger);
    }
    else { return; }

    this._dirty = 0;
  },

  constructor = Class.extend({

    init: function(id, data) {

      if (typeof id === 'string' && id.match(/^\d+$/)) {
        id = +id;
      }

      if (data === undefined && typeof id === 'object') {
        data = id;
        id = undefined;
      }

      this.id = function() {
        return id;
      };

      try {
        Object.defineProperty(this, '_dirty', { value: 0, writable: true });
        Object.defineProperty(this, '_data', {
          enumerable: false,
          configurable: true,
          value: data || {},
          writable: true
        });
      }
      catch (noDefineProperty) {
        // Can't use ES5 Object.defineProperty, fallback
        this._dirty = 0;
        this._data = data;
      }

    },

    destroy: function() {
      this.off();
      this._data = null;
    },

    data : function() {
      if (this._dirty !== true) {
        async(dirtyCheck.bind(this, extend({}, this._data,
                                           this._dirty || undefined)));
        this._dirty = true;
      }
      return this._data;
    },

    get: function(prop) {
      return this._data[prop];
    },

    set: function(values, value) {
      var key, data = this.data();

      if (typeof values === "string") {
        if (this._dirty !== true) {
          this._dirty = this._dirty || {};
          if (!(key in this._dirty)) {
            this._dirty[values] = data[values];
          }
        }
        data[values] = value;
        return this;
      }

      if (typeof values === "object") {
        for (key in values) {
          if (values.hasOwnProperty(key)) {
            if (this._dirty !== true) {
              this._dirty = this._dirty || {};
              if (!(key in this._dirty)) {
                this._dirty[key] = data[key];
              }
            }
            data[key] = values[key];
          }
        }
        return this;
      }
    },

    toJSON: function() {
      return this._data;
    }
  })
  .mixin(pubsub);

  return constructor;

});
