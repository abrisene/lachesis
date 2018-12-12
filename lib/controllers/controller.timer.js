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

// setTimeout(() => 'Hello', 2500);
// console.log(setTimeout(() => 'Hello', 5000));

/*
 # Module Exports
 */

class TimerController {
  constructor() {
    this.timers = [];
    this.queue = [];
    this.timeOut = undefined;
    this.logs = [];

    console.log('\n');
    for (let i = 0; i < 10; i += 1) {
      this.logs[i] = console.draft();
    }
    console.log('\n');

    setInterval(() => this.summarize(), 10);

    this.resetQueue();

    /* setTimeout(() => {
      this.deleteTimer('5c10c2d1d9ab080bd26e6c57');
    }, 1500); */


    /* setTimeout(() => {
      this.createTimer({ duration: 3600, callback: 'http://localhost:8080' });
    }, 1000);

    setTimeout(() => {
      this.createTimer({ duration: 3600 * 4, callback: 'http://localhost:8080' });
    }, 2000); */

    // this.populateTimers();

    for (let i = 0; i < 12; i += 1) {
      // this.createTimer({ duration: 1 + (i * 60 * 5 * Math.random()), callback: 'http://localhost:8080' });
    }
  }

  summarize() {
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
    if (this.timeOut) clearTimeout(this.timeOut);
    this.queue = [];
    this.stream = Timer
      .find()
      .sort('endTS')
      .limit(100)
      .cursor();

    this.stream.on('data', (timer) => {
      this.queue.push(timer);
    });

    this.stream.on('end', () => {
      this.status = 'idle';
      this.evaluateQueue();
    });
  }

  sortQueue() {
    this.queue = this.queue.sort((a, b) => a.endTS - b.endTS);
    this.evaluateQueue();
  }

  async evaluateQueue() {
    if (this.timeOut) clearTimeout(this.timeOut);
    const timer = this.queue[0];
    if (timer) {
      if (Date.now() < timer.endTS) {
        const { remaining } = timer;
        this.timeOut = setTimeout(() => {
          this.evaluateQueue();
        }, remaining);
      } else {
        await timer.redeem();
        await timer.remove();
        this.queue.shift();
        this.evaluateQueue();
      }
    } else {
      // console.log('No Timers Found');
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
      this.queue.push(timer);
      this.sortQueue();

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
          if (i === 0) clearTimeout(this.timeOut);
          const splice = this.queue.splice(i, 1)[0];
          timer = splice[0];
        }
        return timer !== undefined;
      });

      if (!timer) timer = await Timer.findById(id);
      if (!timer) throw new Error(`Could not Delete Timer ${id} - Timer not found`);

      await timer.remove();
      return this.evaluateQueue();
    } catch (err) {
      console.error(err);
      return { err };
    }
  }
}

module.exports = TimerController;
