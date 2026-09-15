(function(){
  'use strict';

  const ERAS = ['imperio', 'occidente', 'bizantino'];
  const ERA_LABELS = {
    imperio: 'Imperio romano (antes de la división, hasta 395 d.C.)',
    occidente: 'Imperio romano de Occidente (395–476 d.C.)',
    bizantino: 'Imperio bizantino / romano de Oriente (395–1453 d.C.)'
  };

  // Dinastía de cada emperador (por nombre exacto tal como figura en datos.js).
  const DYNASTIES = {
    'Augusto': 'Julio-Claudia', 'Tiberio': 'Julio-Claudia', 'Calígula': 'Julio-Claudia',
    'Claudio': 'Julio-Claudia', 'Nerón': 'Julio-Claudia',
    'Galba': 'Sin dinastía (Año de los Cuatro Emperadores)', 'Otón': 'Sin dinastía (Año de los Cuatro Emperadores)',
    'Vitelio': 'Sin dinastía (Año de los Cuatro Emperadores)',
    'Vespasiano': 'Flavia', 'Tito': 'Flavia', 'Domiciano': 'Flavia',
    'Nerva': 'Nervio-Antonina', 'Trajano': 'Nervio-Antonina', 'Adriano': 'Nervio-Antonina',
    'Antonino Pío': 'Nervio-Antonina', 'Marco Aurelio': 'Nervio-Antonina', 'Cómodo': 'Nervio-Antonina',
    'Pértinax': 'Sin dinastía (Año de los Cinco Emperadores)', 'Didio Juliano': 'Sin dinastía (Año de los Cinco Emperadores)',
    'Pescenio Níger': 'Sin dinastía (Año de los Cinco Emperadores)', 'Clodio Albino': 'Sin dinastía (Año de los Cinco Emperadores)',
    'Septimio Severo': 'Severa', 'Caracalla': 'Severa', 'Heliogábalo': 'Severa', 'Alejandro Severo': 'Severa',
    'Maximino el Tracio': 'Crisis del Siglo III', 'Gordiano I': 'Crisis del Siglo III', 'Gordiano II': 'Crisis del Siglo III',
    'Pupieno': 'Crisis del Siglo III', 'Balbino': 'Crisis del Siglo III', 'Gordiano III': 'Crisis del Siglo III',
    'Filipo el Árabe': 'Crisis del Siglo III', 'Decio': 'Crisis del Siglo III', 'Treboniano Galo': 'Crisis del Siglo III',
    'Emiliano': 'Crisis del Siglo III', 'Valeriano': 'Crisis del Siglo III', 'Galieno': 'Crisis del Siglo III',
    'Claudio II el Gótico': 'Crisis del Siglo III', 'Quintilo': 'Crisis del Siglo III', 'Aureliano': 'Crisis del Siglo III',
    'Tácito': 'Crisis del Siglo III', 'Floriano': 'Crisis del Siglo III', 'Probo': 'Crisis del Siglo III',
    'Caro': 'Crisis del Siglo III', 'Carino': 'Crisis del Siglo III', 'Numeriano': 'Crisis del Siglo III',
    'Diocleciano': 'Tetrarquía',
    'Constantino I': 'Constantiniana', 'Constantino II': 'Constantiniana', 'Constante I': 'Constantiniana',
    'Constancio II': 'Constantiniana', 'Juliano el Apóstata': 'Constantiniana',
    'Joviano': 'Sin dinastía (elegido por el ejército)',
    'Valentiniano I y Valente': 'Valentiniana',
    'Teodosio I "el Grande"': 'Teodosiana', 'Honorio': 'Teodosiana', 'Constancio III': 'Teodosiana',
    'Valentiniano III': 'Teodosiana', 'Arcadio': 'Teodosiana', 'Teodosio II': 'Teodosiana', 'Marciano': 'Teodosiana',
    'Petronio Máximo': 'Sin dinastía (ocaso de Occidente)', 'Avito': 'Sin dinastía (ocaso de Occidente)',
    'Mayoriano': 'Sin dinastía (ocaso de Occidente)', 'Libio Severo': 'Sin dinastía (ocaso de Occidente)',
    'Antemio': 'Sin dinastía (ocaso de Occidente)', 'Olibrio': 'Sin dinastía (ocaso de Occidente)',
    'Glicerio': 'Sin dinastía (ocaso de Occidente)', 'Julio Nepote': 'Sin dinastía (ocaso de Occidente)',
    'Rómulo Augústulo': 'Sin dinastía (ocaso de Occidente)',
    'León I "el Tracio"': 'Leonina (Tracia)', 'León II': 'Leonina (Tracia)', 'Zenón': 'Leonina (Tracia)',
    'Anastasio I': 'Leonina (Tracia)',
    'Justino I': 'Justiniana', 'Justiniano I "el Grande"': 'Justiniana', 'Justino II': 'Justiniana',
    'Tiberio II Constantino': 'Justiniana', 'Mauricio': 'Justiniana',
    'Focas': 'Sin dinastía (usurpador)',
    'Heraclio': 'Heráclida', 'Constantino III y Heraclonas': 'Heráclida', 'Constante II': 'Heráclida',
    'Constantino IV': 'Heráclida', 'Justiniano II "el de la Nariz Cortada"': 'Heráclida',
    'Leoncio': 'Sin dinastía (usurpador)', 'Tiberio III': 'Sin dinastía (usurpador)',
    'Filípico Bardanes': 'Sin dinastía (usurpador)', 'Anastasio II': 'Sin dinastía (usurpador)',
    'Teodosio III': 'Sin dinastía (usurpador)',
    'León III "el Isaurio"': 'Isáurica', 'Constantino V "Coprónimo"': 'Isáurica', 'León IV "el Jázaro"': 'Isáurica',
    'Constantino VI': 'Isáurica', 'Irene de Atenas': 'Isáurica',
    'Nicéforo I': 'De Nicéforo I', 'Estauracio': 'De Nicéforo I', 'Miguel I Rangabé': 'De Nicéforo I',
    'León V "el Armenio"': 'Sin dinastía (usurpador)',
    'Miguel II "el Tartamudo"': 'Amoriana', 'Teófilo': 'Amoriana', 'Miguel III "el Ebrio"': 'Amoriana',
    'Basilio I "el Macedonio"': 'Macedonia', 'León VI "el Sabio"': 'Macedonia', 'Alejandro': 'Macedonia',
    'Constantino VII "Porfirogéneta"': 'Macedonia', 'Romano II': 'Macedonia', 'Nicéforo II Focas': 'Macedonia',
    'Juan I Tzimisces': 'Macedonia', 'Basilio II "el Matabúlgaros"': 'Macedonia', 'Constantino VIII': 'Macedonia',
    'Romano III Argiro': 'Macedonia', 'Miguel IV "el Paflagonio"': 'Macedonia', 'Miguel V "Calafates"': 'Macedonia',
    'Zoe y Teodora': 'Macedonia', 'Constantino IX Monómaco': 'Macedonia', 'Teodora': 'Macedonia', 'Miguel VI': 'Macedonia',
    'Isaac I Comneno': 'Sin dinastía (usurpador)',
    'Constantino X Ducas': 'Ducas', 'Romano IV Diógenes': 'Ducas', 'Miguel VII Ducas': 'Ducas',
    'Nicéforo III Botaniates': 'Sin dinastía (usurpador)',
    'Alejo I Comneno': 'Comnena', 'Juan II Comneno "el Bello"': 'Comnena', 'Manuel I Comneno': 'Comnena',
    'Alejo II Comneno': 'Comnena', 'Andrónico I Comneno': 'Comnena',
    'Isaac II Ángelo': 'Ángelo', 'Alejo III Ángelo': 'Ángelo', 'Alejo IV Ángelo': 'Ángelo',
    'Alejo V Murzuflo': 'Sin dinastía (usurpador)',
    'Teodoro I Láscaris': 'Láscaris', 'Juan III Ducas Vatatzés': 'Láscaris', 'Teodoro II Láscaris': 'Láscaris',
    'Juan IV Láscaris': 'Láscaris',
    'Miguel VIII Paleólogo': 'Paleóloga', 'Andrónico II Paleólogo': 'Paleóloga', 'Andrónico III Paleólogo': 'Paleóloga',
    'Juan V Paleólogo': 'Paleóloga', 'Juan VI Cantacuceno': 'Sin dinastía (usurpador)',
    'Andrónico IV Paleólogo': 'Paleóloga', 'Juan VII Paleólogo': 'Paleóloga', 'Manuel II Paleólogo': 'Paleóloga',
    'Juan VIII Paleólogo': 'Paleóloga', 'Constantino XI Paleólogo': 'Paleóloga'
  };

  function stripAccents(s){ return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function foldLower(s){ return stripAccents(s || '').toLowerCase(); }
  function foldKey(s){ return foldLower(s).replace(/[^a-z]/g, ''); }

  function toRoman(num){
    const vals = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
    let n = num, out = '';
    for(let i=0;i<vals.length;i++){
      while(n >= vals[i][0]){ out += vals[i][1]; n -= vals[i][0]; }
    }
    return out;
  }

  function parsePeriodo(periodo){
    const nums = (periodo.match(/\d+/g) || []).map(Number);
    const hasBC = /a\.C\./.test(periodo);
    if(!nums.length) return { startYear: 0, startBC: false, durationYears: 0 };
    const startYear = nums[0];
    let duration = 0;
    if(nums.length === 1){
      duration = 0;
    } else if(hasBC && nums.length === 2){
      duration = nums[0] + nums[1] - 1;
    } else {
      for(let i=0; i + 1 < nums.length; i += 2){
        duration += (nums[i+1] - nums[i]);
      }
    }
    return { startYear: startYear, startBC: hasBC, durationYears: duration };
  }

  function centuryLabel(startYear, startBC){
    const c = Math.ceil(startYear / 100) || 1;
    return 'Siglo ' + toRoman(c) + (startBC ? ' a.C.' : ' d.C.');
  }

  function durationBucket(years){
    if(years <= 0) return 'Brevísimo (menos de 1 año)';
    if(years <= 5) return 'Corto (1 a 5 años)';
    if(years <= 15) return 'Medio (6 a 15 años)';
    if(years <= 30) return 'Largo (16 a 30 años)';
    return 'Muy largo (más de 30 años)';
  }

  function fateOf(texto){
    const t = foldLower(texto || '');
    if(/se suicid|suicidio/.test(t)) return 'Se suicidó';
    if(/asesin|fue ejecutad|lo ejecutaron|decapitad|estrangul|apunal|linch|envenenad|ahogad|degollad/.test(t)) return 'Fue asesinado';
    if(/muri[oo][^.]{0,40}(combate|batalla)|cay[oi][oó]?[^.]{0,20}(combate|luchando)|muerto en (combate|batalla)/.test(t)) return 'Murió en combate';
    if(/abdic|fue depuesto|depuesto por|renunci[oó] al trono/.test(t)) return 'Fue depuesto o abdicó';
    return 'Murió por enfermedad o causas naturales/inciertas';
  }

  function buildPool(){
    const pool = [];
    ERAS.forEach(era=>{
      const list = (window.ROMA_DATA && window.ROMA_DATA[era]) || [];
      list.forEach(item=>{
        const clean = item.nombre.replace(/\s*"[^"]*"/g, '').trim();
        const p = parsePeriodo(item.periodo);
        pool.push({
          era: era,
          eraLabel: ERA_LABELS[era],
          nombre: item.nombre,
          clean: clean,
          key: foldKey(clean),
          initial: clean.charAt(0).toUpperCase(),
          periodo: item.periodo,
          imagen: item.imagen,
          texto: item.texto,
          dinastia: DYNASTIES[item.nombre] || 'Sin dinastía',
          siglo: centuryLabel(p.startYear, p.startBC),
          startYear: p.startBC ? -p.startYear : p.startYear,
          duracion: durationBucket(p.durationYears),
          destino: fateOf(item.texto)
        });
      });
    });
    return pool;
  }

  const POOL = buildPool();

  function findByKey(key){ return POOL.find(p=> p.key === key) || null; }

  // ----- Preguntas disponibles -----
  const QUESTIONS = [
    { id: 'era', label: '¿En qué era gobernó?', get: p=> p.eraLabel },
    { id: 'dinastia', label: '¿A qué dinastía pertenece?', get: p=> p.dinastia },
    { id: 'siglo', label: '¿En qué siglo empezó a reinar?', get: p=> p.siglo },
    { id: 'duracion', label: '¿Cuánto duró su reinado?', get: p=> p.duracion },
    { id: 'destino', label: '¿Cómo terminó su reinado?', get: p=> p.destino },
    { id: 'inicial', label: '¿Con qué letra empieza su nombre?', get: p=> p.initial }
  ];

  // ----- Selección diaria / al azar -----
  function todayKey(){
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }
  function seededIndex(seedStr, max){
    let h = 2166136261;
    for(let i=0;i<seedStr.length;i++){ h ^= seedStr.charCodeAt(i); h = Math.imul(h, 16777619); }
    return Math.abs(h) % max;
  }
  function pickDaily(difficultyMode){ return POOL[seededIndex('imperator-' + difficultyMode + '-' + todayKey(), POOL.length)]; }
  function pickRandom(excludeKey){
    if(POOL.length <= 1) return POOL[0];
    let c;
    do{ c = POOL[Math.floor(Math.random() * POOL.length)]; } while(c.key === excludeKey);
    return c;
  }

  // ----- Estado -----
  let mode = 'daily';
  let secret = null;
  let askedIds = [];
  let wrongGuesses = [];
  let finished = false;
  let won = false;
  let difficulty = 'easy';

  const STORAGE_PROGRESS_PREFIX = 'imperator_progress_v1_';
  const STORAGE_DIFFICULTY = 'imperator_difficulty_v1';

  function loadDifficulty(){
    try{
      const raw = localStorage.getItem(STORAGE_DIFFICULTY);
      return raw === 'hard' ? 'hard' : 'easy';
    }catch(e){ return 'easy'; }
  }
  function saveDifficulty(){
    try{ localStorage.setItem(STORAGE_DIFFICULTY, difficulty); }catch(e){}
  }
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
        date: todayKey(), secretKey: secret.key, askedIds: askedIds,
        wrongGuesses: wrongGuesses, finished: finished, won: won
      }));
    }catch(e){}
  }

  // ----- DOM -----
  const gridEl = document.getElementById('imperatorGrid');
  const questionsEl = document.getElementById('imperatorQuestions');
  const answersEl = document.getElementById('imperatorAnswers');
  const countEl = document.getElementById('imperatorCount');
  const messageEl = document.getElementById('imperatorMessage');
  const formEl = document.getElementById('imperatorForm');
  const inputEl = document.getElementById('imperatorInput');
  const suggestionsEl = document.getElementById('imperatorSuggestions');
  const modeLabel = document.getElementById('imperatorModeLabel');
  const randomBtn = document.getElementById('imperatorRandomBtn');
  const difficultyBtn = document.getElementById('imperatorDifficultyBtn');
  const difficultyNote = document.getElementById('imperatorDifficultyNote');
  const helpBtn = document.getElementById('imperatorHelpBtn');
  const helpOverlay = document.getElementById('imperatorHelpOverlay');
  const helpClose = document.getElementById('imperatorHelpClose');
  const resultOverlay = document.getElementById('imperatorResultOverlay');
  const resultClose = document.getElementById('imperatorResultClose');
  const resultContent = document.getElementById('imperatorResultContent');

  function setMessage(text, isError){
    messageEl.textContent = text || '';
    messageEl.classList.toggle('error', !!isError);
  }

  function cardInitials(name){
    return name.split(/\s+/).filter(Boolean).slice(0,2).map(w=> w.charAt(0).toUpperCase()).join('');
  }
  function hashColor(str){
    let h = 0;
    for(let i=0;i<str.length;i++){ h = str.charCodeAt(i) + ((h<<5)-h); }
    const hue = Math.abs(h) % 360;
    return 'hsl(' + hue + ', 45%, 55%)';
  }

  function renderGrid(){
    gridEl.innerHTML = '';
    POOL.forEach(p=>{
      const card = document.createElement('div');
      card.className = 'imperator-card';
      card.dataset.key = p.key;

      const circle = document.createElement('div');
      circle.className = 'imperator-card-portrait';
      if(p.imagen){
        const img = document.createElement('img');
        img.src = p.imagen;
        img.alt = p.nombre;
        img.onerror = ()=>{
          img.remove();
          circle.style.background = hashColor(p.nombre);
          const s = document.createElement('span');
          s.textContent = cardInitials(p.clean);
          circle.appendChild(s);
        };
        circle.appendChild(img);
      } else {
        circle.style.background = hashColor(p.nombre);
        const s = document.createElement('span');
        s.textContent = cardInitials(p.clean);
        circle.appendChild(s);
      }
      card.appendChild(circle);

      const nm = document.createElement('span');
      nm.className = 'imperator-card-name';
      nm.textContent = p.nombre;
      card.appendChild(nm);

      card.addEventListener('click', ()=> attemptGuess(p));
      gridEl.appendChild(card);
    });
    applyElimination();
  }

  function applyElimination(){
    const cards = gridEl.querySelectorAll('.imperator-card');
    cards.forEach(card=>{
      const p = findByKey(card.dataset.key);
      let eliminated = false;
      askedIds.forEach(qid=>{
        const q = QUESTIONS.find(x=> x.id === qid);
        if(q && q.get(p) !== q.get(secret)) eliminated = true;
      });
      if(wrongGuesses.indexOf(p.key) !== -1) eliminated = true;
      card.classList.toggle('eliminated', eliminated && !finished);
      card.classList.toggle('wrong-pick', wrongGuesses.indexOf(p.key) !== -1);
      card.classList.toggle('is-secret', finished && p.key === secret.key);
    });
    const remaining = POOL.filter(p=>{
      let eliminated = false;
      askedIds.forEach(qid=>{
        const q = QUESTIONS.find(x=> x.id === qid);
        if(q && q.get(p) !== q.get(secret)) eliminated = true;
      });
      if(wrongGuesses.indexOf(p.key) !== -1) eliminated = true;
      return !eliminated;
    }).length;
    countEl.textContent = remaining + ' de ' + POOL.length + ' candidatos posibles';
  }

  function renderQuestions(){
    questionsEl.innerHTML = '';
    QUESTIONS.forEach(q=>{
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'romandle-btn secondary imperator-question-btn';
      const used = askedIds.indexOf(q.id) !== -1;
      btn.textContent = q.label;
      btn.disabled = used || finished;
      btn.addEventListener('click', ()=> askQuestion(q.id));
      questionsEl.appendChild(btn);
    });
  }

  function renderAnswers(){
    answersEl.innerHTML = '';
    askedIds.forEach(qid=>{
      const q = QUESTIONS.find(x=> x.id === qid);
      const row = document.createElement('div');
      row.className = 'imperator-answer';
      const label = document.createElement('span');
      label.className = 'imperator-answer-q';
      label.textContent = q.label;
      const value = document.createElement('span');
      value.className = 'imperator-answer-a';
      value.textContent = q.get(secret);
      row.appendChild(label);
      row.appendChild(value);
      answersEl.appendChild(row);
    });
  }

  function askQuestion(qid){
    if(finished || askedIds.indexOf(qid) !== -1) return;
    askedIds.push(qid);
    setMessage('');
    renderQuestions();
    renderAnswers();
    applyElimination();
    saveProgress();
  }

  // ----- Sugerencias -----
  let activeSuggestion = -1;
  function renderSuggestions(){
    const q = foldLower(inputEl.value).trim();
    suggestionsEl.innerHTML = '';
    activeSuggestion = -1;
    if(q.length < 2 || finished) return;
    const candidates = POOL.filter(p=> foldLower(p.clean).indexOf(q) !== -1).slice(0, 8);
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
        suggestionsEl.innerHTML = '';
        inputEl.value = '';
        attemptGuess(p);
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

  function attemptGuess(p){
    if(finished) return;
    if(p.key === secret.key){
      finish(true);
      return;
    }
    if(wrongGuesses.indexOf(p.key) === -1){
      wrongGuesses.push(p.key);
    }
    setMessage(p.nombre + ' no es. Seguí intentando.', true);
    applyElimination();
    saveProgress();
  }

  function submitFromInput(){
    const raw = inputEl.value.trim();
    if(!raw) return;
    const key = foldKey(raw);
    const match = findByKey(key);
    if(!match){
      setMessage('No reconozco ese nombre de emperador.', true);
      return;
    }
    inputEl.value = '';
    suggestionsEl.innerHTML = '';
    attemptGuess(match);
  }

  function finish(didWin){
    finished = true;
    won = didWin;
    saveProgress();
    renderQuestions();
    applyElimination();
    inputEl.disabled = true;
    setMessage('');
    setTimeout(()=> showResult(), 300);
  }

  function buildShareText(){
    const label = mode === 'daily' ? ('Guess the Imperator ' + todayKey()) : 'Guess the Imperator (práctica)';
    const scoreLabel = won ? (askedIds.length + ' preguntas, ' + wrongGuesses.length + ' fallos') : 'no lo logré';
    return label + ' — ' + scoreLabel;
  }

  function showResult(){
    resultContent.innerHTML = '';
    const title = document.createElement('p');
    title.className = 'romandle-result-title';
    title.textContent = won ? '¡Lo lograste!' : 'Se te acabaron las pistas';
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

    const score = document.createElement('p');
    score.className = 'romandle-result-periodo';
    score.textContent = askedIds.length + ' preguntas usadas · ' + wrongGuesses.length + ' intentos fallidos';
    resultContent.appendChild(score);

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

  function startGame(newMode, forcedSecret){
    mode = newMode;
    finished = false;
    won = false;
    askedIds = [];
    wrongGuesses = [];
    inputEl.disabled = false;
    inputEl.value = '';
    suggestionsEl.innerHTML = '';
    setMessage('');
    modeLabel.textContent = mode === 'daily' ? 'Emperador del día' : 'Modo práctica (al azar)';

    if(forcedSecret){
      secret = forcedSecret;
    } else if(mode === 'daily'){
      secret = pickDaily(difficulty);
      const saved = loadProgress();
      if(saved && saved.secretKey === secret.key){
        askedIds = saved.askedIds || [];
        wrongGuesses = saved.wrongGuesses || [];
        finished = !!saved.finished;
        won = !!saved.won;
      }
    } else {
      secret = pickRandom(secret ? secret.key : null);
    }

    renderGrid();
    renderQuestions();
    renderAnswers();
    inputEl.disabled = finished;
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
    document.body.classList.toggle('imperator-hard', difficulty === 'hard');
    difficultyBtn.textContent = difficulty === 'hard' ? '👁 Modo fácil' : '🙈 Modo difícil';
    difficultyNote.textContent = difficulty === 'hard'
      ? 'Modo difícil: sin grilla de candidatos ni contador. Llevá la cuenta vos.'
      : '';
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
