(function(){
  'use strict';

  const MAX_ATTEMPTS = 5;
  const MAX_HELP = 3;
  const ERAS = ['imperio', 'occidente', 'bizantino'];

  // ----- Banco de guerras -----
  const WARS = [
    { id: 'judeorromana', nombre: 'Primera Guerra Judeo-Romana', participantes: 'Roma vs. los judíos rebeldes de Judea',
      emperadores: ['Nerón','Galba','Otón','Vitelio','Vespasiano'], inicio: 66, fin: 73,
      descripcion: 'Terminó con la destrucción del Templo de Jerusalén (70 d.C.) y la caída de Masada (73 d.C.).' },
    { id: 'dacicas', nombre: 'Guerras Dácicas de Trajano', participantes: 'Roma vs. los dacios de Decébalo',
      emperadores: ['Trajano'], inicio: 101, fin: 106,
      descripcion: 'Terminó con la conquista de Dacia, conmemorada en la Columna de Trajano.' },
    { id: 'marcomanas', nombre: 'Guerras Marcómanas', participantes: 'Roma vs. marcomanos, cuados y otras tribus germánicas',
      emperadores: ['Marco Aurelio','Cómodo'], inicio: 166, fin: 180,
      descripcion: 'Años de invasiones germánicas a través del Danubio durante el reinado de Marco Aurelio.' },
    { id: 'cuatro-emperadores', nombre: 'Año de los Cuatro Emperadores', participantes: 'Galba vs. Otón vs. Vitelio vs. Vespasiano',
      emperadores: ['Galba','Otón','Vitelio','Vespasiano'], inicio: 68, fin: 69,
      descripcion: 'Guerra civil tras la muerte de Nerón; terminó con Vespasiano como fundador de la dinastía Flavia.' },
    { id: 'cinco-emperadores', nombre: 'Año de los Cinco Emperadores', participantes: 'Varios pretendientes al trono tras la muerte de Cómodo',
      emperadores: ['Pértinax','Didio Juliano','Pescenio Níger','Clodio Albino','Septimio Severo'], inicio: 193, fin: 197,
      descripcion: 'Terminó con Septimio Severo como único emperador y fundador de la dinastía Severa.' },
    { id: 'partica-severo', nombre: 'Campaña Pártica de Septimio Severo', participantes: 'Roma vs. el Imperio parto',
      emperadores: ['Septimio Severo'], inicio: 197, fin: 198,
      descripcion: 'Terminó con el saqueo de Ctesifonte, la capital parta.' },
    { id: 'partica-valeriano', nombre: 'Guerra Pártica de Valeriano', participantes: 'Roma vs. el Imperio sasánida',
      emperadores: ['Valeriano','Galieno'], inicio: 253, fin: 260,
      descripcion: 'Terminó con la captura del emperador Valeriano, una humillación sin precedentes para Roma.' },
    { id: 'gotica-claudio', nombre: 'Guerra Gótica de Claudio II', participantes: 'Roma vs. los godos',
      emperadores: ['Claudio II el Gótico'], inicio: 268, fin: 270,
      descripcion: 'Terminó con la victoria romana en la batalla de Naisus, que le dio a Claudio su apodo "el Gótico".' },
    { id: 'civil-constantino', nombre: 'Guerra Civil de Constantino', participantes: 'Constantino I vs. Majencio (312) y después vs. Licinio (324)',
      emperadores: ['Constantino I'], inicio: 312, fin: 324,
      descripcion: 'Terminó con Constantino como único emperador y la fundación de Constantinopla poco después.' },
    { id: 'gotica-adrianopolis', nombre: 'Guerra Gótica de Adrianópolis', participantes: 'Roma vs. los godos (visigodos)',
      emperadores: ['Teodosio I "el Grande"'], inicio: 376, fin: 382,
      descripcion: 'Comenzó bajo Valente, quien murió en la batalla de Adrianópolis (378); terminó con un tratado bajo Teodosio I.' },
    { id: 'saqueo-alarico', nombre: 'Saqueo de Roma por Alarico', participantes: 'Imperio de Occidente vs. los visigodos de Alarico',
      emperadores: ['Honorio'], inicio: 408, fin: 410,
      descripcion: 'Terminó con el primer saqueo de Roma en casi 800 años, un golpe simbólico devastador.' },
    { id: 'vandala', nombre: 'Guerra Vándala de Justiniano', participantes: 'Bizancio vs. el Reino Vándalo',
      emperadores: ['Justiniano I "el Grande"'], inicio: 533, fin: 534,
      descripcion: 'El general Belisario reconquistó el norte de África para el Imperio Bizantino.' },
    { id: 'gotica-justiniano', nombre: 'Guerra Gótica de Justiniano', participantes: 'Bizancio vs. el Reino Ostrogodo',
      emperadores: ['Justiniano I "el Grande"'], inicio: 535, fin: 554,
      descripcion: 'Larga y devastadora campaña de reconquista de Italia, que dejó a la península arrasada.' },
    { id: 'sasanida-heraclio', nombre: 'Guerra Bizantino-Sasánida de Heraclio', participantes: 'Bizancio vs. el Imperio sasánida',
      emperadores: ['Focas','Heraclio'], inicio: 602, fin: 628,
      descripcion: 'La última gran guerra entre Roma y Persia, que dejó a ambos imperios agotados justo antes de las conquistas árabes.' },
    { id: 'asedio-arabe-1', nombre: 'Primer Asedio Árabe de Constantinopla', participantes: 'Bizancio vs. el Califato Omeya',
      emperadores: ['Constantino IV'], inicio: 674, fin: 678,
      descripcion: 'Los bizantinos resistieron gracias al fuego griego, un arma incendiaria secreta.' },
    { id: 'asedio-arabe-2', nombre: 'Segundo Asedio Árabe de Constantinopla', participantes: 'Bizancio vs. el Califato Omeya',
      emperadores: ['León III "el Isaurio"'], inicio: 717, fin: 718,
      descripcion: 'Derrota árabe crucial que aseguró la supervivencia del Imperio Bizantino por siglos.' },
    { id: 'cuarta-cruzada', nombre: 'Cuarta Cruzada', participantes: 'Cruzados latinos y venecianos vs. el Imperio Bizantino',
      emperadores: ['Alejo III Ángelo','Isaac II Ángelo','Alejo IV Ángelo','Alejo V Murzuflo'], inicio: 1202, fin: 1204,
      descripcion: 'Los cruzados terminaron saqueando Constantinopla en vez de llegar a Tierra Santa.' },
    { id: 'caida-constantinopla', nombre: 'Caída de Constantinopla', participantes: 'Imperio Otomano vs. el Imperio Bizantino',
      emperadores: ['Constantino XI Paleólogo'], inicio: 1453, fin: 1453,
      descripcion: 'El sultán otomano Mehmed II tomó la ciudad, poniendo fin a casi 1500 años de Imperio Romano.' }
  ];

  function stripAccents(s){ return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function foldLower(s){ return stripAccents(s || '').toLowerCase(); }

  const STOPWORDS = new Set(['guerra','guerras','de','del','la','las','los','el','en','contra','y','durante','al','un','una']);
  function significantWords(s){
    return foldLower(s).replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(w=> w && !STOPWORDS.has(w) && w.length >= 4);
  }
  function checkNameGuess(raw, correctNombre){
    const guessWords = new Set(foldLower(raw).replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean));
    const correctWords = significantWords(correctNombre);
    if(!correctWords.length) return false;
    return correctWords.every(w=> guessWords.has(w));
  }

  // ----- Índice de emperadores (para retratos y distractores) -----
  const BY_NAME = {};
  const FULL_POOL = [];
  ERAS.forEach(era=>{
    const list = (window.ROMA_DATA && window.ROMA_DATA[era]) || [];
    list.forEach(item=>{
      BY_NAME[item.nombre] = item;
      if(/\sy\s/i.test(item.nombre)) return;
      FULL_POOL.push(item.nombre);
    });
  });
  function emperorData(nombre){ return BY_NAME[nombre] || { nombre: nombre, imagen: '' }; }

  function shuffleArr(arr){
    const a = arr.slice();
    for(let i = a.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }
  function todayKey(){
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }
  function seededIndex(seedStr, max){
    let h = 2166136261;
    for(let i=0;i<seedStr.length;i++){ h ^= seedStr.charCodeAt(i); h = Math.imul(h, 16777619); }
    return Math.abs(h) % max;
  }
  function pickDaily(){ return WARS[seededIndex('guerra-' + todayKey(), WARS.length)]; }
  function pickRandom(excludeId){
    if(WARS.length <= 1) return WARS[0];
    let w;
    do{ w = WARS[Math.floor(Math.random() * WARS.length)]; } while(w.id === excludeId);
    return w;
  }
  function yearLabel(y){ return y + ' d.C.'; }

  function buildOptions(correctVal, allVals){
    const distractors = shuffleArr(Array.from(new Set(allVals.filter(v=> v !== correctVal)))).slice(0,3);
    return shuffleArr(distractors.concat([correctVal]));
  }

  // ----- Estado -----
  let mode = 'daily';
  let secret = null;
  let attempts = 0;
  let hints = 0;
  let resolved = false;
  let won = false;
  let questions = [];
  let questionIdx = 0;
  let questionResults = [];
  let finished = false;
  let selectedEmperors = null; // Set en uso durante la pregunta multi-select

  const STORAGE_PROGRESS = 'guerra_progress_v1';

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
        date: todayKey(), warId: secret.id, attempts: attempts, hints: hints,
        resolved: resolved, won: won, questionIdx: questionIdx,
        questionResults: questionResults, finished: finished
      }));
    }catch(e){}
  }

  // ----- DOM -----
  const attemptsEl = document.getElementById('guerraAttempts');
  const participantesEl = document.getElementById('guerraParticipantes');
  const hintsEl = document.getElementById('guerraHints');
  const messageEl = document.getElementById('guerraMessage');
  const formEl = document.getElementById('guerraForm');
  const inputEl = document.getElementById('guerraInput');
  const questionZone = document.getElementById('guerraQuestionZone');
  const modeLabel = document.getElementById('guerraModeLabel');
  const randomBtn = document.getElementById('guerraRandomBtn');
  const hintBtn = document.getElementById('guerraHintBtn');
  const helpBtn = document.getElementById('guerraHelpBtn');
  const helpOverlay = document.getElementById('guerraHelpOverlay');
  const helpClose = document.getElementById('guerraHelpClose');
  const resultOverlay = document.getElementById('guerraResultOverlay');
  const resultClose = document.getElementById('guerraResultClose');
  const resultContent = document.getElementById('guerraResultContent');

  function setMessage(text, isError){
    messageEl.textContent = text || '';
    messageEl.classList.toggle('error', !!isError);
  }

  function maskedPattern(nombre){
    return nombre.split(' ').map(word=>{
      const letters = word.replace(/[^A-Za-zÀ-ÿ]/g, '');
      if(!letters) return word;
      return word.charAt(0) + word.slice(1).replace(/[A-Za-zÀ-ÿ]/g, '_');
    }).join(' ');
  }

  function renderClue(){
    participantesEl.textContent = secret.participantes;
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
    if(resolved) return;
    if(hints >= 1){
      const h1 = document.createElement('div');
      h1.className = 'silueta-hint';
      h1.textContent = 'El nombre tiene ' + secret.nombre.split(' ').length + ' palabra(s).';
      hintsEl.appendChild(h1);
    }
    if(hints >= 2){
      const h2 = document.createElement('div');
      h2.className = 'silueta-hint';
      h2.textContent = 'Empezó en el ' + yearLabel(secret.inicio) + '.';
      hintsEl.appendChild(h2);
    }
    if(hints >= 3){
      const h3 = document.createElement('div');
      h3.className = 'silueta-hint';
      h3.textContent = 'Forma del nombre: ' + maskedPattern(secret.nombre);
      hintsEl.appendChild(h3);
    }
  }

  function renderGuessArea(){
    inputEl.disabled = resolved;
    document.getElementById('guerraSubmitBtn').disabled = resolved;
    hintBtn.disabled = resolved || hints >= MAX_HELP;
    hintBtn.textContent = '💡 Ayuda (' + (MAX_HELP - hints) + ')';
  }

  // ----- Preguntas -----
  function buildQuestions(){
    const qs = [];
    qs.push({ type: 'emperors', prompt: '¿Qué emperador(es) gobernaba(n) durante ' + secret.nombre + '?' });
    const allStarts = WARS.map(w=> yearLabel(w.inicio));
    qs.push({
      type: 'text',
      prompt: '¿En qué año empezó?',
      correct: yearLabel(secret.inicio),
      options: buildOptions(yearLabel(secret.inicio), allStarts)
    });
    const allEnds = WARS.map(w=> yearLabel(w.fin));
    qs.push({
      type: 'text',
      prompt: '¿En qué año terminó?',
      correct: yearLabel(secret.fin),
      options: buildOptions(yearLabel(secret.fin), allEnds)
    });
    return qs;
  }

  function advanceQuestion(isCorrect){
    questionResults[questionIdx] = !!isCorrect;
    questionIdx++;
    saveProgress();
    setTimeout(renderCurrentQuestion, 800);
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
    } else if(q.type === 'emperors'){
      const correctSet = secret.emperadores;
      const distractPool = shuffleArr(FULL_POOL.filter(n=> correctSet.indexOf(n) === -1))
        .slice(0, Math.max(2, 6 - correctSet.length));
      const allOptions = shuffleArr(correctSet.concat(distractPool));
      selectedEmperors = new Set();

      const grid = document.createElement('div');
      grid.className = 'guerra-emperor-grid';
      allOptions.forEach(nombre=>{
        const data = emperorData(nombre);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'guerra-emperor-btn';
        const img = document.createElement('img');
        img.src = data.imagen || '';
        img.alt = nombre;
        btn.appendChild(img);
        const span = document.createElement('span');
        span.textContent = nombre.replace(/\s*"[^"]*"/g, '');
        btn.appendChild(span);
        btn.addEventListener('click', ()=>{
          if(selectedEmperors.has(nombre)){ selectedEmperors.delete(nombre); btn.classList.remove('selected'); }
          else { selectedEmperors.add(nombre); btn.classList.add('selected'); }
        });
        btn._nombre = nombre;
        grid.appendChild(btn);
      });
      box.appendChild(grid);

      const verifyRow = document.createElement('div');
      verifyRow.className = 'guerra-verify-row';
      const verifyBtn = document.createElement('button');
      verifyBtn.type = 'button';
      verifyBtn.className = 'romandle-btn';
      verifyBtn.textContent = 'Verificar selección';
      verifyBtn.addEventListener('click', ()=>{
        const correctSetKey = new Set(correctSet);
        let allCorrect = true;
        Array.from(grid.children).forEach(btn=>{
          btn.disabled = true;
          const isCorrectOne = correctSetKey.has(btn._nombre);
          const wasSelected = selectedEmperors.has(btn._nombre);
          if(isCorrectOne && wasSelected) btn.classList.add('correct');
          else if(isCorrectOne && !wasSelected){ btn.classList.add('missed'); allCorrect = false; }
          else if(!isCorrectOne && wasSelected){ btn.classList.add('incorrect'); allCorrect = false; }
        });
        verifyBtn.disabled = true;
        advanceQuestion(allCorrect);
      });
      verifyRow.appendChild(verifyBtn);
      box.appendChild(verifyRow);
    }
    questionZone.appendChild(box);
  }

  function renderAll(){
    renderClue();
    renderAttempts();
    renderHints();
    renderGuessArea();
    renderCurrentQuestion();
  }

  function useHint(){
    if(resolved || hints >= MAX_HELP) return;
    hints++;
    renderAll();
    saveProgress();
  }

  function submitFromInput(){
    const raw = inputEl.value.trim();
    if(!raw) return;
    if(resolved) return;
    attempts++;
    inputEl.value = '';
    if(checkNameGuess(raw, secret.nombre)){
      won = true;
      resolved = true;
      setMessage('¡Correcto! Era ' + secret.nombre + '.');
    } else if(attempts >= MAX_ATTEMPTS){
      resolved = true;
      setMessage('Era ' + secret.nombre + '.', true);
    } else {
      setMessage('No es. Te quedan ' + (MAX_ATTEMPTS - attempts) + ' intento(s).', true);
    }
    renderAll();
    saveProgress();
  }

  function buildShareText(){
    const label = mode === 'daily' ? ('La Guerra ' + todayKey()) : 'La Guerra (práctica)';
    const scoreLabel = won ? (attempts + '/' + MAX_ATTEMPTS) : 'X/' + MAX_ATTEMPTS;
    const correctCount = questionResults.filter(Boolean).length;
    return label + ' — ' + scoreLabel + ' ⚔️ · ' + correctCount + '/' + questions.length + ' preguntas';
  }

  function showResult(){
    resultContent.innerHTML = '';
    const title = document.createElement('p');
    title.className = 'romandle-result-title';
    title.textContent = won ? '¡La reconociste!' : 'No llegaste a tiempo';
    resultContent.appendChild(title);

    const name = document.createElement('p');
    name.className = 'romandle-result-name';
    name.textContent = secret.nombre;
    resultContent.appendChild(name);

    const periodo = document.createElement('p');
    periodo.className = 'romandle-result-periodo';
    periodo.textContent = yearLabel(secret.inicio) + ' – ' + yearLabel(secret.fin) + ' · ' + secret.participantes;
    resultContent.appendChild(periodo);

    const quiz = document.createElement('p');
    quiz.className = 'romandle-result-text';
    quiz.style.textAlign = 'center';
    quiz.textContent = 'Preguntas acertadas: ' + questionResults.filter(Boolean).length + '/' + questions.length;
    resultContent.appendChild(quiz);

    const card = document.createElement('div');
    card.className = 'silueta-info-card';
    card.innerHTML = '<strong>Emperador(es):</strong> ' + secret.emperadores.map(n=> n.replace(/\s*"[^"]*"/g,'')).join(', ');
    resultContent.appendChild(card);

    const factCard = document.createElement('div');
    factCard.className = 'silueta-info-card';
    factCard.innerHTML = '<strong>Dato curioso:</strong> ' + secret.descripcion;
    resultContent.appendChild(factCard);

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
    resolved = false;
    won = false;
    questionIdx = 0;
    questionResults = [];
    finished = false;
    inputEl.disabled = false;
    inputEl.value = '';
    setMessage('');
    modeLabel.textContent = mode === 'daily' ? 'Guerra del día' : 'Modo práctica (al azar)';

    if(mode === 'daily'){
      secret = pickDaily();
      const saved = loadProgress();
      if(saved && saved.warId === secret.id){
        attempts = saved.attempts || 0;
        hints = saved.hints || 0;
        resolved = !!saved.resolved;
        won = !!saved.won;
        questionIdx = saved.questionIdx || 0;
        questionResults = saved.questionResults || [];
        finished = !!saved.finished;
      }
    } else {
      secret = pickRandom(secret ? secret.id : null);
    }

    questions = buildQuestions();
    renderAll();
    if(finished) setTimeout(()=> showResult(), 200);
  }

  // ----- Eventos -----
  formEl.addEventListener('submit', (e)=>{
    e.preventDefault();
    submitFromInput();
  });
  hintBtn.addEventListener('click', useHint);
  randomBtn.addEventListener('click', ()=> startGame('practice'));
  helpBtn.addEventListener('click', ()=> helpOverlay.classList.add('open'));
  helpClose.addEventListener('click', ()=> helpOverlay.classList.remove('open'));
  helpOverlay.addEventListener('click', (e)=>{ if(e.target === helpOverlay) helpOverlay.classList.remove('open'); });
  resultClose.addEventListener('click', ()=> resultOverlay.classList.remove('open'));
  resultOverlay.addEventListener('click', (e)=>{ if(e.target === resultOverlay) resultOverlay.classList.remove('open'); });

  startGame('daily');
})();
