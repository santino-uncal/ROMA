(function(){
  'use strict';

  const ERAS = ['imperio', 'occidente', 'bizantino'];

  // ----- Categorías: dinastías y años de emperadores rivales -----
  const CATEGORIES = [
    { id: 'julio-claudia', label: 'Dinastía Julio-Claudia', members: ['Augusto','Tiberio','Calígula','Claudio','Nerón'] },
    { id: 'cuatro-emperadores', label: 'Año de los cuatro emperadores (69 d.C.)', members: ['Galba','Otón','Vitelio','Vespasiano'] },
    { id: 'flavia', label: 'Dinastía Flavia', members: ['Vespasiano','Tito','Domiciano'] },
    { id: 'cinco-buenos', label: 'Los cinco buenos emperadores', members: ['Nerva','Trajano','Adriano','Antonino Pío','Marco Aurelio'] },
    { id: 'cinco-emperadores', label: 'Año de los cinco emperadores (193 d.C.)', members: ['Pértinax','Didio Juliano','Pescenio Níger','Clodio Albino','Septimio Severo'] },
    { id: 'severa', label: 'Dinastía Severa', members: ['Septimio Severo','Caracalla','Heliogábalo','Alejandro Severo'] },
    { id: 'seis-emperadores', label: 'Año de los seis emperadores (238 d.C.)', members: ['Maximino el Tracio','Gordiano I','Gordiano II','Pupieno','Balbino','Gordiano III'] },
    { id: 'crisis-siglo-iii', label: 'Emperadores de la Crisis del Siglo III', members: ['Claudio II el Gótico','Aureliano','Probo','Caro'] },
    { id: 'constantiniana', label: 'Dinastía Constantiniana', members: ['Diocleciano','Constantino I','Constantino II','Constante I','Constancio II'] },
    { id: 'ultimos-occidente', label: 'Últimos emperadores de Occidente', members: ['Mayoriano','Antemio','Julio Nepote','Rómulo Augústulo'] },
    { id: 'justiniana', label: 'Dinastía Justiniana', members: ['Justino I','Justiniano I "el Grande"','Justino II','Tiberio II Constantino','Mauricio'] },
    { id: 'heraclida', label: 'Dinastía Heráclida', members: ['Heraclio','Constante II','Constantino IV','Justiniano II "el de la Nariz Cortada"'] },
    { id: 'isaurica', label: 'Dinastía Isáurica (iconoclasta)', members: ['León III "el Isaurio"','Constantino V "Coprónimo"','León IV "el Jázaro"','Constantino VI','Irene de Atenas'] },
    { id: 'macedonia', label: 'Dinastía Macedonia', members: ['Basilio I "el Macedonio"','León VI "el Sabio"','Constantino VII "Porfirogéneta"','Romano II','Basilio II "el Matabúlgaros"'] },
    { id: 'comnena', label: 'Dinastía Comnena', members: ['Isaac I Comneno','Alejo I Comneno','Juan II Comneno "el Bello"','Manuel I Comneno','Alejo II Comneno','Andrónico I Comneno'] },
    { id: 'angelo', label: 'Dinastía Ángelo', members: ['Isaac II Ángelo','Alejo III Ángelo','Alejo IV Ángelo'] },
    { id: 'lascaris', label: 'Dinastía Láscaris (Imperio de Nicea)', members: ['Teodoro I Láscaris','Juan III Ducas Vatatzés','Teodoro II Láscaris','Juan IV Láscaris'] },
    { id: 'paleologa', label: 'Dinastía Paleóloga (últimos emperadores bizantinos)', members: ['Miguel VIII Paleólogo','Andrónico II Paleólogo','Andrónico III Paleólogo','Juan V Paleólogo','Manuel II Paleólogo','Juan VIII Paleólogo','Constantino XI Paleólogo'] }
  ];

  function stripAccents(s){ return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function foldLower(s){ return stripAccents(s || '').toLowerCase(); }
  function foldKey(s){ return foldLower(s).replace(/[^a-z]/g, ''); }
  function cleanName(nombre){ return (nombre || '').replace(/\s*"[^"]*"/g, '').trim(); }

  // ----- Índice de emperadores por nombre exacto (para resolver categorías) -----
  const BY_NAME = {};
  const FULL_POOL = [];
  ERAS.forEach(era=>{
    const list = (window.ROMA_DATA && window.ROMA_DATA[era]) || [];
    list.forEach(item=>{
      BY_NAME[item.nombre] = Object.assign({}, item, { era: era });
      if(/\sy\s/i.test(item.nombre)) return; // coemperadores conjuntos: no aptos como integrante
      const clean = cleanName(item.nombre);
      if(!clean) return;
      FULL_POOL.push({ nombre: item.nombre, clean: clean, key: foldKey(clean), periodo: item.periodo, era: era });
    });
  });
  function findGuessByKey(key){ return FULL_POOL.find(p=> p.key === key) || null; }

  // ----- Categorías resueltas contra los datos reales -----
  const RESOLVED_CATEGORIES = CATEGORIES.map(cat=>{
    const members = cat.members.map(name=>{
      const data = BY_NAME[name];
      return data ? Object.assign({ clean: cleanName(data.nombre) }, data) : null;
    }).filter(Boolean);
    return Object.assign({}, cat, { members: members });
  }).filter(cat=> cat.members.length >= 3);

  function todayKey(){
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }
  function hashSeed(str){
    let h = 2166136261;
    for(let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return Math.abs(h);
  }
  function seededIndex(seedStr, max){ return hashSeed(seedStr) % max; }

  // ----- Estado -----
  let mode = 'daily';
  let category = null;
  let solved = [];      // booleano por integrante
  let attempts = 0;
  let won = false;
  let gaveUp = false;
  let finished = false;

  const STORAGE_PROGRESS = 'orbita_progress_v1';

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
        date: todayKey(), categoryId: category.id,
        solved: solved, attempts: attempts, won: won, gaveUp: gaveUp, finished: finished
      }));
    }catch(e){}
  }

  // ----- DOM -----
  const stageEl = document.getElementById('orbitaStage');
  const categoryLabelEl = document.getElementById('orbitaCategoryLabel');
  const progressEl = document.getElementById('orbitaProgress');
  const messageEl = document.getElementById('orbitaMessage');
  const modeLabel = document.getElementById('orbitaModeLabel');
  const formEl = document.getElementById('orbitaForm');
  const inputEl = document.getElementById('orbitaInput');
  const suggestionsEl = document.getElementById('orbitaSuggestions');
  const verifyBtn = document.getElementById('orbitaVerifyBtn');
  const giveUpBtn = document.getElementById('orbitaGiveUpBtn');
  const randomBtn = document.getElementById('orbitaRandomBtn');
  const helpBtn = document.getElementById('orbitaHelpBtn');
  const helpOverlay = document.getElementById('orbitaHelpOverlay');
  const helpClose = document.getElementById('orbitaHelpClose');
  const resultOverlay = document.getElementById('orbitaResultOverlay');
  const resultClose = document.getElementById('orbitaResultClose');
  const resultContent = document.getElementById('orbitaResultContent');

  function setMessage(text, isError){
    messageEl.textContent = text || '';
    messageEl.classList.toggle('error', !!isError);
  }

  const ORBIT_DURATION = 70; // segundos por vuelta completa; debe coincidir con --orbit-duration en orbita.css

  function renderStage(){
    Array.from(stageEl.querySelectorAll('.orbita-node-orbit')).forEach(el=> el.remove());
    categoryLabelEl.textContent = category.label;
    const solvedCount = solved.filter(s=> s === true).length;
    progressEl.textContent = solvedCount + ' / ' + category.members.length + ' identificados';

    const total = category.members.length;
    category.members.forEach((member, idx)=>{
      // Retraso negativo: arranca la animación ya avanzada, así cada integrante queda
      // repartido en su propio punto de la órbita, y todos giran juntos para siempre.
      const delay = -(idx / total) * ORBIT_DURATION;

      const orbit = document.createElement('div');
      orbit.className = 'orbita-node-orbit';
      orbit.style.animationDelay = delay + 's';

      const offset = document.createElement('div');
      offset.className = 'orbita-node-offset';

      const el = document.createElement('div');
      el.className = 'orbita-node';
      el.style.animationDelay = delay + 's';

      if(solved[idx] === 'revealed' || solved[idx] === true){
        el.classList.add(solved[idx] === 'revealed' ? 'revealed' : 'solved');
        const img = document.createElement('img');
        img.src = member.imagen || '';
        img.alt = member.clean;
        el.appendChild(img);
        const name = document.createElement('span');
        name.className = 'orbita-node-name';
        name.textContent = member.clean;
        el.appendChild(name);
      } else {
        el.classList.add('unsolved');
        el.textContent = member.periodo;
        el.addEventListener('click', ()=>{
          if(finished) return;
          inputEl.focus();
        });
      }

      offset.appendChild(el);
      orbit.appendChild(offset);
      stageEl.appendChild(orbit);
    });
  }

  function renderControls(){
    inputEl.disabled = finished;
    verifyBtn.disabled = finished;
    giveUpBtn.disabled = finished;
  }

  function renderAll(){
    renderStage();
    renderControls();
  }

  function buildShareText(){
    const label = mode === 'daily' ? ('Órbita Romana ' + todayKey()) : 'Órbita Romana (práctica)';
    const solvedCount = solved.filter(s=> s === true).length;
    const scoreLabel = solvedCount + '/' + category.members.length + (won ? ' ¡completa!' : gaveUp ? ' (se rindió)' : '');
    return label + ' — ' + category.label + ' — ' + scoreLabel;
  }

  function showResult(){
    resultContent.innerHTML = '';
    const title = document.createElement('p');
    title.className = 'romandle-result-title';
    title.textContent = won ? '¡Categoría completa!' : 'Así seguía la categoría...';
    resultContent.appendChild(title);

    const sub = document.createElement('p');
    sub.className = 'romandle-result-periodo';
    sub.textContent = category.label;
    resultContent.appendChild(sub);

    const list = document.createElement('ol');
    list.className = 'secuencia-result-list';
    category.members.forEach((m, idx)=>{
      const li = document.createElement('li');
      li.className = 'secuencia-result-item orbita-fact-item';
      const header = document.createElement('div');
      header.className = 'orbita-result-header';
      const strong = document.createElement('strong');
      strong.textContent = m.periodo;
      header.appendChild(strong);
      const span = document.createElement('span');
      span.textContent = m.clean + (solved[idx] === true ? ' ✅' : '');
      header.appendChild(span);
      li.appendChild(header);
      if(m.texto){
        const fact = document.createElement('div');
        fact.className = 'orbita-result-fact';
        fact.textContent = m.texto;
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

  // ----- Sugerencias -----
  let activeSuggestion = -1;
  function renderSuggestions(){
    const q = foldLower(inputEl.value).trim();
    suggestionsEl.innerHTML = '';
    activeSuggestion = -1;
    if(q.length < 2 || finished) return;
    // Ojo: no mostramos el período acá (es justo la pista que hay que deducir en este juego).
    const candidates = FULL_POOL.filter(p=> foldLower(p.clean).indexOf(q) !== -1).slice(0, 8);
    candidates.forEach(p=>{
      const row = document.createElement('div');
      row.className = 'consul-result clickable';
      const body = document.createElement('div');
      body.className = 'consul-result-body';
      const nm = document.createElement('span');
      nm.className = 'consul-result-name';
      nm.textContent = p.clean;
      body.appendChild(nm);
      row.appendChild(body);
      row.addEventListener('click', ()=>{
        suggestionsEl.innerHTML = '';
        inputEl.value = '';
        submitGuess(p);
      });
      suggestionsEl.appendChild(row);
    });
  }
  function getSuggestionItems(){ return Array.from(suggestionsEl.querySelectorAll('.consul-result')); }
  function setActiveSuggestion(idx){
    const items = getSuggestionItems();
    items.forEach(el=> el.classList.remove('result-active'));
    if(idx < 0 || idx >= items.length){ activeSuggestion = -1; return; }
    activeSuggestion = idx;
    items[idx].classList.add('result-active');
    items[idx].scrollIntoView({ block: 'nearest' });
  }

  function submitFromInput(){
    const raw = inputEl.value.trim();
    if(!raw) return;
    const match = findGuessByKey(foldKey(raw));
    if(!match){
      setMessage('No reconozco ese nombre de emperador.', true);
      return;
    }
    submitGuess(match);
  }

  function submitGuess(match){
    if(finished) return;
    attempts++;
    inputEl.value = '';
    suggestionsEl.innerHTML = '';
    // No importa el orden: buscamos el nombre entre TODOS los integrantes de la categoría,
    // sin depender de qué círculo esté "activo", para poder saltear el que no te acuerdes.
    const idx = category.members.findIndex(m=> m.nombre === match.nombre);
    if(idx === -1){
      setMessage(match.clean + ' no pertenece a esta categoría.', true);
    } else if(solved[idx] === true || solved[idx] === 'revealed'){
      setMessage('Ya identificaste a ' + match.clean + '.', true);
    } else {
      solved[idx] = true;
      setMessage('¡Correcto! Era ' + match.clean + '.');
      if(solved.every(s=> s === true)){
        won = true;
        finished = true;
        setTimeout(()=> showResult(), 500);
      }
    }
    renderAll();
    saveProgress();
  }

  function giveUp(){
    if(finished) return;
    finished = true;
    gaveUp = true;
    won = false;
    solved = solved.map(s=> s === true ? true : 'revealed');
    setMessage('Se reveló la categoría completa.', true);
    renderAll();
    saveProgress();
    setTimeout(()=> showResult(), 400);
  }

  function startGame(newMode){
    mode = newMode;
    attempts = 0;
    won = false;
    gaveUp = false;
    finished = false;
    inputEl.value = '';
    suggestionsEl.innerHTML = '';
    setMessage('');
    modeLabel.textContent = mode === 'daily' ? 'Órbita del día' : 'Modo práctica (al azar)';

    if(mode === 'daily'){
      category = RESOLVED_CATEGORIES[seededIndex('orbita-cat-' + todayKey(), RESOLVED_CATEGORIES.length)];
      solved = category.members.map(()=> false);
      const saved = loadProgress();
      if(saved && saved.categoryId === category.id && Array.isArray(saved.solved) && saved.solved.length === category.members.length){
        solved = saved.solved;
        attempts = saved.attempts || 0;
        won = !!saved.won;
        gaveUp = !!saved.gaveUp;
        finished = !!saved.finished;
      }
    } else {
      category = RESOLVED_CATEGORIES[Math.floor(Math.random() * RESOLVED_CATEGORIES.length)];
      solved = category.members.map(()=> false);
    }

    renderAll();
    if(finished) setTimeout(()=> showResult(), 200);
  }

  // ----- Eventos -----
  inputEl.addEventListener('input', renderSuggestions);
  inputEl.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowDown'){
      const items = getSuggestionItems();
      if(!items.length) return;
      e.preventDefault();
      setActiveSuggestion((activeSuggestion + 1) % items.length);
    } else if(e.key === 'ArrowUp'){
      const items = getSuggestionItems();
      if(!items.length) return;
      e.preventDefault();
      setActiveSuggestion(activeSuggestion <= 0 ? items.length - 1 : activeSuggestion - 1);
    } else if(e.key === 'Escape'){
      suggestionsEl.innerHTML = '';
    } else if(e.key === 'Enter' && activeSuggestion >= 0){
      e.preventDefault();
      const items = getSuggestionItems();
      items[activeSuggestion].click();
    }
  });
  formEl.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(activeSuggestion >= 0){
      const items = getSuggestionItems();
      if(items[activeSuggestion]){ items[activeSuggestion].click(); return; }
    }
    submitFromInput();
  });
  document.addEventListener('click', (e)=>{
    if(!suggestionsEl.contains(e.target) && e.target !== inputEl){
      suggestionsEl.innerHTML = '';
    }
  });
  giveUpBtn.addEventListener('click', giveUp);
  randomBtn.addEventListener('click', ()=> startGame('practice'));
  helpBtn.addEventListener('click', ()=> helpOverlay.classList.add('open'));
  helpClose.addEventListener('click', ()=> helpOverlay.classList.remove('open'));
  helpOverlay.addEventListener('click', (e)=>{ if(e.target === helpOverlay) helpOverlay.classList.remove('open'); });
  resultClose.addEventListener('click', ()=> resultOverlay.classList.remove('open'));
  resultOverlay.addEventListener('click', (e)=>{ if(e.target === resultOverlay) resultOverlay.classList.remove('open'); });

  startGame('daily');
})();
