const Datastore = require('nedb');
const db = new Datastore({ filename: 'portfolio_images.db', autoload: true });

// 定義圖片資訊
const images = [
    {
        title: '作品名稱 1',
        description: '這是我寫網站的第一天。',
        imagePath: '/uploads/01.png',
        uploadedAt: new Date(),
    },
    {
        title: '作品名稱 2',
        description: '這是我寫網站的第二天。',
        imagePath: '/uploads/02.gif',
        uploadedAt: new Date(),
    },
    {
        title: '作品名稱 3',
        description: '這是我寫網站的第三天。',
        imagePath: '/uploads/03.gif',
        uploadedAt: new Date(),
    },
];

// 插入圖片資訊到資料庫
db.insert(images, (err, newDocs) => {
    if (err) {
        console.error('插入圖片資訊時發生錯誤:', err);
    } else {
        console.log('圖片資訊已成功插入資料庫:', newDocs);
    }
});
