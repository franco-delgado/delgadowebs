//alert("FUNCIONA")
const go = document.getElementById("go");
go.addEventListener("click",cargar)


document.write("funca bien")
const contenedor = document.querySelector(".contenedor");
/*const contenedor = document.createElement("DIV");
contenedor.classList.add("contenedor");*/
const filaA = document.createElement("DIV");
const filaB = document.createElement("DIV");


filaA.classList.add("filaA");
filaB.classList.add("filaB");

//caja.textContent = "HOOOOOlAAAAAAAA";

/*filaA.appendChild(caja);
filaB.appendChild(caja);*/

let con=0;
function cargar (){
    const caja = document.createElement("p");
    caja.classList.add("caja");
    con = con+1;
    console.log(con)
    //alert("FUNCA")
        caja.textContent=con;
        if(con%2 == 0){
            filaA.appendChild(caja);
        }else{
            filaB.appendChild(caja);
        }
        contenedor.appendChild(filaA);
        contenedor.appendChild(filaB);
}

var a=[];



//filaA.appendChild(caja)


//contenedor.appendChild(filaB);






/*if(i<=5){
        caja.textContent=a=[i];
        filaA.appendChild(caja);
        console.log("IF: "+i)
    }else{
        caja.textContent=a=[i];
        filaB.appendChild(caja);
        console.log("ELSE: "+i)
    }
*/
