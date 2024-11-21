<?php
    class DataBase{
        public static function Conexion(){
            $conexion = new mysqli("localhost", "root", "admin", "test");
            return $conexion;
        }
    }
?>