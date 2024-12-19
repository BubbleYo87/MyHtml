require('dotenv').config();
const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const nodemailer = require('nodemailer');   

const app = express();
const PORT = 3000;

// 檢查 uploads 資料夾是否存在，否則創建
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// 設置靜態檔案目錄
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// 啟用跨域和 JSON 解析
app.use(cors());
app.use(express.json());

// 設置 MySQL 連接
const db = mysql.createConnection({
    host: '127.0.0.1', // 改為 IPv4 地址
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// 確保資料庫連接成功
db.connect((err) => {
    if (err) {
        console.error('MySQL connection failed:', err);
        throw err;
    }
    console.log('MySQL Connected...');
});

// 設置圖片上傳目錄
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage });

// 處理根路徑請求，返回 index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 上傳圖片並儲存到資料庫
app.post('/upload', upload.single('image'), (req, res) => {
    const { title, description } = req.body;
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const imagePath = `/uploads/${req.file.filename}`;

    const sql = 'INSERT INTO portfolio_images (title, description, image_path) VALUES (?, ?, ?)';
    db.query(sql, [title, description, imagePath], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Failed to upload image.');
        }
        res.send({ success: true, message: 'Image uploaded and saved.', imagePath });
    });
});

// 獲取所有圖片資料
app.get('/images', (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const sql = 'SELECT * FROM portfolio_images LIMIT ? OFFSET ?';
    db.query(sql, [parseInt(limit), parseInt(offset)], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Failed to fetch images.');
        }
        res.json(results);
    });
});

// 新增寄信 API
app.post('/send', async (req, res) => {
    const { name, email, message } = req.body;

    // 驗證請求內容
    if (!name || !email || !message) {
        return res.status(400).send({ error: '所有欄位都必須填寫' });
    }

    try {
        // 設置寄信服務
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // 你也可以使用其他服務
            auth: {
                user: process.env.EMAIL_USER, // Gmail 帳號
                pass: process.env.EMAIL_PASS, // Gmail 應用程式密碼
            },
        });

        // 設置郵件內容
        const mailOptions = {
            from: process.env.EMAIL_USER, // 寄件人
            to: 'hsuaihsien11@gmail.com', // 收件人，替換為目標郵件地址
            subject: `新留言來自：${name}`,
            text: `姓名: ${name}\n信箱: ${email}\n訊息: ${message}`,
        };

        // 發送郵件
        await transporter.sendMail(mailOptions);
        res.send({ success: true, message: '郵件已成功發送！' });
    } catch (error) {
        console.error('郵件發送失敗:', error);
        res.status(500).send({ error: '郵件發送失敗，請稍後再試。' });
    }
});


// 啟動伺服器
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});