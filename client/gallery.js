// 1️⃣ Check authentication
const token = localStorage.getItem("token");

if(!token){
    window.location.href = "login.html";
}

// 2️⃣ Load images
async function loadImages(){

    const res = await fetch("http://localhost:3000/api/images",{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

    const images = await res.json();

    const gallery = document.getElementById("gallery");

    gallery.innerHTML = "";

    images.forEach(img => {

        const div = document.createElement("div");

        div.classList.add("image-card");

        div.innerHTML = `
            <img src="http://localhost:3000/uploads/${img.filename}" 
            onclick="openImage('http://localhost:3000/uploads/${img.filename}')"/>

            <button onclick="deleteImage('${img._id}')">Delete</button>
        `;

        gallery.appendChild(div);

    });

}

// 3️⃣ Delete image
async function deleteImage(id){

    await fetch(`http://localhost:3000/api/images/${id}`,{

        method:"DELETE",

        headers:{
            Authorization:`Bearer ${token}`
        }

    });

    loadImages();

}

// 4️⃣ Load images when page opens
loadImages();


// 5️⃣ Modal / Zoom Logic (ADD HERE)
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const closeModal = document.getElementById("close-modal");

function openImage(src){

    modal.style.display = "flex";
    modalImg.src = src;

}

closeModal.onclick = () => {

    modal.style.display = "none";

};

document.getElementById("back-btn").addEventListener("click", () => {

    window.location.href = "index.html";

});