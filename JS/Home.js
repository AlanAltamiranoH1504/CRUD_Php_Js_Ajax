document.addEventListener("DOMContentLoaded", () =>{
    cargarUsuarios();
})
//Selectores
const tbodyUsuarios = document.querySelector("#tbodyUsuarios");
const divFormularioUsuarioNuevo = document.querySelector("#divFormularioUsuarioNuevo");
const divEditarUsuario = document.querySelector("#divEditarUsuario");
const alertasNuevoUsuario = document.querySelector("#alertasNuevoUsuario");

//Funciones
function cargarUsuarios(){
    fetch("index.php?controlador=controladorUsuario&accion=traerUsuarios").then((response) => {
        return response.json();
    }).then((datos) => {
        const {usuarios} = datos;
        mostrarUsuarios(usuarios);
    }).catch((error) => {
        console.log("Error en traer usuarios: " + error);
    })
}

function mostrarUsuarios(usuarios){
    tbodyUsuarios.innerHTML = "";
    usuarios.forEach((usuario) =>{
        const tr = document.createElement("tr");
        tr.innerHTML = `
                <td>${usuario.nombre}</td>
                <td>${usuario.apellidos}</td>
                <td>${usuario.email}</td>
                <td><button onclick="editarUsuario(${usuario.id})">Editar</button></td>
                <td><button onclick="eliminarUsuario(${usuario.id})">Eliminar</button></td>
            `;
        tbodyUsuarios.appendChild(tr);
    });
}

function agregarUsuario(){
    divFormularioUsuarioNuevo.innerHTML = "";
    divEditarUsuario.innerHTML = "";

    const formulario = document.createElement("form");
    formulario.setAttribute("method", "post");
    formulario.setAttribute("id", "formularioUsuarioNuevo");
    formulario.innerHTML = `
        <p>
            <label for="nombre">Nombre: </label>
            <input type="text" name="nombreNuevo" id="nombreNuevo" pattern="[a-zA-Z]+"  placeholder="Solo letras" required>    
        </p>
        
        <p>
            <label for="apellidos">Apellidos: </label>
            <input type="text" name="apellidos" id="apellidosNuevos"  pattern="[a-zA-Z]+" placeholder="Solo letras" required>
        </p>
        
        <p>
            <label for="email">Email: </label>
            <input type="email" name="email" id="emailNuevo"  placeholder="Formato email" required>
        </p>
        
        <p>
            <label for="password">Password: </label>
            <input type="password" name="password" id="passwordNueva"  placeholder="Minimo 6 caracteres">
        </p>
        
        <p>
            <input type="submit" value="Nuevo Usuario">
        </p>  
    `;
    divFormularioUsuarioNuevo.appendChild(formulario);
    formularioUsuarioNuevo.addEventListener("submit", validarFormularioNuevoUsuario);
}

function validarFormularioNuevoUsuario(e){
    e.preventDefault();
    alertasNuevoUsuario.innerHTML = "";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const nombre = document.querySelector("#nombreNuevo").value;
    const apellidos = document.querySelector("#apellidosNuevos").value;
    const email = document.querySelector("#emailNuevo").value;
    const password = document.querySelector("#passwordNueva").value;

    if (nombre.trim() === "" || Number(nombre)){
        mostrarAlertas("error", "Errores en el nombre del usuario");
    }else if (apellidos.trim() === "" || Number(apellidos)){
        mostrarAlertas("error", "Errores en los apellidos del usuario");
    }else if (email.trim() === "" || !regex.test(email)){
        mostrarAlertas("error", "Errores en el email del usuario");
    }else if (password.trim() === "" || password.length < 6){
        mostrarAlertas("error", "Errores en la contraseña del usuario");
    }else{
        const datosUsuario = {
            nombre,
            apellidos,
            email,
            password
        }
        registrarNuevoUsuario(datosUsuario);
    }
}

function registrarNuevoUsuario(datosUsuario){
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
        if (resultado === "usuario registrado"){
            cargarUsuarios();
            mostrarAlertas("exito", "Nuevo Usuario Registrado");
        }else{
            mostrarAlertas("error", "Error en el registro del usuario")
        }
    }).catch((error) =>{
        mostrarAlertas("error", "Error en el registro del usuario")
    });
    divFormularioUsuarioNuevo.innerHTML = "";
}

function eliminarUsuario(id){
    const idUsuario = {
        id
    }
    fetch(`index.php?controlador=ControladorUsuario&accion=eliminar`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(idUsuario)
    }).then((response) =>{
        return response.json();
    }).then((datos) =>{
        const {resultado, nuevosUsuarios} = datos;
        if (resultado == "usuario eliminado"){
            cargarUsuarios();
        }
    }).catch((error) =>{
        console.log(error)
    });
}

function editarUsuario(id){
    const idUsuario = {
        id
    }
    fetch("index.php?controlador=ControladorUsuario&accion=buscarUsuario", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(idUsuario)
    }).then((response) =>{
        return response.json();
    }).then((datos) =>{
        llenarFormulario(datos);
    }).catch((error)=>{
        mostrarAlertas("error", "Error en la edicion del usuario");
    })
}

function llenarFormulario(datos){
    const {id, nombre, apellidos, email, password} = datos;

    divEditarUsuario.innerHTML = "";
    divFormularioUsuarioNuevo.innerHTML = "";
    const formularioEdicion = document.createElement("form");
    formularioEdicion.setAttribute("method", "post");
    formularioEdicion.setAttribute("id", "formularioEdicion");

    formularioEdicion.innerHTML = `
        <p>
            <label for="id">ID: </label>
            <input type="text" name="id" id="id" readonly value="${id}">
        </p>
        
        <p>
            <label for="nombre">Nombre: </label>
            <input type="text" name="nombreEdicion" id="nombreEdicion" value="${nombre}" pattern="[a-zA-Z]+" required placeholder="Solo letras">
        </p>
        
        <p>
            <label for="apellidos">Apellidos: </label>
            <input type="text" name="apellidosEdicion" id="apellidosEdicion" pattern="[a-zA-Z]+" value="${apellidos}" required placeholder="Solo letras">
        </p>
        
        <p>
            <label for="email">Email: </label>
            <input type="email" name="emailEdicion" id="emailEdicion" value="${email}" required placeholder="Formato Email">
        </p>
        <p>
            <label for="password">Password: </label>
            <input type="password" name="passwordEdicion" id="passwordEdicion" required placeholder="Minimo 6 caracteres" minlength="6">
        </p>
        <p>
            <input type="submit" value="Actualizar"/>
        </p>
    `;
    formularioEdicion.addEventListener("submit", validarFormularioActualizarUsuario);
    divEditarUsuario.appendChild(formularioEdicion);
}

function validarFormularioActualizarUsuario(e){
    e.preventDefault();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const id = document.querySelector("#id").value;
    const nombre = document.querySelector("#nombreEdicion").value;
    const apellidos = document.querySelector("#apellidosEdicion").value;
    const email = document.querySelector("#emailEdicion").value;
    const password = document.querySelector("#passwordEdicion").value;

    if (nombre.trim() === "" || Number(nombre)){
        mostrarAlertas("error", "Errores en el nombre de usuario");
    }else if (apellidos.trim() === "" || Number(apellidos)){
        mostrarAlertas("error", "Errores en los apellidos del usuario");
    }else if (email.trim() === "" || !regex.test(email)){
        mostrarAlertas("error", "Errores en el email de usuario");
    }else if (password.trim() === "" || password.length < 6){
        mostrarAlertas("error", "Errores en la contraseña del usuario");
    } else{
        const datoUsuario = {
            id,
            nombre,
            apellidos,
            email,
            password
        }
        actualizarUsuario(datoUsuario)
    }
}

function actualizarUsuario(datosUsuario){
    fetch("index.php?controlador=ControladorUsuario&accion=actualizar", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(datosUsuario)
    }).then((response) =>{
        return response.json();
    }).then((datos) =>{
        mostrarAlertas("exito", "Usuario Actualizado");
        cargarUsuarios();
    }).catch((error) =>{
        mostrarAlertas("error", "Error en la actualizacion del usuario");
    });
    divEditarUsuario.innerHTML = "";
}

function mostrarAlertas(tipo, mensaje){
    const alerta = document.createElement("div");
    if (tipo === "error"){
        alerta.textContent = mensaje;
        alerta.classList.add("alerta-error");
    }else{
        alerta.textContent = mensaje;
        alerta.classList.add("alerta-exito");
    }
    alertasNuevoUsuario.appendChild(alerta);
    setTimeout(() =>{
        alertasNuevoUsuario.innerHTML = "";
    }, 3000)
}