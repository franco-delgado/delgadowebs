alert("correct")
/*ADMINISTRADOR*/
let cantidad = document.querySelector(".cantidad")




/*CODIGGO BEBIDAS*/
let contenedorMuestra = document.querySelector(".contenedorMuestra");
let inputMuestra = document.querySelector(".inputMuestra");
let manto = document.querySelector(".manto");
let contenedor = document.querySelector(".contenedor");
var input = document.querySelector(".input")
let cantidadPedido = null;

function listo() {
  window.location.href = "../administrador"
  cantidad.innerHTML = inputMuestra;
}
function cancelar() {
  input.value = null;
  manto.style.display = "none";
  contenedor.style.display = "none";
}
function habilitar1() {
  manto.style.display = "grid";
  contenedor.style.display = "grid";
}
function habilitar2() {
  manto.style.display = "grid";
  contenedor.style.display = "grid";
}
function cargar() {
  cantidadPedido = input.value;
  input.value = null;
  alert(" cantidad: " + cantidadPedido);
  manto.style.display = "none";
  contenedor.style.display = "none";
  contenedorMuestra.style.display = "grid";
  inputMuestra.innerHTML = cantidadPedido
}