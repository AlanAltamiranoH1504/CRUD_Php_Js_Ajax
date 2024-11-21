<?php
    spl_autoload_register(function ($nombreClase){
        require_once "Controladores/".$nombreClase.".php";
    })
?>
