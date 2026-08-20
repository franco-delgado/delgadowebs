const KEYS = {
  PROFESIONALES: 'clinica.profesionales',
  TURNOS: 'clinica.turnos',
  ADMIN_AUTH: 'clinica.adminAuth',
};

function leer(clave, valorPorDefecto) {
  try {
    const crudo = window.localStorage.getItem(clave);
    if (!crudo) return valorPorDefecto;
    return JSON.parse(crudo);
  } catch (error) {
    console.error(`No se pudo leer ${clave} del almacenamiento`, error);
    return valorPorDefecto;
  }
}

function escribir(clave, valor) {
  try {
    window.localStorage.setItem(clave, JSON.stringify(valor));
  } catch (error) {
    console.error(`No se pudo guardar ${clave} en el almacenamiento`, error);
  }
}

export { KEYS, leer, escribir };
