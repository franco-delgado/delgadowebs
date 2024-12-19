//FUNCIONES PARA CREAR Y LEER ID PARA SESION
function generarID() {
  let i = Date.now().toString(30);
  let d = Math.random().toString(30).substring(2);
  return i + d.toString();
}

function obtener_localstorage() {
  let nombre = localStorage.getItem("identificador_del_cliente");
  return nombre;
}

function guardar_localstorage() {
  let identificador_del_cliente = {
    id: generarID()
  };
  localStorage.setItem("identificador_del_cliente", JSON.stringify(identificador_del_cliente));
  let iu = JSON.stringify(identificador_del_cliente).substr(7, 20);
  $.post('retornoDB_cliente.php', {
    identificador_unico: iu,
  })
}

//CONECTORES AL "HTML"

const manto = document.querySelector(".manto");
const contenedor = document.querySelector(".contenedor");
const contenedorMuestra = document.querySelector(".contenedorMuestra");
const contenedorFaltaStock = document.querySelector(".contenedor-mensaje-y-boton");
let inputMuestra = document.querySelector(".inputMuestra");
let input = document.querySelector(".input");


let pedido = "";
function select(bebida) {
  id = bebida.toString();
  console.log("hola " + id);
  pedido = id;
  manto.style.display = "grid";
  contenedor.style.display = "grid";
}
let control = "";
function cantidad(stock) {
  num = parseInt(stock, 10);
  control = num;
  console.log("CANTIDAD: " + control);
  return;
}
function seleccionarYCantidad(bebida, stock) {
  // Llama a la función "select" con el valor de "bebida"
  select(bebida);
  // Llama a la función "cantidad" con el valor de "stock"
  cantidad(stock);
}

//INPUT PARA CARGAR MUESTRA
var objpedido = [];
var objNombre = [];
var objCantidad = [];

function guardar() {
  // Agrega el nuevo pedido y cantidad a los arreglos
  let ingresoNumero = parseInt(input.value, 10);
  if (ingresoNumero <= control) {
    input.value = null;
    let pedid = pedido;
    let numero = ingresoNumero;
    $.post('../mesaprevia.php', {
      mesa: "mesa1",
      pedido: pedid,
      cantidad: numero,
    }, function (date) {
      console.log(date);
    })
    location.reload(true);
  } else {
    manto.style.display = "grid";
    mensaje = `<div class="contenedor-mensaje-y-boton"><p class="mensaje-error">Disculpe, por el momento solo contamos con: ${control} ${pedido}</p><button class="eliminarMensaje" onclick="eliminarMensaje()">ACEPTAR</button>`;
    manto.innerHTML = mensaje;
    input.value = null;
  }
}

//CREACION DE DIV PARA CUADRO MUESTRA ANTES DE CONFIRMAR EL PEDIDO
let cuadromuestra = document.createElement("div");
let salidaMuestra = "";

function downPedido() {
  var mesa = $.ajax({
    url: '../mesaprevia.php',
    dataType: 'text',
    async: false
  }).responseText;
  json = JSON.parse(mesa);
  for (j in json.mesa) {
    if (json.mesa[j] == "mesa1") {
      contenedorMuestra.style.display = "grid";
      manto.style.display = "none";
      contenedor.style.display = "none";
      salidaMuestra += `<p class="salidaDeMensaje">${json.pedido[j]} ${json.unidades[j]}</p>`;
      cuadromuestra.innerHTML = salidaMuestra;
    }
  };
}
inputMuestra.appendChild(cuadromuestra);
setTimeout(2000, downPedido());

//ESTA FUNCION ELIMINA EL MENSAJE DE STOCK DISPONIBLE
function eliminarMensaje() {
  location.reload(true);
}

// INPUT PARA ELIMINAR PEDIDO SIN CARGAR
function borrar() {
  manto.style.display = "none";
  contenedor.style.display = "none";
  input.value = null;
}

//BASE DE DATOS
let clickParaIU = 0;
function cargar() {
  console.log(objCantidad);
  if (clickParaIU == 0) {
    guardar_localstorage();
    clickParaIU++;
  }
  var mesa = $.ajax({
    url: '../mesaprevia.php',
    dataType: 'text',
    async: false
  }).responseText;
  json = JSON.parse(mesa);
  contenedorMuestra.style.display = "none";
  for (j in json.pedido) {
    if (json.mesa[j] == "mesa1") {
      $.post('cliente.php', {
        nombre: json.pedido[j],
        numero: json.unidades[j],
      }, function (date) {
        console.log(date);
      })
    }
  }
  alert("su pedidio fue enviado con exto");
  pedido.innerHTML = "";
  $.post('../eliminarDatosPrevios.php', {
    dato: "eliminar1"
  }, function (date) {
    console.log(date);
  })
  eliminar();
}
function eliminar() {
  contenedorMuestra.style.display = "none";
  inputMuestra.value = null;
  $.post('../eliminarDatosPrevios.php', {
    dato: "eliminar1",
  }, function (date) {
    console.log(date);
  })
  location.reload(true);
}

//SALIDA DE IU

var salida = $.ajax({
  url: 'retornoiu.php',
  dataType: 'text',
  async: false
}).responseText;
json = JSON.parse(salida);
let iu = json;

if (iu != "vacio") {
  if (iu == obtener_localstorage().substr(7, 20)) {
    //alert("mismo ID");
    console.log(obtener_localstorage());
    //cuenta.style.display = "block";
  } else/*(iu == obtener_localstorage().substr(7,20))*/ {
    //alert("El ID es diferente");
    console.log(obtener_localstorage());
    location.href = "../menu acompañante/bebidas.php";
  }
  //console.log(obtener_localstorage());
}