document.addEventListener("DOMContentLoaded", ()=>{
    //Selectores
    const formularioRegistro = document.querySelector("#formularioRegistro");
    const formularioSesion = document.querySelector("#formularioInicioSesion");
    const divResultadoSesion = document.querySelector("#resultadoSesion");
    const divResultadoRegistro = document.querySelector("#resultadRegistro");

    //Eventos
    formularioRegistro.addEventListener("submit", validarFormularioRegistro);
    formularioSesion.addEventListener("submit", validarFormularioSesion);

    //Funciones
    function validarFormularioRegistro(e){
        e.preventDefault();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const nombre = document.querySelector("#nombre").value;
        const apellidos = document.querySelector("#apellidos").value;
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;

        if (nombre.trim() === "" || Number(nombre)){
            mostrarAlertas("error", "Errores en el nombre de usuario");
        }else if(apellidos.trim() === "" || Number(apellidos)){
            mostrarAlertas("error", "Errores en los apellidos del usuario");
        }else if (email.trim() === "" || !regex.test(email)){
            mostrarAlertas("error", "Errores en el email de usuario");
        } else if (password.trim() === "" || password.length < 6){
            mostrarAlertas("error", "La password debe 6 o mas caracteres");
        } else{
            const datosUsuario = {
                nombre,
                apellidos,
                email,
                password
            }
            guardarNuevoUsuario(datosUsuario);
        }
    }

    function validarFormularioSesion(e){
        e.preventDefault();
        const email = document.querySelector("#emailSesion").value;
        const password = document.querySelector("#passwordSesion").value;

        if (email.trim() === ""){
            mostrarAlertas("error", "Campo email no llenado");
        }else if (password.trim() === ""){
            mostrarAlertas("error", "Campo password no llenado");
        }else{
            const datosUsuario = {
                email,
                password
            }
            iniciarSesion(datosUsuario);
        }
    }

    function guardarNuevoUsuario(datosUsuario){
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
            mostrarAlertas("fallo", "Usuario No Registrado");
        })
    }

    function iniciarSesion(datosUsuario){
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
                }, 3000);
            }
        }).catch((error)=>{
            console.log("Error en el inicio de sesion: " + error);
        })
    }

    function mostrarAlertas(tipo, mensaje){
        divResultadoSesion.innerHTML = "";
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
        },3000)
    }
});