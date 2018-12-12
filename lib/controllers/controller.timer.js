/*
 # controller.timer.js
 # Server Timer Controller
 */

/*
 # Module Dependencies
 */

require('draftlog').into(console);

const { Timer } = require('../models');
/*
 # Critical Variables
 */

/*
 # Module Exports
 */

class TimerController {
  constructor() {
    this.timers = [];
    this.queue = [];
    // this.timeOut = undefined;
    this.interval = undefined;
    this.step = 0;

    this.refreshRate = 1000 / 60;

    this.summaryLog = console.draft();
    this.logs = [];

    console.log('\n');
    for (let i = 0; i < 10; i += 1) {
      this.logs[i] = console.draft();
    }
    console.log('\n');

    this.start();

    setTimeout(() => {
      // this.deleteTimer('5c115d2102c11b1132b04b71');
      for (let i = 0; i < 48; i += 1) {
        // this.createTimer({ duration: i * (3600 / 2), callback: 'http://localhost:8080', payload: { message: `Timer ${i} Complete!` } });
      }
    }, 500);
    

  }

  start() {
    this.step = 0;
    this.resetQueue();
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.step += 1;
      this.summarize();
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
        log(` > ${i} ${timer._id}: ${timer.remaining / 1000}s`);
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
      // console.log(this.queue[0]);
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
      const timer = new Timer({
        startTS: startTime,
        endTS: endTime,
        payload,
        callback: callbackOptions,
      });
      await timer.save();

      const newQueue = [...this.queue, timer].sort((a, b) => a.endTS - b.endTS);
      this.queue = newQueue;

      return timer;
    } catch (err) {
      console.error(err);
      return { err };
    }
  }

  async deleteTimer(id) {
    try {
      let timer;

      this.queue.some((t, i) => {
        if (t.id === id) {
          const splice = this.queue.splice(i, 1)[0];
          timer = splice[0];
        }
        return timer !== undefined;
      });

      if (!timer) timer = await Timer.findById(id);
      if (!timer) throw new Error(`Could not Delete Timer ${id} - Timer not found`);

      return await timer.remove();
    } catch (err) {
      console.error(err);
      return { err };
    }
  }
}

module.exports = TimerController;
