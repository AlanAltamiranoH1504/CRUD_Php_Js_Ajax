document.addEventListener("DOMContentLoaded", () =>{
    cargarUsuarios();
})
//Selectores
const tbodyUsuarios = document.querySelector("#tbodyUsuarios");
const divFormularioUsuarioNuevo = document.querySelector("#divFormularioUsuarioNuevo");
const divEditarUsuario = document.querySelector("#divEditarUsuario");

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

    const formulario = document.createElement("form");
    formulario.setAttribute("method", "post");
    formulario.setAttribute("id", "formularioUsuarioNuevo");
    formulario.innerHTML = `
        <p>
            <label for="nombre">Nombre: </label>
            <input type="text" name="nombreNuevo" id="nombreNuevo" required>    
        </p>
        
        <p>
            <label for="apellidos">Apellidos: </label>
            <input type="text" name="apellidos" id="apellidosNuevos" required>
        </p>
        
        <p>
            <label for="email">Email: </label>
            <input type="email" name="email" id="emailNuevo" required>
        </p>
        
        <p>
            <label for="password">Password: </label>
            <input type="password" name="password" id="passwordNueva" required>
        </p>
        
        <p>
            <input type="submit" value="Nuevo Usuario">
        </p>  
    `;
    divFormularioUsuarioNuevo.appendChild(formulario);
    formularioUsuarioNuevo.addEventListener("submit", registrarNuevoUsuario);
}


function registrarNuevoUsuario(e){
    e.preventDefault();
    const nombre = document.querySelector("#nombreNuevo").value;
    const apellidos = document.querySelector("#apellidosNuevos").value;
    const email = document.querySelector("#emailNuevo").value;
    const password = document.querySelector("#passwordNueva").value;

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
        if (resultado === "usuario registrado"){
            cargarUsuarios();
        }else{
            console.log("Usuario no registrado");
        }
    }).catch((error) =>{
        console.log("Error: " + error)
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
        console.log(error);
    })
}

function llenarFormulario(datos){
    const {id, nombre, apellidos, email, password} = datos;

    divEditarUsuario.innerHTML = "";
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
            <input type="text" name="nombreEdicion" id="nombreEdicion" value="${nombre}" required>
        </p>
        
        <p>
            <label for="apellidos">Apellidos: </label>
            <input type="text" name="apellidosEdicion" id="apellidosEdicion" value="${apellidos}" required>
        </p>
        
        <p>
            <label for="email">Email: </label>
            <input type="email" name="emailEdicion" id="emailEdicion" value="${email}" required>
        </p>
        <p>
            <label for="password">Password: </label>
            <input type="password" name="passwordEdicion" id="passwordEdicion" required>
        </p>
        <p>
            <input type="submit" value="Actualizar"/>
        </p>
    `;
    formularioEdicion.addEventListener("submit", actualizarUsuario);
    divEditarUsuario.appendChild(formularioEdicion);
}

function actualizarUsuario(e){
    e.preventDefault();
    divEditarUsuario.innerHTML = "";
}