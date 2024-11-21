<?php
    require_once "Configuracion/DataBase.php";

    class Usuario{
        private $id;
        private $nombre;
        private $apellidos;
        private $email;
        private $password;
        private $db;

        public function __construct(){
            $this->db = DataBase::Conexion();
        }

        public function getId(){
            return $this->db->real_escape_string($this->id);
        }
        public function setId($id){
            $this->id = $id;
        }
        public function getNombre(){
            return $this->db->real_escape_string($this->nombre);
        }
        public function setNombre($nombre){
            $this->nombre = $nombre;
        }
        public function getApellidos(){
            return $this->db->real_escape_string($this->apellidos);
        }
        public function setApellidos($apellidos){
            $this->apellidos = $apellidos;
        }
        public function getEmail(){
            return $this->db->real_escape_string($this->email);
        }
        public function setEmail($email){
            $this->email = $email;
        }
        public function getPassword(){
            return $this->db->real_escape_string($this->password);
        }
        public function setPassword($password){
            $this->password = $password;
        }

        public function saveUsuario(){
            $resultadoSaveUsuario = false;

            $query = "INSERT INTO Usuarios(nombre, apellidos, email, password) VALUES('{$this->getNombre()}', '{$this->getApellidos()}', '{$this->getEmail()}', '{$this->getPassword()}')";
            $ejecucionQuery = $this->db->query($query);
            if ($ejecucionQuery){
                $resultadoSaveUsuario = true;
            }
            return $resultadoSaveUsuario;
        }

        public function inicioSesion(){
            $query = "SELECT * FROM Usuarios WHERE email = '{$this->getEmail()}'";
            $ejecucionQuery = $this->db->query($query);

            if ($ejecucionQuery && $ejecucionQuery->num_rows > 0){
                $datosUsuario = $ejecucionQuery->fetch_object();
                $passwordRecibida = $this->getPassword();
                $paswordAlmacenada = $datosUsuario->password;

                if ($paswordAlmacenada == $passwordRecibida){
                    return true;
                }else{
                    return false;
                }
            }
        }

        public function traerUsuarios(){
            $resultadoSelect = false;
            $query = "SELECT * FROM Usuarios";
            $ejecucionQuery = $this->db->query($query);

            if ($ejecucionQuery && $ejecucionQuery->num_rows > 0){
                $resultadoSelect = $ejecucionQuery;
            }
            return $resultadoSelect;
        }

        public function eliminar(){
            $query = "DELETE FROM Usuarios WHERE id = '{$this->getId()}'";
            $ejecucionQuery = $this->db->query($query);

            if ($ejecucionQuery){
                return true;
            }else{
                return false;
            }
        }

        public function buscarUsuario(){
            $query = "SELECT * FROM Usuarios WHERE id = '{$this->getId()}'";
            $ejecucionQuery = $this->db->query($query);

            if ($ejecucionQuery && $ejecucionQuery->num_rows> 0){
                $datosUsuario = $ejecucionQuery->fetch_object();
                return $datosUsuario;
            }else{
                echo json_encode(["datosUsuario" => "sin datos"]);
            }
        }
    }

?>