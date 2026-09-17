(function(){
  'use strict';

  const MAX_ATTEMPTS = 6;
  const MAX_HINTS = 3;
  const ROUND_SIZE = 7;

  // ----- Banco de hechos históricos (año negativo = a.C.) -----
  const EVENTS = [
    { id: 'fundacion', texto: 'Fundación legendaria de Roma por Rómulo', year: -753,
      dato: 'Rómulo mató a su hermano Remo tras una disputa sobre en qué colina fundar la ciudad.' },
    { id: 'expulsion-reyes', texto: 'Expulsión del último rey y nacimiento de la República', year: -509,
      dato: 'El último rey, Tarquinio el Soberbio, fue expulsado tras la violación de Lucrecia por su hijo.' },
    { id: 'doce-tablas', texto: 'Redacción de la Ley de las Doce Tablas', year: -451,
      dato: 'Las Doce Tablas se exhibieron públicamente en el Foro para que cualquier ciudadano pudiera leerlas.' },
    { id: 'saqueo-galos', texto: 'Saqueo de Roma por los galos de Breno', year: -390,
      dato: 'Según la leyenda, los gansos sagrados del Capitolio alertaron a los romanos de un ataque nocturno galo.' },
    { id: 'samnitas', texto: 'Fin de las Guerras Samnitas y dominio de la Italia central', year: -290,
      dato: 'De los samnitas, los romanos adoptaron el pilum, la jabalina que se volvió un arma icónica de la legión.' },
    { id: 'cannas', texto: 'Derrota romana ante Aníbal en la batalla de Cannas', year: -216,
      dato: 'En Cannas murieron más soldados romanos en un solo día que en cualquier otra batalla de su historia.' },
    { id: 'zama', texto: 'Escipión vence a Aníbal en la batalla de Zama', year: -202,
      dato: 'Escipión ganó el apodo "el Africano" tras esta victoria sobre Aníbal.' },
    { id: 'cartago', texto: 'Destrucción de Cartago al final de la Tercera Guerra Púnica', year: -146,
      dato: 'La leyenda de que los romanos sembraron sal en las ruinas de Cartago es, casi con certeza, un mito posterior.' },
    { id: 'gracos', texto: 'Asesinato de Tiberio Graco durante sus reformas agrarias', year: -133,
      dato: 'Tiberio Graco murió apaleado por senadores que usaron las patas de sus propias sillas como armas.' },
    { id: 'rubicon', texto: 'Julio César cruza el Rubicón e inicia la guerra civil', year: -49,
      dato: 'Cruzar el Rubicón con un ejército armado era ilegal; de ahí la frase "alea iacta est" (la suerte está echada).' },
    { id: 'idus-marzo', texto: 'Asesinato de Julio César en los Idus de Marzo', year: -44,
      dato: 'César recibió 23 puñaladas de un grupo de unos 60 senadores conspiradores.' },
    { id: 'actium', texto: 'Batalla naval de Actium entre Octavio y Marco Antonio', year: -31,
      dato: 'Cleopatra y Marco Antonio huyeron de la batalla antes de que terminara, dejando a su flota derrotada.' },
    { id: 'augusto', texto: 'Octavio recibe el título de Augusto, primer emperador', year: -27,
      dato: 'Octavio evitó llamarse rey: prefirió el título de "princeps" ("primero entre iguales") para disimular su poder.' },
    { id: 'teutoburgo', texto: 'Aniquilación de tres legiones romanas en Teutoburgo', year: 9,
      dato: 'Según la tradición, Augusto quedó tan afectado que gritaba "¡Varo, devuélveme mis legiones!".' },
    { id: 'incendio-roma', texto: 'Gran incendio de Roma bajo Nerón', year: 64,
      dato: 'La leyenda de que Nerón "tocaba el violín mientras Roma ardía" es anacrónica: ese instrumento ni existía todavía.' },
    { id: 'vesubio', texto: 'Erupción del Vesubio: Pompeya y Herculano sepultadas', year: 79,
      dato: 'Plinio el Joven describió la erupción en cartas tan detalladas que hoy se llama "pliniana" a este tipo de volcán.' },
    { id: 'trajano-maximo', texto: 'El Imperio alcanza su máxima extensión bajo Trajano', year: 117,
      dato: 'Bajo Trajano el Imperio llegó a cubrir unos 5 millones de km², su mayor extensión jamás alcanzada.' },
    { id: 'caracalla', texto: 'Edicto de Caracalla: ciudadanía romana para todos los hombres libres', year: 212,
      dato: 'El edicto también sirvió para ampliar la base de contribuyentes de un impuesto que hasta entonces solo pagaban los ciudadanos.' },
    { id: 'milvio', texto: 'Constantino vence en el puente Milvio', year: 312,
      dato: 'Antes de la batalla, Constantino habría ordenado pintar el símbolo cristiano (chi-rho) en los escudos de sus soldados.' },
    { id: 'milan', texto: 'Edicto de Milán: libertad de culto para los cristianos', year: 313,
      dato: 'El Edicto de Milán no declaró oficial al cristianismo: solo garantizó la libertad de culto para todas las religiones.' },
    { id: 'nicea', texto: 'Primer Concilio de Nicea, convocado por Constantino', year: 325,
      dato: 'De este concilio surgió el Credo niceno, que todavía se recita hoy en muchas iglesias cristianas.' },
    { id: 'tesalonica', texto: 'Edicto de Tesalónica: el cristianismo, religión oficial del Imperio', year: 380,
      dato: 'A partir de este edicto, practicar los cultos paganos tradicionales empezó a considerarse un delito.' },
    { id: 'division', texto: 'División definitiva del Imperio entre Oriente y Occidente', year: 395,
      dato: 'Tras la muerte de Teodosio I, sus hijos Honorio y Arcadio se repartieron un imperio que nunca volvería a unificarse.' },
    { id: 'saqueo-visigodo', texto: 'Saqueo de Roma por los visigodos de Alarico', year: 410,
      dato: 'Fue la primera vez en casi 800 años que un ejército extranjero lograba tomar la ciudad de Roma.' },
    { id: 'caida-occidente', texto: 'Depuesto Rómulo Augústulo: cae el Imperio Romano de Occidente', year: 476,
      dato: 'El último emperador de Occidente llevaba, por casualidad, el mismo nombre que el fundador legendario de Roma.' },
    { id: 'corpus-iuris', texto: 'Justiniano promulga el Corpus Iuris Civilis', year: 529,
      dato: 'El Corpus Iuris Civilis de Justiniano sigue siendo la base de buena parte del derecho civil moderno en Europa.' },
    { id: 'peste-justiniano', texto: 'La Peste de Justiniano azota Constantinopla', year: 541,
      dato: 'Se estima que la Peste de Justiniano mató a un tercio de la población del Mediterráneo oriental.' },
    { id: 'cuarta-cruzada', texto: 'Saqueo de Constantinopla durante la Cuarta Cruzada', year: 1204,
      dato: 'Los cruzados nunca llegaron a Tierra Santa: terminaron saqueando la ciudad cristiana más grande del mundo.' },
    { id: 'caida-constantinopla', texto: 'Caída de Constantinopla ante los otomanos', year: 1453,
      dato: 'El sultán Mehmed II hizo arrastrar barcos por tierra para rodear las defensas navales de la ciudad.' }
  ];
  const BY_ID = {};
  EVENTS.forEach(e=>{ BY_ID[e.id] = e; });

  function yearLabel(year){
    return year < 0 ? (-year) + ' a.C.' : year + ' d.C.';
  }

  // ----- Utilidades de azar / semilla diaria -----
  function todayKey(){
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }
  function hashSeed(str){
    let h = 2166136261;
    for(let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function mulberry32(seed){
    return function(){
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = (t + Math.imul(t ^ t >>> 7, 61 | t)) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function seededShuffle(arr, seedStr){
    const rng = mulberry32(hashSeed(seedStr));
    const a = arr.slice();
    for(let i = a.length - 1; i > 0; i--){
      const j = Math.floor(rng() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }
  function randomShuffle(arr){
    const a = arr.slice();
    for(let i = a.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  // ----- Estado -----
  let mode = 'daily';
  let events = [];      // los 7 hechos de esta ronda
  let order = [];        // ids en el orden actual (arreglo de 7)
  let locked = [];        // booleano por posición (fijado por pista)
  let lastCheck = null;  // booleano por posición desde la última verificación (o null)
  let attempts = 0;
  let hints = 0;
  let won = false;
  let finished = false;

  const STORAGE_PROGRESS = 'secuencia_progress_v1';

  function correctOrderIds(){
    return events.slice().sort((a,b)=> a.year - b.year).map(e=> e.id);
  }

  function loadProgress(){
    try{
      const raw = localStorage.getItem(STORAGE_PROGRESS);
      if(!raw) return null;
      const data = JSON.parse(raw);
      if(data.date !== todayKey()) return null;
      return data;
    }catch(e){ return null; }
  }
  function saveProgress(){
    if(mode !== 'daily') return;
    try{
      localStorage.setItem(STORAGE_PROGRESS, JSON.stringify({
        date: todayKey(), eventIds: events.map(e=> e.id), order: order,
        locked: locked, attempts: attempts, hints: hints, won: won, finished: finished
      }));
    }catch(e){}
  }

  // ----- DOM -----
  const attemptsEl = document.getElementById('secuenciaAttempts');
  const listEl = document.getElementById('secuenciaList');
  const messageEl = document.getElementById('secuenciaMessage');
  const modeLabel = document.getElementById('secuenciaModeLabel');
  const randomBtn = document.getElementById('secuenciaRandomBtn');
  const hintBtn = document.getElementById('secuenciaHintBtn');
  const verifyBtn = document.getElementById('secuenciaVerifyBtn');
  const helpBtn = document.getElementById('secuenciaHelpBtn');
  const helpOverlay = document.getElementById('secuenciaHelpOverlay');
  const helpClose = document.getElementById('secuenciaHelpClose');
  const resultOverlay = document.getElementById('secuenciaResultOverlay');
  const resultClose = document.getElementById('secuenciaResultClose');
  const resultContent = document.getElementById('secuenciaResultContent');

  function setMessage(text, isError){
    messageEl.textContent = text || '';
    messageEl.classList.toggle('error', !!isError);
  }

  function renderAttempts(){
    attemptsEl.innerHTML = '';
    for(let i = 0; i < MAX_ATTEMPTS; i++){
      const dot = document.createElement('span');
      dot.className = 'silueta-dot';
      if(i < attempts) dot.classList.add(won && i === attempts - 1 ? 'used-ok' : 'used-wrong');
      attemptsEl.appendChild(dot);
    }
  }

  function renderList(){
    listEl.innerHTML = '';
    order.forEach((id, idx)=>{
      const ev = BY_ID[id];
      const li = document.createElement('li');
      li.className = 'secuencia-slot';
      if(locked[idx]) li.classList.add('locked');
      else if(lastCheck){ li.classList.add(lastCheck[idx] ? 'correct' : 'incorrect'); }

      const rank = document.createElement('span');
      rank.className = 'secuencia-slot-rank';
      rank.textContent = (idx + 1) + '.';
      li.appendChild(rank);

      const text = document.createElement('span');
      text.className = 'secuencia-slot-text';
      text.textContent = ev.texto;
      li.appendChild(text);

      if(locked[idx]){
        const lock = document.createElement('span');
        lock.className = 'secuencia-slot-lock';
        lock.textContent = '🔒';
        li.appendChild(lock);
      } else {
        const controls = document.createElement('div');
        controls.className = 'secuencia-slot-controls';
        const up = document.createElement('button');
        up.type = 'button';
        up.className = 'secuencia-arrow-btn';
        up.textContent = '▲';
        up.disabled = finished || findTarget(idx, -1) === -1;
        up.addEventListener('click', ()=> moveSlot(idx, -1));
        const down = document.createElement('button');
        down.type = 'button';
        down.className = 'secuencia-arrow-btn';
        down.textContent = '▼';
        down.disabled = finished || findTarget(idx, 1) === -1;
        down.addEventListener('click', ()=> moveSlot(idx, 1));
        controls.appendChild(up);
        controls.appendChild(down);
        li.appendChild(controls);
      }

      listEl.appendChild(li);
    });
  }

  function renderControls(){
    verifyBtn.disabled = finished;
    hintBtn.disabled = finished || hints >= MAX_HINTS;
    hintBtn.textContent = '💡 Pista (' + (MAX_HINTS - hints) + ')';
  }

  function renderAll(){
    renderAttempts();
    renderList();
    renderControls();
  }

  function findTarget(idx, dir){
    // busca la próxima fila no bloqueada en esa dirección, saltando por encima de las fijadas por pistas
    let i = idx + dir;
    while(i >= 0 && i < order.length && locked[i]) i += dir;
    if(i < 0 || i >= order.length) return -1;
    return i;
  }

  function moveSlot(idx, dir){
    if(finished || locked[idx]) return;
    const targetIdx = findTarget(idx, dir);
    if(targetIdx === -1) return;
    const tmp = order[idx]; order[idx] = order[targetIdx]; order[targetIdx] = tmp;
    lastCheck = null;
    setMessage('');
    renderAll();
    saveProgress();
  }

  function verify(){
    if(finished) return;
    attempts++;
    const correct = correctOrderIds();
    lastCheck = order.map((id, idx)=> id === correct[idx]);
    const correctCount = lastCheck.filter(Boolean).length;
    won = correctCount === order.length;
    if(won){
      finished = true;
      setMessage('¡Los 7 hechos en el orden correcto!');
    } else if(attempts >= MAX_ATTEMPTS){
      finished = true;
      setMessage('Se acabaron los intentos. ' + correctCount + ' de ' + order.length + ' estaban bien.', true);
    } else {
      setMessage(correctCount + ' de ' + order.length + ' en su lugar. Te quedan ' + (MAX_ATTEMPTS - attempts) + ' intento(s).', correctCount < order.length);
    }
    renderAll();
    saveProgress();
    if(finished) setTimeout(()=> showResult(), won ? 500 : 700);
  }

  function useHint(){
    if(finished || hints >= MAX_HINTS) return;
    const correct = correctOrderIds();
    const candidates = [];
    for(let i = 0; i < order.length; i++){
      if(!locked[i] && order[i] !== correct[i]) candidates.push(i);
    }
    if(!candidates.length) return;
    const slotIdx = candidates[Math.floor(Math.random() * candidates.length)];
    const correctId = correct[slotIdx];
    const curIdx = order.indexOf(correctId);
    const tmp = order[slotIdx]; order[slotIdx] = order[curIdx]; order[curIdx] = tmp;
    locked[slotIdx] = true;
    hints++;
    lastCheck = null;
    setMessage('Pista usada: la fila ' + (slotIdx + 1) + ' ya está fija.');
    renderAll();
    saveProgress();
    if(locked.every(Boolean)){
      won = true;
      finished = true;
      setTimeout(()=> showResult(), 500);
    }
  }

  function buildShareText(){
    const label = mode === 'daily' ? ('Secuencia Imperial ' + todayKey()) : 'Secuencia Imperial (práctica)';
    const scoreLabel = won ? (attempts + '/' + MAX_ATTEMPTS) : 'X/' + MAX_ATTEMPTS;
    return label + ' — ' + scoreLabel + ' 📜 · ' + hints + ' pista(s)';
  }

  function showResult(){
    resultContent.innerHTML = '';
    const title = document.createElement('p');
    title.className = 'romandle-result-title';
    title.textContent = won ? '¡Orden correcto!' : 'Casi...';
    resultContent.appendChild(title);

    const sub = document.createElement('p');
    sub.className = 'romandle-result-periodo';
    sub.textContent = 'La secuencia correcta, de más temprano a más tardío:';
    resultContent.appendChild(sub);

    const list = document.createElement('ol');
    list.className = 'secuencia-result-list';
    correctOrderIds().forEach(id=>{
      const ev = BY_ID[id];
      const li = document.createElement('li');
      li.className = 'secuencia-result-item secuencia-fact-item';
      const header = document.createElement('div');
      header.className = 'secuencia-result-header';
      const strong = document.createElement('strong');
      strong.textContent = yearLabel(ev.year);
      header.appendChild(strong);
      const span = document.createElement('span');
      span.textContent = ev.texto;
      header.appendChild(span);
      li.appendChild(header);
      if(ev.dato){
        const fact = document.createElement('div');
        fact.className = 'secuencia-result-fact';
        fact.textContent = '💡 ' + ev.dato;
        li.appendChild(fact);
      }
      list.appendChild(li);
    });
    resultContent.appendChild(list);

    const actions = document.createElement('div');
    actions.className = 'romandle-result-actions';
    const shareBtn = document.createElement('button');
    shareBtn.type = 'button';
    shareBtn.className = 'romandle-btn';
    shareBtn.textContent = '📋 Compartir resultado';
    actions.appendChild(shareBtn);
    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'romandle-btn secondary';
    nextBtn.textContent = '🎲 Jugar otra al azar';
    nextBtn.addEventListener('click', ()=>{
      resultOverlay.classList.remove('open');
      startGame('practice');
    });
    actions.appendChild(nextBtn);
    resultContent.appendChild(actions);

    const shareBox = document.createElement('div');
    shareBox.className = 'romandle-share-box';
    shareBox.style.display = 'none';
    resultContent.appendChild(shareBox);
    shareBtn.addEventListener('click', ()=>{
      const text = buildShareText();
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(()=>{
          setMessage('Resultado copiado al portapapeles.');
        }).catch(()=>{ shareBox.textContent = text; shareBox.style.display = 'block'; });
      } else { shareBox.textContent = text; shareBox.style.display = 'block'; }
    });

    resultOverlay.classList.add('open');
  }

  function startGame(newMode){
    mode = newMode;
    attempts = 0;
    hints = 0;
    won = false;
    finished = false;
    lastCheck = null;
    setMessage('');
    modeLabel.textContent = mode === 'daily' ? 'Secuencia del día' : 'Modo práctica (al azar)';

    if(mode === 'daily'){
      events = seededShuffle(EVENTS, 'secuencia-pool-' + todayKey()).slice(0, ROUND_SIZE);
      order = seededShuffle(events.map(e=> e.id), 'secuencia-order-' + todayKey());
      locked = order.map(()=> false);
      const saved = loadProgress();
      if(saved && Array.isArray(saved.eventIds) && saved.eventIds.length === ROUND_SIZE &&
         saved.eventIds.slice().sort().join(',') === events.map(e=>e.id).slice().sort().join(',')){
        order = saved.order;
        locked = saved.locked;
        attempts = saved.attempts || 0;
        hints = saved.hints || 0;
        won = !!saved.won;
        finished = !!saved.finished;
      }
    } else {
      events = randomShuffle(EVENTS).slice(0, ROUND_SIZE);
      order = randomShuffle(events.map(e=> e.id));
      locked = order.map(()=> false);
    }

    renderAll();
    if(finished) setTimeout(()=> showResult(), 200);
  }

  // ----- Eventos -----
  verifyBtn.addEventListener('click', verify);
  hintBtn.addEventListener('click', useHint);
  randomBtn.addEventListener('click', ()=> startGame('practice'));
  helpBtn.addEventListener('click', ()=> helpOverlay.classList.add('open'));
  helpClose.addEventListener('click', ()=> helpOverlay.classList.remove('open'));
  helpOverlay.addEventListener('click', (e)=>{ if(e.target === helpOverlay) helpOverlay.classList.remove('open'); });
  resultClose.addEventListener('click', ()=> resultOverlay.classList.remove('open'));
  resultOverlay.addEventListener('click', (e)=>{ if(e.target === resultOverlay) resultOverlay.classList.remove('open'); });

  startGame('daily');
})();
