<?php
include "../baseDatos/conexionDB.php";

$bebidas = "SELECT * FROM bebidas";
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
    <link rel="stylesheet" href="../estilos/estiloParaClientes.css">
    <title>Carta digital de tu bar</title>
</head>
<body>
    <div class="titulo">
        <div class="regresar" onclick="location='index.html'"></div>
        <h1>AROMAS CAFE</h1>
    </div>

    <div class="contenedorMuestra" action="datosmesa1" method="post">
            <p type="text" class="inputMuestra"></p>
        <div class="botonesMuestra">
            <button onclick="cargar()" class="guardarMuestra">CONFIRMAR</button>
            <button onclick="eliminar()" class="borrarMuestra">CANCELAR</button>
        </div>
    </div>
    <div class="manto">
        <div class="contenedor">
                <input type="number" class="input">
            <div class="botones">
                <button onclick="guardar()" class="guardar">Cargar</button>
                <button onclick="borrar()" class="borrar">Cancelar</button>
            </div>
        </div>
    </div>
    <?php
    $result = mysqli_query($conex, $bebidas);
$i=1;
    while($row=mysqli_fetch_assoc($result)){
        if($row['stock'] >= 1){ ?>
            <div class="conten" onclick="seleccionarYCantidad('<?php echo $row['nombre'];?>', '<?php echo $row['stock'];?>')">
                <img class="imagen" src="data:image/jpeg;base64,<?php echo base64_encode($row['imagen']);?>"/>
                <div class="nombre"><?php echo $row['nombre'];?></div>
                <div class="descripcion"><?php echo $row['descripcion'];?></div>
                <div class="precio">$ <?php echo $row['precio'];?></div>
            </div>
    <?php }
    } mysqli_free_result($result); ?>

</body>
<script src="codigos.js/nuevoCodigo.js"></script>
</html>