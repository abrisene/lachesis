/*
 # controller.timer.js
 # Server Timer Controller
 */

/*
 # Module Dependencies
 */

require('draftlog').into(console);
const config = require('../configs');
const { Timer } = require('../models');
/*
 # Critical Variables
 */

const env = process.env.NODE_ENV;

/*
 # Module Exports
 */

class TimerController {
  constructor() {
    this.timers = [];
    this.queue = [];

    this.interval = undefined;
    this.step = 0;

    this.refreshRate = 1000 / 60;

    this.summaryLog = console.draft();
    this.logs = [];

    if (env !== 'production') {
      console.log('\n');
      for (let i = 0; i < 10; i += 1) {
        this.logs[i] = console.draft();
      }
      console.log('\n');
    }

    this.start();
  }

  start() {
    this.step = 0;
    this.resetQueue();
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.step += 1;
      if (env !== 'production') this.summarize();
      if (this.queue.length > 0) this.evaluateQueue();
    }, this.refreshRate);
  }

  pause() {
    clearInterval(this.interval);
  }

  summarize() {
    this.summaryLog(`Queue: ${this.queue.length}`);
    for (let i = 0; i < this.logs.length; i += 1) {
      const log = this.logs[i];
      const timer = this.queue[i];

      if (timer) {
        log(` > ${i} ${timer._id} : ${timer.remaining / 1000}s`);
      } else {
        log('');
      }
    }
  }

  resetQueue() {
    this.queue = [];
    this.stream = Timer
      .find()
      .sort('endTS')
      .limit(10000)
      .cursor();

    this.stream.on('data', (timer) => {
      this.queue.push(timer);
    });

    this.stream.on('end', () => {
    });
  }

  async evaluateQueue() {
    const timer = this.queue[0];
    if (timer !== undefined && Date.now() >= timer.endTS) {
      this.queue.shift();
      timer.redeem();
      timer.remove();
    }
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

      if (duration !== undefined) {
        const durationMod = durationType === 's' ? 1000 : 1;
        endTime = startTime + (duration * durationMod);
      }

      // Create the Timer
      let timer = new Timer({
        startTS: startTime,
        endTS: endTime,
        payload,
        callback: callbackOptions,
      });
      timer = await timer.save();

      // Resort the Queue
      const newQueue = [...this.queue, timer].sort((a, b) => a.endTS - b.endTS);
      this.queue = newQueue;

      return timer;
    } catch (err) {
      console.error(err);
      return { err };
    }
  }

  async updateTimer({
    id,
    startTS,
    endTS,
    adjust,
    duration,
    durationType = 's',
    payload,
    callback,
  }) {
    try {
      // Locate the timer in the queue or the database
      let timer;

      this.queue.some((t, i) => {
        if (t.id === id) timer = this.queue[i];
        return timer !== undefined;
      });

      if (!timer) timer = await Timer.findById(id);
      if (!timer) throw new Error(`Could not Update Timer ${id} - Timer not found`);

      // Update the timer timestamps
      if (startTS !== undefined) timer.startTS = startTS;
      
      if (adjust !== undefined || duration !== undefined) {
        const durationMod = durationType === 's' ? 1000 : 1;
        if (adjust !== undefined) {
          timer.remaining += adjust * durationMod;
        } else if (duration) {
          timer.remaining = duration * durationMod;
        }
      } else if (endTS !== undefined) {
        timer.endTS = endTS;
      }

      // Payload and Callback
      if (payload !== undefined) timer.payload = payload;
      if (callback !== undefined) {
        const callbackOptions = typeof callback === 'object' ? callback : {
          url: callback,
        };
        timer.callback = callbackOptions;
      }

      // Resort the Queue
      const newQueue = this.queue.sort((a, b) => a.endTS - b.endTS);
      this.queue = newQueue;

      timer = await timer.save();
      return timer;
    } catch (err) {
      console.error(err);
      return { err };
    }
  }

  async deleteTimer(id) {
    try {
      // Locate the timer in the queue or the database
      let timer;

      this.queue.some((t, i) => {
        if (t.id === id) [ timer ] = this.queue.splice(i, 1);
        return timer !== undefined;
      });

      if (!timer) timer = await Timer.findById(id);
      if (!timer) throw new Error(`Could not Delete Timer ${id} - Timer not found`);

      // Remove the timer
      return await timer.remove();
    } catch (err) {
      console.error(err);
      return { err };
    }
  }
}

module.exports = TimerController;
