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
      label.textContent = wide ? (getTitle(currentEra,item) + '\\n' + getLabel(currentEra,item)) : getLabel(currentEra,item);
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
  function renderPortrait(era, item){
    const box = document.getElementById('cardPortrait');
    const titleEl = document.getElementById('cardTitulo');
    const leftGroup = document.getElementById('cardPortraitLeftGroup');
    const rightGroup = document.getElementById('cardPortraitRightGroup');

    if(item.imagenes && item.imagenes.length){
      box.classList.add('hidden');
      titleEl.textContent = getTitle(era, item);

      const left = item.imagenes[0];
      const right = item.imagenes[1];

      if(left){
        leftGroup.classList.remove('hidden');
        const limg = document.getElementById('cardPortraitLeftImg');
        limg.src = left.imagen;
        limg.style.opacity = 1;
        document.getElementById('cardPortraitLeftCaption').textContent = left.label;
      } else {
        leftGroup.classList.add('hidden');
      }

      if(right){
        rightGroup.classList.remove('hidden');
        const rimg = document.getElementById('cardPortraitRightImg');
        rimg.src = right.imagen;
        rimg.style.opacity = 1;
        document.getElementById('cardPortraitRightCaption').textContent = right.label;
      } else {
        rightGroup.classList.add('hidden');
      }
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

  // init
  setEra('monarquia');
})();
