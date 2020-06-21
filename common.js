const moment = require('moment');
const shortid = require('shortid');

function sleep(time) {
    return new Promise((res, _) => {
        setTimeout(() => {
            res(time);
        }, time);
    })
}

async function heartbeatHandler(meetCondition, timeoutCallback, limitTime, remainTime = limitTime) {
    if (meetCondition()) {
        remainTime = limitTime;
    } else if (remainTime > 0) {
        remainTime -= 1000;
    } else {
        timeoutCallback();
        return;
    }
    await sleep(1000);
    heartbeatHandler(meetCondition, timeoutCallback, limitTime, remainTime);
}

async function tryUntilLimitHandler(meetCondition, failCallback, limitTime, remainTime = limitTime) {
    if (meetCondition()) {
        return;
    } else {
        if (remainTime > 0) {
            remainTime -= 1000;
        } else {
            failCallback();
            return;
        }
    }
    await sleep(1000);
    tryUntilLimitHandler(meetCondition, failCallback, limitTime, remainTime);
}

function getCurDateTime() {
    return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
}

function generateShortId() {
    return shortid.generate();
}

class RunTimer {
    constructor(callback, intervalTime) {
        this.id = generateShortId();
        this.callback = callback;
        this.intervalTime = intervalTime;
        this.timer = 0;
        this.startTimer();
    }

    getTime() {
        return new Date().getTime();
    }

    timeout(diffTime, beforeTime) {
        const waitTime = this.intervalTime - diffTime;
        this.timer = setTimeout(() => {
            this.callback();
            const afterTime = this.getTime();
            this.timeout(afterTime - beforeTime - waitTime, afterTime);
        }, waitTime);
    }

    clearTimer() {
        clearTimeout(this.timer);
    }

    startTimer() {
        this.timeout(0, this.getTime());
    }
}

module.exports = {
    sleep,
    heartbeatHandler,
    tryUntilLimitHandler,
    getCurDateTime,
    generateShortId,
    RunTimer
}
