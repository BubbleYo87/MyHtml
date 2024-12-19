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
    event.preventDefault(); // 防止表單自動刷新

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    try {
        const response = await fetch('http://localhost:3000/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message }),
        });

        const result = await response.json();
        if (response.ok) {
            alert('郵件已成功發送！');
            document.getElementById('contactForm').reset();
        } else {
            alert(`錯誤: ${result.error}`);
        }
    } catch (error) {
        console.error('郵件發送失敗:', error);
        alert('郵件發送失敗，請稍後再試。');
    }
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


// 從 API 加載圖片數據並渲染到頁面
fetch('http://localhost:3000/images')
    .then((response) => response.json())
    .then((data) => {
        const portfolioItems = document.querySelectorAll('.portfolio-items .item');

        // 替換每個佔位符的內容
        data.forEach((item, index) => {
            if (index < portfolioItems.length) {
                const currentItem = portfolioItems[index];
                const img = currentItem.querySelector('img');
                const title = currentItem.querySelector('h3');
                const description = currentItem.querySelector('h4');

                // 更新內容
                img.src = item.image_path;
                img.alt = item.title;
                title.textContent = item.title;
                description.textContent = item.description;
            }
        });
    })
    .catch((error) => console.error('Error loading images:', error));

    




