require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // 用於處理文件路徑

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// 靜態文件服務
app.use(express.static(path.join(__dirname)));

// API 路由
app.post('/send', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send({ error: '所有欄位都必須填寫' });
    }

    try {
        require('dotenv').config();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });


        const mailOptions = {
            from: email,
            to: 'hsuaihsien11@gmail.com', // 收件人的 Gmail
            subject: `新留言來自：${name}`,
            text: `姓名: ${name}\n信箱: ${email}\n訊息: ${message}`,
        };

        await transporter.sendMail(mailOptions);
        res.send({ success: true, message: '郵件已成功發送！' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: '郵件發送失敗，請稍後再試。' });
    }
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`伺服器正在執行於 http://localhost:${PORT}`);
});

console.log('Email User:', process.env.EMAIL_USER);
console.log('Email Pass:', process.env.EMAIL_PASS);

