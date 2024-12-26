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

// 在頁面加載後執行查詢
document.addEventListener('DOMContentLoaded', updateContactCount);





