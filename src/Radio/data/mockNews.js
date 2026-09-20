// src/Radio/data/mockNews.js
//
// Noticias de MUESTRA (estáticas) para usar mientras Supabase no funciona.
//
// IMPORTANTE: este archivo solo contiene DATOS. No exporta funciones.
// Toda la lógica (getNews, saveNews, getCategory, isAdminAuthed, etc.) vive
// en store.js, que decide si usa estos datos o Supabase según el interruptor
// USE_MOCK_NEWS. Cada noticia tiene exactamente el mismo formato que una fila
// de la tabla `news` de Supabase:
//   { id, category, title, summary, content, image, date, author }
//
// `category` debe ser el id de una categoría de store.js:
//   finanzas | politica | deportes | tecnologia | cultura | internacional

// Imagen de muestra generada localmente (no depende de ningún sitio externo,
// así nunca se rompe). Para usar fotos reales, reemplazá el campo `image`
// por una URL: image: 'https://...'
const cover = (color, label) => {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="#14161a"/>` +
    `</linearGradient></defs>` +
    `<rect width="1200" height="675" fill="url(#g)"/>` +
    `<text x="60" y="610" font-family="Georgia, serif" font-size="76" fill="#ffffff" fill-opacity="0.9">${label}</text>` +
    `</svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const LOREM =
  'Este es un texto de muestra para probar el diseño de la nota completa. ' +
  'Cuando la base de datos esté funcionando, acá se mostrará el contenido real ' +
  'cargado desde el panel de administración.\n\n' +
  'Podés editar o borrar estas noticias desde el panel: mientras el modo de ' +
  'muestra esté activo, los cambios duran hasta que se recargue la página.'

export const mockNews = [
  {
    id: 'mock_1',
    category: 'politica',
    title: 'Título de noticia de prueba: sesión clave en el Congreso',
    summary: 'Descripción breve para probar el diseño de la portada principal.',
    content: LOREM,
    image: cover('#2FB8AC', 'Política'),
    date: '2026-09-20',
    author: 'Redacción Política',
  },
  {
    id: 'mock_2',
    category: 'finanzas',
    title: 'Segunda noticia destacada: el mercado cierra con mejoras',
    summary: 'Texto de muestra para la sección de finanzas.',
    content: LOREM,
    image: cover('#F2A93C', 'Finanzas'),
    date: '2026-09-20',
    author: 'Redacción Finanzas',
  },
  {
    id: 'mock_3',
    category: 'deportes',
    title: 'El equipo local gana y se acerca a la cima de la tabla',
    summary: 'Resumen del partido y las claves del triunfo, con declaraciones del cuerpo técnico.',
    content: LOREM,
    image: cover('#E4483A', 'Deportes'),
    date: '2026-09-19',
    author: 'Redacción Deportes',
  },
  {
    id: 'mock_4',
    category: 'tecnologia',
    title: 'Nueva herramienta de inteligencia artificial llega al mercado',
    summary: 'Qué ofrece, cuánto cuesta y cómo puede cambiar el trabajo diario.',
    content: LOREM,
    image: cover('#7C9EF2', 'Tecnología'),
    date: '2026-09-19',
    author: 'Redacción Tecnología',
  },
  {
    id: 'mock_5',
    category: 'cultura',
    title: 'Se inaugura el festival de música y artes de la región',
    summary: 'Programación completa, artistas invitados y horarios de las funciones.',
    content: LOREM,
    image: cover('#C77DE0', 'Cultura'),
    date: '2026-09-18',
    author: 'Redacción Cultura',
  },
  {
    id: 'mock_6',
    category: 'internacional',
    title: 'Cumbre internacional cierra con un acuerdo de cooperación',
    summary: 'Los líderes firmaron una declaración conjunta al término de las reuniones.',
    content: LOREM,
    image: cover('#4FCB86', 'Internacional'),
    date: '2026-09-18',
    author: 'Agencias',
  },
  {
    id: 'mock_7',
    category: 'politica',
    title: 'Debate en el Senado por el nuevo presupuesto provincial',
    summary: 'Oficialismo y oposición exponen sus posiciones antes de la votación.',
    content: LOREM,
    image: cover('#2FB8AC', 'Política'),
    date: '2026-09-17',
    author: 'Redacción Política',
  },
  {
    id: 'mock_8',
    category: 'finanzas',
    title: 'El dólar se mantiene estable en la semana',
    summary: 'Analistas prevén una calma cambiaria en el corto plazo.',
    content: LOREM,
    image: cover('#F2A93C', 'Finanzas'),
    date: '2026-09-17',
    author: 'Redacción Finanzas',
  },
  {
    id: 'mock_9',
    category: 'deportes',
    title: 'Clasificación histórica en el torneo de tenis',
    summary: 'La joven promesa avanza a semifinales tras un partido de tres sets.',
    content: LOREM,
    image: cover('#E4483A', 'Deportes'),
    date: '2026-09-16',
    author: 'Redacción Deportes',
  },
  {
    id: 'mock_10',
    category: 'tecnologia',
    title: 'Lanzan una red de fibra óptica para zonas rurales',
    summary: 'El plan busca conectar a más de cien localidades en los próximos meses.',
    content: LOREM,
    image: cover('#7C9EF2', 'Tecnología'),
    date: '2026-09-16',
    author: 'Redacción Tecnología',
  },
  {
    id: 'mock_11',
    category: 'cultura',
    title: 'Estreno de la obra de teatro que promete llenar las salas',
    summary: 'Elenco, sinopsis y fechas de las primeras funciones.',
    content: LOREM,
    image: cover('#C77DE0', 'Cultura'),
    date: '2026-09-15',
    author: 'Redacción Cultura',
  },
  {
    id: 'mock_12',
    category: 'internacional',
    title: 'Elecciones en el exterior: qué esperar de la jornada',
    summary: 'Un repaso por los candidatos y los temas que definen la contienda.',
    content: LOREM,
    image: cover('#4FCB86', 'Internacional'),
    date: '2026-09-15',
    author: 'Agencias',
  },
]
