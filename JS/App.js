//Selectores
const formularioRegistro = document.querySelector("#formularioRegistro");
const formularioSesion = document.querySelector("#formularioInicioSesion");
const divResultadoSesion = document.querySelector("#resultadoSesion");
const divResultadoRegistro = document.querySelector("#resultadRegistro");

//Eventos
formularioRegistro.addEventListener("submit", guardarNuevoUsuario);
formularioSesion.addEventListener("submit", iniciarSesion);

//Funciones
function guardarNuevoUsuario(e){
    e.preventDefault();

    const nombre = document.querySelector("#nombre").value;
    const apellidos = document.querySelector("#apellidos").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    const datosUsuario = {
        nombre,
        apellidos,
        email,
        password
    }
    fetch("index.php?controlador=ControladorUsuario&accion=saveUsuario", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datosUsuario)
    }).then((response) =>{
        return response.json();
    }).then((datos) =>{
        const {resultado} = datos;

        if (resultado == "usuario registrado"){
            mostrarAlertas("exito", "Usuario Registrado");
        }else {
            mostrarAlertas("fallo", "Usuario No Registrado");
        }
    }).catch((error) =>{
        console.log("Error en el registro de usuario: " + error);
    })
}

function iniciarSesion(e){
    e.preventDefault();

    const email = document.querySelector("#emailSesion").value;
    const password = document.querySelector("#passwordSesion").value;

    const datosUsuario = {
        email,
        password
    }

    fetch("index.php?controlador=ControladorUsuario&accion=iniciarSesion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datosUsuario)
    }).then((response) =>{
        return response.json();
    }).then((datos) =>{
        const {resultado, direccion} = datos;
        if (resultado == "inicioSesion"){
            mostrarAlertas("exito", "Sesion Iniciada");
            setTimeout(() =>{
                window.location.href = direccion;
            }, 1500);
        }else{
            mostrarAlertas("error", "Usuario No Registrado");
            setTimeout(() =>{
                window.location.href = direccion;
            }, 1500);
        }
    }).catch((error)=>{
        console.log("Error en el inicio de sesion: " + error);
    })
}

function mostrarAlertas(tipo, mensaje){
    const divAlerta = document.createElement("div");
    if (tipo == "exito"){
        divAlerta.textContent = mensaje;
        divAlerta.classList.add("alerta-exito");
    }else{
        divAlerta.textContent = mensaje;
        divAlerta.classList.add("alerta-error");
    }
    divResultadoSesion.appendChild(divAlerta);
    setTimeout(() =>{
        divAlerta.remove();
    },1000)
}