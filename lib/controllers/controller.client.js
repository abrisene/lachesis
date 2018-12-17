/*
 # controller.client.js
 # Client Controller
 */

/*
 # Module Dependencies
 */

const axios = require('axios');

/*
 # Critical Variables
 */

/*
 # Module Exports
 */

class ClientController {
  constructor({
    timerUrl,
    callbackUrl,
  }) {
    this.timerUrl = timerUrl;
    this.callbackUrl = callbackUrl;
    this.timers = {};
  }

  /**
   * Gets and returns timer metadata.
   * @param {string}  id        A valid timer id.
   * @param {string}  timerUrl  An optional url for the timer api.
   */
  async get(id, timerUrl = this.timerUrl) {
    try {
      if (!id) throw new Error('Cannot get an undefined timer');
      if (!timerUrl) throw new Error('Cannot get a timer with undefined timer url');

      const timer = await axios({
        method: 'get',
        url: `${timerUrl}/timer/${id}`,
      });

      this.timers[timer._id] = timer;
      return timer;
    } catch (err) {
      return err;
    }
  }

  /**
   * Gets and returns timer metadata. Alias for get().
   * @param {string}  id        A valid timer id.
   * @param {string}  timerUrl  An optional url for the timer api.
   */
  async getTimer(id, timerUrl) {
    return this.get(id, timerUrl);
  }

  /**
   * Creates a new timer.
   * @param {timestamp} startTS       Sets the beginning time of the timer. Defaults to now.
   * @param {timestamp} endTS         Sets the expiration time of the timer.
   * @param {number}    duration      The duration of the timer. Not necessary if endTS is set.
   * @param {string}    durationType  Time unit of the duration.
   *                                  's' for seconds, 'ms' for milliseconds.
   * @param {object}    payload       A payload to be returned on expiration.
   * @param {string}    timerUrl      An optional url for the timer api.
   * @param {string}    callbackUrl   An optional callback url.
   */
  async create({
    startTS = Date.now(),
    endTS,
    duration,
    durationType,
    payload,
    timerUrl = this.timerUrl,
    callbackUrl = this.callbackUrl,
  }) {
    try {
      if (!timerUrl) throw new Error('Cannot define new timer with undefined timer url');
      if (!callbackUrl) throw new Error('Cannot define new timer with undefined callback url');
      if (!endTS && !duration) throw new Error('Cannot define new timer without duration or endTS');

      const timer = await axios({
        method: 'post',
        url: `${timerUrl}/timer`,
        data: {
          startTS,
          endTS,
          duration,
          durationType,
          payload,
          callback: callbackUrl,
        },
      });

      this.timers[timer._id] = timer;
      return timer;
    } catch (err) {
      return err;
    }
  }

  /**
   * Updates an existing timer.
   * @param {timestamp} startTS       Sets the beginning time of the timer. Defaults to now.
   * @param {timestamp} endTS         Sets the expiration time of the timer.
   * @param {number}    adjust        Adjusts the remaining duration of the timer.
   *                                  Affected by durationType.
   * @param {number}    duration      The duration of the timer. Affected by durationType.
   * @param {string}    durationType  Time unit of the duration or adjustment.
   *                                  's' for seconds, 'ms' for milliseconds.
   * @param {object}    payload       A payload to be returned on expiration.
   * @param {string}    timerUrl      An optional url for the timer api.
   * @param {string}    callbackUrl   An optional callback url.
   */
  async update({
    id,
    startTS = Date.now(),
    endTS,
    adjust,
    duration,
    durationType,
    payload,
    timerUrl = this.timerUrl,
    callbackUrl = this.callbackUrl,
  }) {
    try {
      if (!id) throw new Error('Cannot update an undefined timer');
      if (!timerUrl) throw new Error('Cannot update timer with undefined timer url');
      if (!callbackUrl) throw new Error('Cannot update a timer with undefined callback url');
      if (!endTS && !duration) throw new Error('Cannot update a timer without duration or endTS');

      const timer = await axios({
        method: 'patch',
        url: `${timerUrl}/timer`,
        data: {
          startTS,
          endTS,
          adjust,
          duration,
          durationType,
          payload,
          callback: callbackUrl,
        },
      });

      this.timers[timer._id] = timer;
      return timer;
    } catch (err) {
      return err;
    }
  }

  /**
   * Gets and returns timer metadata.
   * @param {string}  id        A valid timer id.
   * @param {string}  timerUrl  An optional url for the timer api.
   */
  async delete(id, timerUrl = this.timerUrl) {
    try {
      if (!id) throw new Error('Cannot delete an undefined timer');
      if (!timerUrl) throw new Error('Cannot delete a timer with undefined timer url');

      const result = await axios({
        method: 'delete',
        url: `${timerUrl}/timer/${id}`,
      });

      this.timers[id] = undefined;
      return result;
    } catch (err) {
      return err;
    }
  }
}

module.exports = ClientController;
