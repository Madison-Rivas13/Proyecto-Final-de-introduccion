// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js'
import {getDatabase, ref, onValue, update, push,child}  from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0xn0IBDC2cFw0LsjYjis6GT4nnYHnXKM",
  authDomain: "madissonsermeno0907-23-18114.firebaseapp.com",
  projectId: "madissonsermeno0907-23-18114",
  storageBucket: "madissonsermeno0907-23-18114.appspot.com",
  messagingSenderId: "823057853817",
  appId: "1:823057853817:web:528e7c0640dc1c6cb413a8",
  measurementId: "G-608ZPM1RJL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

 
//Acá inicio 
var UsuarioConectado = document.getElementById('UsuarioConectado');
var botonIniciar = document.getElementById('botonIniciar');
var botonCerrar = document.getElementById('botonCerrar');
var textoMensaje = document.getElementById('textoMensaje');
var mensajesChat = document.getElementById('mensajesChat');
var nombreUsuarioConectado = "";


botonIniciar.onclick = async function(){
var auth = getAuth();
var provider = new GoogleAuthProvider();
auth.language = "es";
var response = await signInWithPopup(auth,provider);
UsuarioConectado.innerText = response.user.email; 
botonCerrar.style.display = "block";
botonIniciar.style.display = "none";
nombreUsuarioConectado = response.user.email;
escucharYDibujarMensajes();
}

botonCerrar.onclick = async function (){
  var auth = getAuth();
  await auth.signOut();
  botonCerrar.style.display = "none";
  botonIniciar.style.display = "block"; 
  UsuarioConectado.innerText = "No conectado";
  nombreUsuarioConectado = "";
  

}

textoMensaje.onkeydown = async function (event){
  if (event.key == "Enter"){  
if (nombreUsuarioConectado == ""){
alert("El usuario debe iniciar sesion");
return;
  }
  var db = getDatabase();
  var referenciaMensajes = ref(db, "Mensajes");
  var nuevaLlave = push (child(ref(db), "Mensajes" ) ).key;
  var nuevosDatos = {
  [nuevaLlave]: {
    usuario: nombreUsuarioConectado,
    Mensaje: textoMensaje.value,
    fecha: new Date().toLocaleDateString()
  }
  }
textoMensaje.value = ""
update(referenciaMensajes, nuevosDatos)
}

}

function escucharYDibujarMensajes(){
  var db = getDatabase();
  var referenciaMensajes = ref(db, "Mensajes");
  onValue(referenciaMensajes, function(datos){
    var valoresObtenidos = datos.val();
    mensajesChat.innerHTML="";
    //console.log(valoresObtenidos)
    Object.keys(valoresObtenidos).forEach(llave=>{
      var Mensaje = valoresObtenidos[llave];
      mensajesChat.innerHTML += "<div class='nombre-usuario'>" + Mensaje.usuario + "</div>" 
      mensajesChat.innerHTML += "<div class='mensaje-chat'>" + Mensaje.Mensaje + "</div>"
      mensajesChat.innerHTML += "<div>" + Mensaje.fecha + "</div><hr></hr>";

    })

  })
}