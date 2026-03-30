const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const filters = {
    brightness: { value: 100, min: 0, max: 200, unit: "%" },
    contrast: { value: 100, min: 0, max: 200, unit: "%" },
    saturate: { value: 100, min: 0, max: 200, unit: "%" },
    hueRotation: { value: 0, min: 0, max: 360, unit: "deg" },
    blur: { value: 0, min: 0, max: 20, unit: "px" },
    grayscale: { value: 0, min: 0, max: 100, unit: "%" },
    sepia: { value: 0, min: 0, max: 100, unit: "%" },
    opacity: { value: 100, min: 0, max: 100, unit: "%" },
    invert: { value: 0, min: 0, max: 100, unit: "%" },
};

const presets = {
    cinematic: { brightness: 95, contrast: 125, saturate: 85, hueRotation: 0, blur: 0, grayscale: 0, sepia: 10, opacity: 100, invert: 0 },
    golden: { brightness: 110, contrast: 105, saturate: 130, hueRotation: 12, blur: 0, grayscale: 0, sepia: 20, opacity: 100, invert: 0 },
    frost: { brightness: 100, contrast: 110, saturate: 85, hueRotation: 190, blur: 0, grayscale: 0, sepia: 0, opacity: 100, invert: 0 },
    portrait: { brightness: 105, contrast: 95, saturate: 110, hueRotation: 0, blur: 1, grayscale: 0, sepia: 0, opacity: 100, invert: 0 },
    moody: { brightness: 90, contrast: 130, saturate: 80, hueRotation: 0, blur: 0, grayscale: 10, sepia: 0, opacity: 100, invert: 0 },
    night: { brightness: 85, contrast: 120, saturate: 90, hueRotation: 220, blur: 0, grayscale: 0, sepia: 0, opacity: 100, invert: 0 },
    pastel: { brightness: 115, contrast: 90, saturate: 120, hueRotation: 0, blur: 0, grayscale: 0, sepia: 5, opacity: 100, invert: 0 },
    film: { brightness: 95, contrast: 110, saturate: 90, hueRotation: 0, blur: 1, grayscale: 0, sepia: 15, opacity: 100, invert: 0 },
    noir: { brightness: 105, contrast: 150, saturate: 0, hueRotation: 0, blur: 0, grayscale: 100, sepia: 0, opacity: 100, invert: 0 },
    dramatic: { brightness: 95, contrast: 160, saturate: 110, hueRotation: 0, blur: 0, grayscale: 0, sepia: 0, opacity: 100, invert: 0 },
};

// UI Elements
const imagecanvas = document.querySelector("#image-canvas");
const imageinput = document.querySelector("#image-input");
const canvasCtx = imagecanvas.getContext("2d");
const resetBtn = document.querySelector("#reset-btn");
const cropBtn = document.querySelector("#crop-btn");
const saveBtn = document.querySelector("#save-btn");
const downloadBtn = document.querySelector("#download-btn");
const filtersContainer = document.querySelector(".filters");
const presetsContainer = document.querySelector(".presets-grid");
const emptyState = document.querySelector("#empty-state");
const canvasWrapper = document.querySelector(".canvas-wrapper");
const imgDimText = document.querySelector("#img-dim");

let originalImg = null;
let cropper = null;
let isCropMode = false;

// Initialize Filters UI
function createFilters() {
    filtersContainer.innerHTML = "";
    Object.keys(filters).forEach(name => {
        const filter = filters[name];
        const item = document.createElement("div");
        item.classList.add("filter-item");
        
        item.innerHTML = `
            <div class="filter-label">
                <span>${name.replace(/([A-Z])/g, ' $1')}</span>
                <b id="val-${name}">${filter.value}${filter.unit}</b>
            </div>
            <input type="range" min="${filter.min}" max="${filter.max}" value="${filter.value}" id="range-${name}">
        `;
        
        const input = item.querySelector("input");
        input.addEventListener("input", (e) => {
            filters[name].value = e.target.value;
            document.querySelector(`#val-${name}`).innerText = `${e.target.value}${filter.unit}`;
            applyAll();
        });
        
        filtersContainer.appendChild(item);
    });
}

// Initialize Presets UI
function createPresets() {
    presetsContainer.innerHTML = "";
    Object.keys(presets).forEach(name => {
        const btn = document.createElement("button");
        btn.classList.add("preset-btn");
        btn.innerText = name;
        btn.addEventListener("click", () => applyPreset(name));
        presetsContainer.appendChild(btn);
    });
}

function applyPreset(name) {
    const preset = presets[name];
    Object.keys(preset).forEach(key => {
        filters[key].value = preset[key];
    });
    createFilters();
    applyAll();
}

// Image Handling
imageinput.addEventListener("change", handleImageUpload);

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            originalImg = img;
            initCanvas();
            showEditor();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function initCanvas() {
    if (cropper) {
        cropper.destroy();
        cropper = null;
        isCropMode = false;
        cropBtn.classList.remove("active");
    }
    
    imagecanvas.width = originalImg.width;
    imagecanvas.height = originalImg.height;
    canvasCtx.filter = "none";
    canvasCtx.drawImage(originalImg, 0, 0);
    
    imgDimText.innerText = `${originalImg.width} × ${originalImg.height}px`;
}

function showEditor() {
    emptyState.style.display = "none";
    canvasWrapper.style.display = "block";
}

function applyAll() {
    if (!originalImg) return;
    
    // Clear and reset filter
    canvasCtx.clearRect(0, 0, imagecanvas.width, imagecanvas.height);
    
    const fStr = `
        brightness(${filters.brightness.value}%)
        contrast(${filters.contrast.value}%)
        saturate(${filters.saturate.value}%)
        hue-rotate(${filters.hueRotation.value}deg)
        blur(${filters.blur.value}px)
        grayscale(${filters.grayscale.value}%)
        sepia(${filters.sepia.value}%)
        opacity(${filters.opacity.value}%)
        invert(${filters.invert.value}%)
    `.trim();
    
    canvasCtx.filter = fStr;
    canvasCtx.drawImage(originalImg, 0, 0);
    
    // If we were in crop mode, we might need to refresh cropper or wait
}

// Tool Actions
cropBtn.addEventListener("click", () => {
    if (!originalImg) return;
    const cropTools = document.querySelector("#crop-tools");
    
    if (isCropMode) {
        // Exit crop mode and apply crop
        const croppedCanvas = cropper.getCroppedCanvas();
        originalImg = new Image();
        originalImg.onload = () => {
            initCanvas();
            applyAll();
        };
        originalImg.src = croppedCanvas.toDataURL();
        
        cropper.destroy();
        cropper = null;
        isCropMode = false;
        cropBtn.classList.remove("active");
        cropTools.style.display = "none";
    } else {
        // Enter crop mode
        isCropMode = true;
        cropBtn.classList.add("active");
        cropTools.style.display = "flex";
        cropper = new Cropper(imagecanvas, {
            viewMode: 1,
            dragMode: 'move',
            autoCropArea: 1,
            restore: false,
            guides: true,
            center: true,
            highlight: false,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: false,
        });
    }
});

function setCropRatio(ratio) {
    if (cropper) cropper.setAspectRatio(ratio);
}

function rotateImg(deg) {
    if (cropper) cropper.rotate(deg);
}

function flipImg(dir) {
    if (!cropper) return;
    const data = cropper.getData();
    if (dir === 'h') cropper.scaleX(data.scaleX === 1 ? -1 : 1);
    if (dir === 'v') cropper.scaleY(data.scaleY === 1 ? -1 : 1);
}


resetBtn.addEventListener("click", () => {
    if (!originalImg) return;
    
    // Reset filters to defaults
    filters.brightness.value = 100;
    filters.contrast.value = 100;
    filters.saturate.value = 100;
    filters.hueRotation.value = 0;
    filters.blur.value = 0;
    filters.grayscale.value = 0;
    filters.sepia.value = 0;
    filters.opacity.value = 100;
    filters.invert.value = 0;
    
    createFilters();
    initCanvas();
    applyAll();
});

downloadBtn.addEventListener("click", () => {
    if (!originalImg) return;
    const link = document.createElement("a");
    link.download = `pixeltune-${Date.now()}.png`;
    link.href = imagecanvas.toDataURL("image/png");
    link.click();
});

async function saveImageToProfile() {
    if (!originalImg) return;
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login first");
        return;
    }

    imagecanvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("image", blob, `pixeltune-${Date.now()}.png`);

        try {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Saving...';
            
            const res = await fetch("http://localhost:3000/api/images/upload", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            const data = await res.json();
            if (res.ok) {
                alert("Image successfully saved to your cloud gallery!");
            } else {
                alert(data.message || "Failed to save image");
            }
        } catch (err) {
            console.error(err);
            alert("Connection error occurred while saving.");
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<i class="ri-save-3-line"></i> Save to Cloud';
        }
    });
}

saveBtn.addEventListener("click", saveImageToProfile);

// Common Navigation
document.getElementById("gallery-btn").addEventListener("click", () => {
    window.location.href = "gallery.html";
});

document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});

// Init
createFilters();
createPresets();
