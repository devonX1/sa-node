
class TestCron {

    async forCron() {
        for (let i = 0; i < 100; i++) {
            console.log("Testing cron async function");
        }
    }
}

module.exports = TestCron