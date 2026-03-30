const API = "http://localhost:3000/api/auth";

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const showError = (msg) => {
    const errEl = document.getElementById("error-message");
    errEl.innerText = msg;
    errEl.style.opacity = "1";
};

async function login(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!validateEmail(email)) {
        showError("Please enter a valid email address");
        return;
    }

    const res = await fetch(`${API}/login`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email,password})
    });

    const data = await res.json();
    if(res.ok){
        localStorage.setItem("token",data.token);
        window.location.href="index.html";
    }else{
        showError(data.message);
    }
}

async function register(){
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!username || !email || !password) {
        showError("All fields are required");
        return;
    }

    if (!validateEmail(email)) {
        showError("Please enter a valid email address");
        return;
    }

    const res = await fetch(`${API}/register`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username,email,password})
    });

    const data = await res.json();
    if(res.ok){
        window.location.href="login.html";
    }else{
        showError(data.message);
    }
}