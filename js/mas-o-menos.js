(function(){
  'use strict';

  const ERAS = ['imperio', 'occidente', 'bizantino'];

  function cleanName(nombre){ return (nombre || '').replace(/\s*"[^"]*"/g, '').trim(); }

  function parsePeriodo(periodo){
    if(!periodo) return null;
    const clean = periodo.replace(/ /g, ' ').trim();
    let m = clean.match(/^(\d+)\s*(a\.C\.)?\s*(?:–|-)\s*(\d+)\s*(a\.C\.|d\.C\.)?\s*$/);
    if(m){
      const endEra = m[4] || 'd.C.';
      const startEra = m[2] || endEra;
      const startNum = parseInt(m[1], 10), endNum = parseInt(m[3], 10);
      return {
        startYear: startEra === 'a.C.' ? -startNum : startNum,
        endYear: endEra === 'a.C.' ? -endNum : endNum
      };
    }
    m = clean.match(/^(\d+)\s*(a\.C\.|d\.C\.)?\s*$/);
    if(m){
      const era = m[2] || 'd.C.';
      const year = era === 'a.C.' ? -parseInt(m[1],10) : parseInt(m[1],10);
      return { startYear: year, endYear: year };
    }
    return null;
  }
  function durationYears(parsed){ return Math.max(0, parsed.endYear - parsed.startYear); }
  function durationLabel(years){
    if(years <= 0) return 'menos de 1 año';
    if(years === 1) return '1 año';
    return years + ' años';
  }

  // ----- Mazo: emperadores con período parseable, sin coemperadores conjuntos -----
  function buildPool(){
    const pool = [];
    ERAS.forEach(era=>{
      const list = (window.ROMA_DATA && window.ROMA_DATA[era]) || [];
      list.forEach(item=>{
        if(/\sy\s/i.test(item.nombre)) return;
        const parsed = parsePeriodo(item.periodo);
        if(!parsed) return;
        pool.push({
          era: era,
          nombre: cleanName(item.nombre),
          periodo: item.periodo,
          imagen: item.imagen,
          texto: item.texto,
          years: durationYears(parsed)
        });
      });
    });
    return pool;
  }
  const POOL = buildPool();

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
  let sequence = [];
  let pos = 0;         // índice del challenger actual dentro de sequence
  let reference = null;
  let challenger = null;
  let score = 0;
  let best = 0;
  let finished = false;
  let answering = false;

  const STORAGE_BEST = 'mas_o_menos_best_v1';
  const STORAGE_DAILY = 'mas_o_menos_daily_v1';

  function loadBest(){
    try{ return parseInt(localStorage.getItem(STORAGE_BEST), 10) || 0; }catch(e){ return 0; }
  }
  function saveBest(){
    try{ localStorage.setItem(STORAGE_BEST, String(best)); }catch(e){}
  }
  function loadDailyProgress(){
    try{
      const raw = localStorage.getItem(STORAGE_DAILY);
      if(!raw) return null;
      const data = JSON.parse(raw);
      if(data.date !== todayKey()) return null;
      return data;
    }catch(e){ return null; }
  }
  function saveDailyProgress(){
    if(mode !== 'daily') return;
    try{
      localStorage.setItem(STORAGE_DAILY, JSON.stringify({ date: todayKey(), pos: pos, score: score, finished: finished }));
    }catch(e){}
  }

  // ----- DOM -----
  const modeLabel = document.getElementById('momModeLabel');
  const messageEl = document.getElementById('momMessage');
  const scoreEl = document.getElementById('momScore');
  const bestEl = document.getElementById('momBest');
  const refCard = document.getElementById('momRefCard');
  const refImg = document.getElementById('momRefImg');
  const refName = document.getElementById('momRefName');
  const refYears = document.getElementById('momRefYears');
  const chaCard = document.getElementById('momChaCard');
  const chaImg = document.getElementById('momChaImg');
  const chaName = document.getElementById('momChaName');
  const chaYears = document.getElementById('momChaYears');
  const moreBtn = document.getElementById('momMoreBtn');
  const lessBtn = document.getElementById('momLessBtn');
  const randomBtn = document.getElementById('momRandomBtn');
  const helpBtn = document.getElementById('momHelpBtn');
  const helpOverlay = document.getElementById('momHelpOverlay');
  const helpClose = document.getElementById('momHelpClose');
  const resultOverlay = document.getElementById('momResultOverlay');
  const resultClose = document.getElementById('momResultClose');
  const resultContent = document.getElementById('momResultContent');

  function setMessage(text, isError){
    messageEl.textContent = text || '';
    messageEl.classList.toggle('error', !!isError);
  }

  function renderScores(){
    scoreEl.textContent = String(score);
    bestEl.textContent = String(best);
  }

  function renderCards(){
    refCard.classList.remove('correct', 'incorrect');
    chaCard.classList.remove('correct', 'incorrect');
    refImg.src = reference.imagen;
    refImg.alt = reference.nombre;
    refName.textContent = reference.nombre;
    refYears.textContent = durationLabel(reference.years);
    refYears.classList.remove('hidden-years');

    chaImg.src = challenger.imagen;
    chaImg.alt = challenger.nombre;
    chaName.textContent = challenger.nombre;
    chaYears.textContent = '?';
    chaYears.classList.add('hidden-years');
  }

  function renderControls(){
    moreBtn.disabled = finished || answering;
    lessBtn.disabled = finished || answering;
  }

  function buildShareText(){
    const label = mode === 'daily' ? ('Más o Menos Años ' + todayKey()) : 'Más o Menos Años (práctica)';
    return label + ' — racha de ' + score + (score === 1 ? ' acierto' : ' aciertos');
  }

  function showResult(){
    resultContent.innerHTML = '';
    const title = document.createElement('p');
    title.className = 'romandle-result-title';
    title.textContent = 'Se terminó la racha';
    resultContent.appendChild(title);

    const scoreP = document.createElement('p');
    scoreP.className = 'romandle-result-name';
    scoreP.textContent = 'Llegaste a ' + score + (score === 1 ? ' acierto' : ' aciertos');
    resultContent.appendChild(scoreP);

    const bestP = document.createElement('p');
    bestP.className = 'romandle-result-periodo';
    bestP.textContent = score > best ? '¡Nuevo récord!' : 'Récord actual: ' + best;
    resultContent.appendChild(bestP);

    const card = document.createElement('div');
    card.className = 'silueta-info-card';
    card.innerHTML = '<strong>' + challenger.nombre + '</strong> (' + challenger.periodo + ') reinó ' +
      durationLabel(challenger.years) + ', frente a los ' + durationLabel(reference.years) + ' de ' + reference.nombre + '.';
    resultContent.appendChild(card);

    if(challenger.texto){
      const factCard = document.createElement('div');
      factCard.className = 'silueta-info-card';
      factCard.innerHTML = '<strong>Dato curioso de ' + challenger.nombre + ':</strong> ' + challenger.texto;
      resultContent.appendChild(factCard);
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

  function nextChallenger(){
    if(pos >= sequence.length){
      // se acabó el mazo (prácticamente nunca pasa): terminamos la racha como si hubiese ganado todo
      finished = true;
      renderControls();
      saveDailyProgress();
      setTimeout(()=> showResult(), 300);
      return;
    }
    challenger = sequence[pos];
    renderCards();
    renderControls();
    setMessage('');
  }

  function answer(guessMore){
    if(finished || answering) return;
    answering = true;
    pos++;
    const refY = reference.years, chaY = challenger.years;
    const tie = refY === chaY;
    const correct = tie || (guessMore ? chaY > refY : chaY < refY);

    chaYears.textContent = durationLabel(chaY);
    chaYears.classList.remove('hidden-years');
    chaCard.classList.add(correct ? 'correct' : 'incorrect');
    refCard.classList.add(correct ? 'correct' : 'incorrect');
    renderControls();

    if(correct){
      score++;
      if(score > best){ best = score; saveBest(); }
      renderScores();
      setMessage(tie ? '¡Empate! Cuenta como acierto — seguís la racha.' : '¡Correcto! Seguís la racha.');
      saveDailyProgress();
      setTimeout(()=>{
        reference = challenger;
        answering = false;
        nextChallenger();
      }, 900);
    } else {
      finished = true;
      setMessage('Ahí se cortó la racha.', true);
      saveDailyProgress();
      setTimeout(()=> showResult(), 900);
    }
  }

  function startGame(newMode){
    mode = newMode;
    score = 0;
    finished = false;
    answering = false;
    setMessage('');
    modeLabel.textContent = mode === 'daily' ? 'Racha del día' : 'Modo práctica (al azar)';

    if(mode === 'daily'){
      sequence = seededShuffle(POOL, 'mas-o-menos-' + todayKey());
      pos = 1;
      const saved = loadDailyProgress();
      if(saved){
        score = saved.score || 0;
        pos = Math.max(1, saved.pos || 1);
        finished = !!saved.finished;
      }
      // pos es "cuántos challengers ya se sacaron" (índice del próximo a sacar).
      // Si la partida terminó en derrota, el que falló fue sequence[pos-1] contra sequence[pos-2].
      reference = sequence[Math.max(0, (finished ? pos - 2 : pos - 1))];
    } else {
      sequence = randomShuffle(POOL);
      reference = sequence[0];
      pos = 1;
    }

    renderScores();
    if(finished){
      challenger = sequence[Math.max(0, pos - 1)];
      renderCards();
      chaYears.textContent = durationLabel(challenger.years);
      chaYears.classList.remove('hidden-years');
      refCard.classList.add('incorrect');
      chaCard.classList.add('incorrect');
      renderControls();
      setTimeout(()=> showResult(), 200);
    } else {
      nextChallenger();
    }
  }

  // ----- Eventos -----
  moreBtn.addEventListener('click', ()=> answer(true));
  lessBtn.addEventListener('click', ()=> answer(false));
  randomBtn.addEventListener('click', ()=> startGame('practice'));
  helpBtn.addEventListener('click', ()=> helpOverlay.classList.add('open'));
  helpClose.addEventListener('click', ()=> helpOverlay.classList.remove('open'));
  helpOverlay.addEventListener('click', (e)=>{ if(e.target === helpOverlay) helpOverlay.classList.remove('open'); });
  resultClose.addEventListener('click', ()=> resultOverlay.classList.remove('open'));
  resultOverlay.addEventListener('click', (e)=>{ if(e.target === resultOverlay) resultOverlay.classList.remove('open'); });

  best = loadBest();
  startGame('daily');
})();
