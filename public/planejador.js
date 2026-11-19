const photos=['photo-1500375592092-40eb2168fd21','photo-1441974231531-c6227db76b6e','photo-1464822759023-fed622ff2c3b','photo-1519681393784-d120267933ba'];
const defaults=[{name:'Ubatuba',state:'SP',subtitle:'Mar, serra e pé na areia',km:310,hours:'5h30',days:4,via:'Dom Pedro I · Tamoios',alt:'Via Taubaté · Oswaldo Cruz',altkm:340,alth:'6h30',coords:[[-22.74,-46.90],[-23.19,-45.88],[-23.62,-45.41],[-23.43,-45.08]],stops:['Pedreira → São José dos Campos','São José dos Campos → Caraguatatuba','Caraguatatuba → Toninhas, Ubatuba'],kms:[165,85,60],times:['2h30','1h30','1h30'],notes:['Saída sugerida às 07h. Pausa para abastecer e descansar.','Almoço sugerido em Caraguatatuba entre 12h e 13h. Local a confirmar.','Praia das Toninhas; cachoeira da Água Branca como opção. Acesso e condições a confirmar.']},{name:'Carrancas',state:'MG',subtitle:'Cachoeiras e caminhos de Minas',km:390,hours:'6h30',days:3,via:'Fernão Dias · Lavras',alt:'Via São João del-Rei',altkm:460,alth:'8h',coords:[[-22.74,-46.90],[-21.78,-45.96],[-21.25,-45],[-21.49,-44.64]],stops:['Pedreira → região de Campanha','Campanha → Lavras','Lavras → Carrancas'],kms:[210,100,80],times:['3h','1h30','2h'],notes:['Saída sugerida às 07h. Parada de descanso e combustível.','Almoço caseiro em Lavras entre 12h e 13h. Restaurante e acesso asfaltado a confirmar.','Complexo da Fumaça e cachoeiras. Últimos acessos podem ter terra; confirmar antes de ir.']},{name:'Urubici',state:'SC',subtitle:'Altitude, curvas e novos ares',km:1050,hours:'16h',days:5,via:'Régis Bittencourt · Curitiba · BR-116',alt:'Via litoral · BR-101',altkm:1190,alth:'19h',coords:[[-22.74,-46.90],[-25.43,-49.27],[-27.82,-50.33],[-28.02,-49.59]],stops:['Pedreira → Curitiba (dia 1)','Curitiba → Lages (dia 2)','Lages → Urubici (dia 2)'],kms:[530,410,110],times:['8h','6h','2h'],notes:['Almoço no caminho e pernoite em Curitiba. Dividir em pausas a cada 1h30–2h.','Saída cedo. Almoço na região de Lages, estabelecimento a confirmar.','Morro da Igreja, Cascata do Avencal e Serra do Corvo Branco. Reservas, pavimento e acessos pendentes.']},{name:'Serra do Rio do Rastro',state:'SC',subtitle:'Uma curva, uma nova paisagem',km:1140,hours:'18h',days:4,via:'Curitiba · Lages · Bom Jardim da Serra',alt:'Via litoral · Lauro Müller',altkm:1210,alth:'19h30',coords:[[-22.74,-46.90],[-25.43,-49.27],[-28.34,-49.62],[-28.39,-49.55]],stops:['Pedreira → Curitiba (dia 1)','Curitiba → Bom Jardim da Serra (dia 2)','Bom Jardim → mirante da Serra'],kms:[530,590,20],times:['8h','9h','1h'],notes:['Pernoite em Curitiba. Planejar pausas, almoço e combustível.','Etapa longa: considerar pernoite adicional para reduzir cansaço.','Visitar mirante com luz do dia. Confirmar interdições, neblina e condições da SC-390.']}].map((x,i)=>({...x,id:i,photo:photos[i],date:'',status:'Planejando',hotel:'',booking:'Pendente de confirmação',obs:'',checks:[],weather:null,chosen:0}));
let trips;try{trips=JSON.parse(localStorage.getItem('bora-v1'))||defaults}catch{trips=defaults}
// Classifica uma única vez as duas ideias de viagem já presentes no planejador.
let radarUpdated = false;
for (const trip of trips) {
  const destination = {2: 'Urubici', 3: 'Serra do Rio do Rastro'}[trip.id];
  if (!destination || trip.name !== destination || trip.radarReviewed) continue;
  if (trip.status === 'Planejando' && !trip.date) trip.status = 'No radar';
  trip.radarReviewed = true;
  radarUpdated = true;
}
if (radarUpdated) localStorage.setItem('bora-v1', JSON.stringify(trips));
// Os dois roteiros iniciais já constam no diário de viagens realizadas.
let diaryReviewed = false;
for (const trip of trips) {
  const originalName = ['Ubatuba', 'Carrancas'][trip.id];
  if (!originalName || trip.name !== originalName || trip.diaryReviewed) continue;
  if (!trip.date && trip.status === 'Planejando') trip.status = 'Concluída';
  trip.diaryReviewed = true;
  diaryReviewed = true;
}
if (diaryReviewed) localStorage.setItem('bora-v1', JSON.stringify(trips));

function plannedKilometers(trips) {
  return trips
    .filter(trip => trip.status === 'Planejando' || trip.status === 'Confirmada')
    .reduce((total, trip) => total + Number(trip.chosen ? trip.altkm : trip.km), 0);
}
const expeditionId = -476;
if (!trips.some(trip => trip.id === expeditionId)) {
  trips = [...trips, {
    ...defaults[0], status: 'Planejando', id: expeditionId, name: 'Expedição Rastro da Serpente', state: 'SP / PR',
    subtitle: 'Quatro pessoas · Honda CB 500X e Suzuki Boulevard 800',
    roundTrip: true, days: 4, km: 1150, hours: '21h', via: 'Ida pelo Rastro da Serpente e volta pela Régis Bittencourt',
    alt: '', altkm: '', alth: '', photo: photos[3],
    stops: ['Pedreira → Apiaí', 'Apiaí → Curitiba', 'Curitiba → Miracatu', 'Miracatu → Pedreira'],
    waypoints: ['Sorocaba, SP|Capão Bonito, SP|Guapiara, SP', 'Ribeira, SP|Adrianópolis, PR|Bocaiúva do Sul, PR', 'Registro, SP', 'Embu das Artes, SP|Campinas, SP'],
    kms: [370, 180, 290, 310], times: ['6h30', '4h30', '5h', '5h'],
    notes: [
      'Saída sugerida às 7h com os tanques cheios. Pausa em Sorocaba. Em Capão Bonito, abastecer no Posto BR da rotatória do Portal e parar para café e fotos. Seguir pela SP-250 via Guapiara. Jantar e pernoite em Apiaí.',
      'Completar os tanques em Apiaí. Descer até Ribeira, cruzar para Adrianópolis e seguir pela BR-476 via Tunas do Paraná. Parar no Serpenteando Café antes do centro de Bocaiúva do Sul. Pernoite em Curitiba.',
      'Sair cedo com os tanques cheios pela BR-116. Primeira pausa na região de Barra do Turvo. Para combustível e almoço, Graal Petropen, km 461, em Pariquera-Açu, sentido São Paulo. Seguir via Registro até Miracatu para jantar e dormir.',
      'Sair de Miracatu após o café. Fazer uma pausa para abastecer em Juquitiba. Em Embu das Artes, acessar o Rodoanel e seguir pela Bandeirantes. Almoçar na região de Jundiaí e voltar a Pedreira via Campinas.'
    ],
    coords: [[-22.74,-46.90],[-24.51,-48.84],[-25.43,-49.27],[-24.28,-47.46],[-22.74,-46.90]],
    hotel: 'Apiaí · Gold-inn Hotel, R. Dr. Augusto do Amaral, 130, Centro. (15) 3552-2655. Segunda opção: Pousada Canto, R. Luís Gomes de Lima, 8. (15) 99796-1477. Curitiba · Hotel Granville, Centro. Miracatu · hospedagem a definir, com duas vagas internas para as motos.',
    obs: 'Consultar dois quartos ou uma acomodação para quatro. Pedir confirmação por escrito de duas vagas internas com acesso controlado durante a noite e valor por moto. Granville: referência informada de R$ 30 por diária de moto, a reconfirmar. Categoria de hospedagem e reservas em aberto.',
    checks: []
  }];
}
// Atualiza também o roteiro original já salvo neste navegador.
const savedExpedition = trips.find(trip => trip.id === expeditionId);
if (savedExpedition?.days === 3 && savedExpedition.stops?.[2] === 'Curitiba → Pedreira' && savedExpedition.stops.length === 3) {
  const trip = savedExpedition;
  trip.days = 4;
  trip.stops.splice(2, 1, 'Curitiba → Miracatu', 'Miracatu → Pedreira');
  trip.kms.splice(2, 1, 290, 310);
  trip.km = trip.kms.reduce((total, km) => total + Number(km), 0);
  trip.times.splice(2, 1, '5h', '5h');
  trip.notes[2] = trip.notes[2].replace('Seguir via Registro, Rodoanel e Bandeirantes. Programar outra pausa antes de Campinas.', 'Seguir via Registro até Miracatu para jantar e dormir.');
  trip.notes.push('Abastecer em Juquitiba. Seguir via Embu, Rodoanel e Bandeirantes. Almoçar na região de Jundiaí e voltar via Campinas.');
  trip.waypoints.splice(2, 1, 'Registro, SP', 'Embu das Artes, SP|Campinas, SP');
  trip.coords.splice(3, 0, [-24.28,-47.46]);
  trip.hotel += '\nMiracatu · hospedagem a definir, com duas vagas internas para as motos.';
  trip.weather = null;
}
if (savedExpedition && !savedExpedition.schedule) {
  savedExpedition.schedule = savedExpedition.stops.map((_, index) => ({
    day: index + 1, departure: '07:00', lunch: 60, coffee: 20, fuel: 15
  }));
}
if (savedExpedition && !savedExpedition.carnaval2027Agendado) {
  savedExpedition.date = '2027-02-06';
  savedExpedition.carnaval2027Agendado = true;
  savedExpedition.weather = null;
  savedExpedition.obs = savedExpedition.obs?.replace('Data, categoria de hospedagem e reservas em aberto.', 'Categoria de hospedagem e reservas em aberto.') || '';
  localStorage.setItem('bora-v1', JSON.stringify(trips));
}
let selected=trips.find(trip => trip.status === 'Planejando')?.id ?? trips[0]?.id,page='Viagens',tab='Roteiro',filter='Todas',month=new Date().getMonth(),year=new Date().getFullYear();const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const t=()=>trips.find(x=>x.id===selected)||trips[0];const save=()=>{localStorage.setItem('bora-v1',JSON.stringify(trips))};function toast(s){let e=document.getElementById('toast');e.textContent=s;e.hidden=false;setTimeout(()=>e.hidden=true,3000)}const date=s=>s?new Date(s+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}):'Data a definir';
function render(){document.getElementById('nav').innerHTML=['Viagens','Calendário','Preparação'].map((n,i)=>`<button class="${page===n?'active':''}" onclick="page='${n}';render()">${['▧','▦','☑'][i]} &nbsp; ${n}</button>`).join('')+`<button onclick="backup()">↗ &nbsp; Exportar planos</button>`;document.getElementById('app').innerHTML=page==='Calendário'?calendar():page==='Preparação'?`<div class="section"><div class="heading"><h2>Preparação para a estrada</h2>${selectTrip()}</div>${checklist()}</div>`:dashboard();}
function selectTrip(){return `<select style="width:210px" onchange="selected=Number(this.value);render()">${trips.map(x=>`<option value="${x.id}" ${x.id===selected?'selected':''}>${esc(x.name)}</option>`).join('')}</select>`}

function calendarDay(trip, day) {
  if (!trip.date) return null;
  const value = new Date(trip.date + 'T12:00:00');
  value.setDate(value.getDate() + day - 1);
  return value;
}

function dateRange(trip) {
  const start = calendarDay(trip, 1);
  if (!start) return 'Data a definir';
  const end = calendarDay(trip, Number(trip.days));
  const period = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric', month: 'short', year: 'numeric'
  }).formatRange(start, end);
  return trip.id === expeditionId && trip.date === '2027-02-06' && Number(trip.days) === 4
    ? period + ' · Carnaval 2027' : period;
}

function dayLabel(trip, day) {
  const date = calendarDay(trip, day);
  return 'Dia ' + day + (date ? ' · ' + date.toLocaleDateString('pt-BR', {
    weekday: 'short', day: '2-digit', month: '2-digit'
  }) : '');
}

function stepDay(trip, index) {
  const explicit = trip.stops[index]?.match(/\(dia (\d+)\)/i);
  return trip.schedule?.[index]?.day ?? (explicit ? Number(explicit[1]) : trip.id === expeditionId ? index + 1 : 1);
}

function arrival(trip, index) {
  const plan = trip.schedule?.[index] || {};
  if (!plan.departure) return '';
  const duration = String(trip.times[index]).trim().match(/^(\d+)\s*(?:h|:)\s*(\d{1,2})?\s*(?:min)?$/i);
  if (!duration || Number(duration[2] || 0) >= 60) return 'Informe a pilotagem no formato 5h30.';
  const [hours, minutes] = plan.departure.split(':').map(Number);
  const total = hours * 60 + minutes + Number(duration[1]) * 60 + Number(duration[2] || 0)
    + ['lunch', 'coffee', 'fuel'].reduce((sum, key) => sum + Number(plan[key] || 0), 0);
  const clock = [Math.floor(total / 60) % 24, total % 60].map(n => String(n).padStart(2, '0')).join(':');
  return 'Saída ' + plan.departure + ' · Chegada prevista ' + clock
    + (total >= 1440 ? ' (+' + Math.floor(total / 1440) + ' dia)' : '');
}

function scheduleFields(trip, index) {
  const plan = trip.schedule?.[index] || {};
  return `<div class="formgrid"><label>Dia da viagem<input name="day" type="number" required min="1" max="${trip.days}" value="${stepDay(trip,index)}"></label>
    <label>Horário de saída<input name="departure" type="time" value="${esc(plan.departure)}"></label>
    ${[['lunch','Almoço'],['coffee','Café e descanso'],['fuel','Abastecimento']].map(([key,label]) =>
      `<label>${label} (min)<input name="${key}" type="number" min="0" max="1440" value="${Number(plan[key] || 0)}"></label>`).join('')}</div>`;
}

const hotelsByCity = new Map([
  ['apiaí', ['Gold-inn Hotel', 'Pousada Canto']],
  ['curitiba', ['Hotel Granville', 'ibis Curitiba Shopping']],
  ['miracatu', ['Hotelog Miracatu', 'Villa Pantai Secret Place']]
]);

function hotelOptions(city) {
  const names = hotelsByCity.get((city || '').trim().toLocaleLowerCase('pt-BR')) || [];
  return names.map(name => `<option value="${esc(name)}"></option>`).join('');
}

function bookingSearch(trip, index, city) {
  const params = new URLSearchParams({ss: city.trim() + ', Brasil', lang: 'pt-br'});
  if (trip.id === expeditionId) {
    params.set('group_adults', '4');
    params.set('no_rooms', '2');
  }
  for (const [key, offset] of [['checkin', 1], ['checkout', 2]]) {
    const day = calendarDay(trip, index + offset);
    if (day) params.set(key, [day.getFullYear(), String(day.getMonth()+1).padStart(2,'0'), String(day.getDate()).padStart(2,'0')].join('-'));
  }
  return 'https://www.booking.com/searchresults.pt-br.html?' + params;
}

function updateHotelSearch(input, index) {
  const city = input.value.trim();
  document.getElementById('hotel-list-' + index).innerHTML = hotelOptions(city);
  const link = document.getElementById('hotel-search-' + index);
  link.hidden = !city;
  link.href = bookingSearch(t(), index, city);
}
function nightFields(trip) {
  return Array.from({length: Math.max(0, Number(trip.days) - 1)}, (_, i) => {
    const night = trip.nights?.[i] || {};
    const city = night.city ?? (trip.id === expeditionId ? ['Apiaí','Curitiba','Miracatu'][i] : '');
    return `<fieldset class="step"><legend>Pernoite · ${dayLabel(trip,i+1)}</legend><div class="formgrid">
      <label>Cidade<input name="city${i}" oninput="updateHotelSearch(this,${i})" value="${esc(city)}"></label>
      <label>Escolher hotel ou pousada<input name="hotel${i}" list="hotel-list-${i}" placeholder="Selecione ou digite o nome" value="${esc(night.hotel)}"><datalist id="hotel-list-${i}">${hotelOptions(city)}</datalist></label>
      <a id="hotel-search-${i}" ${city ? '' : 'hidden'} href="${esc(bookingSearch(trip,i,city || ''))}" target="_blank" rel="noopener">Ver preços e disponibilidade no Booking.com ↗</a>
      <label>Reserva<select name="status${i}">${['Pendente','Em contato','Reservada','Confirmada'].map(v =>
        `<option ${night.status === v ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
      <label class="check"><input type="checkbox" name="parking${i}" ${night.parking ? 'checked' : ''}>
      ${trip.id === expeditionId ? 'Duas vagas de moto confirmadas' : 'Estacionamento para motos confirmado'}</label>
      </div></fieldset>`;
  }).join('');
}

function saveNights(form) {
  const trip = t();
  trip.nights ||= [];
  for (let i = 0; i < trip.days - 1; i++) {
    trip.nights[i] = {
      city: form.elements['city'+i].value, hotel: form.elements['hotel'+i].value,
      status: form.elements['status'+i].value, parking: form.elements['parking'+i].checked
    };
  }
}
function dashboard(){return `<section class="hero"><span class="tag">SUA PRÓXIMA HISTÓRIA COMEÇA AQUI</span><h2>A melhor parte é<br>o caminho.</h2><p>Da serra ao mar, todas as suas aventuras em um só lugar.</p><button onclick="editTrip(true)">＋ Planejar nova viagem</button><span class="coords">22°44′ S &nbsp; 46°54′ O</span></section><div class="stats"><div class="stat"><small>↗ Viagens no radar</small><strong>${trips.filter(trip => trip.status === 'No radar').length} <small style="font-size:12px;font-weight:400">destinos</small></strong></div><div class="stat"><small>⌁ Quilômetros planejados</small><strong>${plannedKilometers(trips).toLocaleString('pt-BR')} <small style="font-size:12px">km</small></strong></div><div class="stat"><small>▦ Próximas saídas</small><strong>${trips.filter(x=>x.date&&x.date>=new Date().toISOString().slice(0,10)).length} <small style="font-size:12px">agendadas</small></strong></div><div class="stat"><small>☑ Preparação de ${esc(t().name)}</small><strong>${Math.round(t().checks.length/items.length*100)}<small style="font-size:15px">%</small></strong></div></div><div class="heading"><h2>Suas próximas aventuras</h2><div class="filters">${['Todas','Planejando','Confirmada','No radar'].map(x=>`<button class="${filter===x?'active':''}" onclick="filter='${x}';render()">${x}</button>`).join('')}</div></div><div class="cards">${trips.filter(x=>filter==='Todas'||x.status===filter).sort((a,b)=>Number(b.status==='Planejando')-Number(a.status==='Planejando')).map(x=>`<article class="card ${selected===x.id?'selected':''}" tabindex="0" role="button" onkeydown="if(event.key==='Enter'){this.click()}" onclick="selected=${x.id};tab='Roteiro';render();document.querySelector('.detailhead').scrollIntoView()"><div class="photo" style="background-image:url(https://images.unsplash.com/${x.photo}?auto=format&fit=crop&w=600&q=80)"><span class="tag">${esc(x.status)}</span></div><div class="cardbody"><h3>${esc(x.name)} <small class="muted">${esc(x.state)}</small></h3><small class="muted">${esc(x.subtitle)}</small><div class="meta">⌖ Pedreira → ${esc(x.name)}</div><div class="cardfooter"><span>${x.chosen?x.altkm:x.km} km · ${x.days} dias</span><span>${dateRange(x)} ↗</span></div></div></article>`).join('')||'<div class="empty">Nenhuma viagem com esse status.</div>'}</div>${detail()}`}
function detail(){let x=t();return `<section class="section"><div class="detailhead"><div><div class="eyebrow">ROTEIRO EM CONSTRUÇÃO</div><h2>Pedreira → ${esc(x.name)}</h2><span class="muted">${dateRange(x)} · ${x.days} dias · ${x.chosen?x.altkm:x.km} ${x.roundTrip?'km no circuito':'km de ida'} estimados</span></div><div><button onclick="editTrip(false)">✎ Editar viagem</button> <button class="primary" onclick="tab='Rotas';render()">⇄ Comparar rotas</button></div></div><div class="tabs">${['Roteiro','Rotas','Clima','Checklist','Hospedagem e notas'].map(n=>`<button class="${tab===n?'active':''}" onclick="tab='${n}';render()">${n}</button>`).join('')}</div>${tab==='Roteiro'?route():tab==='Rotas'?compare():tab==='Clima'?weather():tab==='Checklist'?checklist():lodging()}</section>`}
function mapDirections(origin, destination, via = '') {
  const params = new URLSearchParams({api: '1', origin, destination, travelmode: 'driving', maptype: 'satellite'});
  if (via) params.set('waypoints', via);
  return 'https://www.google.com/maps/dir/?' + params;
}

// Projeção Web Mercator, também usada na imagem de satélite de fundo.
function circuitPreview(trip, legs) {
  const routePoints = [];
  const viaPoints = new Map([
    ['Sorocaba', [-23.50,-47.46]], ['Capão Bonito', [-24.01,-48.35]], ['Guapiara', [-24.19,-48.53]],
    ['Ribeira', [-24.66,-49.01]], ['Adrianópolis', [-24.66,-48.99]], ['Bocaiúva do Sul', [-25.21,-49.11]],
    ['Registro', [-24.49,-47.84]], ['Embu das Artes', [-23.65,-46.85]], ['Campinas', [-22.91,-47.06]]
  ]);
  const project = ([lat,lon]) => [6378137 * lon * Math.PI/180,
    6378137 * Math.log(Math.tan(Math.PI/4 + lat * Math.PI/360))];
  const markers = [];
  for (let i = 0; i <= legs.length; i++) {
    const coord = trip.coords?.[i];
    if (!coord || !coord.every(Number.isFinite) || Math.abs(coord[0]) >= 85) return '';
    const point = project(coord);
    routePoints.push(point);
    markers.push({point, name: i ? legs[i-1][1] : legs[0][0]});
    if (i < legs.length) {
      for (const place of (trip.waypoints?.[i] || '').split('|')) {
        const via = viaPoints.get(place.split(',')[0].trim());
        if (via) routePoints.push(project(via));
      }
    }
  }
  const width = 600, height = 350;
  const xs = routePoints.map(p => p[0]), ys = routePoints.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const scale = Math.max((maxX-minX)/(width-150), (maxY-minY)/(height-55), 1);
  const left = (minX+maxX-width*scale)/2, top = (minY+maxY+height*scale)/2;
  const pixel = ([x,y]) => [Math.round((x-left)/scale), Math.round((top-y)/scale)];
  const line = routePoints.map(p => pixel(p).join(',')).join(' ');
  const params = new URLSearchParams({bbox:[left,top-height*scale,left+width*scale,top].join(','),
    bboxSR:'3857',imageSR:'3857',size:'900,525',format:'jpg',f:'image'});
  const imagery = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?' + params;
  const labels = markers.filter((m,i) => markers.findIndex(v => v.name === m.name) === i).map(m => {
    const [x,y] = pixel(m.point);
    return `<circle cx="${x}" cy="${y}" r="5" fill="#6949df" stroke="white" stroke-width="3"/>
      <text x="${x+9}" y="${y+4}" fill="white" stroke="#162820" stroke-width="3" paint-order="stroke" font-size="15" font-weight="700">${esc(m.name)}</text>`;
  }).join('');
  return `<figure style="margin:8px 0;max-width:680px"><svg viewBox="0 0 600 350" role="img" aria-label="Traçado aproximado do circuito e cidades de pernoite" style="display:block;width:100%;border-radius:10px;background:#31463e">
    <image href="${esc(imagery)}" width="600" height="350"/>
    <polyline points="${line}" fill="none" stroke="white" stroke-width="6" stroke-opacity=".8" stroke-linejoin="round"/>
    <polyline points="${line}" fill="none" stroke="#693ee0" stroke-width="3.5" stroke-linejoin="round"/>${labels}</svg>
    <figcaption class="muted"><small>Traçado aproximado · Imagem de satélite: Esri, Maxar, Earthstar Geographics e colaboradores.</small></figcaption></figure>`;
}

function expeditionMap(trip) {
  if (trip.id !== expeditionId || !trip.stops.length) return '';
  const legs = trip.stops.map(stop => stop.split(' → '));
  if (legs.some(leg => leg.length !== 2)) return '';
  const origin = legs[0][0] + ', Brasil';
  const destination = legs[legs.length - 1][1] + ', Brasil';
  const via = legs.slice(0, -1).map(leg => leg[1] + ', Brasil').join('|');
  const url = mapDirections(origin, destination, via);
  const key = document.getElementById('app')?.dataset.mapsKey;
  const embed = new URLSearchParams({key: key || '', origin, destination, mode: 'driving', maptype: 'satellite'});
  if (via) embed.set('waypoints', via);
  return `<section class="step"><h3>Mapa geral da expedição</h3>
    <p>${esc([legs[0][0], ...legs.map(leg => leg[1])].join(' → '))}</p>
    ${key ? `<iframe title="Mapa do circuito e pernoites" loading="lazy" referrerpolicy="no-referrer-when-downgrade" style="width:100%;height:340px;border:0" src="https://www.google.com/maps/embed/v1/directions?${esc(embed.toString())}"></iframe>` : circuitPreview(trip, legs)}
    <a href="${esc(url)}" target="_blank" rel="noopener">Abrir circuito no Google Maps ↗</a>
    <p class="muted">O circuito mostra os pernoites. Para seguir as paradas de cada dia, abra o mapa da etapa.</p></section>`;
}

function route(){let x=t();return `${expeditionMap(x)}<div class="detailgrid"><div>${x.stops.map((s,i)=>`<div class="step"><small>${dayLabel(x,stepDay(x,i))}</small><h4>${esc(s)}</h4><span class="tag ok">${x.kms[i]} km ≈ ${esc(x.times[i])}</span> <span class="tag pending">Pavimento a confirmar</span><p><b>${esc(arrival(x,i))}</b></p><p>${esc(x.notes[i])}</p><button onclick="editStep(${i})">Editar etapa</button> <a style="font-size:11px" target="_blank" rel="noopener" href="${esc(mapDirections(s.split(' → ')[0], s.split(' → ')[1] || x.name, x.waypoints?.[i]))}">Abrir etapa no Google Maps ↗</a></div>`).join('')}<button onclick="editStep(-1)">＋ Adicionar etapa</button></div><div class="infobox"><h3>Resumo da rota</h3><p>${esc(x.chosen?x.alt:x.via)}</p><p><b>≈ ${x.chosen?x.altkm:x.km} km · ${esc(x.chosen?x.alth:x.hours)} de pilotagem</b><br><small class="muted">Estimativa sem as paradas.</small></p><button onclick="tab='Clima';render()">☁ Consultar clima por trecho</button></div></div>`}
function compare(){let x=t();return `<p class="notice">Opções preliminares: confirme distância, tempo, pavimento e bloqueios antes da saída. Não há monitoramento de trânsito em tempo real.</p><table><tr><th>Opção</th><th>Distância estimada</th><th>Tempo</th><th></th></tr>${(x.alt ? [0,1] : [0]).map(i=>`<tr><td><b>${i?'Alternativa':'Principal'}</b><br>${esc(i?x.alt:x.via)}</td><td>≈ ${i?x.altkm:x.km} km</td><td>≈ ${esc(i?x.alth:x.hours)}</td><td><button class="${x.chosen===i?'primary':''}" onclick="t().chosen=${i};save();render();toast('Rota selecionada. Revise as etapas.');">${x.chosen===i?'Selecionada':'Usar rota'}</button></td></tr>`).join('')}</table><button onclick="editTrip(false)">Editar opções de rota</button><p class="notice">O clima abaixo é consultado para os pontos da rota principal. Ao mudar o trajeto, atualize as coordenadas das etapas antes de comparar riscos.</p>`}
const items=['Revisar pneus e calibragem','Conferir freios, óleo e transmissão','Verificar luzes e bateria','Separar documentos e seguro','Preparar capacete, luvas e botas','Levar capa de chuva e roupa extra','Separar água, kit de reparo e primeiros socorros','Confirmar hospedagem e acesso asfaltado','Revisar previsão, alertas e interdições','Baixar mapas e conferir autonomia'];
function checklist(){let x=t();return `<p class="muted">${x.checks.length} de ${items.length} itens concluídos · ${esc(x.name)}</p>${items.map((s,i)=>`<label class="check ${x.checks.includes(i)?'done':''}"><input type="checkbox" ${x.checks.includes(i)?'checked':''} onchange="toggleCheck(${i},this.checked)">${s}</label>`).join('')}`}
function toggleCheck(i,on){let x=t();x.checks=on?[...new Set([...x.checks,i])]:x.checks.filter(v=>v!==i);save();render()}
function lodging(){let x=t();return `<form onsubmit="event.preventDefault();saveNights(this);t().hotel=this.hotel.value;t().booking=this.booking.value;t().obs=this.obs.value;save();toast('Hospedagem e observações salvas')">${nightFields(x)}<div class="formgrid"><label>Hospedagem, endereço e contato<textarea name="hotel" placeholder="Ex.: pousada, telefone, check-in e valor">${esc(x.hotel)}</textarea></label><div><label>Status da reserva<select name="booking">${['Pendente de confirmação','Em contato','Reservada','Confirmada'].map(v=>`<option ${x.booking===v?'selected':''}>${v}</option>`).join('')}</select></label><p class="notice">Anote acesso, estacionamento para moto e política de cancelamento. Evite registrar dados de cartão.</p></div></div><label>Observações da viagem<textarea name="obs" placeholder="Paradas favoritas, contatos, ajustes e pendências…">${esc(x.obs)}</textarea></label><button class="primary">Salvar informações</button></form>`}
function weather(){let x=t();return `<div class="heading" style="margin-top:22px"><div><h3>Clima ao longo do caminho</h3><p class="muted">Consulta para a data de saída · previsão diária por ponto</p></div><button class="primary" onclick="fetchWeather()" id="weatherbtn">↻ Atualizar previsão</button></div>${!x.date?'<p class="notice">Defina uma data de saída para consultar a previsão.</p>':''}${x.weather&&x.weather.date===x.date?`<p class="notice">Atualizado ${esc(new Date(x.weather.at).toLocaleString('pt-BR'))} · Open-Meteo · ${esc(x.weather.date)}</p>${x.weather.rows.map(r=>`<div class="weatherrow ${r.rain>=60?'risk':''}"><b>${esc(r.name)}</b><div class="row"><span>${r.min}–${r.max} °C · vento máx. ${r.wind} km/h</span><span class="tag ${r.rain>=60?'pending':'ok'}">${r.rain}% de chance de chuva${r.rain>=60?' · atenção':''}</span></div></div>`).join('')}`:'<div class="empty">☁ Previsão pendente de consulta. Nenhum risco meteorológico foi confirmado.</div>'}<p class="notice">Janela de até 16 dias, sujeita à disponibilidade. A faixa de atenção começa em 60% de probabilidade diária de chuva; não indica intensidade ou horário. Para viagens de vários dias, confira também as datas das etapas. Não substitui alertas oficiais.</p><a href="https://alertas2.inmet.gov.br/" target="_blank" rel="noopener">Consultar alertas oficiais do INMET ↗</a>`}
async function fetchWeather(){let x=t(),id=x.id,d=x.date;if(!d){toast('Defina a data em Editar viagem');return}let delta=(new Date(d+'T12:00:00')-new Date())/86400000;if(delta< -1||delta>15){toast('Previsão disponível apenas para os próximos 16 dias');return}document.getElementById('weatherbtn').disabled=true;try{let rows=await Promise.all(x.coords.map(async(c,i)=>{let u=`https://api.open-meteo.com/v1/forecast?latitude=${c[0]}&longitude=${c[1]}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=America%2FSao_Paulo&start_date=${d}&end_date=${d}`;let r=await fetch(u);if(!r.ok)throw Error();let j=await r.json(),v=j.daily;if(!v||[v.temperature_2m_min[0],v.temperature_2m_max[0],v.precipitation_probability_max[0],v.wind_speed_10m_max[0]].some(v=>v==null))throw Error();return {name:i===0?'Pedreira · saída':x.stops[i-1]||x.name,min:v.temperature_2m_min[0],max:v.temperature_2m_max[0],rain:v.precipitation_probability_max[0],wind:v.wind_speed_10m_max[0]}}));trips.find(v=>v.id===id).weather={at:new Date().toISOString(),date:d,rows};save();render();toast('Previsão atualizada')}catch{toast('Não foi possível consultar. Previsão permanece pendente.');render()}}
function calendar(){let first=new Date(year,month,1).getDay(),total=new Date(year,month+1,0).getDate();return `<section class="section"><div class="heading"><h2>Calendário de viagens</h2><button onclick="editTrip(true)">＋ Nova viagem</button></div><div class="heading"><button aria-label="Mês anterior" onclick="moveMonth(-1)">←</button><h3>${new Date(year,month).toLocaleDateString('pt-BR',{month:'long',year:'numeric'})}</h3><button aria-label="Próximo mês" onclick="moveMonth(1)">→</button></div><div class="calendar">${['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(s=>`<b>${s}</b>`).join('')}${Array.from({length:first},()=>'<div></div>').join('')}${Array.from({length:total},(_,i)=>{let d=new Date(year,month,i+1);return `<div class="day">${i+1}${trips.filter(x=>{if(!x.date)return false;let start=new Date(x.date+'T00:00:00'),end=new Date(start);end.setDate(end.getDate()+Number(x.days));return d>=start&&d<end}).map(x=>`<small style="cursor:pointer" onclick="selected=${x.id};page='Viagens';render()">${esc(x.name)}</small>`).join('')}</div>`}).join('')}</div><h3>Sem data definida</h3>${trips.filter(x=>!x.date).map(x=>`<button style="margin:4px" onclick="selected=${x.id};editTrip(false)">${esc(x.name)} · definir saída</button>`).join('')||'<p class="muted">Todas as viagens têm data.</p>'}</section>`}function moveMonth(n){month+=n;if(month<0){month=11;year--}if(month>11){month=0;year++}render()}
function modal(html){let e=document.getElementById('modal');e.innerHTML=html;e.showModal()}function editTrip(fresh){let x=fresh?{name:'',state:'',subtitle:'Uma nova aventura',km:0,hours:'',days:3,via:'',alt:'',altkm:0,alth:'',date:'',status:'Planejando'}:t();modal(`<form id="tripform"><div class="heading"><h2>${fresh?'Nova aventura':'Editar viagem'}</h2><button type="button" onclick="document.getElementById('modal').close()">✕</button></div><div class="formgrid">${[['name','Destino','text'],['state','Estado','text'],['date','Data de saída','date'],['days','Duração em dias','number'],['km','Distância principal (km)','number'],['hours','Tempo principal (ex.: 5h30)','text'],['via','Rota principal','text'],['alt','Rota alternativa','text'],['altkm','Distância alternativa (km)','number'],['alth','Tempo alternativo','text']].map(([n,l,type])=>`<label>${l}<input name="${n}" type="${type}" value="${esc(x[n])}" ${['name','days','km'].includes(n)?'required':''} ${type==='number'?'min="1" max="99999"':''}></label>`).join('')}<label>Status<select name="status">${['No radar','Planejando','Confirmada','Concluída'].map(s=>`<option ${x.status===s?'selected':''}>${s}</option>`).join('')}</select></label></div><p class="notice">Distâncias e horários inseridos são estimativas. Confirmar uma viagem não confirma automaticamente os dados das etapas.</p><button class="primary">Salvar viagem</button></form>`);document.getElementById('tripform').onsubmit=e=>{e.preventDefault();let v=Object.fromEntries(new FormData(e.target));['km','days','altkm'].forEach(k=>v[k]=Number(v[k]));if(fresh){let id=Date.now();trips.push({...defaults[0],...v,id,photo:photos[2],stops:['Pedreira → '+v.name],kms:[v.km],times:[v.hours],notes:['Definir paradas de descanso, almoço e pontos de interesse. Pavimento pendente de confirmação.'],coords:[[-22.74,-46.9]],checks:[],hotel:'',obs:'',booking:'Pendente de confirmação',weather:null});selected=id}else Object.assign(t(),v);save();document.getElementById('modal').close();render();toast('Plano salvo')};}
function editStep(i){let x=t(),fresh=i<0,j=fresh?x.stops.length:i,c=x.coords[j+1]||['',''];modal(`<form id="stepform"><h2>${fresh?'Adicionar':'Editar'} etapa</h2><label>Etapa<input name="name" required value="${esc(fresh?'':x.stops[i])}" placeholder="Origem → Destino"></label><div class="formgrid"><label>Quilometragem<input name="km" type="number" min="0" required value="${fresh?0:x.kms[i]}"></label><label>Tempo estimado<input name="time" value="${esc(fresh?'':x.times[i])}"></label><label>Latitude do destino<input name="lat" type="number" step="any" min="-90" max="90" value="${c[0]}"></label><label>Longitude do destino<input name="lon" type="number" step="any" min="-180" max="180" value="${c[1]}"></label></div>${scheduleFields(x,j)}<label>Almoço, asfalto, atrativos e pendências<textarea name="note">${esc(fresh?'':x.notes[i])}</textarea></label><p class="notice">Coordenadas necessárias para consultar o clima no destino da etapa.</p><button class="primary">Salvar etapa</button> <button type="button" onclick="document.getElementById('modal').close()">Cancelar</button></form>`);document.getElementById('stepform').onsubmit=e=>{e.preventDefault();let v=Object.fromEntries(new FormData(e.target));x.schedule ||= [];x.schedule[j]={day:Number(v.day),departure:v.departure,lunch:Number(v.lunch),coffee:Number(v.coffee),fuel:Number(v.fuel)};x.stops[j]=v.name;x.kms[j]=Number(v.km);x.times[j]=v.time;x.notes[j]=v.note;if(v.lat!==''&&v.lon!=='')x.coords[j+1]=[Number(v.lat),Number(v.lon)];x.weather=null;save();document.getElementById('modal').close();render()}}
function backup(){let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(trips,null,2)],{type:'application/json'}));a.download='bora-de-moto-planos.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
render();
