const cron = require('node-cron');

async function parseWebsite() {
    try {
        console.log('Начинаем парсинг сайта...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Парсинг завершен.');
    } catch (error) {
        console.error('Ошибка при парсинге сайта:', error);
    }
}

const job = cron.schedule('* * * * *', async () => {
    console.log('Запуск планировщика...');
    await parseWebsite();
});

job.start();
//console.log('Планировщик запущен, будет выполняться каждый день в 00:00.');
