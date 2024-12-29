/*ADMINISTRADOR*/
let cantidad = document.querySelector(".cantidad")

/*CODIGGO BEBIDAS*/
let contenedorMuestra = document.querySelector(".contenedorMuestra");
let inputMuestra = document.querySelector(".inputMuestra");
let manto = document.querySelector(".manto");
let contenedor = document.querySelector(".contenedor");
var input = document.querySelector(".input");
let cantidadPedido = null;
let pedido = "";

function cancelar() {
  input.value = null;
  manto.style.display = "none";
  contenedor.style.display = "none";
}
function habilitar1() {
  manto.style.display = "grid";
  contenedor.style.display = "grid";
  pedido = "pedido 1";
}
function habilitar2() {
  manto.style.display = "grid";
  contenedor.style.display = "grid";
  pedido = "pedido 2";
}
//inputMuestra
function cargar() {
  cantidadPedido = input.value;
  input.value = null;
  manto.style.display = "none";
  contenedor.style.display = "none";
  contenedorMuestra.style.display = "grid";
  inputMuestra.innerHTML = cantidadPedido;
}


function listo() {

  // Guardar los datos en localStorage
  localStorage.setItem('nombre', pedido);
  localStorage.setItem('cantidad', cantidadPedido);

  console.log("Datos guardados en localStorage");
  window.location.href = "../administrador"
}