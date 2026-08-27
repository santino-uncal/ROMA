/* Hitos territoriales y mapas historicos por era.
   Estas constantes quedan en el ambito global y las usa js/app.js. */
// ===== Hitos territoriales: mapas históricos reales de Wikimedia Commons =====

const CONQUISTA_ITALIA = {
  url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Roman%20conquest%20of%20Italy.PNG?width=700',
  credit: 'Javierfv1212, dominio público — Wikimedia Commons'
};
const SEPTIMONTIUM_ROMULO = {
  url: 'assets/img/septimontium-romulo.png',
  credit: 'Mapa del Septimontium bajo Rómulo (imagen provista por el usuario)'
};
const SEPTIMONTIUM_REYES = {
  url: 'assets/img/septimontium-reyes-posteriores.png',
  credit: 'Mapa del Septimontium ampliado (imagen provista por el usuario)'
};
const REPUBLICA_60AC = {
  url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Roman%20republic,%20territory%2060%20BC.svg?width=700',
  credit: 'Ifly6, CC BY-SA — Wikimedia Commons'
};
const REPUBLICA_44AC = {
  url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Roman%20republic,%20territory%2044%20BC.svg?width=700',
  credit: 'Ifly6, CC BY-SA — Wikimedia Commons'
};
const IMPERIO_TRAJANO = {
  url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Roman%20Empire%20Trajan%20117AD.png?width=700',
  credit: 'Wikimedia Commons (dominio del mapa: extensión bajo Trajano, 117 d.C.)'
};
const IMPERIO_400 = {
  url: 'https://commons.wikimedia.org/wiki/Special:FilePath/The%20Roman%20Empire%20ca.%20400%20AD.svg?width=700',
  credit: 'Wikimedia Commons'
};
const OCCIDENTE_476 = {
  url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Western%20and%20Eastern%20Roman%20Empires%20476AD-es.svg?width=700',
  credit: 'Wikimedia Commons'
};
const BIZANCIO_JUSTINIANO = {
  url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Justinian555AD.png?width=700',
  credit: 'Wikimedia Commons (extensión bajo Justiniano I, 555 d.C., tras la reconquista)'
};
const BIZANCIO_1025 = {
  url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Map%20Byzantine%20Empire%201025-es.svg?width=700',
  credit: 'Wikimedia Commons (extensión bajo Basilio II, 1025 d.C.)'
};

// Rangos de años (numeración astronómica: negativo = a.C.) por era.
// Cada hito: {desde, hasta, mapa, caption}
const HITOS_MONARQUIA = [
  { desde:-753, hasta:-716, mapa:SEPTIMONTIUM_ROMULO,
    caption:'El Septimontium bajo Rómulo: la Roma primitiva organizada como una federación de asentamientos sobre las colinas y montes originales (Cermalus, Palatium, Velia, Fagutal, Subura, Cispius, Oppius, entre otros), antes de la unificación posterior en una sola ciudad amurallada.' },
  { desde:-715, hasta:-509, mapa:SEPTIMONTIUM_REYES,
    caption:'El Septimontium ampliado bajo los reyes posteriores a Rómulo (Numa Pompilio, Tulio Hostilio, Anco Marcio, Tarquinio Prisco, Servio Tulio y Tarquinio el Soberbio): el territorio urbano crece incorporando el Aventino y el área de Caelius/Querquetulanus, reflejando la expansión de la ciudad antes de la fundación de la República.' }
];

const HITOS_REPUBLICA = [
  { desde:-509, hasta:-339, mapa:CONQUISTA_ITALIA,
    caption:'Color "500 BC" (el más oscuro): Roma controla solo la ciudad y el Lacio cercano, en guerra intermitente con etruscos y latinos vecinos.' },
  { desde:-338, hasta:-299, mapa:CONQUISTA_ITALIA,
    caption:'Color rojo ("338 BC"): tras la Guerra Latina, Roma disuelve la Liga Latina y domina el Lacio y Campania.' },
  { desde:-298, hasta:-291, mapa:CONQUISTA_ITALIA,
    caption:'Color rosa ("298 BC"): inicio de la Tercera Guerra Samnita, con Roma expandiéndose hacia el centro de Italia.' },
  { desde:-290, hasta:-273, mapa:CONQUISTA_ITALIA,
    caption:'Color naranja ("290 BC"): fin de la Tercera Guerra Samnita, Roma domina buena parte de Italia central.' },
  { desde:-272, hasta:-265, mapa:CONQUISTA_ITALIA,
    caption:'Color naranja claro ("272 BC"): tras vencer a Pirro, Roma controla toda la Italia peninsular.' },
  { desde:-264, hasta:-219, mapa:CONQUISTA_ITALIA,
    caption:'Color amarillo ("264 BC"): inicio de la Primera Guerra Púnica, con Roma ya dueña de toda Italia y expandiéndose a Sicilia.' },
  { desde:-218, hasta:-201, mapa:CONQUISTA_ITALIA,
    caption:'Color verde ("218 BC"): inicio de la Segunda Guerra Púnica, con Aníbal invadiendo Italia. Roma ya controla Sicilia, Cerdeña y Córcega.' },
  { desde:-200, hasta:-92, mapa:REPUBLICA_60AC,
    caption:'No hay un mapa real año por año para este tramo; se usa como referencia el mapa verificado más cercano (territorio hacia el 60 a.C.). Entre el 200 y el 92 a.C. Roma fue incorporando progresivamente Hispania, Macedonia, Grecia y el norte de África tras las guerras púnicas y macedónicas.' },
  { desde:-91, hasta:-60, mapa:REPUBLICA_60AC,
    caption:'Territorio romano hacia el 60 a.C.: tras las conquistas de Pompeyo en Oriente (Siria, Ponto) y el fin de la Guerra Social, el dominio romano cubre casi todo el Mediterráneo.' },
  { desde:-59, hasta:-27, mapa:REPUBLICA_44AC,
    caption:'Territorio romano hacia el 44 a.C., ya con la Galia conquistada por César. Se mantuvo prácticamente igual durante las guerras civiles finales hasta la anexión de Egipto en el 30 a.C.' }
];

const HITOS_IMPERIO = [
  { desde:-27, hasta:116, mapa:IMPERIO_TRAJANO,
    caption:'Referencia: extensión del Imperio cerca de su máximo (117 d.C., bajo Trajano). El imperio de Augusto era bastante menor —sin Britania, Dacia ni la frontera del Éufrates—, y fue creciendo con cada emperador hasta llegar a este punto.' },
  { desde:117, hasta:283, mapa:IMPERIO_TRAJANO,
    caption:'El Imperio en su máxima extensión (117 d.C., bajo Trajano). Adriano se replegó de algunas conquistas orientales, pero las fronteras se mantuvieron aproximadamente así hasta la Crisis del Siglo III.' },
  { desde:284, hasta:395, mapa:IMPERIO_400,
    caption:'El Imperio hacia el 400 d.C., ya estabilizado tras la Tetrarquía y las reformas de Diocleciano y Constantino, poco antes de la división definitiva entre Oriente y Occidente.' }
];

const HITOS_OCCIDENTE = [
  { desde:395, hasta:454, mapa:IMPERIO_400,
    caption:'El Imperio de Occidente hacia el 400 d.C., recién separado de Oriente, todavía con Britania, Hispania, la Galia y el norte de África bajo su control.' },
  { desde:455, hasta:476, mapa:OCCIDENTE_476,
    caption:'El Imperio de Occidente en el 476 d.C., reducido prácticamente a Italia tras las pérdidas ante vándalos, visigodos y otros pueblos germánicos, justo antes de su caída definitiva.' }
];

const HITOS_BIZANTINO = [
  { desde:395, hasta:526, mapa:IMPERIO_400,
    caption:'El Imperio de Oriente hacia el 400 d.C., recién separado de Occidente, heredero directo de las provincias orientales del Imperio Romano.' },
  { desde:527, hasta:716, mapa:BIZANCIO_JUSTINIANO,
    caption:'El Imperio bizantino en su máxima extensión bajo Justiniano I (555 d.C.), tras la reconquista de Italia, el norte de África y el sur de Hispania. Gran parte de estas ganancias se perdería en los siglos siguientes frente a lombardos y árabes.' },
  { desde:717, hasta:1203, mapa:BIZANCIO_1025,
    caption:'El Imperio bizantino bajo Basilio II (1025 d.C.), en su apogeo posterior tras la recuperación de la dinastía macedonia: Bulgaria anexada y el imperio nuevamente fuerte en los Balcanes y Anatolia.' },
  { desde:1204, hasta:1453, mapa:BIZANCIO_1025,
    caption:'No hay un mapa real confirmado para esta etapa final; se muestra como referencia el imperio en 1025, en su apogeo previo. En 1204 Constantinopla cayó ante la Cuarta Cruzada y el imperio se fragmentó en estados sucesores (Nicea, Epiro, Trebisonda); fue restaurado en 1261 pero ya reducido, hasta su caída definitiva en 1453.' }
];
