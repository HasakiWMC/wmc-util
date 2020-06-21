const { common } = require('./index');

let a = 1;
async function test() {
    common.heartbeatHandler(() => {
        return a > 10;
    }, () => {
        console.log(`heartbeat end because condition not meet`);
    }, 3000);

    console.log(`timer start to run`);
    const timer = new common.RunTimer(() => {
        a++;
        console.log(`${timer.getTime()}=${a}`);
    }, 1000);
    setTimeout(() => {
        timer.clearTimer();
    }, 5000);
}

test();
