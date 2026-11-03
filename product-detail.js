// ======================================
// 織心手作 - 商品詳細頁面
// Video phát trong trang, không dùng fullscreen controls
// ======================================

const params = new URLSearchParams(window.location.search);

const productId = (params.get("id") || "01").padStart(2, "0");
const productName = params.get("name") || "毛線手工藝品";
const productPrice = Number(params.get("price")) || 350;


// ======================================
// 商品介紹
// ======================================

const productDescriptions = {
    "01": "奶油色系的花花編織包，使用毛線手工製作，外型可愛又實用，適合日常搭配。",
    "02": "可愛的雲朵花朵胸針，手工編織製作，讓日常穿搭增添溫柔感。",
    "03": "柔軟舒適的暖暖針織圍巾，適合秋冬季節使用，也很適合送禮。",
    "04": "可愛的小花杯套，手工編織製作，讓每天喝飲料也充滿溫暖。",
    "05": "柔美花瓣造型的毛線髮圈，輕巧可愛，適合日常造型搭配。",
    "06": "以毛線製作的溫柔花束，不會凋謝，適合紀念日及送禮。",
    "07": "柔軟保暖的口袋造型毛線帽，兼具實用與可愛風格。",
    "08": "手工編織的小日子杯墊組，適合居家使用，增添生活質感。",
    "09": "森林風格的手工手機袋，方便攜帶手機，也能搭配日常穿搭。",
    "10": "柔軟舒適的手織披肩，適合外出搭配，展現溫柔氣質。",
    "11": "可愛實用的毛線收納籃，適合收納小物，讓生活更加整齊。"
};


// Hiển thị thông tin sản phẩm

document.getElementById("productName").textContent = productName;

document.getElementById("productPrice").textContent =
    "NT$ " + productPrice.toLocaleString("zh-TW");

document.getElementById("productDescription").textContent =
    productDescriptions[productId] ||
    "每件商品都是用心製作，溫暖又獨特，適合送禮，也適合自己收藏。";

document.title = productName + " | 織心手作";


// ======================================
// 商品影片和圖片
// Video luôn đứng đầu tiên
// ======================================

const galleryTrack = document.getElementById("galleryTrack");
const thumbnailList = document.getElementById("thumbnailList");
const galleryDots = document.getElementById("galleryDots");
const galleryCounter = document.getElementById("galleryCounter");

let galleryItems = [
    { type: "video", src: `./images/${productId}.mp4` },
    { type: "image", src: `./images/${productId}.jpg` },
    { type: "image", src: `./images/${productId}-2.jpg` },
    { type: "image", src: `./images/${productId}-3.jpg` },
    { type: "image", src: `./images/${productId}-4.jpg` }
];

let currentIndex = 0;
let scrollTimer;


// ======================================
// Tạo giao diện video và hình ảnh
// ======================================

function createGallery() {

    galleryTrack.innerHTML = "";
    thumbnailList.innerHTML = "";
    galleryDots.innerHTML = "";

    galleryItems.forEach((item, index) => {

        const slide = document.createElement("div");
        slide.className = "gallery-slide";

        const thumbnail = document.createElement("button");
        thumbnail.type = "button";
        thumbnail.className = "gallery-thumb";

        // ------------------------------
        // VIDEO
        // ------------------------------

        if (item.type === "video") {

            const wrapper = document.createElement("div");
            wrapper.className = "video-wrapper";

            const video = document.createElement("video");

            // Các thuộc tính cần thiết cho iPhone
            video.setAttribute("playsinline", "");
            video.setAttribute("webkit-playsinline", "");
            video.setAttribute("muted", "");

            video.playsInline = true;
            video.muted = true;
            video.loop = true;
            video.autoplay = true;
            video.preload = "auto";

            // Không dùng controls mặc định của Safari
            video.controls = false;

            // Không cho video nhận thao tác chạm trực tiếp
            video.style.pointerEvents = "none";

            video.src = item.src;

            // Nút phát / tạm dừng riêng
            const playButton = document.createElement("button");
            playButton.type = "button";
            playButton.className = "video-play-button";
            playButton.textContent = "⏸";
            playButton.setAttribute("aria-label", "播放或暫停影片");

            // Nút bật / tắt tiếng
            const muteButton = document.createElement("button");
            muteButton.type = "button";
            muteButton.className = "video-mute-button";
            muteButton.textContent = "🔇 開啟聲音";

            // Bấm nút giữa video để phát hoặc tạm dừng
            playButton.addEventListener("click", (event) => {

                event.stopPropagation();

                if (video.paused) {

                    video.play().catch(() => {
                        console.log("影片無法播放");
                    });

                } else {

                    video.pause();

                }

            });

            // Bật hoặc tắt âm thanh
            muteButton.addEventListener("click", (event) => {

                event.stopPropagation();

                video.muted = !video.muted;

                muteButton.textContent = video.muted
                    ? "🔇 開啟聲音"
                    : "🔊 靜音";

            });

            // Cập nhật nút khi video phát
            video.addEventListener("play", () => {
                playButton.textContent = "⏸";
            });

            // Cập nhật nút khi video dừng
            video.addEventListener("pause", () => {
                playButton.textContent = "▶";
            });

            // Tự động phát video khi tải xong
            video.addEventListener("loadeddata", () => {

                if (currentIndex === index) {

                    video.play().catch(() => {
                        playButton.textContent = "▶";
                    });

                }

            });

            // Nếu video không tồn tại
            video.addEventListener("error", () => {
                removeGalleryItem(index);
            });

            wrapper.appendChild(video);
            wrapper.appendChild(playButton);
            wrapper.appendChild(muteButton);

            slide.appendChild(wrapper);

            thumbnail.innerHTML =
                '<div class="video-thumb">▶</div>';

            thumbnail.title = "商品影片";

        }

        // ------------------------------
        // IMAGE
        // ------------------------------

        else {

            const img = document.createElement("img");

            img.src = item.src;
            img.alt = productName + " 商品圖片";
            img.loading = "lazy";

            img.addEventListener("error", () => {
                removeGalleryItem(index);
            });

            slide.appendChild(img);

            const thumbImg = document.createElement("img");

            thumbImg.src = item.src;
            thumbImg.alt = "商品縮圖";

            thumbnail.appendChild(thumbImg);

        }

        // Click thumbnail
        thumbnail.addEventListener("click", () => {
            goToSlide(index);
        });

        galleryTrack.appendChild(slide);
        thumbnailList.appendChild(thumbnail);

        // Dots
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "gallery-dot";

        dot.addEventListener("click", () => {
            goToSlide(index);
        });

        galleryDots.appendChild(dot);

    });

    updateGallery();

}


// ======================================
// Xóa video hoặc ảnh không tồn tại
// ======================================

function removeGalleryItem(index) {

    if (!galleryItems[index]) return;

    const oldScrollPosition = galleryTrack.scrollLeft;

    galleryItems.splice(index, 1);

    if (galleryItems.length === 0) {

        galleryItems.push({
            type: "image",
            src: `./images/${productId}.jpg`
        });

    }

    currentIndex = Math.max(
        0,
        Math.min(currentIndex, galleryItems.length - 1)
    );

    createGallery();

    goToSlide(currentIndex);

}


// ======================================
// Chuyển ảnh
// ======================================

function goToSlide(index) {

    if (index < 0 || index >= galleryItems.length) return;

    // Dừng video khi chuyển sang ảnh khác
    galleryTrack.querySelectorAll("video").forEach(video => {
        video.pause();
    });

    currentIndex = index;

    const slide = galleryTrack.children[index];

    if (slide) {

        galleryTrack.scrollTo({
            left: slide.offsetLeft,
            behavior: "smooth"
        });

    }

    updateGallery();

    // Nếu chuyển về video thì phát lại
    const currentVideo = slide?.querySelector("video");

    if (currentVideo) {

        currentVideo.play().catch(() => {
            console.log("請點擊播放按鈕");
        });

    }

}


// ======================================
// Cập nhật ảnh, chấm và số thứ tự
// ======================================

function updateGallery() {

    const dots = galleryDots.querySelectorAll(".gallery-dot");
    const thumbs = thumbnailList.querySelectorAll(".gallery-thumb");

    dots.forEach((dot, index) => {

        dot.classList.toggle("active", index === currentIndex);

    });

    thumbs.forEach((thumb, index) => {

        thumb.classList.toggle("active", index === currentIndex);

    });

    galleryCounter.textContent =
        `${currentIndex + 1} / ${galleryItems.length}`;

    document.getElementById("galleryPrev").style.display =
        galleryItems.length > 1 ? "block" : "none";

    document.getElementById("galleryNext").style.display =
        galleryItems.length > 1 ? "block" : "none";

}


// ======================================
// Nút chuyển ảnh trái / phải
// ======================================

document.getElementById("galleryPrev").addEventListener("click", () => {

    const index =
        (currentIndex - 1 + galleryItems.length) % galleryItems.length;

    goToSlide(index);

});

document.getElementById("galleryNext").addEventListener("click", () => {

    const index =
        (currentIndex + 1) % galleryItems.length;

    goToSlide(index);

});


// ======================================
// Vuốt ngang trên điện thoại
// Không dừng video khi cuộn dọc trang
// ======================================

galleryTrack.addEventListener("scroll", () => {

    clearTimeout(scrollTimer);

    scrollTimer = setTimeout(() => {

        const width = galleryTrack.clientWidth;

        if (!width) return;

        const newIndex = Math.round(
            galleryTrack.scrollLeft / width
        );

        if (newIndex !== currentIndex) {

            // Chỉ dừng video khi đổi slide
            galleryTrack.querySelectorAll("video").forEach(video => {
                video.pause();
            });

            currentIndex = Math.max(
                0,
                Math.min(newIndex, galleryItems.length - 1)
            );

            updateGallery();

            // Nếu slide mới là video thì phát
            const currentVideo =
                galleryTrack.children[currentIndex]?.querySelector("video");

            if (currentVideo) {

                currentVideo.play().catch(() => {
                    console.log("請點擊播放按鈕");
                });

            }

        }

    }, 120);

});


// Tạo thư viện ảnh
createGallery();


// ======================================
// Số lượng sản phẩm
// ======================================

let quantity = 1;

const quantityText = document.getElementById("quantity");

document.getElementById("minusBtn").addEventListener("click", () => {

    if (quantity > 1) {

        quantity--;

        quantityText.textContent = quantity;

        updateButtonData();

    }

});

document.getElementById("plusBtn").addEventListener("click", () => {

    quantity++;

    quantityText.textContent = quantity;

    updateButtonData();

});


// ======================================
// Dữ liệu nút mua hàng
// Giao cho app.js xử lý giỏ hàng
// ======================================

function updateButtonData() {

    const addCartBtn = document.getElementById("addCartBtn");
    const buyNowBtn = document.getElementById("buyNowBtn");

    [addCartBtn, buyNowBtn].forEach(button => {

        button.dataset.id = productId;
        button.dataset.name = productName;
        button.dataset.price = productPrice;
        button.dataset.image = `./images/${productId}.jpg`;
        button.dataset.quantity = quantity;

    });

}

updateButtonData();