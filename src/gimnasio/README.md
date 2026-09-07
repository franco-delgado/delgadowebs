# GymFlow — App de gestión para gimnasios (v2, simplificada)

Prototipo funcional en React con **3 roles**: Cliente, Entrenador y Dueño.
Todos comparten la misma base de datos local (localStorage), así que lo que
carga un rol se refleja en los otros dentro del mismo navegador/computadora.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrí el link que muestra la terminal (por defecto http://localhost:5173).

## Accesos de prueba

Todas las cuentas de prueba usan la contraseña `1234`. Hay botones de acceso
rápido en la pantalla de login, o podés loguearte manualmente:

| Usuario     | Rol        | Quién es                          |
|-------------|-----------|------------------------------------|
| cliente     | Cliente    | Lucía Fernández                   |
| nahuel      | Cliente    | Nahuel Torres                     |
| camila      | Cliente    | Camila Ríos (cuota vencida, a propósito, para probar ese caso) |
| federico    | Cliente    | Federico Salas                    |
| entrenador  | Entrenador | Marcos Ibáñez                     |
| dueno       | Dueño      | Alejandro Paz                     |

## Qué hace cada rol

**Cliente**
- Ve su rutina de entrenamiento diaria (individual o la de su grupo, si el entrenador la armó así).
- Marca su propia asistencia del día.
- Ve su rendimiento (asistencias del mes, racha de días seguidos, total histórico).
- Ve si está al día con la cuota, cuánto paga y cuándo vence el próximo pago.

**Entrenador**
- Ficha su entrada y salida (registro de jornada).
- Arma rutinas de entrenamiento, individuales por alumno o por grupo (puede crear
  grupos y elegir qué alumnos los integran).

**Dueño**
- Alta y baja de alumnos y de entrenadores (cada uno con su propio usuario/contraseña).
- Ve el estado de cuota de cada alumno (al día / por vencer / vencida) y puede
  registrar el pago.
- Ve la asistencia y el rendimiento de cada alumno.
- Ve los horarios de entrada/salida fichados por cada entrenador.
- Modifica el valor de las cuotas (Básico / Estándar / Premium).

## Cómo funciona la base de datos compartida

`src/data/store.js` concentra **todas** las lecturas y escrituras de datos,
usando `localStorage` del navegador. Por eso, si abrís la app en dos pestañas
del mismo navegador (una como entrenador, otra como cliente), los cambios se
reflejan al instante entre ellas.

**Importante:** esto es local a cada navegador/computadora. Sirve perfecto
para mostrarle la demo a un cliente desde una sola máquina, pero **no**
sincroniza datos entre dispositivos distintos (por ejemplo, un entrenador en
una notebook y un alumno en su celular en su casa). Para eso, más adelante,
hay que reemplazar `store.js` por llamadas a un backend real (Firebase,
Supabase, o uno propio) — la forma de las funciones (`getAlumnos`,
`updateAlumno`, etc.) se mantendría igual, así que el resto de la app no
necesitaría cambios grandes.

## Estructura del proyecto

```
src/
  data/store.js            -> Toda la base de datos (localStorage) y su lógica
  context/AuthContext.jsx  -> Login contra store.js
  components/              -> Layout, Sidebar, Topbar, Login, UI reutilizable
  pages/cliente/           -> Mi rutina, Asistencia, Rendimiento, Mi cuota
  pages/entrenador/        -> Fichaje, Rutinas (individual/grupal + grupos)
  pages/dueno/             -> Alumnos, Entrenadores, Cuotas y planes
```

## Publicarla en internet / instalarla como app móvil (PWA)

Sigue funcionando igual que antes:

```bash
npm run build
```

Sube la carpeta `dist/` a Vercel, Netlify o similar (gratis). Una vez
publicada con HTTPS, en el celular aparece la opción "Instalar app" /
"Agregar a pantalla de inicio", sin pasar por tiendas de apps.

**Ojo:** si la publicás así (estática, sin backend), el localStorage de cada
visitante seguirá siendo local a SU navegador — o sea, para que un cliente
real vea en su celular la rutina que le armó el entrenador desde otra
computadora, en algún momento va a hacer falta el backend compartido
mencionado arriba.
