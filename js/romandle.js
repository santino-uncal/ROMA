(function(){
  'use strict';

  const MAX_ATTEMPTS = 6;
  const ERAS = ['imperio', 'occidente', 'bizantino'];

  function stripAccents(s){
    return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  function foldLower(s){
    return stripAccents(s || '').toLowerCase();
  }
  function foldKey(s){
    return foldLower(s).replace(/[^a-z]/g, '');
  }
  function flatten(s){
    return stripAccents(s || '').toUpperCase().replace(/[^A-Z]/g, '');
  }

  // ----- Armado del mazo de emperadores -----
  function buildPool(){
    const pool = [];
    ERAS.forEach(era=>{
      const list = (window.ROMA_DATA && window.ROMA_DATA[era]) || [];
      list.forEach(item=>{
        if(/\sy\s/i.test(item.nombre)) return; // coemperadores conjuntos: no aptos como secreto
        const clean = item.nombre.replace(/\s*"[^"]*"/g, '').trim();
        const flat = flatten(clean);
        if(!flat) return;
        pool.push({
          era: era,
          nombre: item.nombre,
          clean: clean,
          flat: flat,
          key: foldKey(clean),
          length: flat.length,
          periodo: item.periodo,
          imagen: item.imagen,
          texto: item.texto
        });
      });
    });
    return pool;
  }

  const POOL = buildPool();
  const BY_LENGTH = {};
  POOL.forEach(p=>{ (BY_LENGTH[p.length] = BY_LENGTH[p.length] || []).push(p); });

  function findByKey(key){
    return POOL.find(p=> p.key === key) || null;
  }

  // ----- Selección diaria / al azar -----
  function todayKey(){
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }
  function seededIndex(seedStr, max){
    let h = 2166136261;
    for(let i=0;i<seedStr.length;i++){
      h ^= seedStr.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return Math.abs(h) % max;
  }
  function pickDaily(){
    return POOL[seededIndex('romandle-' + todayKey(), POOL.length)];
  }
  function pickRandom(excludeFlat){
    let candidate;
    if(POOL.length <= 1) return POOL[0];
    do{
      candidate = POOL[Math.floor(Math.random() * POOL.length)];
    } while(candidate.flat === excludeFlat);
    return candidate;
  }

  // ----- Estado del juego -----
  let mode = 'daily'; // 'daily' | 'practice'
  let secret = null;
  let guesses = []; // [{flat, colors:[...]}]
  let finished = false;
  let won = false;
  let tileSize = 38;

  const STORAGE_PROGRESS = 'romandle_progress_v1';
  const STORAGE_STATS = 'romandle_stats_v1';

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
        date: todayKey(),
        secretFlat: secret.flat,
        guesses: guesses,
        finished: finished,
        won: won
      }));
    }catch(e){ /* almacenamiento no disponible */ }
  }
  function loadStats(){
    try{
      const raw = localStorage.getItem(STORAGE_STATS);
      if(!raw) return { played:0, won:0, streak:0, maxStreak:0, dist:[0,0,0,0,0,0] };
      return JSON.parse(raw);
    }catch(e){ return { played:0, won:0, streak:0, maxStreak:0, dist:[0,0,0,0,0,0] }; }
  }
  function saveStats(stats){
    try{ localStorage.setItem(STORAGE_STATS, JSON.stringify(stats)); }catch(e){}
  }
  function registerResult(didWin, attempts){
    const stats = loadStats();
    stats.played += 1;
    if(didWin){
      stats.won += 1;
      stats.streak += 1;
      stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
      stats.dist[Math.min(attempts, 6) - 1] += 1;
    } else {
      stats.streak = 0;
    }
    saveStats(stats);
  }

  // ----- Puntuación estilo wordle -----
  function scoreGuess(guessFlat, secretFlat){
    const n = guessFlat.length;
    const result = new Array(n).fill('gray');
    const secretArr = secretFlat.split('');
    const guessArr = guessFlat.split('');
    const counts = {};
    for(let i=0;i<n;i++){
      if(guessArr[i] === secretArr[i]){
        result[i] = 'green';
      } else {
        counts[secretArr[i]] = (counts[secretArr[i]] || 0) + 1;
      }
    }
    for(let i=0;i<n;i++){
      if(result[i] === 'green') continue;
      const c = guessArr[i];
      if(counts[c] > 0){
        result[i] = 'yellow';
        counts[c] -= 1;
      }
    }
    return result;
  }

  // ----- DOM refs -----
  const gridEl = document.getElementById('romandleGrid');
  const messageEl = document.getElementById('romandleMessage');
  const formEl = document.getElementById('romandleForm');
  const inputEl = document.getElementById('romandleInput');
  const suggestionsEl = document.getElementById('romandleSuggestions');
  const keyboardEl = document.getElementById('romandleKeyboard');
  const modeLabel = document.getElementById('romandleModeLabel');
  const randomBtn = document.getElementById('romandleRandomBtn');
  const helpBtn = document.getElementById('romandleHelpBtn');
  const helpOverlay = document.getElementById('romandleHelpOverlay');
  const helpClose = document.getElementById('romandleHelpClose');
  const resultOverlay = document.getElementById('romandleResultOverlay');
  const resultClose = document.getElementById('romandleResultClose');
  const resultContent = document.getElementById('romandleResultContent');

  function setMessage(text, isError){
    messageEl.textContent = text || '';
    messageEl.classList.toggle('error', !!isError);
  }

  function computeTileSize(len){
    const availWidth = Math.min(gridEl.clientWidth || window.innerWidth, 560);
    const gap = 5;
    const raw = (availWidth - gap * (len - 1)) / len;
    return Math.max(16, Math.min(42, Math.floor(raw)));
  }

  function renderGrid(){
    tileSize = computeTileSize(secret.length);
    gridEl.style.setProperty('--tile-size', tileSize + 'px');
    gridEl.innerHTML = '';
    for(let r = 0; r < MAX_ATTEMPTS; r++){
      const row = document.createElement('div');
      row.className = 'romandle-row';
      const guess = guesses[r];
      const isCurrent = !finished && r === guesses.length;
      const currentLetters = isCurrent ? flatten(inputEl.value).slice(0, secret.length) : '';
      for(let c = 0; c < secret.length; c++){
        const tile = document.createElement('div');
        tile.className = 'romandle-tile';
        if(guess){
          tile.classList.add('filled', guess.colors[c]);
          tile.textContent = guess.flat[c];
        } else if(isCurrent && currentLetters[c]){
          tile.classList.add('filled');
          tile.textContent = currentLetters[c];
        }
        row.appendChild(tile);
      }
      gridEl.appendChild(row);
    }
  }

  function shakeCurrentRow(){
    const rows = gridEl.querySelectorAll('.romandle-row');
    const row = rows[guesses.length];
    if(row){
      row.classList.remove('shake');
      void row.offsetWidth;
      row.classList.add('shake');
    }
  }

  const KB_ROWS = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L','Ñ'],
    ['ENTER','Z','X','C','V','B','N','M','⌫']
  ];
  function renderKeyboard(){
    keyboardEl.innerHTML = '';
    const status = {};
    guesses.forEach(g=>{
      for(let i=0;i<g.flat.length;i++){
        const letter = g.flat[i];
        const c = g.colors[i];
        const rank = { gray:0, yellow:1, green:2 };
        if(!(letter in status) || rank[c] > rank[status[letter]]) status[letter] = c;
      }
    });
    KB_ROWS.forEach(row=>{
      const rowEl = document.createElement('div');
      rowEl.className = 'romandle-kb-row';
      row.forEach(key=>{
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'romandle-key';
        if(key === 'ENTER' || key === '⌫') btn.classList.add('wide');
        if(status[key]) btn.classList.add(status[key]);
        btn.textContent = key;
        btn.addEventListener('click', ()=> handleKey(key));
        rowEl.appendChild(btn);
      });
      keyboardEl.appendChild(rowEl);
    });
  }
  function handleKey(key){
    if(finished) return;
    if(key === 'ENTER'){
      formEl.requestSubmit ? formEl.requestSubmit() : submitGuess();
    } else if(key === '⌫'){
      inputEl.value = inputEl.value.slice(0, -1);
      inputEl.dispatchEvent(new Event('input'));
    } else {
      inputEl.value += key;
      inputEl.dispatchEvent(new Event('input'));
    }
    inputEl.focus();
  }

  // ----- Sugerencias (autocompletado) -----
  let activeSuggestion = -1;
  function renderSuggestions(){
    const q = foldLower(inputEl.value).trim();
    suggestionsEl.innerHTML = '';
    activeSuggestion = -1;
    if(q.length < 2 || finished) return;
    const candidates = (secret.length ? (BY_LENGTH[secret.length] || []) : POOL)
      .filter(p=> foldLower(p.clean).indexOf(q) !== -1)
      .slice(0, 8);
    candidates.forEach(p=>{
      const row = document.createElement('div');
      row.className = 'consul-result clickable';
      const body = document.createElement('div');
      body.className = 'consul-result-body';
      const nm = document.createElement('span');
      nm.className = 'consul-result-name';
      nm.textContent = p.nombre;
      body.appendChild(nm);
      const per = document.createElement('span');
      per.className = 'consul-result-latin';
      per.textContent = p.periodo;
      body.appendChild(per);
      row.appendChild(body);
      row.addEventListener('click', ()=>{
        inputEl.value = p.clean;
        suggestionsEl.innerHTML = '';
        renderGrid();
      });
      suggestionsEl.appendChild(row);
    });
  }
  function getSuggestionItems(){
    return Array.from(suggestionsEl.querySelectorAll('.consul-result'));
  }
  function setActiveSuggestion(idx){
    const items = getSuggestionItems();
    items.forEach(el=> el.classList.remove('result-active'));
    if(idx < 0 || idx >= items.length){ activeSuggestion = -1; return; }
    activeSuggestion = idx;
    items[idx].classList.add('result-active');
    items[idx].scrollIntoView({ block: 'nearest' });
  }

  // ----- Envío de intento -----
  function submitGuess(){
    if(finished) return;
    const raw = inputEl.value;
    const key = foldKey(raw);
    if(!key){ return; }
    const match = findByKey(key);
    if(!match){
      setMessage('No reconozco ese nombre de emperador.', true);
      shakeCurrentRow();
      return;
    }
    if(match.length !== secret.length){
      setMessage('Ese nombre tiene distinta cantidad de letras que el secreto.', true);
      shakeCurrentRow();
      return;
    }
    if(guesses.some(g=> g.flat === match.flat)){
      setMessage('Ya lo intentaste.', true);
      shakeCurrentRow();
      return;
    }
    const colors = scoreGuess(match.flat, secret.flat);
    guesses.push({ flat: match.flat, name: match.nombre, colors: colors });
    inputEl.value = '';
    suggestionsEl.innerHTML = '';
    setMessage('');
    renderGrid();
    renderKeyboard();
    saveProgress();

    if(match.flat === secret.flat){
      finish(true);
    } else if(guesses.length >= MAX_ATTEMPTS){
      finish(false);
    }
  }

  function finish(didWin){
    finished = true;
    won = didWin;
    saveProgress();
    if(mode === 'daily') registerResult(didWin, guesses.length);
    renderGrid();
    inputEl.disabled = true;
    setTimeout(()=> showResult(), 400);
  }

  function buildShareText(){
    const label = mode === 'daily' ? ('Romandle ' + todayKey()) : 'Romandle (práctica)';
    const scoreLabel = won ? (guesses.length + '/6') : 'X/6';
    const lines = guesses.map(g=> g.colors.map(c=> c === 'green' ? '🟩' : (c === 'yellow' ? '🟨' : '⬜')).join(''));
    return label + ' — ' + scoreLabel + '\n' + lines.join('\n');
  }

  function showResult(){
    resultContent.innerHTML = '';
    const title = document.createElement('p');
    title.className = 'romandle-result-title';
    title.textContent = won ? '¡Lo lograste!' : 'No llegaste a tiempo';
    resultContent.appendChild(title);

    if(secret.imagen){
      const img = document.createElement('img');
      img.className = 'romandle-result-figure';
      img.src = secret.imagen;
      img.alt = secret.nombre;
      img.onerror = ()=> img.remove();
      resultContent.appendChild(img);
    }

    const name = document.createElement('p');
    name.className = 'romandle-result-name';
    name.textContent = secret.nombre;
    resultContent.appendChild(name);

    const periodo = document.createElement('p');
    periodo.className = 'romandle-result-periodo';
    periodo.textContent = secret.periodo;
    resultContent.appendChild(periodo);

    const texto = document.createElement('p');
    texto.className = 'romandle-result-text';
    texto.textContent = secret.texto;
    resultContent.appendChild(texto);

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
    nextBtn.textContent = '🎲 Jugar otro al azar';
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
        }).catch(()=>{
          shareBox.textContent = text;
          shareBox.style.display = 'block';
        });
      } else {
        shareBox.textContent = text;
        shareBox.style.display = 'block';
      }
    });

    resultOverlay.classList.add('open');
  }

  // ----- Arranque de partida -----
  function startGame(newMode, forcedSecret){
    mode = newMode;
    finished = false;
    won = false;
    guesses = [];
    inputEl.disabled = false;
    inputEl.value = '';
    suggestionsEl.innerHTML = '';
    setMessage('');
    modeLabel.textContent = mode === 'daily' ? 'Emperador del día' : 'Modo práctica (al azar)';

    if(forcedSecret){
      secret = forcedSecret;
    } else if(mode === 'daily'){
      secret = pickDaily();
      const saved = loadProgress();
      if(saved && saved.secretFlat === secret.flat){
        guesses = saved.guesses || [];
        finished = !!saved.finished;
        won = !!saved.won;
      }
    } else {
      secret = pickRandom(secret ? secret.flat : null);
    }

    renderGrid();
    renderKeyboard();
    inputEl.disabled = finished;
    if(finished) setTimeout(()=> showResult(), 200);
  }

  // ----- Eventos -----
  inputEl.addEventListener('input', ()=>{
    renderSuggestions();
    renderGrid();
  });
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
    submitGuess();
  });
  document.addEventListener('click', (e)=>{
    if(!suggestionsEl.contains(e.target) && e.target !== inputEl){
      suggestionsEl.innerHTML = '';
    }
  });
  randomBtn.addEventListener('click', ()=> startGame('practice'));
  helpBtn.addEventListener('click', ()=> helpOverlay.classList.add('open'));
  helpClose.addEventListener('click', ()=> helpOverlay.classList.remove('open'));
  helpOverlay.addEventListener('click', (e)=>{ if(e.target === helpOverlay) helpOverlay.classList.remove('open'); });
  resultClose.addEventListener('click', ()=> resultOverlay.classList.remove('open'));
  resultOverlay.addEventListener('click', (e)=>{ if(e.target === resultOverlay) resultOverlay.classList.remove('open'); });
  window.addEventListener('resize', ()=>{ if(secret) renderGrid(); });

  startGame('daily');
})();
