const fs = require('fs');
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

// 1. تنظيف الكاش لضمان دخول نظيف
function cleanOldCache() {
    const cacheDir = './cache_folder';
    if (fs.existsSync(cacheDir)) {
        fs.rmSync(cacheDir, { recursive: true, force: true });
    }
}
cleanOldCache();

const bot = mineflayer.createBot({
    host: 'ABGMC.aternos.me:', 
    port: 46998,
    username: 'ABG_Robot'
});

bot.loadPlugin(pathfinder);

// 2. نظام مراقبة النشاط (عشان البوت ميهنجش)
let lastMessageTime = Date.now();
setInterval(() => {
    if (Date.now() - lastMessageTime > 300000) { // لو مفيش رسالة جات من 5 دقايق
        console.log('⚠️ البوت معلق.. إعادة تشغيل..');
        process.exit(1);
    }
}, 60000);

bot.on('message', (jsonMsg) => {
    lastMessageTime = Date.now(); // تحديث وقت آخر رسالة
    const message = jsonMsg.toString();
    console.log('رسالة السيرفر:', message);

    if (/(register|تسجيل)/i.test(message)) {
        bot.chat('/register 0.963852963 0.963852963');
    } else if (/(login|log in|دخول)/i.test(message)) {
        bot.chat('/login 0.963852963');
    }
});

bot.on('spawn', () => {
    console.log('✅ تم تسجيل الدخول بنجاح!');
    bot.chat('أنا متواجد للحفاظ على السيرفر نشط! 🤖');
    startHumanBehavior();
});

// 3. سلوك بشري متطور (حركة وتفاعل)
function startHumanBehavior() {
    setInterval(() => {
        const moves = ['forward', 'back', 'left', 'right'];
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        bot.setControlState(randomMove, true);
        setTimeout(() => bot.setControlState(randomMove, false), 1500);
        bot.look(Math.random() * Math.PI * 2, (Math.random() - 0.5) * Math.PI / 4);
    }, 12000);

    // البوت بيتكلم كل فترة عشان يبان طبيعي
    setInterval(() => {
        const msgs = ["سيرفر جامد جداً!", "حد عايز مساعدة؟", "أنا شغال 24 ساعة 🤖"];
        bot.chat(msgs[Math.floor(Math.random() * msgs.length)]);
    }, 300000); 
}

// 4. نظام إعادة الاتصال الذكي (لضمان العمل 24/7)
bot.on('end', () => {
    console.log('🔌 الاتصال انقطع.. محاولة إعادة الاتصال خلال 10 ثواني...');
    setTimeout(() => process.exit(1), 10000);
});

bot.on('error', (err) => {
    console.log('❌ خطأ:', err.message);
});

