# Sitio de club deportivo: novedades y reserva de canchas

Componente React sin referencias a ningún club en particular. El nombre, el escudo, los colores, los datos de contacto y de transferencia se cargan desde el panel de administración.

## Cómo usarlo

Requiere solo `react` y `react-dom`. Copiá esta carpeta a tu proyecto e importá el componente:

```jsx
import AlquilerDeCanchas from './AlquilerDeCanchas/AlquilerDeCanchas.jsx'

<AlquilerDeCanchas />
```

### Botón "Volver al portfolio"

Aparece arriba del encabezado. Props opcionales:

```jsx
<AlquilerDeCanchas onBack={() => navigate('/')} />        // con react-router
<AlquilerDeCanchas backHref="/" />                        // link simple
<AlquilerDeCanchas backLabel="Volver" showBack={false} /> // cambiar texto u ocultar
```
Sin props, vuelve a la página anterior del navegador.

## Acceso al panel

Botón **Administración** del encabezado. Contraseña inicial: `admin1234`.
**Cambiala** en Administración > Configuración > Contraseña del panel.

## Qué hace cada parte

**Usuarios (`user/`)**
- Inicio: presentación, turnos libres de hoy, últimas novedades, cómo reservar y contacto.
- Novedades: listado con categorías y buscador; cada novedad se abre con sus fotos y video.
- Reservar cancha: cancha, día y turno. Pide nombre, apellido, DNI, teléfono y el comprobante de transferencia (imagen o PDF). Entrega un código y permite consultar el estado con el DNI.

**Administración (`admin/`)**
- Resumen: pendientes, turnos de hoy, ingresos confirmados del mes, ocupación de 7 días.
- Reservas: filtros y búsqueda, datos completos, comprobante (ver/descargar), confirmar, rechazar, cancelar, WhatsApp a la persona y exportación a CSV.
- Novedades: texto, hasta 6 fotos, video de YouTube, categoría, fecha y destacada.
- Turnos y precios: canchas, horarios por día de la semana, precios (individual o en bloque), generador de turnos y días cerrados.
- Configuración: datos del club, datos de transferencia, escudo, color principal, condiciones, contraseña y copia de seguridad.

## Estructura

```
Chacarita/
  Chacarita.jsx / .css      entrada y estilos base
  config/                   valores por defecto
  context/                  estado y reglas (disponibilidad, reservas, sesión)
  utils/                    fechas, archivos, almacenamiento, CSV
  components/               Header, Footer, Modal, Toast, Logo, ui (botones, campos)
  user/                     Home, News, Reservations
  admin/                    Dashboard, ReservationsManager, NewsManager,
                            ScheduleManager, Settings
```
Cada componente tiene su `.css` en la misma carpeta. Todas las clases empiezan con `cl-` y están dentro de `.cl-app`, para no chocar con los estilos del resto de tu sitio.

## Importante antes de entregarlo a un cliente

Los datos se guardan en el navegador (`localStorage`), no en un servidor.
- Las reservas hechas desde el celular de un cliente **no llegan** al panel que abre el administrador en otro dispositivo.
- La contraseña del panel protege la interfaz, pero no es seguridad real: cualquiera con acceso al navegador puede leer los datos.
- Límite de unos 5 MB: los comprobantes se comprimen, pero con muchas reservas conviene descargar copias y limpiar.

Para uso real con varios dispositivos hace falta un backend (base de datos, almacenamiento de archivos y login). Toda la persistencia pasa por `utils/storage.js` y `context/ClubContext.jsx`, así que ahí se reemplaza por llamadas a una API sin tocar las pantallas.
