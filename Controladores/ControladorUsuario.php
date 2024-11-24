<?php
    require_once "Modelos/Usuario.php";

    class ControladorUsuario{
        public function index(){
            require_once "Vistas/Usuario/index.html";
        }

        public function saveUsuario(){
            header("Content-Type: application/json");
            $datosUsuario = json_decode(file_get_contents("php://input"), true);

            if ($datosUsuario){
                $nombre = $datosUsuario['nombre'];
                $apellidos = $datosUsuario['apellidos'];
                $email = $datosUsuario['email'];
                $password = $datosUsuario['password'];

                $usuario = new Usuario();
                $usuario->setNombre($nombre);
                $usuario->setApellidos($apellidos);
                $usuario->setEmail($email);
                $usuario->setPassword($password);
//                $usuario->setPassword(password_hash($password, PASSWORD_BCRYPT, ['cost' => 4]));

                $resultadoRegistro = $usuario->saveUsuario();

                if ($resultadoRegistro){
                    echo json_encode(['resultado' => "usuario registrado"]);
                }else{
                    echo json_encode(['resultado' => "usuario no registrado"]);
                }
            }
        }

        public function iniciarSesion(){
            header("Contet-Type: application/json");
            $datosUsuario = json_decode(file_get_contents("php://input"), true);

            if ($datosUsuario){
                $email = $datosUsuario['email'];
                $password = $datosUsuario['password'];

                $usuario = new Usuario();
                $usuario->setEmail($email);
                $usuario->setPassword($password);

                $resultadoInicioSesion = $usuario->inicioSesion();
                if ($resultadoInicioSesion){
                    echo json_encode(["resultado" => "inicioSesion", "direccion" => "Home.html"]);
                }else{
                    echo json_encode(["resultado" => "falloSesion", "direccion" => "index.php"]);
                }
            }
        }

        public function traerUsuarios(){
            $usuario = new Usuario();
            $usuariosDB = $usuario->traerUsuarios();

            $usuarios = [];
            if (is_object($usuariosDB)){
                while ($usuarioRow =  $usuariosDB->fetch_object()){
                    $usuarios[] = $usuarioRow;
                }
                echo json_encode(['usuarios' => $usuarios]);
            }else{
                echo json_encode(["resultado" => "fallos"]);
            }
        }

        public function buscarUsuario(){
            header("Content-Type: application/json");
            $idUsuario = json_decode(file_get_contents("php://input"), true);

            if ($idUsuario){
                $id = $idUsuario['id'];
                $usuario = new Usuario();
                $usuario->setId($id);

                $resultadoBusqueda = $usuario->buscarUsuario();
                echo json_encode($resultadoBusqueda);
            }
        }

        public function eliminar(){
            header("Content-Type: application/json");
            $idUsuario = json_decode(file_get_contents("php://input"), true);
            $id = $idUsuario['id'];

            $usuario = new Usuario();
            $usuario->setId($id);
            $resultadoEliminado = $usuario->eliminar();
            if ($resultadoEliminado){
                $nuevosUsuarios = $usuario->traerUsuarios();
                echo json_encode(["resultado" => "usuario eliminado"]);
            }else{
                echo json_encode(["resultado" => "fallo"]);
            }
        }

        public function actualizar(){
            header("Content-Type: application/json");
            $datosUsuario = json_decode(file_get_contents("php://input"), true);

            if ($datosUsuario){
                $id = $datosUsuario['id'];
                $nombre = $datosUsuario['nombre'];
                $apellidos = $datosUsuario['apellidos'];
                $email = $datosUsuario['email'];
                $password = $datosUsuario['password'];

                $usuario = new Usuario();
                $usuario->setId($id);
                $usuario->setNombre($nombre);
                $usuario->setApellidos($apellidos);
                $usuario->setEmail($email);
                $usuario->setPassword($password);

                $resultadoActualizacion = $usuario->actualizar();
                if ($resultadoActualizacion){
                    echo json_encode(["resultado" => "actualizado"]);
                }else{
                    echo json_encode(["resultado" => "no actualizado"]);
                }
            }
        }
    }
?>