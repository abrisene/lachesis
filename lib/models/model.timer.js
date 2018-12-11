/*
 # model.timer.js
 # Timer Mongoose Model
 */

/**
 # Module Dependencies
 */

const mongoose = require('mongoose');

const { Schema } = mongoose;

// const crypto = require('crypto');
const axios = require('axios');

/*
 # Critical Variables
 */

/*
 # Utility Methods
 */

const generateToken = (len = 32) => {
  const hash = crypto.randomBytes(len).toString('hex');
  return hash;
};

/*
 # Schema
 */

const schema = new Schema({
  startTS: { type: Date, require: true, default: Date.now },
  endTS: { type: Date, require: true },
  callbackTS: Date,
  payload: Object,
  callback: {
    method: { type: String, default: 'post' },
    url: { type: String, require: true },
    transport: { type: String, default: 'http' },
  },
}, {
  timestamps: {
    createdAt: 'tsCreated',
  },
});

schema.index({ endTS: 1 });
/*
 # Middleware
 */


/**
 # Schema Virtuals
 */

schema.virtual('remaining')
  .get(function () { return this.endTS - Date.now(); })
  .set(function (v) {
    this.endTS = Date.now() + v;
  });

/**
 # Schema Methods
 */

schema.methods.redeem = async function () {
  let result = {};
  try {
    const { method, url, transport } = this.callback;
    if (transport === 'http') {
      if (!url) throw new Error('URI not defined');
      const res = await axios({
        method,
        url,
        data: this.payload || {},
      });
      console.log(res);
      result = res;
    } else {
      throw new Error('Transport Method Undefined');
    }

    return result;
  } catch (err) {
    console.error(err);
    result.err = err;
    return result;
  }
};

/**
 # Static Schema Methods
 */


/**
 # Module Exports
 */

module.exports = mongoose.model('Timer', schema);
