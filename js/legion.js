(function(){
  'use strict';

  const MAX_ATTEMPTS = 5;
  const MAX_HELP = 3;

  // ----- Banco de legiones (recorte automático les tapa el cognomen en assets/img/legiones-oculto/) -----
  // resultado: true = la legión ganó esa batalla puntual; false = la perdió (o fue aniquilada/se rindió).
  const LEGIONS = [
    { slug: 'legio-i-adiutrix', numeral: 'I', cognomen: 'Adiutrix', animal: 'Capricornio', apodo: null,
      curiosidad: 'Fue reclutada por Nerón entre marineros de la flota de Miseno, no entre soldados de tierra.',
      batalla: { nombre: 'Primera batalla de Bedriacum', anio: '69 d.C.', resultado: false,
        nota: 'Capturó el águila de la XXI Rapax peleando con fiereza, pero el bando de Otón perdió la batalla.' } },
    { slug: 'legio-i-germanica', numeral: 'I', cognomen: 'Germanica', animal: 'Toro', apodo: null,
      curiosidad: 'Fue una de las legiones del Rin que se amotinó tras la muerte de Augusto, en el año 14 d.C.',
      batalla: { nombre: 'Batalla de Dirraquio', anio: '48 a.C.', resultado: false,
        nota: 'César fue rechazado aquí, aunque ganaría la guerra poco después en Farsalia.' } },
    { slug: 'legio-i-italica', numeral: 'I', cognomen: 'Italica', animal: 'Jabalí', apodo: null,
      curiosidad: 'Nerón la reclutó pensando en una campaña militar personal al Cáucaso que nunca llegó a ocurrir.',
      batalla: { nombre: 'Segunda batalla de Bedriacum (Cremona)', anio: '69 d.C.', resultado: false,
        nota: 'Luchó del lado de Vitelio, derrotado por las fuerzas de Vespasiano.' } },
    { slug: 'legio-i-minervia', numeral: 'I', cognomen: 'Minervia', animal: 'Minerva (diosa)', apodo: null,
      curiosidad: 'Debe su nombre a la diosa Minerva, patrona personal del emperador Domiciano, quien la formó.',
      batalla: { nombre: 'Toma de Sarmizegetusa (Segunda Guerra Dacia)', anio: '106 d.C.', resultado: true,
        nota: 'Participó en la conquista definitiva de Dacia bajo Trajano.' } },
    { slug: 'legio-i-parthica', numeral: 'I', cognomen: 'Parthica', animal: 'Centauro', apodo: null,
      curiosidad: 'Fue creada por Septimio Severo específicamente para sus campañas contra los partos.',
      batalla: { nombre: 'Saqueo de Ctesifonte', anio: '198 d.C.', resultado: true,
        nota: 'Bajo Septimio Severo, en su campaña párthica.' } },
    { slug: 'legio-ii-augusta', numeral: 'II', cognomen: 'Augusta', animal: 'Capricornio', apodo: null,
      curiosidad: 'Estuvo estacionada en Britania durante más de 200 años, una de las guarniciones más largas de cualquier legión.',
      batalla: { nombre: 'Conquista del suroeste de Britania', anio: '43-47 d.C.', resultado: true,
        nota: 'Bajo el futuro emperador Vespasiano, tomó numerosos fuertes britanos, incluido Maiden Castle.' } },
    { slug: 'legio-ii-parthica', numeral: 'II', cognomen: 'Parthica', animal: 'Centauro', apodo: null,
      curiosidad: 'Fue la única legión imperial acuartelada de forma permanente en Italia, cerca de Roma.',
      batalla: { nombre: 'Saqueo de Ctesifonte', anio: '198 d.C.', resultado: true,
        nota: 'Bajo Septimio Severo. Décadas más tarde sus soldados matarían a dos emperadores por su cuenta.' } },
    { slug: 'legio-ii-traiana-fortis', numeral: 'II', cognomen: 'Traiana Fortis', animal: 'Hércules', apodo: null,
      curiosidad: 'Pese a su nombre por Trajano, pasó la mayor parte de su historia acuartelada en Egipto.',
      batalla: { nombre: 'Asedio de Alejandría (Guerra Bucólica)', anio: '172 d.C.', resultado: true,
        nota: 'Su defensa exitosa de la ciudad le ganó el cognomen "Fortis" (valiente).' } },
    { slug: 'legio-iii-augusta', numeral: 'III', cognomen: 'Augusta', animal: 'Pegaso', apodo: null,
      curiosidad: 'Pasó casi toda su existencia en el norte de África, vigilando la frontera del Sahara.',
      batalla: { nombre: 'Batalla cerca de Cartago', anio: '238 d.C.', resultado: true,
        nota: 'Derrotó y mató a Gordiano II durante el año de los seis emperadores.' } },
    { slug: 'legio-iii-gallica', numeral: 'III', cognomen: 'Gallica', animal: 'Toro', apodo: null,
      curiosidad: 'Pese a llevar el nombre de la Galia, pasó la mayor parte de su historia estacionada en Siria.',
      batalla: { nombre: 'Segunda batalla de Bedriacum (Cremona)', anio: '69 d.C.', resultado: true,
        nota: 'Famosa por saludar al sol naciente (costumbre siria) al amanecer, desconcertando al enemigo.' } },
    { slug: 'legio-iii-parthica', numeral: 'III', cognomen: 'Parthica', animal: 'Toro', apodo: null,
      curiosidad: 'Fue una de las tres legiones "Parthicae" creadas por Septimio Severo.',
      batalla: { nombre: 'Batalla de Resaena', anio: '243 d.C.', resultado: true,
        nota: 'Contra los sasánidas, bajo Gordiano III.' } },
    { slug: 'legio-iiii-flavia-felix', numeral: 'IIII', cognomen: 'Flavia Felix', animal: 'León', apodo: null,
      curiosidad: 'Fue reconstituida por los Flavios luego de que su predecesora, la IIII Macedonica, fuera disuelta en deshonra.',
      batalla: { nombre: 'Segunda batalla de Tapae', anio: '101 d.C.', resultado: true,
        nota: 'Victoria decisiva de Trajano sobre el rey dacio Decébalo.' } },
    { slug: 'legio-iiii-macedonica', numeral: 'IIII', cognomen: 'Macedonica', animal: 'Toro', apodo: null,
      curiosidad: 'Participó en la conquista de Britania bajo Claudio antes de ser disuelta por Vespasiano.',
      batalla: { nombre: 'Batalla de Mutina (Módena)', anio: '43 a.C.', resultado: true,
        nota: 'Del lado del Senado contra Marco Antonio, aunque sufrió bajas graves.' } },
    { slug: 'legio-iiii-scythica', numeral: 'IIII', cognomen: 'Scythica', animal: 'Capricornio', apodo: null,
      curiosidad: 'El origen de su cognomen es incierto: no hay evidencia clara de que haya luchado contra los escitas.',
      batalla: { nombre: 'Capitulación de Rhandeia', anio: '62 d.C.', resultado: false,
        nota: 'Rodeada y forzada a una rendición humillante ante los partos.' } },
    { slug: 'legio-v-alaudae', numeral: 'V', cognomen: 'Alaudae', animal: 'Elefante', apodo: null,
      curiosidad: 'Fue reclutada originalmente por Julio César entre galos, no entre ciudadanos romanos, algo muy inusual.',
      batalla: { nombre: 'Primera batalla de Tapae', anio: '86 d.C.', resultado: false,
        nota: 'Emboscada y aniquilada junto al general Cornelio Fusco; nunca volvió a reconstituirse.' } },
    { slug: 'legio-vi-ferrata', numeral: 'VI', cognomen: 'Ferrata', animal: 'Loba capitolina', apodo: null,
      curiosidad: 'Su nombre significa "de hierro", probablemente por su resistencia legendaria en combate.',
      batalla: { nombre: 'Batalla de Zela', anio: '47 a.C.', resultado: true,
        nota: 'La batalla del "veni, vidi, vici" de César.' } },
    { slug: 'legio-vi-victrix', numeral: 'VI', cognomen: 'Victrix', animal: 'Toro', apodo: null,
      curiosidad: 'Construyó gran parte del Muro de Adriano en el norte de Britania.',
      batalla: { nombre: 'Batalla de Accio', anio: '31 a.C.', resultado: true,
        nota: 'Del lado de Octavio, contra Marco Antonio y Cleopatra.' } },
    { slug: 'legio-vii-claudia', numeral: 'VII', cognomen: 'Claudia', animal: 'Toro', apodo: null,
      curiosidad: 'Recibió el título "Claudia Pia Fidelis" por permanecer leal a Claudio durante una revuelta en el 42 d.C.',
      batalla: { nombre: 'Batalla de Farsalia', anio: '48 a.C.', resultado: true,
        nota: 'Del lado de César, contra Pompeyo.' } },
    { slug: 'legio-viii-augusta', numeral: 'VIII', cognomen: 'Augusta', animal: 'Toro', apodo: null,
      curiosidad: 'Fue una de las legiones veteranas de Julio César, reasentada por Augusto tras las guerras civiles.',
      batalla: { nombre: 'Asedio de Alesia', anio: '52 a.C.', resultado: true,
        nota: 'Bajo Julio César, contra Vercingétorix.' } },
    { slug: 'legio-viiii-hispana', numeral: 'VIIII', cognomen: 'Hispana', animal: 'Toro', apodo: 'La Legión Perdida',
      curiosidad: 'Su desaparición de los registros después del 120 d.C. es uno de los grandes misterios sin resolver de la historia militar romana.',
      batalla: { nombre: 'Revuelta de Boudica', anio: '60-61 d.C.', resultado: false,
        nota: 'Un destacamento de unos 2000 hombres fue emboscado y aniquilado en su marcha de auxilio. Su destino final (aniquilada en Britania o transferida y perdida en otro frente) sigue siendo un misterio histórico real.' } },
    { slug: 'legio-x-fretensis', numeral: 'X', cognomen: 'Fretensis', animal: 'Jabalí', apodo: null,
      curiosidad: 'Su nombre viene del Estrecho de Mesina ("fretum"), donde luchó durante las guerras civiles.',
      batalla: { nombre: 'Asedio de Jerusalén', anio: '70 d.C.', resultado: true,
        nota: 'Bajo Tito, puso fin a la Primera Guerra Judeo-Romana.' } },
    { slug: 'legio-x-gemina', numeral: 'X', cognomen: 'Gemina', animal: 'Toro', apodo: null,
      curiosidad: '"Gemina" significa "mellizas": se formó fusionando los restos de dos legiones distintas.',
      batalla: { nombre: 'Batalla de Farsalia', anio: '48 a.C.', resultado: true,
        nota: 'Legión favorita de César, originalmente llamada X Equestris.' } },
    { slug: 'legio-xi-claudia', numeral: 'XI', cognomen: 'Claudia', animal: 'Neptuno (dios)', apodo: null,
      curiosidad: 'Como la VII, recibió el título "Claudia Pia Fidelis" por su lealtad a Claudio en el 42 d.C.',
      batalla: { nombre: 'Asedio de Alesia', anio: '52 a.C.', resultado: true,
        nota: 'Bajo Julio César.' } },
    { slug: 'legio-xii-fulminata', numeral: 'XII', cognomen: 'Fulminata', animal: 'Águila con el rayo', apodo: null,
      curiosidad: 'Su nombre significa "fulminante" o "la del rayo", por el símbolo del dios Júpiter en su estandarte.',
      batalla: { nombre: 'Batalla de Bet-Horón', anio: '66 d.C.', resultado: false,
        nota: 'Derrota humillante: perdió su águila legionaria, algo muy infrecuente y deshonroso.' } },
    { slug: 'legio-xiii-gemina', numeral: 'XIII', cognomen: 'Gemina', animal: 'León', apodo: null,
      curiosidad: 'Cruzó el Rubicón junto a Julio César en el 49 a.C., uno de los momentos más famosos de la historia romana.',
      batalla: { nombre: 'Asedio de Alesia', anio: '52 a.C.', resultado: true,
        nota: 'También conocida por cruzar el Rubicón junto a César en el 49 a.C.' } },
    { slug: 'legio-xiiii-gemina', numeral: 'XIIII', cognomen: 'Gemina', animal: 'Capricornio', apodo: null,
      curiosidad: 'Fue apodada "Martia Victrix" por su papel decisivo aplastando la revuelta de Boudica.',
      batalla: { nombre: 'Batalla de Watling Street', anio: '61 d.C.', resultado: true,
        nota: 'Aplastó la revuelta de Boudica pese a estar en franca inferioridad numérica.' } },
    { slug: 'legio-xv-apollinaris', numeral: 'XV', cognomen: 'Apollinaris', animal: 'Apolo (dios)', apodo: null,
      curiosidad: 'Debe su nombre al dios Apolo, posiblemente por la devoción de Augusto hacia esa deidad.',
      batalla: { nombre: 'Asedio de Jerusalén', anio: '70 d.C.', resultado: true,
        nota: 'Bajo Tito.' } },
    { slug: 'legio-xvi-flavia-firma', numeral: 'XVI', cognomen: 'Flavia Firma', animal: 'Pegaso', apodo: null,
      curiosidad: 'Fue formada por Vespasiano para reemplazar a la XVI Gallica, disuelta en deshonra.',
      batalla: { nombre: 'Recaptura de Ctesifonte', anio: '165 d.C.', resultado: true,
        nota: 'En la guerra párthica de Lucio Vero.' } },
    { slug: 'legio-xvi-gallica', numeral: 'XVI', cognomen: 'Gallica', animal: 'León', apodo: null,
      curiosidad: 'Fue una de las cuatro legiones destinadas originalmente a la conquista de Britania bajo Claudio.',
      batalla: { nombre: 'Revuelta bátava', anio: '69-70 d.C.', resultado: false,
        nota: 'Se rindió ante el rebelde Civilis; fue disuelta después en deshonra (reemplazada por la XVI Flavia Firma).' } },
    { slug: 'legio-xx-valeria-victrix', numeral: 'XX', cognomen: 'Valeria Victrix', animal: 'Jabalí', apodo: null,
      curiosidad: 'Participó en la conquista de Britania y en aplastar la revuelta de Boudica.',
      batalla: { nombre: 'Batalla de Watling Street', anio: '61 d.C.', resultado: true,
        nota: 'Derrota de Boudica; ganó el título "Valeria Victrix" por esta campaña.' } },
    { slug: 'legio-xxi-rapax', numeral: 'XXI', cognomen: 'Rapax', animal: 'Capricornio', apodo: null,
      curiosidad: 'Su nombre significa "la rapaz" o "la voraz", reflejando una reputación agresiva en combate.',
      batalla: { nombre: 'Aniquilada por los sármatas', anio: 'c. 92 d.C.', resultado: false,
        nota: 'Destruida bajo Domiciano (otra teoría sostiene que fue disuelta por sublevarse poco antes).' } },
    { slug: 'legio-xxii-primigenia', numeral: 'XXII', cognomen: 'Primigenia', animal: 'Hércules', apodo: null,
      curiosidad: 'Su nombre honra a la diosa Fortuna Primigenia, venerada especialmente en la ciudad de Preneste.',
      batalla: { nombre: 'Batalla de Lugdunum', anio: '197 d.C.', resultado: true,
        nota: 'Bajo Septimio Severo, contra el usurpador Clodio Albino.' } },
    { slug: 'legio-xxx-ulpia-victrix', numeral: 'XXX', cognomen: 'Ulpia Victrix', animal: 'Capricornio', apodo: null,
      curiosidad: '"Ulpia" viene del nombre de familia de Trajano (Marco Ulpio Trajano), quien la formó.',
      batalla: { nombre: 'Batalla de Lugdunum', anio: '197 d.C.', resultado: true,
        nota: 'Bajo Septimio Severo.' } }
  ];

  function imgOculto(l){ return 'assets/img/legiones-oculto/' + l.slug + '.png'; }
  function imgRevelado(l){ return 'assets/img/legiones/' + l.slug + '.png'; }
  function nombreCompleto(l){ return 'Legio ' + l.numeral + ' ' + l.cognomen; }

  function stripAccents(s){ return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function foldLower(s){ return stripAccents(s || '').toLowerCase(); }
  function foldKey(s){ return foldLower(s).replace(/[^a-z]/g, ''); }

  const NUMERAL_PREFIX = /^(legio\s+)?(xxxiii|xxxii|xxxi|xxx|xxviiii|xxviii|xxvii|xxvi|xxv|xxiiii|xxiii|xxii|xxi|xx|xviiii|xviii|xvii|xvi|xv|xiiii|xiii|xii|xi|x|viiii|viii|vii|vi|v|iiii|iii|ii|i)\s+/i;
  function guessKey(raw){
    let s = foldLower(raw).trim().replace(/\s+/g, ' ');
    s = s.replace(NUMERAL_PREFIX, '');
    return foldKey(s);
  }
  LEGIONS.forEach(l=>{ l.cognomenKey = foldKey(l.cognomen); l.completo = nombreCompleto(l); });

  function todayKey(){
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }
  function seededIndex(seedStr, max){
    let h = 2166136261;
    for(let i=0;i<seedStr.length;i++){ h ^= seedStr.charCodeAt(i); h = Math.imul(h, 16777619); }
    return Math.abs(h) % max;
  }
  function pickDaily(){ return LEGIONS[seededIndex('legion-' + todayKey(), LEGIONS.length)]; }
  function pickRandom(excludeSlug){
    if(LEGIONS.length <= 1) return LEGIONS[0];
    let c;
    do{ c = LEGIONS[Math.floor(Math.random() * LEGIONS.length)]; } while(c.slug === excludeSlug);
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

  const STORAGE_PROGRESS = 'legion_progress_v1';

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
        date: todayKey(), secretSlug: secret.slug, attempts: attempts, hints: hints,
        resolved: resolved, won: won, questionIdx: questionIdx,
        questionResults: questionResults, finished: finished
      }));
    }catch(e){}
  }

  // ----- DOM -----
  const attemptsEl = document.getElementById('legionAttempts');
  const imgEl = document.getElementById('legionImg');
  const hintsEl = document.getElementById('legionHints');
  const messageEl = document.getElementById('legionMessage');
  const formEl = document.getElementById('legionForm');
  const inputEl = document.getElementById('legionInput');
  const questionZone = document.getElementById('legionQuestionZone');
  const modeLabel = document.getElementById('legionModeLabel');
  const randomBtn = document.getElementById('legionRandomBtn');
  const hintBtn = document.getElementById('legionHintBtn');
  const helpBtn = document.getElementById('legionHelpBtn');
  const helpOverlay = document.getElementById('legionHelpOverlay');
  const helpClose = document.getElementById('legionHelpClose');
  const resultOverlay = document.getElementById('legionResultOverlay');
  const resultClose = document.getElementById('legionResultClose');
  const resultContent = document.getElementById('legionResultContent');

  function setMessage(text, isError){
    messageEl.textContent = text || '';
    messageEl.classList.toggle('error', !!isError);
  }

  function renderImage(){
    imgEl.src = resolved ? imgRevelado(secret) : imgOculto(secret);
    imgEl.alt = resolved ? secret.completo : 'Emblema de una legión romana, sin su nombre';
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

  function maskedPattern(cognomen){
    return cognomen.split(' ').map(word=>
      word.charAt(0).toUpperCase() + '_'.repeat(Math.max(0, word.length - 1))
    ).join(' ');
  }

  function renderHints(){
    hintsEl.innerHTML = '';
    if(resolved) return;
    if(hints >= 1){
      const h1 = document.createElement('div');
      h1.className = 'silueta-hint';
      h1.textContent = 'Su cognomen empieza con la letra: ' + secret.cognomen.charAt(0).toUpperCase();
      hintsEl.appendChild(h1);
    }
    if(hints >= 2){
      const h2 = document.createElement('div');
      h2.className = 'silueta-hint';
      h2.textContent = 'Tiene ' + secret.cognomen.split(' ').length + ' palabra(s) en el cognomen.';
      hintsEl.appendChild(h2);
    }
    if(hints >= 3){
      const h3 = document.createElement('div');
      h3.className = 'silueta-hint';
      h3.textContent = 'Forma del cognomen: ' + maskedPattern(secret.cognomen);
      hintsEl.appendChild(h3);
    }
  }

  function renderGuessArea(){
    inputEl.disabled = resolved;
    document.getElementById('legionSubmitBtn').disabled = resolved;
    hintBtn.disabled = resolved || hints >= MAX_HELP;
    hintBtn.textContent = '💡 Ayuda (' + (MAX_HELP - hints) + ')';
  }

  // ----- Preguntas -----
  function buildQuestions(){
    const qs = [];
    qs.push({
      type: 'text',
      prompt: '¿Tenía ' + secret.completo + ' un apodo informal, además de su nombre oficial?',
      correct: secret.apodo ? 'Sí, tenía un apodo' : 'No, no se le conoce un apodo',
      options: ['Sí, tenía un apodo', 'No, no se le conoce un apodo']
    });
    const allBattles = LEGIONS.map(l=> l.batalla.nombre);
    const distractors = shuffleArr(Array.from(new Set(allBattles.filter(b=> b !== secret.batalla.nombre)))).slice(0,3);
    qs.push({
      type: 'text',
      prompt: '¿En qué batalla luchó ' + secret.completo + '?',
      correct: secret.batalla.nombre,
      options: shuffleArr(distractors.concat([secret.batalla.nombre]))
    });
    qs.push({
      type: 'text',
      prompt: '¿Ganó esa batalla?',
      correct: secret.batalla.resultado ? 'Sí, la ganó' : 'No, no la ganó',
      options: ['Sí, la ganó', 'No, no la ganó']
    });
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
    questionZone.appendChild(box);
  }

  function renderAll(){
    renderImage();
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
    submitGuessRaw(raw);
  }

  function submitGuessRaw(raw){
    if(resolved) return;
    attempts++;
    inputEl.value = '';
    const key = guessKey(raw);
    if(key === secret.cognomenKey){
      won = true;
      resolved = true;
      setMessage('¡Correcto! Era ' + secret.completo + '.');
    } else if(attempts >= MAX_ATTEMPTS){
      resolved = true;
      setMessage('Era ' + secret.completo + '.', true);
    } else {
      setMessage('No es. Te quedan ' + (MAX_ATTEMPTS - attempts) + ' intento(s).', true);
    }
    renderAll();
    saveProgress();
  }

  function buildShareText(){
    const label = mode === 'daily' ? ('La Legión ' + todayKey()) : 'La Legión (práctica)';
    const scoreLabel = won ? (attempts + '/' + MAX_ATTEMPTS) : 'X/' + MAX_ATTEMPTS;
    const correctCount = questionResults.filter(Boolean).length;
    return label + ' — ' + scoreLabel + ' 🦅 · ' + correctCount + '/' + questions.length + ' preguntas';
  }

  function showResult(){
    resultContent.innerHTML = '';
    const title = document.createElement('p');
    title.className = 'romandle-result-title';
    title.textContent = won ? '¡La reconociste!' : 'No llegaste a tiempo';
    resultContent.appendChild(title);

    const img = document.createElement('img');
    img.className = 'romandle-result-figure';
    img.style.objectFit = 'contain';
    img.style.background = '#fbf6ec';
    img.src = imgRevelado(secret);
    img.alt = secret.completo;
    resultContent.appendChild(img);

    const name = document.createElement('p');
    name.className = 'romandle-result-name';
    name.textContent = secret.completo + (secret.apodo ? ' ("' + secret.apodo + '")' : '');
    resultContent.appendChild(name);

    const periodo = document.createElement('p');
    periodo.className = 'romandle-result-periodo';
    periodo.textContent = 'Emblema: ' + secret.animal;
    resultContent.appendChild(periodo);

    const quiz = document.createElement('p');
    quiz.className = 'romandle-result-text';
    quiz.style.textAlign = 'center';
    quiz.textContent = 'Preguntas acertadas: ' + questionResults.filter(Boolean).length + '/' + questions.length;
    resultContent.appendChild(quiz);

    const card = document.createElement('div');
    card.className = 'silueta-info-card';
    card.innerHTML = '<strong>Batalla:</strong> ' + secret.batalla.nombre + ' (' + secret.batalla.anio + ') — ' +
      (secret.batalla.resultado ? 'la ganó.' : 'no la ganó.') + '<br>' + secret.batalla.nota;
    resultContent.appendChild(card);

    if(secret.curiosidad){
      const factCard = document.createElement('div');
      factCard.className = 'silueta-info-card';
      factCard.innerHTML = '<strong>Dato curioso:</strong> ' + secret.curiosidad;
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

  function startGame(newMode, forcedSecret){
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
    modeLabel.textContent = mode === 'daily' ? 'Legión del día' : 'Modo práctica (al azar)';

    if(forcedSecret){
      secret = forcedSecret;
    } else if(mode === 'daily'){
      secret = pickDaily();
      const saved = loadProgress();
      if(saved && saved.secretSlug === secret.slug){
        attempts = saved.attempts || 0;
        hints = saved.hints || 0;
        resolved = !!saved.resolved;
        won = !!saved.won;
        questionIdx = saved.questionIdx || 0;
        questionResults = saved.questionResults || [];
        finished = !!saved.finished;
      }
    } else {
      secret = pickRandom(secret ? secret.slug : null);
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
