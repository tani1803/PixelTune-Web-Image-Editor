// 1️⃣ Check authentication
const token = localStorage.getItem("token");

if(!token){
    window.location.href = "login.html";
}

// 2️⃣ Load images
let galleryImages = [];
let currentImgIndex = -1;

async function loadImages(){
    const res = await fetch("http://localhost:3000/api/images",{
        headers:{ Authorization: `Bearer ${token}` }
    });

    galleryImages = await res.json();
    const gallery = document.getElementById("gallery");

    if (galleryImages.length === 0) {
        gallery.innerHTML = `
            <div class="no-images">
                <i class="ri-image-line"></i>
                <p>Your gallery is empty. Start creating!</p>
            </div>
        `;
        return;
    }

    gallery.innerHTML = "";
    galleryImages.forEach((img, index) => {
        const div = document.createElement("div");
        div.classList.add("image-card");

        div.innerHTML = `
            <div class="img-container" onclick="openImage(${index})">
                <img src="http://localhost:3000/uploads/${img.filename}" alt="Edited artwork" />
            </div>
            <div class="card-actions">
                <span class="img-date">${new Date().toLocaleDateString()}</span>
                <button class="delete-btn" onclick="deleteImage('${img._id}')">
                    <i class="ri-delete-bin-line"></i> Delete
                </button>
            </div>
        `;

        gallery.appendChild(div);
    });
}


// 3️⃣ Delete image
async function deleteImage(id){
    if(!confirm("Delete this creation?")) return;
    
    await fetch(`http://localhost:3000/api/images/${id}`,{
        method:"DELETE",
        headers:{ Authorization: `Bearer ${token}` }
    });

    loadImages();
}

// 4️⃣ Load images when page opens
loadImages();


// 5️⃣ Modal / Zoom Logic
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const closeModal = document.getElementById("close-modal");

function openImage(index){
    currentImgIndex = index;
    const img = galleryImages[index];
    modal.style.display = "flex";
    modalImg.src = `http://localhost:3000/uploads/${img.filename}`;
}

function navigateGallery(step) {
    if (currentImgIndex === -1) return;
    
    currentImgIndex += step;
    if (currentImgIndex >= galleryImages.length) currentImgIndex = 0;
    if (currentImgIndex < 0) currentImgIndex = galleryImages.length - 1;
    
    const img = galleryImages[currentImgIndex];
    modalImg.style.opacity = "0.5";
    modalImg.src = `http://localhost:3000/uploads/${img.filename}`;
    setTimeout(() => modalImg.style.opacity = "1", 100);
}

closeModal.onclick = () => {
    modal.style.display = "none";
    currentImgIndex = -1;
};

// Keyboard Support
window.addEventListener("keydown", (e) => {
    if (modal.style.display === "flex") {
        if (e.key === "ArrowRight") navigateGallery(1);
        if (e.key === "ArrowLeft") navigateGallery(-1);
        if (e.key === "Escape") closeModal.onclick();
    }
});

document.getElementById("back-btn").addEventListener("click", () => {
    window.location.href = "index.html";
});