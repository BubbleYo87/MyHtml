require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const Datastore = require("nedb-promises");

const app = express();
const PORT = 3000;

// 檢查 uploads 資料夾是否存在，否則創建
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// 設置靜態檔案目錄
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ defCharset: 'utf8', defParamCharset: 'utf8' }));
app.use(cors());

// 初始化資料庫
const ProfolioDB = Datastore.create(path.join(__dirname, "/profolio.db"));
const ContactDB = Datastore.create({
    filename: __dirname + "/contact.db",
    autoload: true // 確保自動加載
});

console.log("資料庫文件路徑:", __dirname + "/contact.db");

// 路由：Profolio
app.get("/profolio", async (req, res) => {
    try {
        const results = await ProfolioDB.find({});
        if (results && results.length > 0) {
            res.send(results);
        } else {
            res.send("No data available.");
        }
    } catch (err) {
        console.error("Error fetching profolio:", err);
        res.status(500).send("Error fetching data.");
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
