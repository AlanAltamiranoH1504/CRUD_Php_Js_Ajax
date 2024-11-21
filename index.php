<?php
    session_start();
    require_once "AutoLoad.php";
    if (!isset($_GET['controlador'])){
        header("Location: index.php?controlador=ControladorUsuario&accion=index");
    }else if (isset($_GET['controlador']) && class_exists($_GET['controlador'])){
        $controlador = new $_GET['controlador'];
        if (isset($_GET['accion']) && method_exists($controlador, $_GET['accion'])){
            $accion = $_GET['accion'];

            $controlador->$accion();
        }else{
            echo "<h1>El metodo no existe</h1>";
        }
    }else{
        echo "<h1>El controlador no existe</h1>";
    }

?>
