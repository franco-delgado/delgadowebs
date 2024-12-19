//FUNCIONES PARA CREAR Y LEER ID PARA SESION
function generarID(){
    let i = Date.now().toString(30);
    let d = Math.random().toString(30).substring(2);
    return i+d.toString();
}

function obtener_localstorage(){
    let nombre = localStorage.getItem("identificador_del_cliente");
    return nombre;
}

function guardar_localstorage(){
    let identificador_del_cliente = {
        id : generarID()
    };
localStorage.setItem( "identificador_del_cliente", JSON.stringify( identificador_del_cliente ) );
let iu = JSON.stringify( identificador_del_cliente ).substr(7,20);
    $.post('retornoDB_cliente.php',{
        identificador_unico: iu,
    })
}

//funciona con iu=json NO COLOCAR JSON.SALIDAIU

//BOTONES DE SELECCION


const manto = document.querySelector(".manto");
const contenedor = document.querySelector(".contenedor");
const contenedorMuestra = document.querySelector(".contenedorMuestra");
let inputMuestra = document.querySelector(".inputMuestra");
let input = document.querySelector(".input");

var objpedido = [];
var objNombre=[];
var objCantidad=[];


let pedido="";
function select(bebida){
    id = bebida.toString();
    console.log("hola "+id);
    pedido = id;
    manto.style.display="grid";
    contenedor.style.display="grid";
}
let control="";
function cantidad(stock){
    num = parseInt(stock, 10);
    control = num;
    console.log("CANTIDAD: "+control);
    return;
}
function seleccionarYCantidad(bebida, stock) {
    // Llama a la función "select" con el valor de "bebida"
    select(bebida);
    // Llama a la función "cantidad" con el valor de "stock"
    cantidad(stock);
}

//INPUT PARA CARGAR MUESTRA
function guardar(){
    // Agrega el nuevo pedido y cantidad a los arreglos
    let ingresoNumero = parseInt(input.value, 10);
    if(ingresoNumero <= control){
        contenedorMuestra.style.display="grid";
        manto.style.display="none";
        contenedor.style.display="none";
        objNombre.push(pedido);
        objCantidad.push(input.value);
        objpedido.push(input.value+" "+pedido);
        inputMuestra.innerHTML= objpedido.toString();
        input.value = null;
    }else{
        manto.style.display="grid";
        mensaje = `<div class="contenedor-mensaje-y-boton"><p class="mensaje-error">"Disculpe, por el momento solo contamos con: ", ${control}," ",${pedido}</p><button class="eliminarMensaje" onclick="eliminarMensaje()">ACEPTAR</button>`;
        console.log("Disculpe, por el momento solo contamos con: ", control," ",pedido);
        manto.innerHTML = mensaje;
    }
}
function eliminarMensaje(){
    manto.style.display="none";
    location.reload(true);
}

// INPUT PARA ELIMINAR PEDIDO SIN CARGAR
function borrar(){
    manto.style.display="none";
    contenedor.style.display="none";
    input.value = null;
}

//BASE DE DATOS
let clickParaIU=0;
function cargar(){
    
    console.log("detectado")
    console.log(objCantidad);
    if(clickParaIU == 0){
        guardar_localstorage();
        clickParaIU++;
    }
    contenedorMuestra.style.display="none";
    inputMuestra.value= null;
    let pedid = objNombre.toString();
    let numero = objCantidad.toString();
        $.post('cliente.php',{
            nombre: pedid,
            numero: numero,
            //horaComienzo: horaComienzo
        },function(date){
            console.log(date);
        })
        console.log(pedid+" "+numero);
        objpedido.splice(0);
        objNombre.splice(0);
        objCantidad.splice(0);
        alert("su pedidio fue enviado con exto");
        pedido.innerHTML = "";
}
function eliminar(){
    contenedorMuestra.style.display="none";
    objpedido.splice(0);
    objNombre.splice(0);
    objCantidad.splice(0);
    inputMuestra.value= null;
}
//HORA
const d = new Date();
let hora = d.getHours();
let minutos = d.getMinutes();
let horaComienzo = hora+":"+minutos;


//SALIDA DE IU

var salida = $.ajax({
    url:'retornoiu.php',
    dataType:'text',
    async:false
}).responseText;
json = JSON.parse(salida);
let iu = json;

if(iu != "vacio"){
    if(iu == obtener_localstorage().substr(7,20)){
        //alert("mismo ID");
        console.log(obtener_localstorage());
        //cuenta.style.display = "block";
    }else/*(iu == obtener_localstorage().substr(7,20))*/{
        //alert("El ID es diferente");
        console.log(obtener_localstorage());
        location.href = "../menu acompañante/bebidas.php";
    }
    //console.log(obtener_localstorage());
}