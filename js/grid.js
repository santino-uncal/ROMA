(function(){
  'use strict';

  const ERAS = ['imperio', 'occidente', 'bizantino'];
  const ERA_LABELS = {
    imperio: 'Antes de la división (hasta 395 d.C.)',
    occidente: 'Imperio romano de Occidente',
    bizantino: 'Imperio bizantino / de Oriente'
  };

  // Dinastía de cada emperador (misma tabla que usa Guess the Imperator).
  const DYNASTIES = {
    'Augusto': 'Julio-Claudia', 'Tiberio': 'Julio-Claudia', 'Calígula': 'Julio-Claudia',
    'Claudio': 'Julio-Claudia', 'Nerón': 'Julio-Claudia',
    'Galba': 'Sin dinastía', 'Otón': 'Sin dinastía', 'Vitelio': 'Sin dinastía',
    'Vespasiano': 'Flavia', 'Tito': 'Flavia', 'Domiciano': 'Flavia',
    'Nerva': 'Nervio-Antonina', 'Trajano': 'Nervio-Antonina', 'Adriano': 'Nervio-Antonina',
    'Antonino Pío': 'Nervio-Antonina', 'Marco Aurelio': 'Nervio-Antonina', 'Cómodo': 'Nervio-Antonina',
    'Pértinax': 'Sin dinastía', 'Didio Juliano': 'Sin dinastía',
    'Pescenio Níger': 'Sin dinastía', 'Clodio Albino': 'Sin dinastía',
    'Septimio Severo': 'Severa', 'Caracalla': 'Severa', 'Heliogábalo': 'Severa', 'Alejandro Severo': 'Severa',
    'Maximino el Tracio': 'Crisis del Siglo III', 'Gordiano I': 'Crisis del Siglo III', 'Gordiano II': 'Crisis del Siglo III',
    'Pupieno': 'Crisis del Siglo III', 'Balbino': 'Crisis del Siglo III', 'Gordiano III': 'Crisis del Siglo III',
    'Filipo el Árabe': 'Crisis del Siglo III', 'Decio': 'Crisis del Siglo III', 'Treboniano Galo': 'Crisis del Siglo III',
    'Emiliano': 'Crisis del Siglo III', 'Valeriano': 'Crisis del Siglo III', 'Galieno': 'Crisis del Siglo III',
    'Claudio II el Gótico': 'Crisis del Siglo III', 'Quintilo': 'Crisis del Siglo III', 'Aureliano': 'Crisis del Siglo III',
    'Tácito': 'Crisis del Siglo III', 'Floriano': 'Crisis del Siglo III', 'Probo': 'Crisis del Siglo III',
    'Caro': 'Crisis del Siglo III', 'Carino': 'Crisis del Siglo III', 'Numeriano': 'Crisis del Siglo III',
    'Diocleciano': 'Sin dinastía',
    'Constantino I': 'Constantiniana', 'Constantino II': 'Constantiniana', 'Constante I': 'Constantiniana',
    'Constancio II': 'Constantiniana', 'Juliano el Apóstata': 'Constantiniana',
    'Joviano': 'Sin dinastía',
    'Valentiniano I y Valente': 'Sin dinastía',
    'Teodosio I "el Grande"': 'Teodosiana', 'Honorio': 'Teodosiana', 'Constancio III': 'Teodosiana',
    'Valentiniano III': 'Teodosiana', 'Arcadio': 'Teodosiana', 'Teodosio II': 'Teodosiana', 'Marciano': 'Teodosiana',
    'Petronio Máximo': 'Sin dinastía', 'Avito': 'Sin dinastía', 'Mayoriano': 'Sin dinastía',
    'Libio Severo': 'Sin dinastía', 'Antemio': 'Sin dinastía', 'Olibrio': 'Sin dinastía',
    'Glicerio': 'Sin dinastía', 'Julio Nepote': 'Sin dinastía', 'Rómulo Augústulo': 'Sin dinastía',
    'León I "el Tracio"': 'Leonina (Tracia)', 'León II': 'Leonina (Tracia)', 'Zenón': 'Leonina (Tracia)',
    'Anastasio I': 'Leonina (Tracia)',
    'Justino I': 'Justiniana', 'Justiniano I "el Grande"': 'Justiniana', 'Justino II': 'Justiniana',
    'Tiberio II Constantino': 'Justiniana', 'Mauricio': 'Justiniana',
    'Focas': 'Sin dinastía',
    'Heraclio': 'Heráclida', 'Constantino III y Heraclonas': 'Heráclida', 'Constante II': 'Heráclida',
    'Constantino IV': 'Heráclida', 'Justiniano II "el de la Nariz Cortada"': 'Heráclida',
    'Leoncio': 'Sin dinastía', 'Tiberio III': 'Sin dinastía', 'Filípico Bardanes': 'Sin dinastía',
    'Anastasio II': 'Sin dinastía', 'Teodosio III': 'Sin dinastía',
    'León III "el Isaurio"': 'Isáurica', 'Constantino V "Coprónimo"': 'Isáurica', 'León IV "el Jázaro"': 'Isáurica',
    'Constantino VI': 'Isáurica', 'Irene de Atenas': 'Isáurica',
    'Nicéforo I': 'De Nicéforo I', 'Estauracio': 'De Nicéforo I', 'Miguel I Rangabé': 'De Nicéforo I',
    'León V "el Armenio"': 'Sin dinastía',
    'Miguel II "el Tartamudo"': 'Amoriana', 'Teófilo': 'Amoriana', 'Miguel III "el Ebrio"': 'Amoriana',
    'Basilio I "el Macedonio"': 'Macedonia', 'León VI "el Sabio"': 'Macedonia', 'Alejandro': 'Macedonia',
    'Constantino VII "Porfirogéneta"': 'Macedonia', 'Romano II': 'Macedonia', 'Nicéforo II Focas': 'Macedonia',
    'Juan I Tzimisces': 'Macedonia', 'Basilio II "el Matabúlgaros"': 'Macedonia', 'Constantino VIII': 'Macedonia',
    'Romano III Argiro': 'Macedonia', 'Miguel IV "el Paflagonio"': 'Macedonia', 'Miguel V "Calafates"': 'Macedonia',
    'Zoe y Teodora': 'Macedonia', 'Constantino IX Monómaco': 'Macedonia', 'Teodora': 'Macedonia', 'Miguel VI': 'Macedonia',
    'Isaac I Comneno': 'Sin dinastía',
    'Constantino X Ducas': 'Ducas', 'Romano IV Diógenes': 'Ducas', 'Miguel VII Ducas': 'Ducas',
    'Nicéforo III Botaniates': 'Sin dinastía',
    'Alejo I Comneno': 'Comnena', 'Juan II Comneno "el Bello"': 'Comnena', 'Manuel I Comneno': 'Comnena',
    'Alejo II Comneno': 'Comnena', 'Andrónico I Comneno': 'Comnena',
    'Isaac II Ángelo': 'Ángelo', 'Alejo III Ángelo': 'Ángelo', 'Alejo IV Ángelo': 'Ángelo',
    'Alejo V Murzuflo': 'Sin dinastía',
    'Teodoro I Láscaris': 'Láscaris', 'Juan III Ducas Vatatzés': 'Láscaris', 'Teodoro II Láscaris': 'Láscaris',
    'Juan IV Láscaris': 'Láscaris',
    'Miguel VIII Paleólogo': 'Paleóloga', 'Andrónico II Paleólogo': 'Paleóloga', 'Andrónico III Paleólogo': 'Paleóloga',
    'Juan V Paleólogo': 'Paleóloga', 'Juan VI Cantacuceno': 'Sin dinastía',
    'Andrónico IV Paleólogo': 'Paleóloga', 'Juan VII Paleólogo': 'Paleóloga', 'Manuel II Paleólogo': 'Paleóloga',
    'Juan VIII Paleólogo': 'Paleóloga', 'Constantino XI Paleólogo': 'Paleóloga'
  };

  // Categorías curadas: hechos históricos puntuales (no derivables de los datos existentes).
  const CURATED = [
    {
      id: 'dacia', label: 'Tuvo a Dacia como provincia',
      names: ['Trajano','Adriano','Antonino Pío','Marco Aurelio','Cómodo','Pértinax','Didio Juliano',
        'Pescenio Níger','Clodio Albino','Septimio Severo','Caracalla','Heliogábalo','Alejandro Severo',
        'Maximino el Tracio','Gordiano I','Gordiano II','Pupieno','Balbino','Gordiano III','Filipo el Árabe',
        'Decio','Treboniano Galo','Emiliano','Valeriano','Galieno','Claudio II el Gótico','Quintilo','Aureliano']
    },
    {
      id: 'britania', label: 'Tuvo a Britania como provincia',
      names: ['Claudio','Nerón','Galba','Otón','Vitelio','Vespasiano','Tito','Domiciano','Nerva','Trajano',
        'Adriano','Antonino Pío','Marco Aurelio','Cómodo','Pértinax','Didio Juliano','Pescenio Níger','Clodio Albino',
        'Septimio Severo','Caracalla','Heliogábalo','Alejandro Severo','Maximino el Tracio','Gordiano I','Gordiano II',
        'Pupieno','Balbino','Gordiano III','Filipo el Árabe','Decio','Treboniano Galo','Emiliano','Valeriano','Galieno',
        'Claudio II el Gótico','Quintilo','Aureliano','Tácito','Floriano','Probo','Caro','Carino','Numeriano',
        'Diocleciano','Constantino I','Constantino II','Constante I','Constancio II','Juliano el Apóstata','Joviano',
        'Valentiniano I y Valente','Teodosio I "el Grande"','Honorio']
    },
    {
      id: 'persecucion', label: 'Persiguió activamente a los cristianos',
      names: ['Nerón','Decio','Valeriano','Diocleciano']
    },
    {
      id: 'concilio', label: 'Convocó un concilio ecuménico',
      names: ['Constantino I','Teodosio I "el Grande"','Marciano','Justiniano I "el Grande"','Constantino IV','Irene de Atenas']
    },
    {
      id: 'peste', label: 'Reinó durante una gran epidemia',
      names: ['Valeriano','Galieno','Justiniano I "el Grande"']
    },
    {
      id: 'obra', label: 'Construyó una obra pública que aún se conserva',
      names: ['Vespasiano','Tito','Adriano','Trajano','Justiniano I "el Grande"','Teodosio II']
    },
    {
      id: 'cedio', label: 'Cedió o abandonó territorio voluntariamente',
      names: ['Adriano','Aureliano','Joviano']
    },
    {
      id: 'nino', label: 'Asumió el trono siendo niño',
      names: ['Gordiano III','León II','Constantino VI','Juan IV Láscaris','Juan V Paleólogo']
    }
  ];

  function stripAccents(s){ return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function foldLower(s){ return stripAccents(s || '').toLowerCase(); }
  function foldKey(s){ return foldLower(s).replace(/[^a-z]/g, ''); }

  function toRoman(num){
    const vals = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
    let n = num, out = '';
    for(let i=0;i<vals.length;i++){ while(n >= vals[i][0]){ out += vals[i][1]; n -= vals[i][0]; } }
    return out;
  }
  function parsePeriodo(periodo){
    const nums = (periodo.match(/\d+/g) || []).map(Number);
    const hasBC = /a\.C\./.test(periodo);
    if(!nums.length) return { startYear: 0, startBC: false, durationYears: 0 };
    const startYear = nums[0];
    let duration = 0;
    if(nums.length === 1){ duration = 0; }
    else if(hasBC && nums.length === 2){ duration = nums[0] + nums[1] - 1; }
    else { for(let i=0;i+1<nums.length;i+=2){ duration += (nums[i+1]-nums[i]); } }
    return { startYear: startYear, startBC: hasBC, durationYears: duration };
  }
  function centuryLabel(startYear, startBC){
    const c = Math.ceil(startYear / 100) || 1;
    return 'Siglo ' + toRoman(c) + (startBC ? ' a.C.' : ' d.C.');
  }
  function durationBucket(years){
    if(years <= 0) return 'Reinado brevísimo (menos de 1 año)';
    if(years <= 5) return 'Reinado corto (1 a 5 años)';
    if(years <= 15) return 'Reinado medio (6 a 15 años)';
    if(years <= 30) return 'Reinado largo (16 a 30 años)';
    return 'Reinado muy largo (más de 30 años)';
  }
  function fateOf(texto){
    const t = foldLower(texto || '');
    if(/se suicid|suicidio/.test(t)) return 'Se suicidó';
    if(/asesin|fue ejecutad|lo ejecutaron|decapitad|estrangul|apunal|linch|envenenad|ahogad|degollad/.test(t)) return 'Fue asesinado';
    if(/muri[oo][^.]{0,40}(combate|batalla)|cay[oi][oó]?[^.]{0,20}(combate|luchando)|muerto en (combate|batalla)/.test(t)) return 'Murió en combate';
    if(/abdic|fue depuesto|depuesto por|renunci[oó] al trono/.test(t)) return 'Fue depuesto o abdicó';
    return 'Murió por enfermedad o causas naturales';
  }

  function buildPool(){
    const pool = [];
    ERAS.forEach(era=>{
      const list = (window.ROMA_DATA && window.ROMA_DATA[era]) || [];
      list.forEach(item=>{
        const clean = item.nombre.replace(/\s*"[^"]*"/g, '').trim();
        const p = parsePeriodo(item.periodo);
        pool.push({
          era: era, nombre: item.nombre, clean: clean, key: foldKey(clean),
          periodo: item.periodo, imagen: item.imagen, texto: item.texto,
          dinastia: DYNASTIES[item.nombre] || 'Sin dinastía',
          siglo: centuryLabel(p.startYear, p.startBC),
          duracion: durationBucket(p.durationYears),
          destino: fateOf(item.texto)
        });
      });
    });
    return pool;
  }

  const POOL = buildPool();
  function findByKey(key){ return POOL.find(p=> p.key === key) || null; }

  function buildCategories(){
    const cats = [];
    cats.push({ id:'era-imperio', label: ERA_LABELS.imperio, test: p=> p.era === 'imperio' });
    cats.push({ id:'era-occidente', label: ERA_LABELS.occidente, test: p=> p.era === 'occidente' });
    cats.push({ id:'era-bizantino', label: ERA_LABELS.bizantino, test: p=> p.era === 'bizantino' });

    Array.from(new Set(POOL.map(p=> p.dinastia))).forEach(d=>{
      if(d === 'Sin dinastía') return;
      cats.push({ id:'din-'+d, label: 'Dinastía ' + d, test: p=> p.dinastia === d });
    });
    Array.from(new Set(POOL.map(p=> p.siglo))).forEach(s=>{
      cats.push({ id:'siglo-'+s, label: s, test: p=> p.siglo === s });
    });
    Array.from(new Set(POOL.map(p=> p.duracion))).forEach(d=>{
      cats.push({ id:'dur-'+d, label: d, test: p=> p.duracion === d });
    });
    Array.from(new Set(POOL.map(p=> p.destino))).forEach(f=>{
      cats.push({ id:'fate-'+f, label: f, test: p=> p.destino === f });
    });
    CURATED.forEach(c=>{
      const set = new Set(c.names);
      cats.push({ id:'cur-'+c.id, label: c.label, test: p=> set.has(p.nombre) });
    });

    return cats.filter(c=> POOL.filter(c.test).length >= 3);
  }

  const CATEGORIES = buildCategories();

  // ----- PRNG determinista para la grilla del día -----
  function seedFromString(str){
    let h = 2166136261;
    for(let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function mulberry32(seed){
    let a = seed;
    return function(){
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function shuffleWith(arr, rng){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(rng() * (i+1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }
  function findMatching(cellCandidates){
    const n = cellCandidates.length;
    const order = cellCandidates.map((c,i)=>i).sort((a,b)=> cellCandidates[a].length - cellCandidates[b].length);
    const assignment = new Array(n).fill(null);
    const used = new Set();
    let steps = 0;
    function backtrack(idx){
      if(idx === n) return true;
      const cellIdx = order[idx];
      for(const key of cellCandidates[cellIdx]){
        if(used.has(key)) continue;
        steps++;
        if(steps > 200000) return false;
        used.add(key);
        assignment[cellIdx] = key;
        if(backtrack(idx+1)) return true;
        used.delete(key);
        assignment[cellIdx] = null;
      }
      return false;
    }
    return backtrack(0) ? assignment : null;
  }
  const pairCompatCache = new Map();
  function pairCompatible(catA, catB){
    const key = catA.id + '|' + catB.id;
    let cached = pairCompatCache.get(key);
    if(cached === undefined){
      cached = POOL.some(p=> catA.test(p) && catB.test(p));
      pairCompatCache.set(key, cached);
    }
    return cached;
  }

  // Arma filas/columnas por backtracking: descarta ramas incompatibles apenas
  // aparecen, en vez de sortear las 6 categorías a ciegas y recién chequear al final.
  function tryBuildRowsCols(shuffled){
    const rows = [];
    const cols = [];
    function backtrack(idx){
      if(rows.length === 3 && cols.length === 3) return true;
      if(idx >= shuffled.length) return false;
      const cat = shuffled[idx];
      if(rows.length < 3 && cols.every(c=> pairCompatible(cat, c))){
        rows.push(cat);
        if(backtrack(idx + 1)) return true;
        rows.pop();
      }
      if(cols.length < 3 && rows.every(r=> pairCompatible(r, cat))){
        cols.push(cat);
        if(backtrack(idx + 1)) return true;
        cols.pop();
      }
      return backtrack(idx + 1);
    }
    return backtrack(0) ? { rows: rows.slice(), cols: cols.slice() } : null;
  }

  function generateGrid(rng){
    for(let attempt = 0; attempt < 60; attempt++){
      const shuffled = shuffleWith(CATEGORIES, rng);
      const built = tryBuildRowsCols(shuffled);
      if(!built) continue;
      const cellCandidates = [];
      for(let r = 0; r < 3; r++){
        for(let c = 0; c < 3; c++){
          cellCandidates.push(POOL.filter(p=> built.rows[r].test(p) && built.cols[c].test(p)).map(p=> p.key));
        }
      }
      if(findMatching(cellCandidates)) return built;
    }
    return null;
  }

  function todayKey(){
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }

  // ----- Estado -----
  let mode = 'daily';
  let rows = [], cols = [];
  let cellAnswers = new Array(9).fill(null); // { key, nombre, imagen }
  let usedKeys = new Set();
  let wrongAttempts = 0;
  let activeCell = -1;
  let finished = false;

  const STORAGE_PROGRESS = 'grid_progress_v1';

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
        date: todayKey(), rowIds: rows.map(r=> r.id), colIds: cols.map(c=> c.id),
        cellAnswers: cellAnswers, wrongAttempts: wrongAttempts, finished: finished
      }));
    }catch(e){}
  }

  // ----- DOM -----
  const tableEl = document.getElementById('gridTable');
  const messageEl = document.getElementById('gridMessage');
  const modeLabel = document.getElementById('gridModeLabel');
  const randomBtn = document.getElementById('gridRandomBtn');
  const helpBtn = document.getElementById('gridHelpBtn');
  const helpOverlay = document.getElementById('gridHelpOverlay');
  const helpClose = document.getElementById('gridHelpClose');
  const resultOverlay = document.getElementById('gridResultOverlay');
  const resultClose = document.getElementById('gridResultClose');
  const resultContent = document.getElementById('gridResultContent');

  function setMessage(text, isError){
    messageEl.textContent = text || '';
    messageEl.classList.toggle('error', !!isError);
  }

  function cellHTML(idx){
    const cell = document.createElement('td');
    cell.className = 'grid-cell';
    cell.dataset.idx = idx;
    const answer = cellAnswers[idx];
    if(answer){
      cell.classList.add('filled');
      const fig = document.createElement('div');
      fig.className = 'grid-cell-answer';
      if(answer.imagen){
        const img = document.createElement('img');
        img.src = answer.imagen;
        img.alt = answer.nombre;
        img.onerror = ()=> img.remove();
        fig.appendChild(img);
      }
      const nm = document.createElement('span');
      nm.textContent = answer.nombre;
      fig.appendChild(nm);
      cell.appendChild(fig);
    } else if(activeCell === idx && !finished){
      cell.classList.add('active');
      const wrap = document.createElement('div');
      wrap.className = 'grid-cell-input-wrap';
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'grid-cell-input';
      input.placeholder = 'Nombre…';
      input.id = 'gridActiveInput';
      input.autocomplete = 'off';
      wrap.appendChild(input);
      const sugg = document.createElement('div');
      sugg.className = 'romandle-suggestions grid-suggestions';
      sugg.id = 'gridActiveSuggestions';
      wrap.appendChild(sugg);
      cell.appendChild(wrap);
      cell.addEventListener('click', (e)=> e.stopPropagation());
    } else {
      cell.classList.add('empty');
      cell.addEventListener('click', (e)=>{
        e.stopPropagation();
        if(finished) return;
        activeCell = idx;
        render();
        const el = document.getElementById('gridActiveInput');
        if(el) el.focus();
      });
    }
    return cell;
  }

  function render(){
    tableEl.innerHTML = '';
    const thead = document.createElement('tr');
    thead.appendChild(document.createElement('th'));
    cols.forEach(c=>{
      const th = document.createElement('th');
      th.className = 'grid-header';
      th.textContent = c.label;
      thead.appendChild(th);
    });
    tableEl.appendChild(thead);

    for(let r = 0; r < 3; r++){
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.className = 'grid-header grid-header-row';
      th.textContent = rows[r].label;
      tr.appendChild(th);
      for(let c = 0; c < 3; c++){
        tr.appendChild(cellHTML(r * 3 + c));
      }
      tableEl.appendChild(tr);
    }

    if(activeCell !== -1 && !cellAnswers[activeCell]){
      const input = document.getElementById('gridActiveInput');
      const sugg = document.getElementById('gridActiveSuggestions');
      if(input){
        input.addEventListener('input', ()=> renderSuggestions(input, sugg));
        input.addEventListener('keydown', (e)=>{
          if(e.key === 'Enter'){ e.preventDefault(); trySubmitActive(input.value); }
          else if(e.key === 'Escape'){ activeCell = -1; render(); }
        });
      }
    }
  }

  function renderSuggestions(input, sugg){
    const q = foldLower(input.value).trim();
    sugg.innerHTML = '';
    if(q.length < 2) return;
    const candidates = POOL.filter(p=> !usedKeys.has(p.key) && foldLower(p.clean).indexOf(q) !== -1).slice(0, 8);
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
      row.addEventListener('click', ()=> trySubmitActive(p.nombre));
      sugg.appendChild(row);
    });
  }

  function trySubmitActive(raw){
    if(activeCell === -1) return;
    const key = foldKey(raw);
    if(!key) return;
    const match = findByKey(key);
    if(!match){
      setMessage('No reconozco ese nombre de emperador.', true);
      return;
    }
    if(usedKeys.has(match.key)){
      setMessage('Ya usaste a ' + match.nombre + ' en otra celda.', true);
      return;
    }
    const r = Math.floor(activeCell / 3);
    const c = activeCell % 3;
    if(rows[r].test(match) && cols[c].test(match)){
      cellAnswers[activeCell] = { key: match.key, nombre: match.nombre, imagen: match.imagen };
      usedKeys.add(match.key);
      activeCell = -1;
      setMessage('');
      render();
      saveProgress();
      checkWin();
    } else {
      wrongAttempts++;
      setMessage(match.nombre + ' no cumple esa fila y columna.', true);
      saveProgress();
    }
  }

  function checkWin(){
    if(cellAnswers.every(a=> a)){
      finished = true;
      saveProgress();
      setTimeout(()=> showResult(), 300);
    }
  }

  function buildShareText(){
    const label = mode === 'daily' ? ('Grid Imperial ' + todayKey()) : 'Grid Imperial (práctica)';
    return label + ' — 9/9, ' + wrongAttempts + ' intentos fallidos';
  }

  function showResult(){
    resultContent.innerHTML = '';
    const title = document.createElement('p');
    title.className = 'romandle-result-title';
    title.textContent = '¡Completaste la grilla!';
    resultContent.appendChild(title);

    const score = document.createElement('p');
    score.className = 'romandle-result-periodo';
    score.textContent = wrongAttempts + ' intentos fallidos';
    resultContent.appendChild(score);

    const list = document.createElement('div');
    list.className = 'grid-result-list';
    for(let r = 0; r < 3; r++){
      for(let c = 0; c < 3; c++){
        const idx = r * 3 + c;
        const row = document.createElement('div');
        row.className = 'grid-result-item';
        row.innerHTML = '<strong>' + cellAnswers[idx].nombre + '</strong><br>' +
          '<span>' + rows[r].label + ' × ' + cols[c].label + '</span>';
        list.appendChild(row);
      }
    }
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
    finished = false;
    wrongAttempts = 0;
    cellAnswers = new Array(9).fill(null);
    usedKeys = new Set();
    activeCell = -1;
    setMessage('');
    modeLabel.textContent = mode === 'daily' ? 'Grilla del día' : 'Modo práctica (al azar)';

    if(mode === 'daily'){
      const rng = mulberry32(seedFromString('grid-' + todayKey()));
      const g = generateGrid(rng);
      rows = g.rows; cols = g.cols;
      const saved = loadProgress();
      if(saved && saved.rowIds && saved.rowIds.join() === rows.map(r=>r.id).join() && saved.colIds.join() === cols.map(c=>c.id).join()){
        cellAnswers = saved.cellAnswers || new Array(9).fill(null);
        wrongAttempts = saved.wrongAttempts || 0;
        finished = !!saved.finished;
        usedKeys = new Set(cellAnswers.filter(Boolean).map(a=> a.key));
      }
    } else {
      const rng = Math.random;
      const g = generateGrid(rng);
      rows = g.rows; cols = g.cols;
    }

    render();
    if(finished) setTimeout(()=> showResult(), 200);
  }

  randomBtn.addEventListener('click', ()=> startGame('practice'));
  helpBtn.addEventListener('click', ()=> helpOverlay.classList.add('open'));
  helpClose.addEventListener('click', ()=> helpOverlay.classList.remove('open'));
  helpOverlay.addEventListener('click', (e)=>{ if(e.target === helpOverlay) helpOverlay.classList.remove('open'); });
  resultClose.addEventListener('click', ()=> resultOverlay.classList.remove('open'));
  resultOverlay.addEventListener('click', (e)=>{ if(e.target === resultOverlay) resultOverlay.classList.remove('open'); });
  document.addEventListener('click', ()=>{
    if(activeCell !== -1 && !cellAnswers[activeCell]){
      activeCell = -1;
      render();
    }
  });

  startGame('daily');
})();
