//網頁設計資料
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav');
const header = document.querySelector('.header');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const scrollHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const nearBottom = currentScroll + windowHeight >= scrollHeight - 50; // 距離頁尾 50px 時觸發

    if (nearBottom) {
        header.classList.add('hidden');
    } else if (currentScroll > lastScroll) {
        // 向下滾動
        header.classList.add('hidden');
    } else {
        // 向上滾動
        header.classList.remove('hidden');
    }

    lastScroll = currentScroll;
});


//伺服器資料
document.getElementById('contactForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // 防止頁面刷新

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    try {
        const response = await fetch('http://localhost:3000/send', { // 改為你的伺服器 URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message }),
        });

        const result = await response.json();
        if (response.ok) {
            alert('郵件已成功發送！');
            document.getElementById('contactForm').reset(); // 清空表單
        } else {
            alert(`錯誤: ${result.error}`);
        }
    } catch (error) {
        console.error('郵件發送失敗:', error);
        alert('郵件發送失敗，請稍後再試。');
    }
});

const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// 配置靜態文件服務
app.use(express.static(path.join(__dirname)));

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`伺服器正在執行於 http://localhost:${PORT}`);
});



