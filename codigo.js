window.addEventListener('scroll', function () {
  const prueba = document.querySelector(".prueba");
  const contenBlog = document.querySelector(".conten-imgblog");
  const scrollPosition = window.scrollY;
  if (scrollPosition >= window.innerHeight) {
    prueba.style.opacity = 1;
  } else {
    prueba.style.opacity = 0;
  }
  //contenBlog
  if (scrollPosition >= 2 * window.innerHeight) {
    contenBlog.style.left = '0';
  } else {
    contenBlog.style.left = '-100%';
  }
});
 
const idhotel = document.getElementById("ImMin1");
const hotel = document.querySelector(".hotel");
// codigos para regresar a la parte superior
const divup = document.querySelector(".divup");
function subir() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
divup.addEventListener("click", subir);


/*const qr = document.querySelector(".qr");

qr.addEventListener("click", irSoloPedidos);*/
function irAHotel(){
  location.href = "https://franco-delgado.github.io/hotel/";
}
idhotel.addEventListener("click", irAHotel)
hotel.addEventListener("click", irAHotel)

function Pedidos() {
    location.href = "cafe-bar/index.html";
}
function blog() {
  location.href = "landing-page/index.php";
}
/*
bloquead para evitar errores en git
const blog = document.querySelector(".blog");
const ecomer = document.querySelector(".ecomer");
const auto = document.querySelector(".auto");
//let texth = document.querySelector(".texth");
//HOTEL
hotel.addEventListener("click", irHotel);
function irHotel(){
    location.href = "hotel/index.html";
}

blog.addEventListener("click", irABlog);
function irABlog() {
    location.href = "blog/index.html";
}
//ECOMER
ecomer.addEventListener("click", irEcomer);
function irEcomer() {
    location.href = "restorant/index.html";
}

auto.addEventListener("click",irAuto);
function irAuto(){
    location.href = "autos/index.html";
} */
