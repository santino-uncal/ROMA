(function(){
  'use strict';

  const MAX_ATTEMPTS = 5;
  const ERAS = ['imperio', 'occidente', 'bizantino'];
  const ERA_LABELS = {
    imperio: 'el Imperio Romano (antes de la división de Oriente y Occidente)',
    occidente: 'el Imperio Romano de Occidente',
    bizantino: 'el Imperio Bizantino (Romano de Oriente)'
  };
  const REVEAL_FILTERS = [
    'brightness(0.05) blur(18px) grayscale(1)',
    'brightness(0.15) blur(13px) grayscale(1)',
    'brightness(0.3) blur(9px) grayscale(0.85)',
    'brightness(0.5) blur(5px) grayscale(0.6)',
    'brightness(0.72) blur(2px) grayscale(0.3)'
  ];
  const BASE_SHADOW = 'drop-shadow(0 2px 3px rgba(0,0,0,0.25))';
  const BLANK_IMG = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBTAA7';

  // ----- Silueta negra recortada (modo fácil) -----
  const SILH_MAX_SIDE = 160; // procesar en baja resolución: más rápido y difumina el detalle fino
  const SILH_THRESHOLD = 70; // distancia de color respecto al fondo promedio del borde
  const SILH_SMOOTH_PASSES = 2; // limpia ruido tipo "sal y pimienta" fundiendo con la mayoría vecina

  function buildBackgroundMask(px, w, h){
    let br = 0, bg = 0, bb = 0, n = 0;
    for(let x = 0; x < w; x++){
      [0, h-1].forEach(y=>{ const i = (y*w+x)*4; br+=px[i]; bg+=px[i+1]; bb+=px[i+2]; n++; });
    }
    for(let y = 0; y < h; y++){
      [0, w-1].forEach(x=>{ const i = (y*w+x)*4; br+=px[i]; bg+=px[i+1]; bb+=px[i+2]; n++; });
    }
    br/=n; bg/=n; bb/=n;

    let mask = new Uint8Array(w*h);
    for(let i = 0; i < w*h; i++){
      const o = i*4;
      const dr = px[o]-br, dg = px[o+1]-bg, db = px[o+2]-bb;
      mask[i] = Math.sqrt(dr*dr + dg*dg + db*db) < SILH_THRESHOLD ? 1 : 0;
    }

    // Suavizado: un puñado de píxeles aislados de fondo o figura se funde con la mayoría vecina
    for(let pass = 0; pass < SILH_SMOOTH_PASSES; pass++){
      const next = new Uint8Array(w*h);
      for(let y = 0; y < h; y++){
        for(let x = 0; x < w; x++){
          let bgNeighbors = 0, total8 = 0;
          for(let dy = -1; dy <= 1; dy++){
            for(let dx = -1; dx <= 1; dx++){
              const nx = x+dx, ny = y+dy;
              if(nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
              total8++;
              if(mask[ny*w+nx]) bgNeighbors++;
            }
          }
          next[y*w+x] = (bgNeighbors / total8) >= 0.55 ? 1 : 0;
        }
      }
      mask = next;
    }
    return mask;
  }

  function buildSilhouette(item){
    if(item._silhouette){ return; } // ya calculada (o en curso)
    item._silhouette = 'pending';
    const image = new Image();
    image.onload = function(){
      try{
        const scale = Math.min(1, SILH_MAX_SIDE / Math.max(image.naturalWidth, image.naturalHeight));
        const w = Math.max(1, Math.round(image.naturalWidth * scale));
        const h = Math.max(1, Math.round(image.naturalHeight * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h);
        const px = data.data;
        const isBg = buildBackgroundMask(px, w, h);
        const total = w * h;
        let bgCount = 0;
        for(let i = 0; i < total; i++){ if(isBg[i]) bgCount++; }
        const bgRatio = bgCount / total;
        if(bgRatio < 0.05 || bgRatio > 0.95){
          throw new Error('segmentación no confiable');
        }
        for(let i = 0; i < total; i++){
          const o = i * 4;
          if(isBg[i]){
            px[o+3] = 0;
          } else {
            px[o] = 0; px[o+1] = 0; px[o+2] = 0; px[o+3] = 255;
          }
        }
        ctx.putImageData(data, 0, 0);
        item._silhouette = canvas.toDataURL('image/png');
      }catch(e){
        item._silhouette = 'filter'; // recorte no confiable: recurrimos al desenfoque del modo difícil
      }
      if(secret === item) renderImage();
    };
    image.onerror = function(){
      item._silhouette = 'filter';
      if(secret === item) renderImage();
    };
    image.src = item.imagen;
  }

  function stripAccents(s){ return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function foldLower(s){ return stripAccents(s || '').toLowerCase(); }
  function foldKey(s){ return foldLower(s).replace(/[^a-z]/g, ''); }

  function parsePeriodo(periodo){
    if(!periodo) return null;
    const clean = periodo.replace(/ /g, ' ').trim();
    let m = clean.match(/^(\d+)\s*(a\.C\.)?\s*(?:–|-)\s*(\d+)\s*(a\.C\.|d\.C\.)?\s*$/);
    if(m){
      const endEra = m[4] || 'd.C.';
      const startEra = m[2] || endEra;
      const startNum = parseInt(m[1], 10);
      const endNum = parseInt(m[3], 10);
      const startYear = startEra === 'a.C.' ? -startNum : startNum;
      const endYear = endEra === 'a.C.' ? -endNum : endNum;
      return { startYear: startYear, endYear: endYear };
    }
    m = clean.match(/^(\d+)\s*(a\.C\.|d\.C\.)?\s*$/);
    if(m){
      const era = m[2] || 'd.C.';
      const num = parseInt(m[1], 10);
      const year = era === 'a.C.' ? -num : num;
      return { startYear: year, endYear: year };
    }
    return null;
  }
  function durationLabel(parsed){
    if(!parsed) return null;
    const years = Math.max(0, parsed.endYear - parsed.startYear);
    if(years <= 0) return 'Menos de 1 año';
    if(years === 1) return '1 año';
    return years + ' años';
  }

  // ----- Armado del mazo de emperadores -----
  function buildPool(){
    const pool = [];
    ERAS.forEach(era=>{
      const list = (window.ROMA_DATA && window.ROMA_DATA[era]) || [];
      list.forEach(item=>{
        if(/\sy\s/i.test(item.nombre)) return; // coemperadores conjuntos: no aptos como secreto
        const clean = item.nombre.replace(/\s*"[^"]*"/g, '').trim();
        if(!clean) return;
        pool.push({
          era: era,
          nombre: item.nombre,
          clean: clean,
          key: foldKey(clean),
          periodo: item.periodo,
          parsed: parsePeriodo(item.periodo),
          imagen: item.imagen,
          texto: item.texto,
          mapaEspecial: item.mapaEspecial || null
        });
      });
    });
    return pool;
  }

  const POOL = buildPool();

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
  function pickDaily(){ return POOL[seededIndex('silueta-oculta-' + todayKey(), POOL.length)]; }
  function pickRandom(excludeKey){
    if(POOL.length <= 1) return POOL[0];
    let c;
    do{ c = POOL[Math.floor(Math.random() * POOL.length)]; } while(c.key === excludeKey);
    return c;
  }
  function shuffleArr(arr){
    const a = arr.slice();
    for(let i = a.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }
  function buildOptions(correctVal, allVals){
    const distractors = shuffleArr(Array.from(new Set(allVals.filter(v=> v && v !== correctVal)))).slice(0,3);
    return shuffleArr(distractors.concat([correctVal]));
  }

  // ----- Estado -----
  let mode = 'daily';
  let difficulty = 'easy';
  let secret = null;
  let attempts = 0;
  let resolved = false;
  let won = false;
  let questions = [];
  let questionIdx = 0;
  let questionResults = [];
  let finished = false;

  const STORAGE_PROGRESS_PREFIX = 'silueta_oculta_progress_v1_';
  const STORAGE_DIFFICULTY = 'silueta_oculta_difficulty_v1';

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
        resolved: resolved, won: won, questionIdx: questionIdx,
        questionResults: questionResults, finished: finished
      }));
    }catch(e){}
  }

  // ----- DOM -----
  const attemptsEl = document.getElementById('ocultaAttempts');
  const imgEl = document.getElementById('ocultaImg');
  const hintsEl = document.getElementById('ocultaHints');
  const messageEl = document.getElementById('ocultaMessage');
  const formEl = document.getElementById('ocultaForm');
  const inputEl = document.getElementById('ocultaInput');
  const suggestionsEl = document.getElementById('ocultaSuggestions');
  const questionZone = document.getElementById('ocultaQuestionZone');
  const modeLabel = document.getElementById('ocultaModeLabel');
  const randomBtn = document.getElementById('ocultaRandomBtn');
  const difficultyBtn = document.getElementById('ocultaDifficultyBtn');
  const helpBtn = document.getElementById('ocultaHelpBtn');
  const helpOverlay = document.getElementById('ocultaHelpOverlay');
  const helpClose = document.getElementById('ocultaHelpClose');
  const resultOverlay = document.getElementById('ocultaResultOverlay');
  const resultClose = document.getElementById('ocultaResultClose');
  const resultContent = document.getElementById('ocultaResultContent');

  function setMessage(text, isError){
    messageEl.textContent = text || '';
    messageEl.classList.toggle('error', !!isError);
  }

  function currentFilter(){
    if(resolved) return BASE_SHADOW;
    const idx = Math.min(attempts, REVEAL_FILTERS.length - 1);
    return REVEAL_FILTERS[idx] + ' ' + BASE_SHADOW;
  }

  function renderImage(){
    imgEl.alt = resolved ? secret.clean : 'Silueta oculta de un emperador romano';
    imgEl.classList.toggle('oculta-revealed', resolved);

    if(resolved){
      imgEl.style.filter = BASE_SHADOW;
      imgEl.src = secret.imagen;
      return;
    }

    if(difficulty === 'hard'){
      imgEl.style.filter = currentFilter();
      imgEl.src = secret.imagen;
      return;
    }

    // Modo fácil: silueta negra recortada del fondo
    if(secret._silhouette === 'filter'){
      // el recorte automático no fue confiable para esta imagen: usamos el desenfoque como respaldo
      imgEl.style.filter = currentFilter();
      imgEl.src = secret.imagen;
      return;
    }
    imgEl.style.filter = BASE_SHADOW;
    if(secret._silhouette && secret._silhouette !== 'pending'){
      imgEl.src = secret._silhouette;
    } else {
      imgEl.src = BLANK_IMG;
      buildSilhouette(secret);
    }
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
    if(attempts >= 2 && !resolved){
      const h1 = document.createElement('div');
      h1.className = 'silueta-hint';
      h1.textContent = 'Es un emperador de: ' + (ERA_LABELS[secret.era] || secret.era);
      hintsEl.appendChild(h1);
    }
    if(attempts >= 4 && !resolved){
      const h2 = document.createElement('div');
      h2.className = 'silueta-hint';
      h2.textContent = 'Su nombre empieza con la letra: ' + secret.clean.charAt(0).toUpperCase();
      hintsEl.appendChild(h2);
    }
  }

  function renderGuessArea(){
    inputEl.disabled = resolved;
    document.getElementById('ocultaSubmitBtn').disabled = resolved;
  }

  // ----- Preguntas -----
  function buildQuestions(){
    const qs = [];
    qs.push({
      type: 'text',
      prompt: '¿En qué período gobernó ' + secret.clean + '?',
      correct: secret.periodo,
      options: buildOptions(secret.periodo, POOL.map(p=> p.periodo))
    });
    const secretDur = secret.parsed ? durationLabel(secret.parsed) : null;
    if(secretDur){
      const durPool = POOL.map(p=> p.parsed ? durationLabel(p.parsed) : null);
      qs.push({
        type: 'text',
        prompt: '¿Cuántos años gobernó ' + secret.clean + '?',
        correct: secretDur,
        options: buildOptions(secretDur, durPool)
      });
    }
    if(secret.mapaEspecial && secret.mapaEspecial.url){
      const candidates = POOL.filter(p=> p.mapaEspecial && p.mapaEspecial.url && p.mapaEspecial.url !== secret.mapaEspecial.url);
      if(candidates.length){
        const distractor = candidates[Math.floor(Math.random() * candidates.length)];
        qs.push({
          type: 'image',
          prompt: '¿Cuál de estos dos mapas corresponde al territorio bajo ' + secret.clean + '?',
          options: shuffleArr([
            { url: secret.mapaEspecial.url, correct: true },
            { url: distractor.mapaEspecial.url, correct: false }
          ])
        });
      }
    }
    return qs;
  }

  function advanceQuestion(isCorrect){
    questionResults[questionIdx] = !!isCorrect;
    questionIdx++;
    saveProgress();
    setTimeout(renderCurrentQuestion, 700);
  }

  function renderCurrentQuestion(){
    questionZone.innerHTML = '';
    if(!resolved) return;
    if(questionIdx >= questions.length){
      if(!finished){ finished = true; saveProgress(); }
      setTimeout(()=> showResult(), 200);
      return;
    }
    const q = questions[questionIdx];
    const box = document.createElement('div');
    box.className = 'silueta-question';
    const h4 = document.createElement('h4');
    h4.textContent = q.prompt;
    box.appendChild(h4);

    if(q.type === 'text'){
      const opts = document.createElement('div');
      opts.className = 'silueta-question-options';
      q.options.forEach(opt=>{
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'silueta-option-btn';
        btn.textContent = opt;
        btn.addEventListener('click', ()=>{
          Array.from(opts.children).forEach(b=> b.disabled = true);
          if(opt === q.correct){
            btn.classList.add('correct');
          } else {
            btn.classList.add('incorrect');
            const correctBtn = Array.from(opts.children).find(b=> b.textContent === q.correct);
            if(correctBtn) correctBtn.classList.add('correct');
          }
          advanceQuestion(opt === q.correct);
        });
        opts.appendChild(btn);
      });
      box.appendChild(opts);
    } else if(q.type === 'image'){
      const grid = document.createElement('div');
      grid.className = 'oculta-map-choice';
      q.options.forEach(opt=>{
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'oculta-map-btn';
        const img = document.createElement('img');
        img.src = opt.url;
        img.alt = 'Mapa de un territorio romano';
        btn.appendChild(img);
        btn.addEventListener('click', ()=>{
          Array.from(grid.children).forEach(b=> b.disabled = true);
          if(opt.correct){
            btn.classList.add('correct');
          } else {
            btn.classList.add('incorrect');
            const correctBtn = Array.from(grid.children).find((b,i)=> q.options[i].correct);
            if(correctBtn) correctBtn.classList.add('correct');
          }
          advanceQuestion(opt.correct);
        });
        grid.appendChild(btn);
      });
      box.appendChild(grid);
    }
    questionZone.appendChild(box);
  }

  function renderAll(){
    renderImage();
    renderAttempts();
    renderHints();
    renderGuessArea();
    renderCurrentQuestion();
  }

  // ----- Sugerencias -----
  let activeSuggestion = -1;
  function renderSuggestions(){
    const q = foldLower(inputEl.value).trim();
    suggestionsEl.innerHTML = '';
    activeSuggestion = -1;
    if(q.length < 2 || resolved) return;
    const candidates = POOL.filter(p=> foldLower(p.clean).indexOf(q) !== -1).slice(0, 8);
    candidates.forEach(p=>{
      const row = document.createElement('div');
      row.className = 'consul-result clickable';
      const body = document.createElement('div');
      body.className = 'consul-result-body';
      const nm = document.createElement('span');
      nm.className = 'consul-result-name';
      nm.textContent = p.clean;
      body.appendChild(nm);
      const per = document.createElement('span');
      per.className = 'consul-result-latin';
      per.textContent = p.periodo;
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
      setMessage('No reconozco ese nombre de emperador.', true);
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
      setMessage('¡Correcto! Era ' + secret.clean + '.');
    } else if(attempts >= MAX_ATTEMPTS){
      resolved = true;
      setMessage('Era ' + secret.clean + '.', true);
    } else {
      setMessage(match.clean + ' no es. Te quedan ' + (MAX_ATTEMPTS - attempts) + ' intento(s).', true);
    }
    renderAll();
    saveProgress();
  }

  function buildShareText(){
    const label = mode === 'daily' ? ('Silueta Oculta ' + todayKey()) : 'Silueta Oculta (práctica)';
    const scoreLabel = won ? (attempts + '/' + MAX_ATTEMPTS) : 'X/' + MAX_ATTEMPTS;
    const correctCount = questionResults.filter(Boolean).length;
    return label + ' — ' + scoreLabel + ' 🖼️ · ' + correctCount + '/' + questions.length + ' preguntas';
  }

  function showResult(){
    resultContent.innerHTML = '';
    const title = document.createElement('p');
    title.className = 'romandle-result-title';
    title.textContent = won ? '¡La reconociste!' : 'No llegaste a tiempo';
    resultContent.appendChild(title);

    const img = document.createElement('img');
    img.className = 'romandle-result-figure';
    img.style.objectFit = 'cover';
    img.src = secret.imagen;
    img.alt = secret.clean;
    resultContent.appendChild(img);

    const name = document.createElement('p');
    name.className = 'romandle-result-name';
    name.textContent = secret.clean;
    resultContent.appendChild(name);

    const periodo = document.createElement('p');
    periodo.className = 'romandle-result-periodo';
    periodo.textContent = secret.periodo + (secret.parsed ? ' · ' + durationLabel(secret.parsed) : '');
    resultContent.appendChild(periodo);

    const quiz = document.createElement('p');
    quiz.className = 'romandle-result-text';
    quiz.style.textAlign = 'center';
    quiz.textContent = 'Preguntas acertadas: ' + questionResults.filter(Boolean).length + '/' + questions.length;
    resultContent.appendChild(quiz);

    if(secret.texto){
      const card = document.createElement('div');
      card.className = 'silueta-info-card';
      card.innerHTML = '<strong>Dato curioso:</strong> ' + secret.texto;
      resultContent.appendChild(card);
    }

    if(secret.mapaEspecial && secret.mapaEspecial.caption){
      const card2 = document.createElement('div');
      card2.className = 'silueta-info-card';
      card2.innerHTML = '<strong>Territorio:</strong> ' + secret.mapaEspecial.caption;
      resultContent.appendChild(card2);
    }

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
    questionIdx = 0;
    questionResults = [];
    finished = false;
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
      if(saved && saved.secretKey === secret.key){
        attempts = saved.attempts || 0;
        resolved = !!saved.resolved;
        won = !!saved.won;
        questionIdx = saved.questionIdx || 0;
        questionResults = saved.questionResults || [];
        finished = !!saved.finished;
      }
    } else {
      secret = pickRandom(secret ? secret.key : null);
    }

    questions = buildQuestions();
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
    difficultyBtn.textContent = difficulty === 'hard' ? '🌫️ Modo fácil' : '🌫️ Modo difícil';
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
