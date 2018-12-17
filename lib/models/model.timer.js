/*
 # model.timer.js
 # Timer Mongoose Model
 */

/**
 # Module Dependencies
 */

const mongoose = require('mongoose');

const { Schema } = mongoose;

const axios = require('axios');

/*
 # Critical Variables
 */

/*
 # Utility Methods
 */

/*
 # Schema
 */

const schema = new Schema({
  startTS: { type: Date, required: true, default: Date.now },
  endTS: { type: Date, required: true },
  callbackTS: Date,
  redeemTS: Date,
  redeemCount: Number,
  payload: Object,
  callback: {
    method: { type: String, default: 'post' },
    url: { type: String, required: true },
    transport: { type: String, default: 'http' },
  },
}, {
  timestamps: {
    createdAt: 'tsCreated',
    updatedAt: 'tsUpdated',
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
      result = res.status;
    } else {
      throw new Error('Transport Method Undefined');
    }
    if (this.redeemCount === undefined) this.redeemCount = 0;

    this.redeemCount += 1;
    this.redeemTS = Date.now();
    await this.save();

    return result;
  } catch (err) {
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
