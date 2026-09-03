/* Logica de la linea de tiempo. Usa window.ROMA_DATA (datos.js) y las constantes de mapas.js. */
(function(){
  const DATA = window.ROMA_DATA;
  let currentEra = 'monarquia';
  let currentIndex = 0;
  let lastSpqrEra = 'monarquia';

  function getList(era){
    if(era==='monarquia') return DATA.monarquia;
    if(era==='republica') return DATA.republica;
    if(era==='imperio') return DATA.imperio;
    if(era==='occidente') return DATA.occidente;
    return DATA.bizantino;
  }
  function getLabel(era, item){
    if(era==='republica'){
      const y = item.anio;
      return (y<0 ? Math.abs(y)+' a.C.' : y+' d.C.');
    }
    return item.periodo;
  }
  function getTitle(era, item){
    if(era==='republica') return item.titulo;
    return item.nombre;
  }
  function getPeriodoBadge(era, item){
    if(era==='republica'){
      const y = item.anio;
      return (y<0 ? Math.abs(y)+' a.C.' : y+' d.C.');
    }
    return item.periodo;
  }


  function parseStartYear(periodo){
    // Caso "27 a.C. – 14 d.C.": el primer número trae su propio sufijo pegado.
    let m = periodo.match(/^(\d+)\s*(a\.C\.|d\.C\.)/);
    if(m){
      const year = parseInt(m[1], 10);
      return m[2] === 'a.C.' ? -year : year;
    }
    // Caso "753–716 a.C." o "14–37 d.C.": el sufijo aparece una sola vez, al final,
    // y aplica a todo el rango.
    const numMatch = periodo.match(/(\d+)/);
    if(!numMatch) return null;
    const year = parseInt(numMatch[1], 10);
    const markers = periodo.match(/a\.C\.|d\.C\./g);
    if(!markers) return null;
    const lastMarker = markers[markers.length - 1];
    return lastMarker === 'a.C.' ? -year : year;
  }

  function findHito(hitos, year){
    if(year===null) return null;
    for(const h of hitos){
      if(year >= h.desde && year <= h.hasta) return h;
    }
    return null;
  }

  function getMapForEntry(era, item){
    let year, hitos;
    if(era === 'monarquia'){ year = parseStartYear(item.periodo); hitos = HITOS_MONARQUIA; }
    else if(era === 'republica'){ year = item.anio; hitos = HITOS_REPUBLICA; }
    else if(era === 'imperio'){ year = parseStartYear(item.periodo); hitos = HITOS_IMPERIO; }
    else if(era === 'occidente'){ year = parseStartYear(item.periodo); hitos = HITOS_OCCIDENTE; }
    else { year = parseStartYear(item.periodo); hitos = HITOS_BIZANTINO; }

    const h = findHito(hitos, year);
    if(!h) return null;
    return { url: h.mapa.url, credit: h.mapa.credit, caption: h.caption };
  }

  function renderRail(){
    const rail = document.getElementById('rail');
    rail.innerHTML = '';
    const list = getList(currentEra);
    const wide = (currentEra !== 'republica');
    list.forEach((item, idx)=>{
      const t = document.createElement('div');
      t.className = 'tick' + (wide ? ' wide' : '') + (idx===currentIndex ? ' selected' : '');
      t.dataset.idx = idx;
      const dot = document.createElement('div');
      dot.className='dot';
      const label = document.createElement('div');
      label.className='label';
      if(wide){
        const nombre = document.createElement('span');
        nombre.textContent = getTitle(currentEra,item);
        const fecha = document.createElement('span');
        fecha.className = 'label-fecha';
        fecha.textContent = getLabel(currentEra,item);
        label.append(nombre, document.createElement('br'), fecha);
      } else {
        label.textContent = getLabel(currentEra,item);
      }
      t.appendChild(dot);
      t.appendChild(label);
      t.addEventListener('click', ()=>{ selectIndex(idx, true); });
      rail.appendChild(t);
    });
  }

  const AVATAR_COLORS = ['#8a1f2b','#5c1a2b','#6a2280','#1f5c4d','#8a6d3b','#3d5a80','#7a3b12','#4b3f72'];
  function getInitials(name){
    if(!name) return '?';
    const clean = name.replace(/["“”].*?["“”]/g,'').replace(/\(.*?\)/g,'').trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    if(parts.length===0) return '?';
    if(parts.length===1) return parts[0].slice(0,2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  function hashColor(str){
    let h = 0;
    for(let i=0;i<str.length;i++){ h = str.charCodeAt(i) + ((h<<5)-h); }
    return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
  }
  function fillMiniGroup(group, img, caption, data){
    if(!data){ group.classList.add('hidden'); return; }
    group.classList.remove('hidden');
    caption.textContent = data.label || '';
    const circle = img.parentElement;
    let abbr = circle.querySelector('.portrait-abbr');
    if(data.imagen){
      circle.style.background = '';
      if(abbr) abbr.remove();
      img.style.display = '';
      img.src = data.imagen;
      img.style.opacity = 1;
    } else {
      img.style.display = 'none';
      img.removeAttribute('src');
      circle.style.background = hashColor(data.label || '?');
      if(!abbr){
        abbr = document.createElement('span');
        abbr.className = 'portrait-abbr';
        circle.appendChild(abbr);
      }
      abbr.textContent = data.abbr || getInitials(data.label);
    }
  }

  function renderPortrait(era, item){
    const box = document.getElementById('cardPortrait');
    const titleEl = document.getElementById('cardTitulo');
    const leftGroup = document.getElementById('cardPortraitLeftGroup');
    const rightGroup = document.getElementById('cardPortraitRightGroup');

    if(item.imagenes && item.imagenes.length){
      box.classList.add('hidden');
      titleEl.textContent = getTitle(era, item);

      fillMiniGroup(leftGroup, document.getElementById('cardPortraitLeftImg'),
        document.getElementById('cardPortraitLeftCaption'), item.imagenes[0]);
      fillMiniGroup(rightGroup, document.getElementById('cardPortraitRightImg'),
        document.getElementById('cardPortraitRightCaption'), item.imagenes[1]);
      return;
    }

    leftGroup.classList.add('hidden');
    rightGroup.classList.add('hidden');

    if(era === 'republica' && !item.imagen){
      box.classList.add('hidden');
      return;
    }
    box.classList.remove('hidden');
    const name = getTitle(era, item);
    box.style.background = hashColor(name);
    box.innerHTML = '';
    const span = document.createElement('span');
    span.textContent = getInitials(name);
    box.appendChild(span);
    if(item.imagen){
      const img = document.createElement('img');
      img.src = item.imagen;
      img.alt = name;
      img.onload = () => { img.style.opacity = 1; span.style.display='none'; };
      img.onerror = () => { img.remove(); };
      box.appendChild(img);
    }
  }

  function renderCard(){
    const list = getList(currentEra);
    const item = list[currentIndex];
    if(!item) return;
    document.getElementById('cardPeriodo').textContent = getPeriodoBadge(currentEra, item);
    document.getElementById('cardTitulo').textContent = getTitle(currentEra, item);
    renderPortrait(currentEra, item);
    document.getElementById('cardTexto').textContent = item.texto;
    document.getElementById('prevBtn').disabled = (currentIndex===0);
    document.getElementById('nextBtn').disabled = (currentIndex===list.length-1);

    const mapa = getMapForEntry(currentEra, item);
    const mapBox = document.getElementById('mapBox');
    if(mapa){
      document.getElementById('cardMapa').src = mapa.url;
      document.getElementById('cardMapaCaption').textContent = mapa.caption + ' (Fuente: ' + mapa.credit + ')';
      mapBox.style.display = 'block';
    } else {
      mapBox.style.display = 'none';
    }
  }

  function selectIndex(idx, scrollIntoView){
    currentIndex = idx;
    renderRail();
    renderCard();
    if(scrollIntoView){
      const el = document.querySelectorAll('.tick')[idx];
      if(el) el.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
    }
  }

  function setEra(era){
    currentEra = era;
    currentIndex = 0;
    const spqrEras = ['monarquia','republica','imperio'];
    if(spqrEras.includes(era)) lastSpqrEra = era;
    document.querySelectorAll('[data-era]').forEach(b=>{
      b.classList.toggle('active', b.dataset.era===era);
    });
    document.getElementById('spqrBtn').classList.toggle('active', spqrEras.includes(era));
    document.getElementById('jumpbar').style.display = (era==='republica') ? 'flex' : 'none';
    if(era!=='republica'){
      const cr = document.getElementById('consulResults');
      if(cr) cr.innerHTML = '';
    }
    document.getElementById('eras').style.display = spqrEras.includes(era) ? 'flex' : 'none';
    document.getElementById('conflictsBox').style.display = spqrEras.includes(era) ? 'block' : 'none';
    document.getElementById('conflictsBoxOccidente').style.display = (era==='occidente') ? 'block' : 'none';
    document.getElementById('conflictsBoxBizantino').style.display = (era==='bizantino') ? 'block' : 'none';
    document.body.classList.toggle('byz-theme', era==='bizantino');
    renderRail();
    renderCard();
    setTimeout(()=>{
      const scrollBox = document.getElementById('railScroll');
      scrollBox.scrollLeft = 0;
    },0);
  }

  document.querySelectorAll('[data-era]').forEach(b=>{
    b.addEventListener('click', ()=> setEra(b.dataset.era));
  });
  document.getElementById('spqrBtn').addEventListener('click', ()=> setEra(lastSpqrEra));

  document.getElementById('prevBtn').addEventListener('click', ()=>{
    if(currentIndex>0) selectIndex(currentIndex-1, true);
  });
  document.getElementById('nextBtn').addEventListener('click', ()=>{
    const list = getList(currentEra);
    if(currentIndex<list.length-1) selectIndex(currentIndex+1, true);
  });

  document.getElementById('jumpBtn').addEventListener('click', ()=>{
    const val = parseInt(document.getElementById('jumpYear').value, 10);
    if(isNaN(val)) return;
    const target = -val;
    const list = DATA.republica;
    let idx = list.findIndex(it=>it.anio===target);
    if(idx===-1){
      // find closest
      let best=0, bestDiff=Infinity;
      list.forEach((it,i)=>{
        const d = Math.abs(it.anio-target);
        if(d<bestDiff){bestDiff=d; best=i;}
      });
      idx = best;
    }
    selectIndex(idx, true);
  });
  document.getElementById('jumpYear').addEventListener('keydown', (e)=>{
    if(e.key==='Enter'){ document.getElementById('jumpBtn').click(); return; }
    if(e.key!=='ArrowUp' && e.key!=='ArrowDown') return;
    e.preventDefault();
    const input = e.target;
    let val = input.value==='' ? null : parseInt(input.value, 10);
    if(e.key==='ArrowUp'){
      val = (val===null) ? 509 : Math.max(27, val-1);
    } else {
      val = (val===null) ? 27 : Math.min(509, val+1);
    }
    input.value = val;
  });

  // ----- Buscador de consules (era republica) -----
  function foldText(s){
    return (s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
  }
  const CONSUL_PREFIX_RE = /^(primeros?\s+)?tribunos\s+consulares\s*:?\s*/i;
  const CONSUL_SKIP_RE = /^(segundo\s+decenvirato|primer\s+decenvirato|decenvirato|ausencia\b|interregno|anarqu|sin\s+c[oó]nsul|bloqueo|nuevo\s+bloqueo|[uú]ltima\s+secesi|c[oó]nsules\s+inciertos)/i;
  const CONSUL_ROLE_RE = /^(dictador|c[oó]nsul(\s+(unico|único|sufecto|suffecto))?|magister\s+equitum|prefecto|tribuno)\b/i;

  // Traduccion aproximada de nombres al latin (praenomina, gens, cognomina + heuristica).
  const LAT_MAP = {
  "acidino":"Acidinus","acilio":"Acilius","aemiliano":"Aemilianus","afranio":"Afranius",
  "africano":"Africanus","agripa":"Agrippa","ahala":"Ahala","albino":"Albinus","albo":"Albus",
  "alobrogico":"Allobrogicus","ambusto":"Ambustus","amintino":"Amintinus","anicio":"Anicius",
  "antonio":"Antonius","apio":"Appius","apuleyo":"Appuleius","apustio":"Apustius","aquilino":"Aquilinus",
  "aquilio":"Aquilius","arvina":"Arvina","asiatico":"Asiaticus","asina":"Asina","asinio":"Asinius",
  "aternio":"Aternius","atico":"Atticus","atilio":"Atilius","atratino":"Atratinus","aufidio":"Aufidius",
  "augurino":"Augurinus","aulio":"Aulius","aulo":"Aulus","aurelio":"Aurelius","aurunco":"Auruncus",
  "aventinense":"Aventinensis","axila":"Axilla","balbo":"Balbus","balearico":"Baliaricus",
  "barbato":"Barbatus","barbula":"Barbula","bebio":"Baebius","bestia":"Bestia","bibulo":"Bibulus",
  "blasion":"Blasio","blesio":"Blaesus","bruto":"Brutus","bubulco":"Bubulcus","bulbo":"Bulbus",
  "buteon":"Buteo","caeco":"Caecus","calaico":"Callaicus","calatino":"Calatinus","caldo":"Caldus",
  "caleno":"Calenus","calpurniano":"Calpurnianus","calpurnio":"Calpurnius","calvino":"Calvinus",
  "calvisio":"Calvisius","calvo":"Calvus","camerino":"Camerinus","camilo":"Camillus","canina":"Canina",
  "caninio":"Caninius","capitolino":"Capitolinus","caprario":"Caprarius","carbon":"Carbo",
  "carvilio":"Carvilius","casio":"Cassius","cassio":"Cassius","cato":"Cato","caton":"Cato",
  "catulo":"Catulus","caudex":"Caudex","caudice":"Caudex","caudine":"Caudinus","caudino":"Caudinus",
  "cayo":"Gaius","cecilio":"Caecilius","cedicio":"Caedicius","celer":"Celer","celio":"Caelius",
  "celiomontano":"Caelimontanus","censorino":"Censorinus","centon":"Cento","centumalo":"Centumalus",
  "cepion":"Caepio","cerco":"Cerco","cerretano":"Cerretanus","cesar":"Caesar","ceson":"Kaeso",
  "cesonino":"Caesoninus","cetego":"Cethegus","ciceron":"Cicero","cicurino":"Cicurinus","ciego":"Caecus",
  "cina":"Cinna","cincinato":"Cincinnatus","claudio":"Claudius","claudo":"Claudus","clelio":"Cloelius",
  "clepsina":"Clepsina","clodiano":"Clodianus","cluilio":"Cluilius","cneo":"Gnaeus","coceyo":"Cocceius",
  "colatino":"Collatinus","cominio":"Cominius","coritinesano":"Coritinesanus","cornelio":"Cornelius",
  "cornicen":"Cornicen","cornuto":"Cornutus","coruncanio":"Coruncanius","corvino":"Corvinus",
  "corvo":"Corvus","coso":"Cossus","cota":"Cotta","craso":"Crassus","creticus":"Creticus",
  "crispino":"Crispinus","crispo":"Crispus","crus":"Crus","curcio":"Curtius","curiacio":"Curiatius",
  "curio":"Curius","curion":"Curio","cursor":"Cursor","curvo":"Curvus","deciano":"Decianus",
  "decimo":"Decimus","decio":"Decius","delmatico":"Dalmaticus","dentato":"Dentatus","denter":"Denter",
  "dentro":"Denter","diademato":"Diadematus","didio":"Didius","dolabela":"Dolabella","domicio":"Domitius",
  "dorsuo":"Dorsuo","druso":"Drusus","duilio":"Duilius","ebucio":"Aebutius","eburno":"Eburnus",
  "elio":"Aelius","emiliano":"Aemilianus","emilio":"Aemilius","enobarbo":"Ahenobarbus","escaeva":"Scaeva",
  "escapula":"Scapula","escauro":"Scaurus","esceva":"Scaeva","escevola":"Scaevola","escipion":"Scipio",
  "escribonio":"Scribonius","espurino":"Spurinus","espurio":"Spurius","esquilino":"Esquilinus",
  "estrabon":"Strabo","estructo":"Structus","fabio":"Fabius","fabricio":"Fabricius","falto":"Falto",
  "fanio":"Fannius","fannio":"Fannius","fidenate":"Fidenas","figulo":"Figulus","filipo":"Philippus",
  "filo":"Philo","filon":"Philo","fimbria":"Fimbria","fisto":"Fistus","flaccinator":"Flaccinator",
  "flaco":"Flaccus","flama":"Flamma","flaminino":"Flamininus","flaminio":"Flaminius","flavio":"Flavius",
  "flavo":"Flavus","floro":"Florus","folio":"Folius","frugi":"Frugi","fulon":"Fullo","fulviano":"Fulvianus",
  "fulvio":"Fulvius","fundanio":"Fundanius","fundulo":"Fundulus","furio":"Furius","fuso":"Fusus",
  "gabinio":"Gabinius","galba":"Galba","galo":"Gallus","gayo":"Gaius","geganio":"Geganius",
  "gelio":"Gellius","gemino":"Geminus","genucio":"Genucius","geta":"Geta","glabrion":"Glabrio",
  "gneo":"Gnaeus","graco":"Gracchus","gurges":"Gurges","helva":"Helva","herenio":"Herennius",
  "herminio":"Herminius","hibrida":"Hybrida","hipseo":"Hypsaeus","hircio":"Hirtius","hispalo":"Hispallus",
  "horacio":"Horatius","hortalo":"Hortalus","hortensio":"Hortensius","hostilio":"Hostilius",
  "hosto":"Hostus","imperioso":"Imperiosus","inregilense":"Inregillensis","isaurico":"Isauricus","joven":"",
  "julio":"Iulius","julo":"Iulus","junio":"Iunius","juvencio":"Iuventius","labeon":"Labeo",
  "lactuca":"Lactuca","lactucino":"Lactucinus","lanato":"Lanatus","larcio":"Larcius","lars":"Lars",
  "lateranao":"Lateranus","laterano":"Lateranus","lelio":"Laelius","lenate":"Laenas","lentulo":"Lentulus",
  "lepido":"Lepidus","levino":"Laevinus","libon":"Libo","licinio":"Licinius","licino":"Licinus",
  "ligur":"Ligur","livianio":"Livienus","livio":"Livius","loculo":"Lucullus","longino":"Longinus",
  "longo":"Longus","lucio":"Lucius","lucrecio":"Lucretius","luculo":"Lucullus","lupo":"Lupus",
  "luscino":"Luscinus","lusco":"Luscus","luscon":"Lusco","lutacio":"Lutatius","macedonico":"Macedonicus",
  "macerino":"Macerinus","magno":"Magnus","malleolo":"Malleolus","maluginense":"Maluginensis",
  "mamercino":"Mamercinus","mamerco":"Mamercus","mamilio":"Mamilius","mancino":"Mancinus",
  "manilio":"Manilius","manio":"Manius","manlio":"Manlius","marcelino":"Marcellinus","marcelo":"Marcellus",
  "marcio":"Marcius","marco":"Marcus","mario":"Marius","mason":"Maso","maton":"Mato","maximo":"Maximus",
  "medulino":"Medullinus","megelo":"Megellus","melio":"Maelius","menenio":"Menenius","menio":"Maenius",
  "merenda":"Merenda","merula":"Merula","mesala":"Messalla","metelo":"Metellus","minucio":"Minucius",
  "montano":"Montanus","muciano":"Mucianus","mucio":"Mucius","mugilano":"Mugillanus","mumio":"Mummius",
  "munacio":"Munatius","murena":"Murena","mus":"Mus","musca":"Musca","muzio":"Mucius","nasica":"Nasica",
  "naucio":"Nautius","nautio":"Nautius","nepote":"Nepos","neron":"Nero","nerva":"Nerva","nigro":"Niger",
  "nobilior":"Nobilior","noctua":"Noctua","norbano":"Norbanus","numerio":"Numerius","numicio":"Numicius",
  "numidico":"Numidicus","numio":"Numius","octavio":"Octavius","ogulnio":"Ogulnius","opimio":"Opimius",
  "opiter":"Opiter","orestes":"Orestes","otacilio":"Otacilius","pacilo":"Pacilus","pansa":"Pansa",
  "papirio":"Papirius","papo":"Papus","paterculo":"Paterculus","paulo":"Paullus","pcilo":"Pacilus",
  "peno":"Poenus","perpenna":"Perpenna","petelio":"Petelius","petico":"Peticus","petilio":"Petilius",
  "petino":"Petinus","peto":"Paetus","pictor":"Pictor","pinario":"Pinarius","pio":"Pius","pison":"Piso",
  "planco":"Plancus","plaucio":"Plautius","plautio":"Plautius","poeno":"Poenus","polion":"Pollio",
  "pompeyo":"Pompeius","pomponio":"Pomponius","popilio":"Popillius","porcina":"Porcina","porcio":"Porcius",
  "postumio":"Postumius","postumo":"Postumus","potito":"Potitus","pretextato":"Praetextatus",
  "prisco":"Priscus","privernate":"Privernas","proculo":"Proculus","publicio":"Publicius",
  "publicola":"Poplicola","publilio":"Publilius","publio":"Publius","pulcro":"Pulcher","pulo":"Pullus",
  "pulvilo":"Pulvillus","pupio":"Pupius","purpurion":"Purpureo","quincio":"Quinctius",
  "quintilio":"Quinctilius","quinto":"Quintus","ravila":"Ravilla","regilense":"Regillensis",
  "regulo":"Regulus","rex":"Rex","roco":"Rocus","romilio":"Romilius","rufino":"Rufinus","rufo":"Rufus",
  "rulliano":"Rullianus","rupilio":"Rupilius","ruso":"Rufus","rutilio":"Rutilius","rutilo":"Rutilus",
  "sabino":"Sabinus","saco":"Saccus","salinator":"Salinator","sapiens":"Sapiens","saturnino":"Saturninus",
  "saverrio":"Saverrio","sceva":"Scaeva","sempronio":"Sempronius","ser":"Servius","serapion":"Serapio",
  "sergio":"Sergius","serrano":"Serranus","serviliano":"Servilianus","servilio":"Servilius",
  "servio":"Servius","sestilio":"Sextilius","sestio":"Sextius","sextilio":"Sextilius","sextio":"Sextius",
  "sexto":"Sextus","sicinio":"Sicinius","siculo":"Siculus","sila":"Sulla","silano":"Silanus",
  "sofo":"Sophus","sosio":"Sosius","spinter":"Spinther","stolon":"Stolo","sulpicio":"Sulpicius",
  "sura":"Sura","talna":"Talna","tanfilo":"Tamphilus","tapulo":"Tappulus","tarpeyo":"Tarpeius",
  "tarquinio":"Tarquinius","terencio":"Terentius","termo":"Thermus","tiberio":"Tiberius",
  "titinio":"Titinius","tito":"Titus","torcuato":"Torquatus","trebonio":"Trebonius","tremulo":"Tremulus",
  "tricipitino":"Tricipitinus","tricosto":"Tricostus","trigemino":"Trigeminus","tuberto":"Tubertus",
  "tucca":"Tucca","tuditano":"Tuditanus","tulio":"Tullius","tulo":"Tullus","turrino":"Turrinus",
  "tusco":"Tuscus","uritino":"Uritinus","valerio":"Valerius","varo":"Varus","varron":"Varro",
  "vatia":"Vatia","vaticano":"Vaticanus","vecelino":"Vecellinus","vennon":"Venno","venon":"Venno",
  "verginio":"Verginius","verrucoso":"Verrucosus","veturio":"Veturius","vibio":"Vibius",
  "vibulano":"Vibulanus","villio":"Villius","violento":"Violens","vipsanio":"Vipsanius",
  "virginio":"Verginius","visolo":"Visellus","vitulo":"Vitulus","volcacio":"Volcatius","voleron":"Volero",
  "voleyo":"Voleius","volsco":"Volscus","volumnio":"Volumnius","voluso":"Volusus","vopisco":"Vopiscus",
  "vulson":"Vulso"
  };
  const NAME_STOP = { de:1, la:1, el:1, y:1, del:1, los:1, las:1 };

  function latinizeToken(tok){
    const key = foldText(tok);
    if(NAME_STOP[key]) return '';
    if(Object.prototype.hasOwnProperty.call(LAT_MAP, key)) return LAT_MAP[key];
    let s = tok;
    const m = s.match(/^[Ee]s([cpqt])(.*)$/);
    if(m) s = (s[0]==='E' ? 'S' : 's') + m[1] + m[2];
    s = s.replace(/J/g,'I').replace(/j/g,'i');
    const END = [
      [/ci[oó]n$/i,'tio'], [/si[oó]n$/i,'sio'], [/[oó]n$/i,'o'],
      [/ense$/i,'ensis'], [/ate$/i,'as'],
      [/iano$/i,'ianus'], [/ano$/i,'anus'], [/ino$/i,'inus'],
      [/ico$/i,'icus'], [/oso$/i,'osus'],
      [/io$/i,'ius'], [/eo$/i,'eus'], [/o$/i,'us']
    ];
    for(let k=0;k<END.length;k++){
      if(END[k][0].test(s)){ s = s.replace(END[k][0], END[k][1]); break; }
    }
    s = s.normalize('NFD').replace(/[̀-ͯ]/g,'');
    if(/^[a-z]/.test(s) && /^[A-ZÁÉÍÓÚÜÑ]/.test(tok)){
      s = s.charAt(0).toUpperCase() + s.slice(1);
    }
    return s;
  }
  function latinizeName(name){
    return name.split(/\s+/).map(latinizeToken).filter(Boolean).join(' ');
  }

  let consulIndex = null;
  function buildConsulIndex(){
    const map = new Map();
    DATA.republica.forEach(item=>{
      let raw = (item.titulo || '')
        .replace(CONSUL_PREFIX_RE, '')
        .replace(/\([^)]*\)/g, '');
      if(CONSUL_SKIP_RE.test(raw)) return;
      raw.split(/\s*,\s*|\s+y\s+|\s+[—–]\s+/).forEach((part, partIdx)=>{
        let name = part.replace(/\s+/g,' ').trim();
        name = name.replace(/[.,;:·]+$/,'').trim();
        if(name.length < 3) return;
        if(CONSUL_ROLE_RE.test(name)) return;
        if(!/^[A-ZÁÉÍÓÚÜÑ]/.test(name)) return;
        const key = foldText(name);
        let g = map.get(key);
        if(!g){ g = { name: name, latin: latinizeName(name), years: [], portrait: null }; map.set(key, g); }
        if(g.years.indexOf(item.anio) === -1) g.years.push(item.anio);
        const imgData = item.imagenes && item.imagenes[partIdx];
        if(imgData && (!g.portrait || (imgData.imagen && !g.portrait.imagen))){
          g.portrait = imgData;
        }
      });
    });
    consulIndex = Array.from(map.values());
    consulIndex.forEach(g=> g.years.sort((a,b)=> a-b));
  }

  function yearLabel(y){ return (y<0 ? Math.abs(y)+' a.C.' : y+' d.C.'); }

  function jumpToYear(anio){
    const idx = DATA.republica.findIndex(it=> it.anio===anio);
    if(idx!==-1) selectIndex(idx, true);
  }

  function renderConsulResults(query){
    const box = document.getElementById('consulResults');
    box.innerHTML = '';
    const q = foldText(query).trim();
    if(q.length < 2) return;
    if(!consulIndex) buildConsulIndex();
    const matches = consulIndex
      .filter(g=> foldText(g.name).indexOf(q) !== -1 || foldText(g.latin).indexOf(q) !== -1)
      .sort((a,b)=> a.years[0] - b.years[0])
      .slice(0, 25);
    if(!matches.length){
      const p = document.createElement('p');
      p.className = 'consul-noresult';
      p.textContent = 'Sin resultados para "' + query.trim() + '".';
      box.appendChild(p);
      return;
    }
    matches.forEach(g=>{
      const row = document.createElement('div');
      row.className = 'consul-result';

      const circle = document.createElement('span');
      circle.className = 'portrait-circle';
      const p = g.portrait;
      if(p && p.imagen){
        const img = document.createElement('img');
        img.src = p.imagen;
        img.alt = g.name;
        img.onload = ()=>{ img.style.opacity = 1; };
        img.onerror = ()=>{
          img.remove();
          circle.style.background = hashColor(g.name);
          const s = document.createElement('span');
          s.textContent = getInitials(g.name);
          circle.appendChild(s);
        };
        circle.appendChild(img);
      } else {
        circle.style.background = hashColor(g.name);
        const s = document.createElement('span');
        s.textContent = (p && p.abbr) ? p.abbr : getInitials(g.name);
        circle.appendChild(s);
      }
      row.appendChild(circle);

      const body = document.createElement('div');
      body.className = 'consul-result-body';
      const nm = document.createElement('span');
      nm.className = 'consul-result-name';
      nm.textContent = g.name;
      body.appendChild(nm);

      if(g.latin && foldText(g.latin) !== foldText(g.name)){
        const lat = document.createElement('span');
        lat.className = 'consul-result-latin';
        lat.textContent = g.latin;
        body.appendChild(lat);
      }

      const years = document.createElement('div');
      years.className = 'consul-result-years';
      g.years.forEach(y=>{
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'consul-year-btn';
        b.textContent = yearLabel(y);
        b.addEventListener('click', ()=> jumpToYear(y));
        years.appendChild(b);
      });
      body.appendChild(years);
      row.appendChild(body);
      box.appendChild(row);
    });
  }

  const consulInput = document.getElementById('jumpConsul');
  if(consulInput){
    consulInput.addEventListener('input', ()=> renderConsulResults(consulInput.value));
  }

  // init
  setEra('monarquia');
})();
