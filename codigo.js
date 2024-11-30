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




/*
bloquead para evitar errores en git 
const hotel = document.querySelector(".hotel");
const blog = document.querySelector(".blog");
const ecomer = document.querySelector(".ecomer");
const qr = document.querySelector(".qr");
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

qr.addEventListener("click", irSoloPedidos);
function irSoloPedidos() {
    location.href = "SoloPedidos/index.html";
}

auto.addEventListener("click",irAuto);
function irAuto(){
    location.href = "autos/index.html";
} */