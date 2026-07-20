const { Client, GatewayIntentBits } = require('discord.js');
const mineflayer = require('mineflayer');

// إنشاء بوت ديسكورد الرئيسي
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// تخزين البوتات الشغالة حالياً في الذاكرة
const activeBots = new Map();

client.once('ready', () => {
    console.log(`✅ Discord Bot is online as ${client.user.tag}`);
});

// استقبال الأوامر من ديسكورد
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // شكل الأمر: !start <IP> <Port> <BotName>
    if (message.content.startsWith('!start')) {
        const args = message.content.split(' ');
        const ip = args[1];
        const port = args[2] ? parseInt(args[2]) : 25565;
        const botName = args[3] || `Bot_${Math.floor(Math.random() * 1000)}`;

        if (!ip) {
            return message.reply('❌ اذكر الـ IP! الاستخدام الصحيح: `!start <IP> <Port> <BotName>`');
        }

        if (activeBots.has(botName)) {
            return message.reply(`⚠️ البوت بالاسم "${botName}" شغال بالفعل!`);
        }

        message.reply(`🚀 جاري تشغيل البوت **${botName}** والانضمام إلى ` + ip + `:` + port + `...`);

        try {
            // إنشاء بوت Mineflayer جديد
            const bot = mineflayer.createBot({
                host: ip,
                port: port,
                username: botName,
                version: false // اكتشاف الإصدار تلقائياً
            });

            // التعامل مع الأحداث لتجنب انهيار المصنع لو حصل خطأ
            bot.on('spawn', () => {
                console.log(`[+] Bot ${botName} spawned successfully on ${ip}:${port}`);
            });

            bot.on('error', (err) => {
                console.log(`[!] Error in bot ${botName}:`, err.message);
            });

            bot.on('end', (reason) => {
                console.log(`[-] Bot ${botName} disconnected:`, reason);
                activeBots.delete(botName);
            });

            // حفظ البوت في القائمة
            activeBots.set(botName, bot);

        } catch (error) {
            message.reply(`❌ حدث خطأ أثناء تشغيل البوت: ${error.message}`);
        }
    }

    // أمر لإيقاف بوت معين: !stop <BotName>
    if (message.content.startsWith('!stop')) {
        const args = message.content.split(' ');
        const botName = args[1];

        if (activeBots.has(botName)) {
            const bot = activeBots.get(botName);
            bot.quit();
            activeBots.delete(botName);
            message.reply(`🛑 تم إيقاف وإزالة البوت: **${botName}**`);
        } else {
            message.reply(`❌ مفيش بوت بالاسم ده شغال حالياً.`);
        }
    }
});

// تشغيل البوت بالتوكن مباشرة
client.login("YOUR_DISCORD_TOKEN_HERE");

