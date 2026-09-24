/* ================= datos base ================= */
const CATS = ["Fútbol Masculino","Fútbol Femenino","Fútbol Infantil","Rugby","Acrobacia","Newcom","Vóley","Eventos Sociales"];
const HOURS = []; for(let h=8; h<24; h++){ HOURS.push(String(h).padStart(2,'0')+':00'); } // 08:00 ... 23:00
const isDia = h => parseInt(h) < 19;
const ADMIN_PASS = "chacarita2026";

function load(key, fallback){ try{ const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }catch(e){ return fallback; } }
function save(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

function seed(){
  if(!localStorage.getItem('ccj_news')){
    save('ccj_news', [
      {id:1, title:"Arrancó el torneo Apertura", text:"El plantel de fútbol masculino debuta este fin de semana en su cancha. ¡Los esperamos a todos para alentar!", img:"", video:"", date: new Date().toISOString()},
      {id:2, title:"Nuevas categorías de acrobacia", text:"Abrimos inscripciones para acrobacia infantil y juvenil. Consultá horarios en secretaría.", img:"", video:"", date: new Date().toISOString()}
    ]);
  }
  if(!localStorage.getItem('ccj_prices')){
    const p = {}; HOURS.forEach(h => p[h] = isDia(h) ? 4000 : 6000);
    save('ccj_prices', p);
  }
  if(!localStorage.getItem('ccj_reservations')) save('ccj_reservations', []);
  if(!localStorage.getItem('ccj_cats')){
    const c = {}; CATS.forEach(cat => c[cat] = "Información del equipo próximamente. Consultá días y horarios de entrenamiento en secretaría del club.");
    save('ccj_cats', c);
  }
}
seed();

function toast(msg){
  const t = document.createElement('div'); t.className='toast'; t.textContent = msg;
  document.getElementById('toastRoot').appendChild(t);
  setTimeout(()=>t.remove(), 3200);
}
function closeModal(){ document.getElementById('modalRoot').innerHTML=''; }
function openModal(html){ document.getElementById('modalRoot').innerHTML =
  '<div class="modal-bg" onclick="if(event.target===this)closeModal()"><div class="modal-box"><button class="modal-close" onclick="closeModal()">&times;</button>'+html+'</div></div>'; }

function fmtDate(d){
  return d.toLocaleDateString('es-AR', {weekday:'short', day:'2-digit', month:'2-digit'});
}
function toYMD(d){ return d.toISOString().slice(0,10); }

function youtubeEmbed(url){
  if(!url) return '';
  let id = '';
  const m1 = url.match(/[?&]v=([^&]+)/); const m2 = url.match(/youtu\.be\/([^?&]+)/);
  if(m1) id = m1[1]; else if(m2) id = m2[1];
  return id ? 'https://www.youtube.com/embed/'+id : '';
}

/* ================= navegación ================= */
const views = ['home','categories','reserve','admin'];
function showView(name){
  views.forEach(v => document.getElementById('view-'+v).classList.toggle('hidden', v!==name));
  document.querySelectorAll('.navlink').forEach(b => b.classList.toggle('active', b.dataset.view===name));
  if(name==='home') renderNews();
  if(name==='categories') renderCats();
  if(name==='reserve') renderReserve();
  if(name==='admin') renderAdmin();
}
document.querySelectorAll('.navlink').forEach(b => b.addEventListener('click', ()=>showView(b.dataset.view)));

/* ================= novedades (público) ================= */
function renderNews(){
  const news = load('ccj_news', []).slice().sort((a,b)=> new Date(b.date)-new Date(a.date));
  const grid = document.getElementById('newsGrid');
  if(!news.length){ grid.innerHTML = '<p class="empty">Todavía no hay novedades publicadas.</p>'; return; }
  grid.innerHTML = news.map(n => {
    const emb = youtubeEmbed(n.video);
    let media = '';
    if(n.img) media = '<img src="'+n.img+'" alt="">';
    if(emb) media += '<iframe src="'+emb+'" frameborder="0" allowfullscreen></iframe>';
    return '<div class="card">'+media+'<h3>'+escapeHtml(n.title)+'</h3><div class="date">'+new Date(n.date).toLocaleDateString('es-AR')+'</div><p>'+escapeHtml(n.text)+'</p></div>';
  }).join('');
}
function escapeHtml(s){ const d=document.createElement('div'); d.textContent=s||''; return d.innerHTML; }

/* ================= categorías (público) ================= */
function renderCats(){
  const cats = load('ccj_cats', {});
  document.getElementById('catGrid').innerHTML = CATS.map(c =>
    '<button class="cat-btn" onclick="openCat('+JSON.stringify(c)+')">'+c+'</button>').join('');
}
function openCat(name){
  const cats = load('ccj_cats', {});
  openModal('<h3>'+name+'</h3><p>'+escapeHtml(cats[name]||'')+'</p>');
}

/* ================= reservas (público) ================= */
let selectedDate = toYMD(new Date());
function renderReserve(){
  const tabsEl = document.getElementById('dateTabs');
  tabsEl.innerHTML = '';
  for(let i=0;i<5;i++){
    const d = new Date(); d.setDate(d.getDate()+i);
    const ymd = toYMD(d);
    const btn = document.createElement('button');
    btn.className = 'tab'+(ymd===selectedDate?' active':'');
    btn.textContent = i===0 ? 'Hoy '+fmtDate(d).split(' ')[1] : fmtDate(d);
    btn.onclick = ()=>{ selectedDate = ymd; renderReserve(); };
    tabsEl.appendChild(btn);
  }
  renderSlots();
}
function renderSlots(){
  const prices = load('ccj_prices', {});
  const resv = load('ccj_reservations', []);
  const taken = new Set(resv.filter(r => r.date===selectedDate && r.status!=='cancelado').map(r=>r.time));
  const grid = document.getElementById('slotsGrid');
  grid.innerHTML = HOURS.map(h => {
    const dia = isDia(h);
    const busy = taken.has(h);
    return '<div class="slot"><div class="time">'+h+' - '+String((parseInt(h)+1)%24).padStart(2,'0')+':00</div>'+
      '<span class="tag '+(dia?'dia':'noche')+'">'+(dia?'Día':'Noche')+'</span>'+
      '<div class="price">$'+ (prices[h]||0).toLocaleString('es-AR') +'</div>'+
      '<button '+(busy?'disabled':'')+' onclick="openBooking(\''+h+'\')">'+(busy?'Ocupado':'Reservar')+'</button></div>';
  }).join('');
}
function openBooking(time){
  openModal('<h3>Reservar '+time+' hs</h3><p class="small">Fecha: '+selectedDate+'</p>'+
    '<div class="field"><label>Nombre y apellido</label><input id="bkName"></div>'+
    '<div class="field"><label>Teléfono</label><input id="bkPhone"></div>'+
    '<button class="btn" onclick="confirmBooking(\''+time+'\')">Solicitar turno</button>');
}
function confirmBooking(time){
  const name = document.getElementById('bkName').value.trim();
  const phone = document.getElementById('bkPhone').value.trim();
  if(!name || !phone){ toast('Completá nombre y teléfono'); return; }
  const resv = load('ccj_reservations', []);
  resv.push({id:Date.now(), date:selectedDate, time, name, phone, status:'pendiente', createdAt:new Date().toISOString()});
  save('ccj_reservations', resv);
  closeModal();
  renderSlots();
  toast('Turno solicitado. El club confirmará tu reserva.');
}

/* ================= admin ================= */
function renderAdmin(){
  const logged = sessionStorage.getItem('ccj_admin')==='1';
  document.getElementById('adminLogin').classList.toggle('hidden', logged);
  document.getElementById('adminPanel').classList.toggle('hidden', !logged);
  if(logged){ renderNewsAdmin(); renderBookingsAdmin(); renderPricesAdmin(); renderCatsAdmin(); }
}
document.getElementById('adminLoginBtn').addEventListener('click', ()=>{
  if(document.getElementById('adminPass').value === ADMIN_PASS){
    sessionStorage.setItem('ccj_admin','1'); renderAdmin();
  } else toast('Contraseña incorrecta');
});
document.querySelectorAll('.atab').forEach(b=>{
  b.addEventListener('click', ()=>{
    document.querySelectorAll('.atab').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    ['news','bookings','prices','cats'].forEach(t => document.getElementById('atab-'+t).classList.toggle('hidden', t!==b.dataset.atab));
  });
});

/* -- admin: novedades -- */
function renderNewsAdmin(){
  const news = load('ccj_news', []).slice().sort((a,b)=> new Date(b.date)-new Date(a.date));
  document.getElementById('newsAdminList').innerHTML = news.length ? news.map(n =>
    '<div class="card" style="margin-bottom:10px"><h3>'+escapeHtml(n.title)+'</h3><p>'+escapeHtml(n.text)+'</p>'+
    '<div class="row-actions"><button class="btn-edit" onclick="editNews('+n.id+')">Editar</button>'+
    '<button class="btn-cancel" onclick="deleteNews('+n.id+')">Eliminar</button></div></div>'
  ).join('') : '<p class="empty">Sin novedades.</p>';
}
document.getElementById('nSaveBtn').addEventListener('click', ()=>{
  const title = document.getElementById('nTitle').value.trim();
  const text = document.getElementById('nText').value.trim();
  const img = document.getElementById('nImg').value.trim();
  const video = document.getElementById('nVideo').value.trim();
  const editId = document.getElementById('nEditId').value;
  if(!title || !text){ toast('Completá título y texto'); return; }
  let news = load('ccj_news', []);
  if(editId){
    news = news.map(n => n.id==editId ? {...n, title, text, img, video} : n);
  } else {
    news.push({id:Date.now(), title, text, img, video, date:new Date().toISOString()});
  }
  save('ccj_news', news);
  ['nTitle','nText','nImg','nVideo','nEditId'].forEach(id=>document.getElementById(id).value='');
  renderNewsAdmin();
  toast('Novedad guardada');
});
function editNews(id){
  const n = load('ccj_news', []).find(x=>x.id===id); if(!n) return;
  document.getElementById('nTitle').value = n.title;
  document.getElementById('nText').value = n.text;
  document.getElementById('nImg').value = n.img||'';
  document.getElementById('nVideo').value = n.video||'';
  document.getElementById('nEditId').value = n.id;
  window.scrollTo({top:0, behavior:'smooth'});
}
function deleteNews(id){
  save('ccj_news', load('ccj_news', []).filter(n=>n.id!==id));
  renderNewsAdmin();
}

/* -- admin: turnos -- */
function renderBookingsAdmin(){
  const resv = load('ccj_reservations', []).slice().sort((a,b)=> (a.date+a.time).localeCompare(b.date+b.time));
  const el = document.getElementById('bookingsList');
  if(!resv.length){ el.innerHTML='<p class="empty">No hay turnos solicitados.</p>'; return; }
  el.innerHTML = '<table><thead><tr><th>Fecha</th><th>Hora</th><th>Nombre</th><th>Teléfono</th><th>Estado</th><th></th></tr></thead><tbody>'+
    resv.map(r => '<tr><td>'+r.date+'</td><td>'+r.time+'</td><td>'+escapeHtml(r.name)+'</td><td>'+escapeHtml(r.phone)+'</td><td>'+r.status+'</td>'+
    '<td class="row-actions">'+
    (r.status!=='confirmado' ? '<button class="btn-ok" onclick="setBooking('+r.id+',\'confirmado\')">Confirmar</button>' : '')+
    (r.status!=='cancelado' ? '<button class="btn-cancel" onclick="setBooking('+r.id+',\'cancelado\')">Cancelar</button>' : '')+
    '</td></tr>').join('') + '</tbody></table>';
}
function setBooking(id, status){
  save('ccj_reservations', load('ccj_reservations', []).map(r => r.id===id ? {...r, status} : r));
  renderBookingsAdmin();
}

/* -- admin: precios -- */
function renderPricesAdmin(){
  const prices = load('ccj_prices', {});
  document.getElementById('priceTableBody').innerHTML = HOURS.map(h =>
    '<tr><td>'+h+'</td><td>'+(isDia(h)?'Día':'Noche')+'</td>'+
    '<td><input type="number" id="pin_'+h+'" value="'+(prices[h]||0)+'" style="width:100px"></td>'+
    '<td><button class="btn-edit" style="color:#fff" onclick="saveOnePrice(\''+h+'\')">Guardar</button></td></tr>'
  ).join('');
}
function saveOnePrice(h){
  const val = parseInt(document.getElementById('pin_'+h).value)||0;
  const prices = load('ccj_prices', {}); prices[h]=val; save('ccj_prices', prices);
  toast('Precio de '+h+' actualizado'); renderReserve();
}
document.getElementById('applyDayBtn').addEventListener('click', ()=>{
  const val = parseInt(document.getElementById('dayPriceInput').value); if(!val){ toast('Ingresá un precio'); return; }
  const prices = load('ccj_prices', {}); HOURS.forEach(h => { if(isDia(h)) prices[h]=val; }); save('ccj_prices', prices);
  renderPricesAdmin(); toast('Precio día aplicado a todos los turnos de día');
});
document.getElementById('applyNightBtn').addEventListener('click', ()=>{
  const val = parseInt(document.getElementById('nightPriceInput').value); if(!val){ toast('Ingresá un precio'); return; }
  const prices = load('ccj_prices', {}); HOURS.forEach(h => { if(!isDia(h)) prices[h]=val; }); save('ccj_prices', prices);
  renderPricesAdmin(); toast('Precio noche aplicado a todos los turnos de noche');
});

/* -- admin: categorías -- */
function renderCatsAdmin(){
  const cats = load('ccj_cats', {});
  document.getElementById('catAdminList').innerHTML = CATS.map(c =>
    '<div class="field"><label>'+c+'</label><textarea id="cat_'+CATS.indexOf(c)+'">'+escapeHtml(cats[c]||'')+'</textarea></div>').join('');
}
document.getElementById('catSaveBtn').addEventListener('click', ()=>{
  const cats = {}; CATS.forEach((c,i) => cats[c]=document.getElementById('cat_'+i).value);
  save('ccj_cats', cats); toast('Descripciones guardadas');
});

/* ================= init ================= */
showView('home');