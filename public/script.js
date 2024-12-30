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


document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault(); // 防止默認提交行為

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    fetch('/contact_me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('聯絡資訊已成功送出！');
        } else {
            alert('送出失敗，請稍後再試。');
        }
    })
    .catch(error => console.error('錯誤:', error));
});


document.addEventListener("scroll", () => {
    const portfolioSection = document.querySelector("#portfolio"); //點擊後
    const button = document.querySelector("#scroll-button");
    const sectionTop = portfolioSection.offsetTop;
    const sectionHeight = portfolioSection.offsetHeight;
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    if (scrollPosition > sectionTop && scrollPosition < sectionTop + sectionHeight) {
        const offset = scrollPosition - sectionTop;
        button.style.top = `${120 + offset / 11}%`; /* 動態調整位置，基於滾動進度 */
    } else {
        button.style.top = "110%"; /* 超出範圍時重置位置 */
    }
});
// 點擊事件：跳轉到其他網站檔案
document.querySelector("#scroll-button").addEventListener("click", () => {
    window.location.href = './index2.html'; // 替換成資料夾中的目標檔案名稱
});

// 查詢資料庫中的聯絡數量
function updateContactCount() {
    fetch('/contact_count')
        .then(response => response.json())
        .then(data => {
            if (data.count !== undefined) {
                document.getElementById('contact-count').textContent = 
                    `目前已被 ${data.count} 位聯絡過`;
            } else {
                document.getElementById('contact-count').textContent = "無法查詢資料數量。";
            }
        })
        .catch(error => {
            console.error("Error fetching contact count:", error);
            document.getElementById('contact-count').textContent = "查詢失敗，請稍後再試。";
        });
}


const baseURL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://myhtml.onrender.com'; // 替換成你的 Render 應用 URL

// 在頁面加載後執行查詢
document.addEventListener('DOMContentLoaded', updateContactCount);

fetch(`${baseURL}/profolio`)
.then((response) => response.json())
.then((data) => {
    const portfolioContainer = document.querySelector('.portfolio-items');
    portfolioContainer.innerHTML = ''; // 清空容器內容

    data.forEach((item) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
            <img src="${item.imagePath}" alt="${item.title}">
            <h3>${item.title}</h3>
            <h4>${item.description}</h4>
        `;
        portfolioContainer.appendChild(itemElement);
    });
})
.catch((error) => {
    console.error('Error loading images:', error);
});

document.addEventListener("DOMContentLoaded", () => {
    // 獲取所有的圖片
    const images = document.querySelectorAll(".parallax-png");

    // 為每張圖片生成一個隨機的移動係數
    const randomFactors = Array.from(images).map(() => ({
        xFactor: Math.random() * 2 - 1, // 隨機生成 -1 到 1 的水平移動係數
        yFactor: Math.random() * 1.5 + 0.3, // 隨機生成 0.3 到 1.8 的垂直移動係數
    }));

    // 監聽滾動事件
    document.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY; // 獲取滾動的垂直位置

        images.forEach((image, index) => {
            const { xFactor, yFactor } = randomFactors[index]; // 獲取每張圖片的隨機係數

            // 應用隨機移動效果
            image.style.transform = `translate(${scrollPosition * xFactor}px, ${scrollPosition * yFactor}px)`;
        });
    });
});







