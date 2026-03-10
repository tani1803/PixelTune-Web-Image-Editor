const token = localStorage.getItem("token");

if(!token){
window.location.href="login.html";
}

const filters = {
    brigtness: {
        value: 100,
        min: 0,
        max: 200,
        unit: "%",
    },
    contrast: {
        value: 100,
        min: 0,
        max: 200,
        unit: "%",
    },
    saturation: {
        value: 100,
        min: 0,
        max: 200,
        unit: "%",
    },
    hueRotation: {
        value: 0,
        min: 0,
        max: 360,
        unit: "deg",
    },
    blur: {
        value: 0,
        min: 0,
        max: 20,
        unit: "px",
    },
    grayscale: {
        value: 0,
        min: 0,
        max: 100,
        unit: "%",
    },
    sepia: {
        value: 0,
        min: 0,
        max: 100,
        unit: "%",
    },
    opacity: {
        value: 100,
        min: 0,
        max: 100,
        unit: "%",
    },
    invert: {
        value: 0,
        min: 0,
        max: 100,
        unit: "%",
    },
};

const imagecanvas  = document.querySelector("#image-canvas");
const imageinput = document.querySelector("#image-input");
const canvasCtx = imagecanvas.getContext("2d");
const resetBtn = document.querySelector("#reset-btn");
document.getElementById("save-btn").addEventListener("click", saveImageToProfile);const presetsContainer = document.querySelector(".presets");
let file = null;
let img = null;

const filtersContainer = document.querySelector(".filters");

function createFilterElement(name, unit, value, min, max) {
    const div = document.createElement("div");
    div.classList.add("filter");

    const p = document.createElement("p");
    p.innerText = name;

    const input = document.createElement("input");
    input.type = "range";
    input.min = min;
    input.max = max;
    input.value = value;
    input.id = name;

    div.appendChild(p);
    div.appendChild(input);

    input.addEventListener("input",(event) =>{
        filters[name].value = input.value;
        applyFilters();
    })

    return div;
}

function createFilters(){
    Object.keys(filters).forEach(filter => {
    const f = filters[filter];
    const filterElement = createFilterElement(
        filter,
        f.unit,
        f.value,
        f.min,
        f.max
    );
    filtersContainer.appendChild(filterElement);
});
}

createFilters();


imageinput.addEventListener("change",event=>{

    const file = event.target.files[0];
    const imageplaceholder = document.querySelector(".placeholder");
    imageplaceholder.style.display = "none";

    const image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = () =>{
        img = image;
        imagecanvas.width = image.width;
        imagecanvas.height = image.height;
        canvasCtx.drawImage(image,0,0);
    }

})

function applyFilters() {
    canvasCtx.clearRect(0, 0, imagecanvas.width, imagecanvas.height);

    canvasCtx.filter = `
        brightness(${filters.brigtness.value}${filters.brigtness.unit})
        contrast(${filters.contrast.value}${filters.contrast.unit})
        saturate(${filters.saturation.value}${filters.saturation.unit})
        hue-rotate(${filters.hueRotation.value}${filters.hueRotation.unit})
        blur(${filters.blur.value}${filters.blur.unit})
        grayscale(${filters.grayscale.value}${filters.grayscale.unit})
        sepia(${filters.sepia.value}${filters.sepia.unit})
        opacity(${filters.opacity.value}${filters.opacity.unit})
        invert(${filters.invert.value}${filters.invert.unit})
    `.trim();

    canvasCtx.drawImage(img, 0, 0);
}

resetBtn.addEventListener("click",()=>{
     filters.brigtness.value = 100;
    filters.contrast.value = 100;
    filters.saturation.value = 100;
    filters.opacity.value = 100;

    filters.hueRotation.value = 0;
    filters.blur.value = 0;
    filters.grayscale.value = 0;
    filters.sepia.value = 0;
    filters.invert.value = 0;

    canvasCtx.filter = "none";

    filtersContainer.innerHTML = "";
    createFilters();

    if (img) {
        canvasCtx.clearRect(0, 0, imagecanvas.width, imagecanvas.height);
        canvasCtx.drawImage(img, 0, 0);
    }
})

async function saveImageToProfile() {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        return;
    }

    imagecanvas.toBlob(async (blob) => {

        const formData = new FormData();
        formData.append("image", blob, "edited-image.png");

        const res = await fetch("http://localhost:3000/api/images/upload", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        const data = await res.json();

        if (res.ok) {
            alert("Image saved to your profile!");
        } else {
            alert(data.message);
        }

    });

}

const presets = {

    cinematic: {
        brigtness: 95,
        contrast: 125,
        saturation: 85,
        hueRotation: 0,
        blur: 0,
        grayscale: 0,
        sepia: 10,
        opacity: 100,
        invert: 0,
    },

    golden: {
        brigtness: 110,
        contrast: 105,
        saturation: 130,
        hueRotation: 12,
        blur: 0,
        grayscale: 0,
        sepia: 20,
        opacity: 100,
        invert: 0,
    },

    frost: {
        brigtness: 100,
        contrast: 110,
        saturation: 85,
        hueRotation: 190,
        blur: 0,
        grayscale: 0,
        sepia: 0,
        opacity: 100,
        invert: 0,
    },

    portrait: {
        brigtness: 105,
        contrast: 95,
        saturation: 110,
        hueRotation: 0,
        blur: 1,
        grayscale: 0,
        sepia: 0,
        opacity: 100,
        invert: 0,
    },

    moody: {
        brigtness: 90,
        contrast: 130,
        saturation: 80,
        hueRotation: 0,
        blur: 0,
        grayscale: 10,
        sepia: 0,
        opacity: 100,
        invert: 0,
    },

    night: {
        brigtness: 85,
        contrast: 120,
        saturation: 90,
        hueRotation: 220,
        blur: 0,
        grayscale: 0,
        sepia: 0,
        opacity: 100,
        invert: 0,
    },

    pastel: {
        brigtness: 115,
        contrast: 90,
        saturation: 120,
        hueRotation: 0,
        blur: 0,
        grayscale: 0,
        sepia: 5,
        opacity: 100,
        invert: 0,
    },

    film: {
        brigtness: 95,
        contrast: 110,
        saturation: 90,
        hueRotation: 0,
        blur: 1,
        grayscale: 0,
        sepia: 15,
        opacity: 100,
        invert: 0,
    },

    noir: {
        brigtness: 105,
        contrast: 150,
        saturation: 0,
        hueRotation: 0,
        blur: 0,
        grayscale: 100,
        sepia: 0,
        opacity: 100,
        invert: 0,
    },

    dramatic: {
        brigtness: 95,
        contrast: 160,
        saturation: 110,
        hueRotation: 0,
        blur: 0,
        grayscale: 0,
        sepia: 0,
        opacity: 100,
        invert: 0,
    },

    
};

Object.keys(presets).forEach(presetName => {
    const btn = document.createElement("button");
    btn.classList.add("btn");
    btn.innerText = presetName;

    btn.addEventListener("click", () => {
        applyPreset(presetName);
    });

    presetsContainer.appendChild(btn);
});


function applyPreset(presetName) {
    const preset = presets[presetName];

    Object.keys(preset).forEach(key => {
        filters[key].value = preset[key];
    });

    filtersContainer.innerHTML = "";
    createFilters();
    applyFilters();
}

document.getElementById("gallery-btn").addEventListener("click",()=>{

window.location.href="gallery.html";

});

document.getElementById("logout-btn").addEventListener("click",()=>{

localStorage.removeItem("token");

window.location.href="login.html";

});


