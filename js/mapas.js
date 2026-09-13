/* Hitos territoriales y mapas historicos por era.
   Estas constantes quedan en el ambito global y las usa js/app.js. */
// ===== Hitos territoriales: mapas históricos reales de Wikimedia Commons =====

const SEPTIMONTIUM_ROMULO = {
  url: 'assets/img/septimontium-romulo.png',
  credit: 'Mapa del Septimontium bajo Rómulo (imagen provista por el usuario)'
};
const SEPTIMONTIUM_REYES = {
  url: 'assets/img/septimontium-reyes-posteriores.png',
  credit: 'Mapa del Septimontium ampliado (imagen provista por el usuario)'
};
const REP_509_500 = { url: 'assets/509 - 500.png', credit: 'Imagen provista por el usuario' };
const REP_499_435 = { url: 'assets/499 - 435.png', credit: 'Imagen provista por el usuario' };
const REP_434_341 = { url: 'assets/434 - 341.png', credit: 'Imagen provista por el usuario' };
const REP_341_335 = { url: 'assets/341-335.png', credit: 'Imagen provista por el usuario' };
const REP_335_304 = { url: 'assets/335 - 304.png', credit: 'Imagen provista por el usuario' };
const REP_304_298 = { url: 'assets/304 - 298.png', credit: 'Imagen provista por el usuario' };
const REP_298_296 = { url: 'assets/298 - 296.png', credit: 'Imagen provista por el usuario' };
const REP_296_290 = { url: 'assets/296 - 290.png', credit: 'Imagen provista por el usuario' };
const REP_290_272 = { url: 'assets/290 - 272.png', credit: 'Imagen provista por el usuario' };
const REP_272_241 = { url: 'assets/272 - 241.png', credit: 'Imagen provista por el usuario' };
const REP_241_228 = { url: 'assets/241-228.png', credit: 'Imagen provista por el usuario' };
const REP_228_201 = { url: 'assets/228-201.png', credit: 'Imagen provista por el usuario' };
const REP_201_178 = { url: 'assets/201-178.png', credit: 'Imagen provista por el usuario' };
const REP_178_146 = { url: 'assets/178-146.png', credit: 'Imagen provista por el usuario' };
const REP_146_133 = { url: 'assets/146-133.png', credit: 'Imagen provista por el usuario' };
const REP_133_129 = { url: 'assets/133-129.png', credit: 'Imagen provista por el usuario' };
const REP_129_105 = { url: 'assets/129-105.png', credit: 'Imagen provista por el usuario' };
const REP_105_85 = { url: 'assets/105-85.png', credit: 'Imagen provista por el usuario' };
const REP_85_80 = { url: 'assets/85-80.png', credit: 'Imagen provista por el usuario' };
const REP_80_72 = { url: 'assets/80 - 72.png', credit: 'Imagen provista por el usuario' };
const REP_72_63 = { url: 'assets/72-63.png', credit: 'Imagen provista por el usuario' };
const REP_63_50 = { url: 'assets/63-50.png', credit: 'Imagen provista por el usuario' };
const REP_50_47 = { url: 'assets/50-47.png', credit: 'Imagen provista por el usuario' };
const REP_47_31 = { url: 'assets/47-31.png', credit: 'Imagen provista por el usuario' };
const REP_31_27 = { url: 'assets/31-27.png', credit: 'Imagen provista por el usuario' };
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
  { desde:-509, hasta:-500, mapa:REP_509_500,
    caption:'Los primeros años de la República: Roma controla apenas la ciudad y el Lacio inmediato, en conflicto con los etruscos de Lars Porsena y los pueblos latinos y sabinos vecinos.' },
  { desde:-499, hasta:-435, mapa:REP_499_435,
    caption:'Roma consolida su posición en el Lacio tras la batalla del lago Regilo (496 a.C.) y la Liga Latina; luchas constantes contra volscos, ecuos y sabinos, mientras crece la tensión con la vecina Veyes.' },
  { desde:-434, hasta:-341, mapa:REP_434_341,
    caption:'Se libran las guerras contra Veyes, que cae en el 396 a.C. tras un largo asedio; poco después Roma sufre el saqueo galo de Breno (390 a.C.) pero se recupera y libra la Primera Guerra Samnita.' },
  { desde:-341, hasta:-335, mapa:REP_341_335,
    caption:'Tras la Primera Guerra Samnita, estalla la Guerra Latina (340-338 a.C.): Roma vence a sus antiguos aliados y disuelve la Liga Latina en el 338 a.C., anexando directamente buena parte del Lacio.' },
  { desde:-335, hasta:-304, mapa:REP_335_304,
    caption:'Segunda Guerra Samnita (326-304 a.C.): Roma se expande hacia Campania y el centro de Italia, pese al desastre inicial de las Horcas Caudinas (321 a.C.).' },
  { desde:-304, hasta:-298, mapa:REP_304_298,
    caption:'Breve paz con los samnitas tras el final de la Segunda Guerra Samnita; se construye la Vía Apia (312 a.C.) y Roma consolida el territorio conquistado en Campania.' },
  { desde:-298, hasta:-296, mapa:REP_298_296,
    caption:'Estalla la Tercera Guerra Samnita: samnitas, galos, etruscos y umbros se coaligan contra Roma, que resiste el empuje conjunto en el centro de Italia.' },
  { desde:-296, hasta:-290, mapa:REP_296_290,
    caption:'Roma derrota a la coalición itálica en Sentino (295 a.C.) y pone fin a la Tercera Guerra Samnita en el 290 a.C., dominando ya la mayor parte de Italia central.' },
  { desde:-290, hasta:-272, mapa:REP_290_272,
    caption:'Guerra Pírrica (280-275 a.C.): Pirro de Epiro desembarca en el sur de Italia en apoyo de Tarento, pero es finalmente derrotado; Tarento cae en el 272 a.C. y Roma domina toda la península itálica.' },
  { desde:-272, hasta:-241, mapa:REP_272_241,
    caption:'Con Italia peninsular bajo su control, Roma libra la Primera Guerra Púnica (264-241 a.C.) contra Cartago por el dominio de Sicilia, que termina anexando como su primera provincia.' },
  { desde:-241, hasta:-228, mapa:REP_241_228,
    caption:'Entre guerras, Roma aprovecha una revuelta de mercenarios para arrebatarle a Cartago Cerdeña y Córcega (238 a.C.) e inicia las Guerras Ilirias contra la piratería en el Adriático.' },
  { desde:-228, hasta:-201, mapa:REP_228_201,
    caption:'Segunda Guerra Púnica (218-201 a.C.): Aníbal cruza los Alpes e invade Italia, pero Roma resiste y termina venciendo en Zama, expulsando a Cartago de Hispania.' },
  { desde:-201, hasta:-178, mapa:REP_201_178,
    caption:'Tras derrotar a Cartago, Roma se enfrenta a Macedonia (Segunda Guerra Macedónica, 200-197 a.C.) y comienza a establecerse en Hispania y el Adriático oriental.' },
  { desde:-178, hasta:-146, mapa:REP_178_146,
    caption:'Tercera Guerra Macedónica (171-168 a.C.) y destrucción de Corinto y Cartago en el 146 a.C.: Macedonia y Acaya se convierten en provincias y Cartago desaparece tras la Tercera Guerra Púnica.' },
  { desde:-146, hasta:-133, mapa:REP_146_133,
    caption:'Tras la caída de Cartago y Corinto, Roma somete la resistencia numantina en Hispania (133 a.C.) y recibe en herencia el reino de Pérgamo de manos de Atalo III.' },
  { desde:-133, hasta:-129, mapa:REP_133_129,
    caption:'Se organiza la nueva provincia de Asia a partir del legado de Atalo III de Pérgamo, mientras en Roma comienzan las reformas agrarias de los hermanos Graco.' },
  { desde:-129, hasta:-105, mapa:REP_129_105,
    caption:'Roma funda la provincia de Galia Narbonense en el sur de las Galias (121 a.C.) y se involucra en la Guerra de Yugurta en Numidia, al tiempo que crece la amenaza de cimbrios y teutones.' },
  { desde:-105, hasta:-85, mapa:REP_105_85,
    caption:'Reformas militares de Mario, victoria sobre cimbrios y teutones, la Guerra Social (91-88 a.C.) que otorga la ciudadanía a los itálicos, y el estallido de la Primera Guerra Mitridática.' },
  { desde:-85, hasta:-80, mapa:REP_85_80,
    caption:'Fin de la Primera Guerra Mitridática (paz de Dárdano, 85 a.C.) y guerra civil de Sila, que marcha sobre Roma e impone su dictadura (82-79 a.C.).' },
  { desde:-80, hasta:-72, mapa:REP_80_72,
    caption:'Guerra Sertoriana en Hispania, estallido de la revuelta de esclavos liderada por Espartaco (73 a.C.) y Tercera Guerra Mitridática en Oriente.' },
  { desde:-72, hasta:-63, mapa:REP_72_63,
    caption:'Craso y Pompeyo aplastan la revuelta de Espartaco (71 a.C.); Pompeyo limpia el Mediterráneo de piratas y anexa Siria y el Ponto, mientras en Roma se descubre la conjura de Catilina (63 a.C.).' },
  { desde:-63, hasta:-50, mapa:REP_63_50,
    caption:'Primer Triunvirato de Pompeyo, Craso y César; este último conquista toda la Galia (58-50 a.C.) mientras Craso muere en Carras frente a los partos (53 a.C.).' },
  { desde:-50, hasta:-47, mapa:REP_50_47,
    caption:'César cruza el Rubicón (49 a.C.) desatando la guerra civil contra Pompeyo, a quien derrota en Farsalia (48 a.C.); Pompeyo es asesinado en Egipto y César libra la guerra alejandrina.' },
  { desde:-47, hasta:-31, mapa:REP_47_31,
    caption:'Dictadura y asesinato de César (44 a.C.), Segundo Triunvirato y nuevas guerras civiles entre Octavio, Antonio y Lépido, que culminan en la batalla naval de Actio (31 a.C.).' },
  { desde:-31, hasta:-27, mapa:REP_31_27,
    caption:'Tras Actio, Octavio anexa Egipto (30 a.C.) y queda como único dueño del poder; en el 27 a.C. el Senado le otorga el título de Augusto, marcando el inicio simbólico del Imperio.' }
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
