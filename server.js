require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const Datastore = require("nedb-promises");


const app = express();
const PORT = 3000;

// 檢查 uploads 資料夾是否存在，否則創建
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// 設置靜態檔案目錄
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 初始化資料庫
const ProfolioDB = Datastore.create(path.join(__dirname, "/profolio.db"));
const ContactDB = Datastore.create({
    filename: __dirname + "/contact.db",
    autoload: true // 確保自動加載
});

console.log("資料庫文件路徑:", __dirname + "/contact.db");


// 配置 multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // 指定上傳目錄
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // 確保文件名唯一
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            cb(new Error('文件類型無效，請上傳圖片'));
        } else {
            cb(null, true);
        }
    }
});
;

app.post('/upload', upload.single('image'), async (req, res) => {
    const { title, description } = req.body;
    const file = req.file;

    if (!title || !description || !file) {
        return res.status(400).send({ error: "請提供標題、描述和圖片文件。" });
    }

    const imagePath = `/uploads/${file.filename}`;
    const newEntry = { 
        title, 
        description, 
        imagePath, 
        uploadedAt: new Date() // 添加上傳時間
    };

    try {
        const insertedDoc = await ProfolioDB.insert(newEntry);
        res.status(201).send({
            success: true,
            message: "上傳成功，數據已儲存！",
            data: insertedDoc
        });
    } catch (error) {
        console.error("儲存新數據時發生錯誤：", error);
        res.status(500).send({ error: "儲存數據失敗，請稍後再試。" });
    }
});


// 修改 /profolio 路由，按 title 排序
app.get('/profolio', async (req, res) => {
    try {
        // 根據 uploadedAt 升序排序
        const results = await ProfolioDB.find({}).sort({ uploadedAt: 1 });
        if (results && results.length > 0) {
            res.status(200).json(results);
        } else {
            res.status(404).send("無數據可用。");
        }
    } catch (err) {
        console.error("獲取作品集數據時發生錯誤：", err);
        res.status(500).send("獲取數據失敗。");
    }
});


// 中間件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 路由：處理表單提交
app.post("/contact_me", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        console.log("缺少必要欄位");
        return res.status(400).send({ error: "請填寫所有必填欄位。" });
    }

    const contactData = { name, email, message, submittedAt: new Date() };
    console.log("準備寫入資料庫：", contactData);

    try {
        const newDoc = await ContactDB.insert(contactData);
        console.log("數據成功儲存:", newDoc);

        // 使用新的壓縮方法
        await ContactDB.compactDatafile();
        console.log("資料已同步到 contact.db 文件");

        res.status(200).send({ success: true, message: "資料已成功儲存！", data: newDoc });
    } catch (error) {
        console.error("儲存數據時發生錯誤：", error);
        res.status(500).send({ error: "儲存訊息失敗，請稍後再試。" });
    }
});
// 查詢聯絡資料的數量
app.get('/contact_count', async (req, res) => {
    try {
        const count = await ContactDB.count({}); // 使用 nedb-promises 查詢資料數量
        res.status(200).send({ count });
    } catch (error) {
        console.error("Error counting contact data:", error);
        res.status(500).send({ error: "無法查詢資料數量，請稍後再試。" });
    }
});


// 啟動伺服器
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
