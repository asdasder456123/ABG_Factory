const mineflayer = require('mineflayer');

const ip = process.argv[2];
const port = parseInt(process.argv[3]);
const name = process.argv[4];
const password = "0.9638529630.963852963";

const bot = mineflayer.createBot({
    host: ip,
    port: port,
    username: name
});

bot.on('spawn', () => {
    console.log(`✅ ${name} دخل السيرفر!`);
    bot.chat(`/login ${password}`);
});

bot.on('kicked', console.log);
bot.on('error', console.log);

