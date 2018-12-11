/*
 # controller.timer.js
 # Server Timer Controller
 */

/*
 # Module Dependencies
 */

const { Timer } = require('../models');
/*
 # Critical Variables
 */

// setTimeout(() => 'Hello', 2500);
// console.log(setTimeout(() => 'Hello', 5000));

/*
 # Module Exports
 */

class TimerController {

  constructor() {
    this.timers = [];
    this.queue = [];
    this.stream = {};
    this.getQueue();
    // this.populateTimers();
    for (let i = 0; i < 1; i++) {
      this.createTimer({ duration: 3600 });
    };
  }

  getQueue() {
    this.queue = [];
    this.stream = Timer
      .find()
      .sort('endTS')
      .limit(1000)
      .cursor();

    console.log('Queue Stream Opened');

    this.stream.on('data', (timer) => {
      console.log('New Timer');
      // console.log(timer);
      this.queue.push(timer);
    });

    this.stream.on('end', () => {
      console.log('Queue Stream Closed');
      console.log(this.queue[0]);
      console.log(this.queue.length);
    });
  }

  async createTimer({
    startTS,
    endTS,
    duration,
    durationType = 's',
    payload,
    callback,
  }) {
    try {
      // Get Callack Options
      const callbackOptions = typeof callback === 'object' ? callback : {
        url: callback,
      };

      // Get Timestamps
      const startTime = startTS || Date.now();
      let endTime = endTS;

      if (duration) {
        const durationMod = durationType === 's' ? 1000 : 1;
        endTime = startTime + (duration * durationMod);
      }

      const timer = new Timer({
        startTS: startTime,
        endTS: endTime,
        payload,
        callback: callbackOptions,
      });
      await timer.save();

      this.getQueue();

      return timer;
    } catch (err) {
      console.error(err);
      return { err };
    }
  }

/*
  createTimer({ timeout, data = {}, uri }) {
    return new Promise((resolve, reject) => {
      const duration = timeout * 1000;
      const timer = new Timer({
        timeout,
        startTS: Date.now(),
        endTS: Date.now() + duration,
        data,
        callback: {
          method: 'post',
          uri,
          transport: 'http',
        },
      });

      timer.save((err) => {
        if (err) { reject(err) };
        console.log(`Added Timer: ${timer._id} with ${timeout}s`);
        const localTimer = this.createLocalTimer(timer, duration);
        this.timers.push(localTimer);
        resolve(timer);
      });
    });
  }
*/

  /* async populateTimers() {
    try {
      const timers = Timer.find();
      timers.forEach(timer => this.populateTimer(timer));
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  populateTimer(timer) {
    this.createLocalTimer(timer, timer.remaining);
    console.log(`Populating Timer: ${timer._id} with ${timer.remaining / 1000}s`);
  } */

  /* createLocalTimer(timer) {
    const localTimer = {
      id: timer._id.toString(),
      startTS: timer.startTS,
      endTS: timer.endTS,
      timer: setTimeout(() => {
        timer.redeem();
      }, timer.remaining),
    };

    return localTimer;
  } */

  /* createLocalTimer(timer, duration) {
    const localTimer = {
      id: timer._id.toString(),
      timer: setTimeout(() => {
        request({
          method: timer.callback.method,
          uri: timer.callback.uri,
          body: timer.data,
          json: true,
        }, (err, res, body) => {
          if (err) {
            console.log(`Timer Error: ${timer._id}
              >> ${err}`);

          } else {
            console.log(`Timer Completed: ${timer._id}`);
            timer.remove();
          }

        });

      }, duration),
    };

    return localTimer;
  } */

  /* populateTimers() {
    return new Promise((resolve, reject) => {
      Timer.find((err, timers) => {
        if (err) { reject(err) };
        for (let timer of timers) {
          this.populateTimer(timer);
        }
        resolve(timers);
      });
    });
  }

  populateTimer(timer) {
    const endTS = new Date(timer.endTS).getTime();
    const remaining = endTS - new Date().getTime();
    this.createLocalTimer(timer, remaining);
    console.log(`Populating Timer: ${timer._id} with ${remaining / 1000}s`);
  }

  createTimer({ timeout, data = {}, uri }) {
    return new Promise((resolve, reject) => {
      const duration = timeout * 1000;
      const timer = new Timer({
        timeout,
        startTS: Date.now(),
        endTS: Date.now() + duration,
        data,
        callback: {
          method: 'post',
          uri,
          transport: 'http',
        },
      });

      timer.save((err) => {
        if (err) { reject(err) };
        console.log(`Added Timer: ${timer._id} with ${timeout}s`);
        const localTimer = this.createLocalTimer(timer, duration);
        this.timers.push(localTimer);
        resolve(timer);
      });
    });
  }

  createLocalTimer(timer, duration) {
    const localTimer = {
      id: timer._id.toString(),
      timer: setTimeout(() => {
        request({
          method: timer.callback.method,
          uri: timer.callback.uri,
          body: timer.data,
          json: true,
        }, (err, res, body) => {
          if (err) { 
            console.log(`Timer Error: ${timer._id}
              >> ${err}`);

          } else {
            console.log(`Timer Completed: ${timer._id}`);
            timer.remove();
          }

        });
        
      }, duration),
    };

    return localTimer;
  }

  deleteTimer(id) {
    return new Promise((resolve, reject) => {
      const localTimer = this.timers.filter(t => t.id === id);
      clearTimeout(localTimer.timer);
      this.timers = this.timers.filter((t) => t.id !== id);
      Timer.findOne({ _id: id }, (err, timer) => {
        if (err) { 
          reject(err)
        } else if (timer !== null) {
          timer.remove();
          console.log(`Timer Deleted: ${id}`);
          resolve();
        } else {
          reject('Timer not found');
        }
      });
    });
  } */
}

module.exports = TimerController;
