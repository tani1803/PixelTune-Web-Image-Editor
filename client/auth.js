const API = "http://localhost:3000/api/auth";

async function login(){

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

const res = await fetch(`${API}/login`,{

method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({email,password})

});

const data = await res.json();

if(res.ok){

localStorage.setItem("token",data.token);

// alert("Login successful");

window.location.href="index.html";

}else{

document.getElementById("error-message").innerText = data.message;
}

}

async function register(){

const username = document.getElementById("username").value;
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

const res = await fetch(`${API}/register`,{

method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({username,email,password})

});

const data = await res.json();

if(res.ok){

// alert("Account created");

window.location.href="login.html";

}else{

alert(data.message);

}

}