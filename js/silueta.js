(function(){
  'use strict';

  const MAX_ATTEMPTS = 3;

  function stripAccents(s){ return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function foldLower(s){ return stripAccents(s || '').toLowerCase(); }
  function foldKey(s){ return foldLower(s).replace(/[^a-z]/g, ''); }

  const POOL = (window.PROVINCIAS_DATA || []).map(p=> Object.assign({}, p, {
    key: foldKey(p.nombre),
    imagen: 'assets/img/provincias/' + p.id + '.png'
  }));

  function findByKey(key){ return POOL.find(p=> p.key === key) || null; }

  function todayKey(){
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }
  function seededIndex(seedStr, max){
    let h = 2166136261;
    for(let i=0;i<seedStr.length;i++){ h ^= seedStr.charCodeAt(i); h = Math.imul(h, 16777619); }
    return Math.abs(h) % max;
  }
  function pickDaily(difficulty){ return POOL[seededIndex('silueta-' + difficulty + '-' + todayKey(), POOL.length)]; }
  function pickRandom(excludeKey){
    if(POOL.length <= 1) return POOL[0];
    let c;
    do{ c = POOL[Math.floor(Math.random() * POOL.length)]; } while(c.key === excludeKey);
    return c;
  }

  // ----- Estado -----
  let mode = 'daily';
  let difficulty = 'easy';
  let secret = null;
  let attempts = 0;
  let resolved = false; // silhouette guessed or attempts exhausted
  let won = false;
  let questionAnswered = false;
  let finished = false; // whole round (silhouette + question) done
  let questionTypeIdx = -1;

  const STORAGE_PROGRESS_PREFIX = 'silueta_progress_v1_';
  const STORAGE_DIFFICULTY = 'silueta_difficulty_v1';

  function loadDifficulty(){
    try{
      const raw = localStorage.getItem(STORAGE_DIFFICULTY);
      return raw === 'hard' ? 'hard' : 'easy';
    }catch(e){ return 'easy'; }
  }
  function saveDifficulty(){ try{ localStorage.setItem(STORAGE_DIFFICULTY, difficulty); }catch(e){} }
  function loadProgress(){
    try{
      const raw = localStorage.getItem(STORAGE_PROGRESS_PREFIX + difficulty);
      if(!raw) return null;
      const data = JSON.parse(raw);
      if(data.date !== todayKey()) return null;
      return data;
    }catch(e){ return null; }
  }
  function saveProgress(){
    if(mode !== 'daily') return;
    try{
      localStorage.setItem(STORAGE_PROGRESS_PREFIX + difficulty, JSON.stringify({
        date: todayKey(), secretKey: secret.key, attempts: attempts,
        resolved: resolved, won: won, questionAnswered: questionAnswered, finished: finished,
        questionTypeIdx: questionTypeIdx
      }));
    }catch(e){}
  }

  // ----- DOM -----
  const attemptsEl = document.getElementById('siluetaAttempts');
  const imgEl = document.getElementById('siluetaImg');
  const hintsEl = document.getElementById('siluetaHints');
  const messageEl = document.getElementById('siluetaMessage');
  const formEl = document.getElementById('siluetaForm');
  const inputEl = document.getElementById('siluetaInput');
  const suggestionsEl = document.getElementById('siluetaSuggestions');
  const questionZone = document.getElementById('siluetaQuestionZone');
  const modeLabel = document.getElementById('siluetaModeLabel');
  const randomBtn = document.getElementById('siluetaRandomBtn');
  const difficultyBtn = document.getElementById('siluetaDifficultyBtn');
  const helpBtn = document.getElementById('siluetaHelpBtn');
  const helpOverlay = document.getElementById('siluetaHelpOverlay');
  const helpClose = document.getElementById('siluetaHelpClose');
  const resultOverlay = document.getElementById('siluetaResultOverlay');
  const resultClose = document.getElementById('siluetaResultClose');
  const resultContent = document.getElementById('siluetaResultContent');

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

  function renderHints(){
    hintsEl.innerHTML = '';
    if(attempts >= 1 && !won){
      const h1 = document.createElement('div');
      h1.className = 'silueta-hint';
      h1.textContent = 'Región del Imperio: ' + secret.region;
      hintsEl.appendChild(h1);
    }
    if(attempts >= 2 && !resolved){
      const h2 = document.createElement('div');
      h2.className = 'silueta-hint';
      h2.textContent = 'Empieza con la letra: ' + secret.nombre.charAt(0).toUpperCase();
      hintsEl.appendChild(h2);
    }
  }

  function renderGuessArea(){
    const disable = resolved;
    inputEl.disabled = disable;
    document.getElementById('siluetaSubmitBtn').disabled = disable;
  }

  function otherValues(field){
    return Array.from(new Set(POOL.map(p=> p[field]).filter(v=> v && v !== secret[field])));
  }
  function paisInfo(){ return (window.PAISES_INFO && window.PAISES_INFO[secret.paisModerno]) || {}; }

  const EASY_QUESTIONS = [
    () => ({
      question: '¿Cuál es la capital actual de ' + secret.paisModerno + '?',
      correct: secret.capitalModerna,
      options: shuffleArr(otherValues('capitalModerna')).slice(0,3).concat([secret.capitalModerna])
    }),
    () => ({
      question: '¿En qué país actual se encuentra esta provincia?',
      correct: secret.paisModerno,
      options: shuffleArr(otherValues('paisModerno')).slice(0,3).concat([secret.paisModerno])
    }),
    () => {
      const info = paisInfo();
      const others = Array.from(new Set(POOL.map(p=> (window.PAISES_INFO[p.paisModerno]||{}).idioma).filter(v=> v && v !== info.idioma)));
      return {
        question: '¿Qué idioma se habla hoy en ' + secret.paisModerno + '?',
        correct: info.idioma,
        options: shuffleArr(others).slice(0,3).concat([info.idioma])
      };
    },
    () => {
      const info = paisInfo();
      const others = Array.from(new Set(POOL.map(p=> (window.PAISES_INFO[p.paisModerno]||{}).moneda).filter(v=> v && v !== info.moneda)));
      return {
        question: '¿Qué moneda se usa hoy en ' + secret.paisModerno + '?',
        correct: info.moneda,
        options: shuffleArr(others).slice(0,3).concat([info.moneda])
      };
    },
    () => {
      const info = paisInfo();
      const all = ['Europa', 'África', 'Asia'];
      return {
        question: '¿En qué continente está ' + secret.paisModerno + ' hoy?',
        correct: info.continente,
        options: all
      };
    },
    () => {
      const info = paisInfo();
      const others = Array.from(new Set(POOL.map(p=> (window.PAISES_INFO[p.paisModerno]||{}).bandera).filter(v=> v && v !== info.bandera)));
      return {
        question: '¿Cuál es la bandera de ' + secret.paisModerno + '?',
        correct: info.bandera,
        options: shuffleArr(others).slice(0,3).concat([info.bandera])
      };
    }
  ];

  const HARD_QUESTIONS = [
    () => ({
      question: '¿Esta provincia era senatorial o imperial?',
      correct: secret.tipo,
      options: ['Senatorial', 'Imperial']
    }),
    () => ({
      question: '¿Cuál era la capital romana de esta provincia?',
      correct: secret.capitalRomana,
      options: shuffleArr(otherValues('capitalRomana')).slice(0,3).concat([secret.capitalRomana])
    }),
    () => ({
      question: '¿A qué región del Imperio pertenecía?',
      correct: secret.region,
      options: shuffleArr(otherValues('region')).slice(0,3).concat([secret.region])
    }),
    () => ({
      question: '¿A qué provincia corresponde este dato: "' + secret.dato + '"?',
      correct: secret.nombre,
      options: shuffleArr(otherValues('nombre')).slice(0,3).concat([secret.nombre])
    }),
    () => ({
      question: '¿En qué siglo fue anexada como provincia romana?',
      correct: secret.sigloAnexion,
      options: shuffleArr(otherValues('sigloAnexion')).slice(0,3).concat([secret.sigloAnexion])
    }),
    () => ({
      question: '¿Esta provincia fue anexada antes o después de Cristo?',
      correct: secret.sigloAnexion.indexOf('a.C.') !== -1 ? 'Antes de Cristo (a.C.)' : 'Después de Cristo (d.C.)',
      options: ['Antes de Cristo (a.C.)', 'Después de Cristo (d.C.)']
    })
  ];

  function buildMCQuestion(){
    questionZone.innerHTML = '';
    if(!resolved || questionAnswered) return;
    const box = document.createElement('div');
    box.className = 'silueta-question';
    const h4 = document.createElement('h4');
    const bank = difficulty === 'easy' ? EASY_QUESTIONS : HARD_QUESTIONS;
    if(questionTypeIdx < 0 || questionTypeIdx >= bank.length) questionTypeIdx = Math.floor(Math.random() * bank.length);
    const q = bank[questionTypeIdx]();
    h4.textContent = q.question;
    const correctAnswer = q.correct;
    const options = shuffleArr(Array.from(new Set(q.options)));
    box.appendChild(h4);
    const opts = document.createElement('div');
    opts.className = 'silueta-question-options';
    options.forEach(opt=>{
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'silueta-option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', ()=>{
        Array.from(opts.children).forEach(b=> b.disabled = true);
        if(opt === correctAnswer){
          btn.classList.add('correct');
        } else {
          btn.classList.add('incorrect');
          const correctBtn = Array.from(opts.children).find(b=> b.textContent === correctAnswer);
          if(correctBtn) correctBtn.classList.add('correct');
        }
        questionAnswered = true;
        finished = true;
        saveProgress();
        setTimeout(()=> showResult(), 500);
      });
      opts.appendChild(btn);
    });
    box.appendChild(opts);
    questionZone.appendChild(box);
  }

  function shuffleArr(arr){
    const a = arr.slice();
    for(let i = a.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function renderAll(){
    imgEl.src = secret.imagen;
    imgEl.alt = 'Silueta de una provincia romana';
    renderAttempts();
    renderHints();
    renderGuessArea();
    buildMCQuestion();
  }

  // ----- Sugerencias -----
  let activeSuggestion = -1;
  function renderSuggestions(){
    const q = foldLower(inputEl.value).trim();
    suggestionsEl.innerHTML = '';
    activeSuggestion = -1;
    if(q.length < 2 || resolved) return;
    const candidates = POOL.filter(p=> foldLower(p.nombre).indexOf(q) !== -1).slice(0, 8);
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
      per.textContent = p.region;
      body.appendChild(per);
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
    const match = findByKey(foldKey(raw));
    if(!match){
      setMessage('No reconozco ese nombre de provincia.', true);
      return;
    }
    submitGuess(match);
  }

  function submitGuess(match){
    if(resolved) return;
    attempts++;
    inputEl.value = '';
    suggestionsEl.innerHTML = '';
    if(match.key === secret.key){
      won = true;
      resolved = true;
      setMessage('¡Correcto! Era ' + secret.nombre + '.');
    } else if(attempts >= MAX_ATTEMPTS){
      resolved = true;
      setMessage('Era ' + secret.nombre + '.', true);
    } else {
      setMessage(match.nombre + ' no es. Te quedan ' + (MAX_ATTEMPTS - attempts) + ' intento(s).', true);
    }
    renderAll();
    saveProgress();
  }

  function buildShareText(){
    const label = mode === 'daily' ? ('Silueta Imperial ' + todayKey()) : 'Silueta Imperial (práctica)';
    const scoreLabel = won ? (attempts + '/' + MAX_ATTEMPTS) : 'X/' + MAX_ATTEMPTS;
    return label + ' (' + (difficulty === 'hard' ? 'difícil' : 'fácil') + ') — ' + scoreLabel;
  }

  function showResult(){
    resultContent.innerHTML = '';
    const title = document.createElement('p');
    title.className = 'romandle-result-title';
    title.textContent = won ? '¡Lo lograste!' : 'No llegaste a tiempo';
    resultContent.appendChild(title);

    const img = document.createElement('img');
    img.className = 'romandle-result-figure';
    img.style.background = '#fbf6ec';
    img.style.objectFit = 'contain';
    img.src = secret.imagen;
    img.alt = secret.nombre;
    resultContent.appendChild(img);

    const name = document.createElement('p');
    name.className = 'romandle-result-name';
    name.textContent = secret.nombre;
    resultContent.appendChild(name);

    const periodo = document.createElement('p');
    periodo.className = 'romandle-result-periodo';
    periodo.textContent = secret.region + ' · Provincia ' + secret.tipo.toLowerCase();
    resultContent.appendChild(periodo);

    const card = document.createElement('div');
    card.className = 'silueta-info-card';
    card.innerHTML =
      '<strong>País actual:</strong> ' + secret.paisModerno + ' (capital ' + secret.capitalModerna + ')<br>' +
      '<strong>Capital romana:</strong> ' + secret.capitalRomana + '<br>' +
      '<strong>Dato curioso:</strong> ' + secret.dato;
    resultContent.appendChild(card);

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

  function startGame(newMode, forcedSecret){
    mode = newMode;
    attempts = 0;
    resolved = false;
    won = false;
    questionAnswered = false;
    finished = false;
    questionTypeIdx = -1;
    inputEl.disabled = false;
    inputEl.value = '';
    suggestionsEl.innerHTML = '';
    setMessage('');
    modeLabel.textContent = mode === 'daily' ? 'Provincia del día' : 'Modo práctica (al azar)';

    if(forcedSecret){
      secret = forcedSecret;
    } else if(mode === 'daily'){
      secret = pickDaily(difficulty);
      const saved = loadProgress();
      if(saved && saved.secretKey === secret.key){
        attempts = saved.attempts || 0;
        resolved = !!saved.resolved;
        won = !!saved.won;
        questionAnswered = !!saved.questionAnswered;
        finished = !!saved.finished;
        questionTypeIdx = (typeof saved.questionTypeIdx === 'number') ? saved.questionTypeIdx : -1;
      }
    } else {
      secret = pickRandom(secret ? secret.key : null);
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
  randomBtn.addEventListener('click', ()=> startGame('practice'));
  helpBtn.addEventListener('click', ()=> helpOverlay.classList.add('open'));
  helpClose.addEventListener('click', ()=> helpOverlay.classList.remove('open'));
  helpOverlay.addEventListener('click', (e)=>{ if(e.target === helpOverlay) helpOverlay.classList.remove('open'); });
  resultClose.addEventListener('click', ()=> resultOverlay.classList.remove('open'));
  resultOverlay.addEventListener('click', (e)=>{ if(e.target === resultOverlay) resultOverlay.classList.remove('open'); });

  function applyDifficultyUI(){
    difficultyBtn.textContent = difficulty === 'hard' ? '🏛️ Modo difícil' : '🌍 Modo fácil';
  }
  difficultyBtn.addEventListener('click', ()=>{
    difficulty = difficulty === 'hard' ? 'easy' : 'hard';
    saveDifficulty();
    applyDifficultyUI();
    startGame('daily');
  });

  difficulty = loadDifficulty();
  applyDifficultyUI();
  startGame('daily');
})();
