import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export function useMenu() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();
  const barraMenuRef = useRef(null);
  const animacionRef = useRef(null);

  const navegarA = (ruta) => {
    navigate(ruta);
  };

  const clickMenu = () => {
    clearInterval(animacionRef.current);
    const elemento = barraMenuRef.current;

    if (!menuAbierto) {
      setMenuAbierto(true);
      elemento.style.display = "grid";
      let pos = 0;
      animacionRef.current = setInterval(() => {
        if (pos >= 200) {
          clearInterval(animacionRef.current);
        } else {
          pos += 4;
          elemento.style.height = pos + "px";
        }
      }, 2);
    } else {
      let pos = 200;
      animacionRef.current = setInterval(() => {
        if (pos <= 0) {
          clearInterval(animacionRef.current);
          elemento.style.display = "none";
          setMenuAbierto(false);
        } else {
          pos -= 4;
          elemento.style.height = pos + "px";
        }
      }, 2);
    }
  };

  return {
    barraMenuRef,
    clickMenu,
    navegarA,
  };
}
