
const bebidas = document.getElementById("bebidas");
const pizzas = document.getElementById("pizzas");
const cuenta = document.getElementById("cuenta");


bebidas.addEventListener("click",()=>{
    location.href = "bebidas.html";
});
pizzas.addEventListener("click",()=>{
    location.href = "pizzas.php";
});
cuenta.addEventListener("click",()=>{
    location.href = "cuenta.php";
});

